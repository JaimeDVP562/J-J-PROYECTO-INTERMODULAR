import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, interval, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Factura, Venta, Jornada, ResumenJornada } from '../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  cargando = true;
  error = '';

  // Stats (admin)
  totalProductos = 0;
  totalClientes = 0;
  totalFacturas = 0;
  importeFacturas = 0;
  totalVentas = 0;
  importeVentas = 0;
  ultimasFacturas: Factura[] = [];
  ultimasVentas: Venta[] = [];
  resumenJornadas: ResumenJornada[] = [];

  // Jornada propia (todos los roles)
  jornadaActiva: Jornada | null = null;
  accionJornada = false;
  errorJornada = '';
  misJornadas: Jornada[] = [];
  tiempoTranscurrido = '';
  private timerSub?: Subscription;

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
      this.cargarAdmin();
    } else {
      this.cargarUsuario();
    }
    this.cargarJornadaActiva();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  cargarAdmin(): void {
    forkJoin({
      productos: this.api.getProductos(),
      clientes: this.api.getClientes(),
      facturas: this.api.getFacturas(),
      ventas: this.api.getVentas(),
      resumen: this.api.getResumenJornadasHoy(),
    }).subscribe({
      next: ({ productos, clientes, facturas, ventas, resumen }) => {
        this.totalProductos = productos.length;
        this.totalClientes = clientes.length;
        this.totalFacturas = facturas.length;
        this.importeFacturas = facturas.reduce((s, f) => s + Number(f.total_amount), 0);
        this.totalVentas = ventas.length;
        this.importeVentas = ventas.reduce((s, v) => s + Number(v.total), 0);
        this.ultimasFacturas = facturas.slice(-5).reverse();
        this.ultimasVentas = ventas.slice(-5).reverse();
        this.resumenJornadas = resumen;
        this.cargando = false;
      },
      error: () => { this.error = 'Error al cargar el panel.'; this.cargando = false; },
    });
  }

  cargarUsuario(): void {
    this.api.getJornadas().subscribe({
      next: (j) => { this.misJornadas = j; this.cargando = false; },
      error: () => { this.error = 'Error al cargar actividad.'; this.cargando = false; },
    });
  }

  cargarJornadaActiva(): void {
    this.api.getJornadaActiva().subscribe({
      next: (j) => {
        this.jornadaActiva = j;
        if (j) this.iniciarTimer();
      },
    });
  }

  iniciarJornada(): void {
    this.accionJornada = true;
    this.errorJornada = '';
    this.api.iniciarJornada().subscribe({
      next: (j) => {
        this.jornadaActiva = j;
        this.accionJornada = false;
        this.iniciarTimer();
        if (!this.auth.isAdmin()) this.cargarUsuario();
        else this.api.getResumenJornadasHoy().subscribe(r => this.resumenJornadas = r);
      },
      error: (e) => {
        this.errorJornada = e?.error?.error ?? 'Error al iniciar jornada.';
        this.accionJornada = false;
      },
    });
  }

  finalizarJornada(): void {
    if (!this.jornadaActiva) return;
    this.accionJornada = true;
    this.errorJornada = '';
    this.api.finalizarJornada(this.jornadaActiva.id).subscribe({
      next: () => {
        this.jornadaActiva = null;
        this.timerSub?.unsubscribe();
        this.tiempoTranscurrido = '';
        this.accionJornada = false;
        if (!this.auth.isAdmin()) this.cargarUsuario();
        else this.api.getResumenJornadasHoy().subscribe(r => this.resumenJornadas = r);
      },
      error: () => { this.errorJornada = 'Error al finalizar jornada.'; this.accionJornada = false; },
    });
  }

  private iniciarTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000).pipe(startWith(0)).subscribe(() => {
      if (!this.jornadaActiva) return;
      const diff = Math.floor((Date.now() - new Date(this.jornadaActiva.inicio).getTime()) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      this.tiempoTranscurrido = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    });
  }

  formatMinutos(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { pending: 'Pendiente', paid: 'Pagada', cancelled: 'Cancelada' };
    return map[status] ?? status;
  }
}
