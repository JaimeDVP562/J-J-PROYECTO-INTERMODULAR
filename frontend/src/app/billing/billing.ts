import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Factura, Venta } from '../models/models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class BillingComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  public auth = inject(AuthService);

  // Facturas
  facturas: Factura[] = [];
  cargandoFacturas = true;
  errorFacturas = '';
  editandoId: number | null = null;
  editForm: Partial<Factura> = {};
  guardando = false;
  eliminandoId: number | null = null;

  // Ventas (para el total)
  ventas: Venta[] = [];

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.cargandoFacturas = true;
    this.api.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.cargandoFacturas = false;
      },
      error: () => {
        this.errorFacturas = 'Error al cargar las facturas.';
        this.cargandoFacturas = false;
      },
    });
  }

  irAVentas(): void {
    this.router.navigate(['/pos']);
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
      error: () => {
        this.guardando = false;
      },
    });
  }

  eliminarFactura(id: number): void {
    if (!confirm('¿Eliminar esta factura?')) return;
    this.eliminandoId = id;
    this.api.deleteFactura(id).subscribe({
      next: () => {
        this.facturas = this.facturas.filter((f) => f.id !== id);
        this.eliminandoId = null;
      },
      error: () => {
        this.eliminandoId = null;
      },
    });
  }

  // ── Helpers ──
  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      paid: 'Pagada',
      cancelled: 'Cancelada',
    };
    return map[status] ?? status;
  }

  get totalImporte(): number {
    return this.facturas.reduce((sum, f) => sum + Number(f.total_amount), 0);
  }

  get totalVentas(): number {
    return this.ventas.reduce((sum, v) => sum + Number(v.total), 0);
  }
}
