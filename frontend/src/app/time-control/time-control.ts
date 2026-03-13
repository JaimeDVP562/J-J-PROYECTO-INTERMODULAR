import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Jornada, ResumenJornada, ResumenMensualUsuario, ResumenMensualAdmin } from '../models/models';

@Component({
  selector: 'app-time-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-control.html',
  styleUrl: './time-control.css',
})
export class TimeControlComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  vistaActiva: 'hoy' | 'mensual' = 'hoy';

  // Admin/Gerente - equipo
  resumen: ResumenJornada[] = [];

  // Jornadas propias (todos los roles)
  misJornadas: Jornada[] = [];

  // Resumen mensual
  mesSeleccionado = new Date().getMonth() + 1;
  anoSeleccionado = new Date().getFullYear();
  resumenMensualUsuario: ResumenMensualUsuario | null = null;
  resumenMensualAdmin: ResumenMensualAdmin[] = [];
  cargandoMensual = false;

  // Detalle jornadas de un empleado (mensual)
  expandedUserId: number | null = null;
  jornadasDetalle: Jornada[] = [];
  cargandoDetalle = false;
  editandoJornadaId: number | null = null;
  editJornadaForm = { inicio: '', fin: '' };
  mostrarFormNuevaJornada = false;
  nuevaJornadaForm = { inicio: '', fin: '' };
  errorJornada = '';
  guardandoJornada = false;

  cargando = true;
  error = '';

  meses = [
    { n: 1, label: 'Enero' }, { n: 2, label: 'Febrero' }, { n: 3, label: 'Marzo' },
    { n: 4, label: 'Abril' }, { n: 5, label: 'Mayo' }, { n: 6, label: 'Junio' },
    { n: 7, label: 'Julio' }, { n: 8, label: 'Agosto' }, { n: 9, label: 'Septiembre' },
    { n: 10, label: 'Octubre' }, { n: 11, label: 'Noviembre' }, { n: 12, label: 'Diciembre' },
  ];

  ngOnInit(): void {
    if (this.auth.isAdminOrGerente()) {
      forkJoin({
        resumen: this.api.getResumenJornadasHoy(),
        jornadas: this.api.getJornadas(),
      }).subscribe({
        next: ({ resumen, jornadas }) => {
          this.resumen = resumen;
          this.misJornadas = jornadas;
          this.cargando = false;
        },
        error: () => { this.error = 'Error al cargar el resumen.'; this.cargando = false; },
      });
    } else {
      this.api.getJornadas().subscribe({
        next: (j) => { this.misJornadas = j; this.cargando = false; },
        error: () => { this.error = 'Error al cargar jornadas.'; this.cargando = false; },
      });
    }
  }

  cargarMensual(): void {
    this.cargandoMensual = true;
    this.expandedUserId = null;
    this.jornadasDetalle = [];
    this.api.getResumenMensual(this.mesSeleccionado, this.anoSeleccionado).subscribe({
      next: (data: any) => {
        if (this.auth.isAdminOrGerente()) {
          this.resumenMensualAdmin = data;
        } else {
          this.resumenMensualUsuario = data;
        }
        this.cargandoMensual = false;
      },
      error: () => { this.cargandoMensual = false; },
    });
  }

  get miResumenMensual(): ResumenMensualAdmin | null {
    const user = this.auth.getCurrentUser();
    if (!user) return null;
    return this.resumenMensualAdmin.find(r => r.user_id === user.id) ?? null;
  }

  get equipoResumenMensual(): ResumenMensualAdmin[] {
    const user = this.auth.getCurrentUser();
    if (!user) return this.resumenMensualAdmin;
    return this.resumenMensualAdmin.filter(r => r.user_id !== user.id);
  }

  // ── Detalle jornadas empleado ──────────────────────────────────────
  toggleDetalle(userId: number): void {
    if (this.expandedUserId === userId) {
      this.expandedUserId = null;
      this.jornadasDetalle = [];
      this.editandoJornadaId = null;
      this.mostrarFormNuevaJornada = false;
      return;
    }
    this.expandedUserId = userId;
    this.editandoJornadaId = null;
    this.mostrarFormNuevaJornada = false;
    this.errorJornada = '';
    this.cargarJornadasDetalle(userId);
  }

  cargarJornadasDetalle(userId: number): void {
    this.cargandoDetalle = true;
    this.api.getJornadasUsuario(userId, this.mesSeleccionado, this.anoSeleccionado).subscribe({
      next: (j) => { this.jornadasDetalle = j; this.cargandoDetalle = false; },
      error: () => { this.cargandoDetalle = false; },
    });
  }

  iniciarEditJornada(j: Jornada): void {
    this.editandoJornadaId = j.id;
    this.editJornadaForm = { inicio: this.toDatetimeLocal(j.inicio), fin: this.toDatetimeLocal(j.fin) };
    this.mostrarFormNuevaJornada = false;
    this.errorJornada = '';
  }

  guardarEditJornada(): void {
    if (!this.editandoJornadaId) return;
    this.guardandoJornada = true;
    this.api.updateJornada(this.editandoJornadaId, {
      inicio: this.editJornadaForm.inicio,
      fin: this.editJornadaForm.fin || null,
    }).subscribe({
      next: (j) => {
        const idx = this.jornadasDetalle.findIndex(x => x.id === j.id);
        if (idx !== -1) this.jornadasDetalle[idx] = j;
        this.editandoJornadaId = null;
        this.guardandoJornada = false;
        this.cargarMensual();
        if (this.expandedUserId) this.cargarJornadasDetalle(this.expandedUserId);
      },
      error: (e) => {
        this.errorJornada = e?.error?.message ?? 'Error al guardar.';
        this.guardandoJornada = false;
      },
    });
  }

  eliminarJornada(id: number): void {
    if (!confirm('¿Eliminar esta jornada? Esta acción no se puede deshacer.')) return;
    this.api.deleteJornada(id).subscribe({
      next: () => {
        this.jornadasDetalle = this.jornadasDetalle.filter(j => j.id !== id);
        this.cargarMensual();
        if (this.expandedUserId) this.cargarJornadasDetalle(this.expandedUserId);
      },
    });
  }

  abrirFormNuevaJornada(): void {
    this.mostrarFormNuevaJornada = true;
    this.nuevaJornadaForm = { inicio: '', fin: '' };
    this.editandoJornadaId = null;
    this.errorJornada = '';
  }

  crearJornada(): void {
    if (!this.expandedUserId || !this.nuevaJornadaForm.inicio) {
      this.errorJornada = 'La hora de inicio es obligatoria.';
      return;
    }
    this.guardandoJornada = true;
    this.api.createJornadaAdmin({
      user_id: this.expandedUserId,
      inicio: this.nuevaJornadaForm.inicio,
      fin: this.nuevaJornadaForm.fin || undefined,
    }).subscribe({
      next: () => {
        this.mostrarFormNuevaJornada = false;
        this.guardandoJornada = false;
        this.cargarMensual();
        if (this.expandedUserId) this.cargarJornadasDetalle(this.expandedUserId);
      },
      error: (e) => {
        this.errorJornada = e?.error?.message ?? 'Error al crear la jornada.';
        this.guardandoJornada = false;
      },
    });
  }

  toDatetimeLocal(iso?: string | null): string {
    if (!iso) return '';
    return iso.slice(0, 16);
  }

  formatMin(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  }

  formatPeriodosResumen(periodos: { inicio: string; fin: string | null }[]): string {
    return periodos.map(p => `${p.inicio}-${p.fin ?? '...'}`).join(' / ');
  }

  formatDiaPeriodos(jornadas: Jornada[]): string {
    return jornadas
      .map(j => `${j.inicio.slice(11, 16)}-${j.fin ? j.fin.slice(11, 16) : '...'}`)
      .join(' / ');
  }

  sumMinutos(jornadas: Jornada[]): number {
    return jornadas.reduce((sum, j) => sum + (j.duracion_minutos ?? 0), 0);
  }

  get jornadasPorDia(): { fecha: string; label: string; jornadas: Jornada[] }[] {
    const map = new Map<string, Jornada[]>();
    for (const j of this.jornadasDetalle) {
      const fecha = j.inicio.slice(0, 10);
      if (!map.has(fecha)) map.set(fecha, []);
      map.get(fecha)!.push(j);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, jornadas]) => {
        const [y, mo, d] = fecha.split('-');
        return { fecha, label: `${d}/${mo}/${y}`, jornadas };
      });
  }
}
