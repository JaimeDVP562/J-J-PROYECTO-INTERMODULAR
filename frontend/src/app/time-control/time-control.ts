import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, interval, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import {
  Jornada,
  ResumenJornada,
  ResumenMensualUsuario,
  ResumenMensualAdmin,
} from '../models/models';

@Component({
  selector: 'app-time-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-control.html',
  styleUrl: './time-control.css',
})
export class TimeControlComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  vistaActiva: 'hoy' | 'mensual' = this.auth.isAdminOrGerente() ? 'hoy' : 'mensual';

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

  // Detalle jornadas de un empleado (mensual) — admin/gerente
  expandedUserId: number | null = null;
  jornadasDetalle: Jornada[] = [];

  // Detalle jornadas propias por día — empleado normal
  expandedDia: string | null = null;
  jornadasMensualesEmpleado: Jornada[] = [];
  cargandoDetalle = false;
  editandoJornadaId: number | null = null;
  editJornadaForm = { inicio: '', fin: '' };
  mostrarFormNuevaJornada = false;
  nuevaJornadaForm = { inicio: '', fin: '' };
  errorJornada = '';
  guardandoJornada = false;

  cargando = true;
  error = '';

  // Paginación (similar a POS/Stock)
  readonly porPagina = 10;
  paginaResumenHoy = 1;
  paginaEquipo = 1;
  paginaDias = 1;

  // Filtros para la vista 'Hoy'
  filtroEmpleado: number | '' = '';
  filtroRol: string = '';
  filtroEstado: '' | 'active' | 'inactive' = '';
  // Resultado después de aplicar filtros
  resumenFiltrado: ResumenJornada[] = [];

  // Enhanced pagination helpers
  private visiblePages(totalPages: number, currentPage: number, maxVisible = 3): number[] {
    totalPages = Math.max(1, totalPages ?? 1);
    if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxVisible + 1;
    }
    const pages: number[] = [];
    for (let n = start; n <= end; n++) pages.push(n);
    return pages;
  }

  /* --- Resumen (hoy) pagination --- */
  get resumenPaginados(): ResumenJornada[] {
    const start = (this.paginaResumenHoy - 1) * this.porPagina;
    return this.resumenFiltrado.slice(start, start + this.porPagina);
  }
  get totalPaginasResumen(): number {
    return Math.ceil((this.resumenFiltrado?.length ?? 0) / this.porPagina);
  }
  get resumenVisiblePages(): number[] {
    return this.visiblePages(this.totalPaginasResumen, this.paginaResumenHoy, 3);
  }
  prevResumen() {
    if (this.paginaResumenHoy > 1) this.paginaResumenHoy--;
  }
  nextResumen() {
    if (this.paginaResumenHoy < this.totalPaginasResumen) this.paginaResumenHoy++;
  }
  goToResumenFirst() {
    this.paginaResumenHoy = 1;
  }
  goToResumenLast() {
    this.paginaResumenHoy = this.totalPaginasResumen || 1;
  }

  /* --- Equipo (mensual) pagination --- */
  get equipoPaginados(): ResumenMensualAdmin[] {
    const list = this.equipoResumenMensual;
    const start = (this.paginaEquipo - 1) * this.porPagina;
    return list.slice(start, start + this.porPagina);
  }
  get totalPaginasEquipo(): number {
    return Math.ceil(this.equipoResumenMensual.length / this.porPagina);
  }
  get equipoVisiblePages(): number[] {
    return this.visiblePages(this.totalPaginasEquipo, this.paginaEquipo, 3);
  }
  prevEquipo() {
    if (this.paginaEquipo > 1) this.paginaEquipo--;
  }
  nextEquipo() {
    if (this.paginaEquipo < this.totalPaginasEquipo) this.paginaEquipo++;
  }
  goToEquipoFirst() {
    this.paginaEquipo = 1;
  }
  goToEquipoLast() {
    this.paginaEquipo = this.totalPaginasEquipo || 1;
  }

  /* --- Dias (resumen mensual usuario) pagination --- */
  get diasPaginados(): any[] {
    const list = this.resumenMensualUsuario?.detalle_dias ?? [];
    const start = (this.paginaDias - 1) * this.porPagina;
    return list.slice(start, start + this.porPagina);
  }
  get totalPaginasDias(): number {
    return Math.ceil((this.resumenMensualUsuario?.detalle_dias?.length ?? 0) / this.porPagina);
  }
  get diasVisiblePages(): number[] {
    return this.visiblePages(this.totalPaginasDias, this.paginaDias, 3);
  }
  prevDias() {
    if (this.paginaDias > 1) this.paginaDias--;
  }
  nextDias() {
    if (this.paginaDias < this.totalPaginasDias) this.paginaDias++;
  }
  goToDiasFirst() {
    this.paginaDias = 1;
  }
  goToDiasLast() {
    this.paginaDias = this.totalPaginasDias || 1;
  }

  // ── Jornada propia (fichar) ──
  jornadaActiva: Jornada | null = null;
  jornadaCargada = false;
  accionJornada = false;
  tiempoTranscurrido = '00:00:00';
  private timerSub?: Subscription;

  meses = [
    { n: 1, label: 'Enero' },
    { n: 2, label: 'Febrero' },
    { n: 3, label: 'Marzo' },
    { n: 4, label: 'Abril' },
    { n: 5, label: 'Mayo' },
    { n: 6, label: 'Junio' },
    { n: 7, label: 'Julio' },
    { n: 8, label: 'Agosto' },
    { n: 9, label: 'Septiembre' },
    { n: 10, label: 'Octubre' },
    { n: 11, label: 'Noviembre' },
    { n: 12, label: 'Diciembre' },
  ];

  get availableYears(): number[] {
    const current = new Date().getFullYear();
    const start = Math.max(2020, current - 3);
    const end = current + 1;
    const years: number[] = [];
    for (let y = start; y <= end; y++) years.push(y);
    // Ensure selected year is present
    if (this.anoSeleccionado && !years.includes(this.anoSeleccionado))
      years.push(this.anoSeleccionado);
    // Sort descending so latest year appears first
    return years.sort((a, b) => b - a);
  }

  limpiarFiltrosMensual(): void {
    const now = new Date();
    this.mesSeleccionado = now.getMonth() + 1;
    this.anoSeleccionado = now.getFullYear();
    this.paginaEquipo = 1;
    this.paginaDias = 1;
    this.paginaResumenHoy = 1;
    this.expandedUserId = null;
    this.expandedDia = null;
    this.jornadasDetalle = [];
    this.jornadasMensualesEmpleado = [];
    this.cargarMensual();
  }

  ngOnInit(): void {
    this.cargarJornadaActiva();
    this.cargarMensual();
    if (this.auth.isAdminOrGerente()) {
      forkJoin({
        resumen: this.api.getResumenJornadasHoy(),
        jornadas: this.api.getJornadas(),
      }).subscribe({
        next: ({ resumen, jornadas }) => {
          this.resumen = resumen;
          this.filtrarResumenHoy();
          this.misJornadas = jornadas;
          this.cargando = false;
        },
        error: () => {
          this.error = 'Error al cargar el resumen.';
          this.cargando = false;
        },
      });
    } else {
      this.api.getJornadas().subscribe({
        next: (j) => {
          this.misJornadas = j;
          this.cargando = false;
        },
        error: () => {
          this.error = 'Error al cargar jornadas.';
          this.cargando = false;
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  // ── Fichar ──
  cargarJornadaActiva(): void {
    this.api.getJornadaActiva().subscribe({
      next: (j) => {
        this.jornadaActiva = j;
        this.jornadaCargada = true;
        if (j) this.iniciarTimer();
      },
      error: () => {
        this.jornadaActiva = null;
        this.jornadaCargada = true;
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
        this.recargarJornadas();
      },
      error: (e) => {
        this.errorJornada = e?.error?.error ?? 'Error al iniciar jornada.';
        this.accionJornada = false;
        if (e?.status === 422) this.cargarJornadaActiva();
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
        this.recargarJornadas();
      },
      error: () => {
        this.errorJornada = 'Error al pausar el turno.';
        this.accionJornada = false;
      },
    });
  }

  private recargarJornadas(): void {
    if (this.auth.isAdminOrGerente()) {
      this.api.getResumenJornadasHoy().subscribe((r) => {
        this.resumen = r;
        this.filtrarResumenHoy();
      });
    }
    this.api.getJornadas().subscribe((js) => (this.misJornadas = js));
  }

  // Opciones derivadas del resumen para los filtros
  get empleadosHoy(): { id?: number; nombre: string }[] {
    const map = new Map<number | string, { id?: number; nombre: string }>();
    for (const r of this.resumen) {
      const key = r.user_id ?? r.nombre;
      if (!map.has(key)) map.set(key as number | string, { id: r.user_id, nombre: r.nombre });
    }
    return Array.from(map.values());
  }

  get rolesHoy(): string[] {
    const s = new Set<string>();
    for (const r of this.resumen) if (r.rol) s.add(r.rol);
    return Array.from(s.values());
  }

  filtrarResumenHoy(): void {
    let list = this.resumen ?? [];
    if (this.filtroEmpleado !== '') {
      const val = String(this.filtroEmpleado);
      list = list.filter((r) => String(r.user_id ?? r.nombre) === val);
    }
    if (this.filtroRol) {
      list = list.filter((r) => r.rol === this.filtroRol);
    }
    if (this.filtroEstado) {
      if (this.filtroEstado === 'active') list = list.filter((r) => !!r.jornada_activa);
      else if (this.filtroEstado === 'inactive') list = list.filter((r) => !r.jornada_activa);
    }
    this.resumenFiltrado = list;
    this.paginaResumenHoy = 1;
  }

  limpiarFiltrosHoy(): void {
    this.filtroEmpleado = '';
    this.filtroRol = '';
    this.filtroEstado = '';
    this.filtrarResumenHoy();
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
    this.timerSub = interval(1000)
      .pipe(startWith(0))
      .subscribe(() => {
        if (!this.jornadaActiva) return;
        const minutosCompletados = this.jornadasPropias
          .filter((j) => j.fin != null)
          .reduce((sum, j) => sum + (j.duracion_minutos ?? 0), 0);
        const segundosActivos = Math.max(
          0,
          Math.floor((Date.now() - this.parseFecha(this.jornadaActiva.inicio).getTime()) / 1000),
        );
        const total = minutosCompletados * 60 + segundosActivos;
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        this.tiempoTranscurrido = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      });
  }

  private get jornadasPropias(): Jornada[] {
    const uid = this.auth.getCurrentUser()?.id;
    return this.misJornadas.filter((j) => j.user_id === uid);
  }

  get tramosCompletadosHoy(): number {
    return this.jornadasPropias.filter((j) => j.fin != null).length;
  }

  get totalMinutosHoy(): number {
    return this.jornadasPropias.reduce((sum, j) => sum + (j.duracion_minutos ?? 0), 0);
  }

  get tiempoTotal(): string {
    if (!this.jornadaActiva) return this.formatMin(this.totalMinutosHoy);
    return this.tiempoTranscurrido;
  }

  // ── Mensual ──
  cargarMensual(): void {
    this.cargandoMensual = true;
    this.expandedUserId = null;
    this.expandedDia = null;
    this.jornadasDetalle = [];
    this.api.getResumenMensual(this.mesSeleccionado, this.anoSeleccionado).subscribe({
      next: (data: any) => {
        if (this.auth.isAdminOrGerente()) {
          this.resumenMensualAdmin = data;
        } else {
          this.resumenMensualUsuario = data;
          const uid = this.auth.getCurrentUser()?.id;
          if (uid) {
            this.api.getJornadasUsuario(uid, this.mesSeleccionado, this.anoSeleccionado).subscribe({
              next: (js) => {
                this.jornadasMensualesEmpleado = js;
              },
            });
          }
        }
        this.cargandoMensual = false;
      },
      error: () => {
        this.cargandoMensual = false;
      },
    });
  }

  toggleDia(fecha: string): void {
    this.expandedDia = this.expandedDia === fecha ? null : fecha;
  }

  jornadasDelDia(fecha: string): Jornada[] {
    return this.jornadasMensualesEmpleado.filter((j) => j.inicio.slice(0, 10) === fecha);
  }

  get miResumenMensual(): ResumenMensualAdmin | null {
    const user = this.auth.getCurrentUser();
    if (!user) return null;
    return this.resumenMensualAdmin.find((r) => r.user_id === user.id) ?? null;
  }

  get miResumen(): { dias_trabajados: number; total_minutos: number } | null {
    if (this.auth.isAdminOrGerente()) return this.miResumenMensual;
    return this.resumenMensualUsuario;
  }

  get equipoResumenMensual(): ResumenMensualAdmin[] {
    const user = this.auth.getCurrentUser();
    if (!user) return this.resumenMensualAdmin;
    return this.resumenMensualAdmin.filter((r) => r.user_id !== user.id);
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
      next: (j) => {
        this.jornadasDetalle = j;
        this.cargandoDetalle = false;
      },
      error: () => {
        this.cargandoDetalle = false;
      },
    });
  }

  iniciarEditJornada(j: Jornada): void {
    this.editandoJornadaId = j.id;
    this.editJornadaForm = {
      inicio: this.toDatetimeLocal(j.inicio),
      fin: this.toDatetimeLocal(j.fin),
    };
    this.mostrarFormNuevaJornada = false;
    this.errorJornada = '';
  }

  guardarEditJornada(): void {
    if (!this.editandoJornadaId) return;
    this.guardandoJornada = true;
    this.api
      .updateJornada(this.editandoJornadaId, {
        inicio: this.editJornadaForm.inicio,
        fin: this.editJornadaForm.fin || null,
      })
      .subscribe({
        next: (j) => {
          const idx = this.jornadasDetalle.findIndex((x) => x.id === j.id);
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
        this.jornadasDetalle = this.jornadasDetalle.filter((j) => j.id !== id);
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
    this.api
      .createJornadaAdmin({
        user_id: this.expandedUserId,
        inicio: this.nuevaJornadaForm.inicio,
        fin: this.nuevaJornadaForm.fin || undefined,
      })
      .subscribe({
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
    return periodos.map((p) => `${p.inicio}-${p.fin ?? '...'}`).join(' / ');
  }

  formatDiaPeriodos(jornadas: Jornada[]): string {
    return jornadas
      .map((j) => `${j.inicio.slice(11, 16)}-${j.fin ? j.fin.slice(11, 16) : '...'}`)
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
