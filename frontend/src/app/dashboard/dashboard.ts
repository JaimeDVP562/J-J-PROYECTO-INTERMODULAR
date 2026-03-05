import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, interval, of, Subscription } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
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
export class DashboardComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  // ── Jornada propia (todos los roles) ──
  jornadaActiva: Jornada | null = null;
  jornadaCargada = false;
  accionJornada = false;
  errorJornada = '';
  tiempoTranscurrido = '00:00:00';
  private timerSub?: Subscription;

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
    this.cargarJornadaActiva();
    if (this.auth.isAdminOrGerente()) {
      this.cargarAdmin();
    } else {
      this.cargarUsuario();
    }
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
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
      error: () => { this.errorAdmin = 'Error al cargar datos.'; this.cargandoAdmin = false; },
    });
    this.consultarEstadisticas();
  }

  consultarEstadisticas(): void {
    this.cargandoStats = true;
    this.errorStats = '';
    this.api.getEstadisticas(this.fechaDesde, this.fechaHasta).subscribe({
      next: (s) => { this.stats = s; this.cargandoStats = false; },
      error: () => { this.errorStats = 'Error al cargar estadísticas.'; this.cargandoStats = false; },
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
      error: () => { this.cargandoUsuario = false; },
    });
  }

  // ── Jornada ──
  cargarJornadaActiva(): void {
    this.api.getJornadaActiva().subscribe({
      next: (j) => { this.jornadaActiva = j; this.jornadaCargada = true; if (j) this.iniciarTimer(); },
      error: () => { this.jornadaActiva = null; this.jornadaCargada = true; },
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
        if (this.auth.isAdminOrGerente()) {
          this.api.getResumenJornadasHoy().subscribe(r => this.resumenJornadas = r);
        } else {
          this.api.getJornadas().subscribe(js => this.misJornadas = js);
        }
      },
      error: (e) => {
        this.errorJornada = e?.error?.error ?? 'Error al iniciar jornada.';
        this.accionJornada = false;
        // Re-sync with DB in case there's an open jornada we didn't know about
        if (e?.status === 422) { this.cargarJornadaActiva(); }
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
        this.tiempoTranscurrido = '00:00:00';
        this.accionJornada = false;
        if (this.auth.isAdminOrGerente()) {
          this.api.getResumenJornadasHoy().subscribe(r => this.resumenJornadas = r);
        } else {
          this.api.getJornadas().subscribe(js => this.misJornadas = js);
        }
      },
      error: () => { this.errorJornada = 'Error al finalizar jornada.'; this.accionJornada = false; },
    });
  }

  private parseFecha(s: string | null | undefined): Date {
    if (!s) return new Date(NaN);
    return new Date(s.replace(' ', 'T'));
  }

  get jornadaInicioDate(): Date | null {
    if (!this.jornadaActiva?.inicio) return null;
    const d = this.parseFecha(this.jornadaActiva.inicio);
    return isNaN(d.getTime()) ? null : d;
  }

  private iniciarTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000).pipe(startWith(0)).subscribe(() => {
      if (!this.jornadaActiva) return;
      const diff = Math.floor((Date.now() - this.parseFecha(this.jornadaActiva.inicio).getTime()) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      this.tiempoTranscurrido = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    });
  }

  // ── Getters usuario normal ──
  get diaSemana(): string { return this.DIAS[new Date().getDay()]; }

  get tiempoTrabajadoHoy(): string {
    const min = this.misJornadas.reduce((s, j) => s + (j.duracion_minutos ?? 0), 0);
    if (this.jornadaActiva) {
      const extra = Math.floor((Date.now() - this.parseFecha(this.jornadaActiva.inicio).getTime()) / 60000);
      return this.formatMinutos(min + extra);
    }
    return this.formatMinutos(min);
  }

  get ventasHoyCount(): number { return this.misVentasHoy.length; }
  get importeTotalHoy(): number { return this.misVentasHoy.reduce((s: number, v: any) => s + Number(v.total), 0); }
  get promedioVentaHoy(): number { return this.ventasHoyCount > 0 ? this.importeTotalHoy / this.ventasHoyCount : 0; }
  get devolucionesHoyCount(): number { return this.misDevolucionesHoy.length; }
  get importeDevolucionesHoy(): number { return this.misDevolucionesHoy.reduce((s: number, d: any) => s + Number(d.importe), 0); }

  formatMinutos(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { pending: 'Pendiente', paid: 'Pagada', cancelled: 'Cancelada' };
    return map[status] ?? status;
  }

  get signoBalance(): string {
    if (!this.stats) return '';
    return this.stats.diferencia >= 0 ? 'positivo' : 'negativo';
  }
}
