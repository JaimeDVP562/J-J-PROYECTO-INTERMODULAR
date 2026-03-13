import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Factura, Venta, CierreCaja } from '../models/models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class BillingComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  vistaActiva: 'facturas' | 'ventas' | 'devoluciones' | 'cierres' = 'facturas';

  // Facturas
  facturas: Factura[] = [];
  cargandoFacturas = true;
  errorFacturas = '';
  editandoId: number | null = null;
  editForm: Partial<Factura> = {};
  guardando = false;
  eliminandoId: number | null = null;

  // Ventas
  ventas: Venta[] = [];
  cargandoVentas = false;
  errorVentas = '';
  devolucionVentaId: number | null = null;
  motivoDevolucion = '';
  passwordDevolucion = '';
  procesandoDevolucion = false;
  errorDevolucion = '';

  // Devoluciones
  devoluciones: any[] = [];
  cargandoDevoluciones = false;

  // Cierres de caja
  cierres: CierreCaja[] = [];
  cargandoCierres = false;
  expandedCierreId: number | null = null;

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.cargandoFacturas = true;
    this.api.getFacturas().subscribe({
      next: (data) => { this.facturas = data; this.cargandoFacturas = false; },
      error: () => { this.errorFacturas = 'Error al cargar las facturas.'; this.cargandoFacturas = false; },
    });
  }

  cargarVentas(): void {
    if (this.ventas.length > 0) return;
    this.cargandoVentas = true;
    this.api.getVentas().subscribe({
      next: (data) => { this.ventas = data; this.cargandoVentas = false; },
      error: () => { this.errorVentas = 'Error al cargar ventas.'; this.cargandoVentas = false; },
    });
  }

  cargarDevoluciones(): void {
    if (this.devoluciones.length > 0) return;
    this.cargandoDevoluciones = true;
    this.api.getDevoluciones().subscribe({
      next: (data) => { this.devoluciones = data; this.cargandoDevoluciones = false; },
      error: () => { this.cargandoDevoluciones = false; },
    });
  }

  cambiarVista(v: 'facturas' | 'ventas' | 'devoluciones' | 'cierres'): void {
    this.vistaActiva = v;
    if (v === 'ventas') this.cargarVentas();
    if (v === 'devoluciones') this.cargarDevoluciones();
    if (v === 'cierres') this.cargarCierres();
  }

  cargarCierres(): void {
    if (this.cierres.length > 0) return;
    this.cargandoCierres = true;
    this.api.getCierresCaja().subscribe({
      next: (data) => { this.cierres = data; this.cargandoCierres = false; },
      error: () => { this.cargandoCierres = false; },
    });
  }

  toggleCierre(id: number): void {
    this.expandedCierreId = this.expandedCierreId === id ? null : id;
  }

  // ── Facturas ──
  iniciarEdicion(f: Factura): void {
    this.editandoId = f.id;
    this.editForm = {
      cliente_id: f.cliente_id,
      user_id: f.user_id,
      total_amount: f.total_amount,
      status: f.status,
      invoice_date: f.invoice_date,
      due_date: f.due_date ?? '',
    };
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.editForm = {};
  }

  guardarEdicion(): void {
    if (!this.editandoId) return;
    this.guardando = true;
    this.api.updateFactura(this.editandoId, this.editForm).subscribe({
      next: () => {
        this.guardando = false;
        this.editandoId = null;
        this.cargarFacturas();
      },
      error: () => { this.guardando = false; },
    });
  }

  eliminarFactura(id: number): void {
    if (!confirm('¿Eliminar esta factura?')) return;
    this.eliminandoId = id;
    this.api.deleteFactura(id).subscribe({
      next: () => {
        this.facturas = this.facturas.filter(f => f.id !== id);
        this.eliminandoId = null;
      },
      error: () => { this.eliminandoId = null; },
    });
  }

  // ── Devoluciones ──
  iniciarDevolucion(venta: Venta): void {
    this.devolucionVentaId = venta.id;
    this.motivoDevolucion = '';
    this.passwordDevolucion = '';
    this.errorDevolucion = '';
  }

  cancelarDevolucion(): void {
    this.devolucionVentaId = null;
    this.motivoDevolucion = '';
    this.passwordDevolucion = '';
  }

  confirmarDevolucion(): void {
    if (!this.devolucionVentaId) return;
    if (!this.passwordDevolucion) {
      this.errorDevolucion = 'Introduce tu contraseña para confirmar la devolución.';
      return;
    }

    this.procesandoDevolucion = true;
    this.errorDevolucion = '';

    this.api.crearDevolucion(this.devolucionVentaId, this.passwordDevolucion, this.motivoDevolucion || undefined).subscribe({
      next: () => {
        this.procesandoDevolucion = false;
        this.devolucionVentaId = null;
        this.passwordDevolucion = '';
        // Refresh ventas
        this.ventas = [];
        this.cargarVentas();
        this.devoluciones = [];
      },
      error: (e) => {
        this.errorDevolucion = e?.error?.message ?? 'Error al procesar la devolución.';
        this.procesandoDevolucion = false;
      },
    });
  }

  // ── Helpers ──
  getStatusLabel(status: string): string {
    const map: Record<string, string> = { pending: 'Pendiente', paid: 'Pagada', cancelled: 'Cancelada' };
    return map[status] ?? status;
  }

  get totalImporte(): number {
    return this.facturas.reduce((sum, f) => sum + Number(f.total_amount), 0);
  }

  get totalVentas(): number {
    return this.ventas.reduce((sum, v) => sum + Number(v.total), 0);
  }
}
