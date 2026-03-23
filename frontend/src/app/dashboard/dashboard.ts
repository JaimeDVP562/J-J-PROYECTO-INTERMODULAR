import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Jornada, ResumenJornada, Estadisticas } from '../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  public auth = inject(AuthService);

  // ── Vista admin/gerente ──
  cargandoAdmin = false;
  errorAdmin = '';
  resumenJornadas: ResumenJornada[] = [];

  // Estadísticas
  stats: Estadisticas | null = null;
  cargandoStats = false;
  errorStats = '';

  // Rango de fechas (default: primer día del mes corriente → hoy)
  fechaDesde = this.primerDiaMes();
  fechaHasta = this.hoyISO();

  // ── Vista usuario normal ──
  misJornadas: Jornada[] = [];
  misVentasHoy: any[] = [];
  misDevolucionesHoy: any[] = [];
  cargandoUsuario = true;

  readonly DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  readonly today = new Date();

  ngOnInit(): void {
    if (this.auth.isAdminOrGerente()) {
      this.cargarAdmin();
    } else {
      this.cargarUsuario();
    }
  }

  navigateToFichar(): void {
    this.router.navigate(['/time-control']);
  }

  // ── Helpers de fecha ──
  private hoyISO(): string {
    return new Date().toISOString().split('T')[0];
  }
  private primerDiaMes(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }

  // ── Carga admin/gerente ──
  cargarAdmin(): void {
    this.cargandoAdmin = true;
    forkJoin({
      resumen: this.api.getResumenJornadasHoy(),
    }).subscribe({
      next: ({ resumen }) => {
        this.resumenJornadas = resumen;
        this.cargandoAdmin = false;
      },
      error: () => {
        this.errorAdmin = 'Error al cargar datos.';
        this.cargandoAdmin = false;
      },
    });
    this.consultarEstadisticas();
  }

  consultarEstadisticas(): void {
    this.cargandoStats = true;
    this.errorStats = '';
    this.api.getEstadisticas(this.fechaDesde, this.fechaHasta).subscribe({
      next: (s) => {
        this.stats = s;
        this.cargandoStats = false;
      },
      error: () => {
        this.errorStats = 'Error al cargar estadísticas.';
        this.cargandoStats = false;
      },
    });
  }

  // ── Carga usuario normal ──
  cargarUsuario(): void {
    forkJoin({
      jornadas: this.api.getJornadas().pipe(catchError(() => of<any[]>([]))),
      ventas: this.api.getVentasHoy().pipe(catchError(() => of<any[]>([]))),
      devoluciones: this.api.getDevolucionesHoy().pipe(catchError(() => of<any[]>([]))),
    }).subscribe({
      next: ({ jornadas, ventas, devoluciones }) => {
        this.misJornadas = jornadas;
        this.misVentasHoy = ventas;
        this.misDevolucionesHoy = devoluciones;
        this.cargandoUsuario = false;
      },
      error: () => {
        this.cargandoUsuario = false;
      },
    });
  }

  // ── Getters usuario normal ──
  get diaSemana(): string {
    return this.DIAS[new Date().getDay()];
  }

  get totalMinutosHoy(): number {
    return this.misJornadas.reduce((s, j) => s + (j.duracion_minutos ?? 0), 0);
  }

  get tiempoTrabajadoHoy(): string {
    const min = this.misJornadas.reduce((s, j) => s + (j.duracion_minutos ?? 0), 0);
    return this.formatMinutos(min);
  }

  get ventasHoyCount(): number {
    return this.misVentasHoy.length;
  }
  get importeTotalHoy(): number {
    return this.misVentasHoy.reduce((s: number, v: any) => s + Number(v.total), 0);
  }
  get promedioVentaHoy(): number {
    return this.ventasHoyCount > 0 ? this.importeTotalHoy / this.ventasHoyCount : 0;
  }
  get devolucionesHoyCount(): number {
    return this.misDevolucionesHoy.length;
  }
  get importeDevolucionesHoy(): number {
    return this.misDevolucionesHoy.reduce((s: number, d: any) => s + Number(d.importe), 0);
  }

  formatMinutos(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      paid: 'Pagada',
      cancelled: 'Cancelada',
    };
    return map[status] ?? status;
  }

  get signoBalance(): string {
    if (!this.stats) return '';
    return this.stats.diferencia >= 0 ? 'positivo' : 'negativo';
  }
}
