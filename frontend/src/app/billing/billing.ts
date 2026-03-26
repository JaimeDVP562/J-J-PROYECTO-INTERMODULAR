import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Factura, Venta, CierreCaja, Producto } from '../models/models';
import { Cliente, Proveedor } from '../models/models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.html',
  styleUrls: ['./billing.css'],
})
export class BillingComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  // Este componente solo gestiona facturas; vistas de ventas/devoluciones/cierres están en `pos`

  // Facturas
  facturas: Factura[] = [];
  clientes: Cliente[] = [];
  proveedores: Proveedor[] = [];
  cargandoFacturas = true;
  errorFacturas = '';
  // pagination for facturas (same as productos in pos)
  pageSizeFacturas = 10;
  facturasPage = 1;
  facturasTotal = 0;
  facturasLastPage = 1;
  // Filtered source for client-side filtering
  facturasFiltradas: Factura[] = [];
  facturasServerPaged = true;
  facturasFiltroCliente: number | '' = '';
  facturasFiltroEstado: string = '';
  facturasFiltroFechaEmision: string = '';
  facturasFiltroFechaVencimiento: string = '';
  // Expanded factura for details panel (similar to POS cierres)
  expandedFacturaId: number | null = null;
  // Control de pestañas/vistas (la plantilla usa `vistaActiva`)
  vistaActiva: 'facturas' | 'factura' | 'clientes' = 'facturas';
  editandoId: number | null = null;
  editForm: Partial<Factura> = {};
  guardando = false;
  eliminandoId: number | null = null;
  editError = '';
  // Clientes CRUD UI state
  clienteForm: Partial<Cliente> = {};
  editingClienteId: number | null = null;
  clienteSaving = false;
  clienteFormError = '';
  // Crear factura
  createForm: Partial<Factura> & {
    proveedor_id?: number | null;
    payment_method?: string;
    iban?: string;
    detalles?: {
      producto_id?: number | null;
      cantidad: number;
      precio_unitario: number;
      descripcion?: string;
      nombre?: string;
    }[];
  } = { detalles: [] };
  // productos disponibles para añadir a la factura
  productos: Producto[] = [];
  // temporal para nuevo item en creación
  newItemProductoId: number | null = null;
  newItemDescripcion = '';
  newItemCantidad = 1;
  newItemPrecio = 0;
  newItemLoadingProducto = false;
  // manual item inputs
  newItemManualNombre = '';
  newItemManualCantidad = 1;
  newItemManualPrecio = 0;
  newItemManualDescripcion = '';
  creando = false;
  createError = '';

  ngOnInit(): void {
    this.cargarFacturas();
    this.cargarClientes();
    this.cargarProveedores();
    this.cargarProductos();
    this.cargarEmpresa();
  }

  cargarEmpresa(): void {
    this.api.getEmpresa().subscribe({
      next: (data) => {
        try {
          const extra = data && (data.extra || {});
          // If backend provides extra.default_series use it, otherwise leave empty
          if (extra && typeof extra === 'object' && extra.default_series) {
            this.createForm.series = extra.default_series;
          } else if (!this.createForm.series) {
            // fallback: keep empty so backend will fill 'F' or company default
            this.createForm.series = this.createForm.series ?? '';
          }
          // Request next sequential number for this series and prefill the field
          const seriesToQuery = this.createForm.series || undefined;
          this.api.getNextFacturaNumber(seriesToQuery).subscribe({
            next: (resp) => {
              if (resp && typeof resp.next === 'number') {
                this.createForm.number = resp.next;
              }
            },
            error: () => {
              // ignore errors here; backend will assign number if needed
            },
          });
        } catch (e) {
          // ignore
        }
      },
      error: () => {},
    });
  }

  cargarProductos(): void {
    this.api.getProductos().subscribe({
      next: (data) => (this.productos = Array.isArray(data) ? data : []),
      error: () => (this.productos = []),
    });
  }

  private parsePrecio(v: any): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  cargarClientes(): void {
    this.api.getClientes().subscribe({
      next: (data) => (this.clientes = data),
      error: () => (this.clientes = []),
    });
  }

  cargarProveedores(): void {
    this.api.getProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: () => (this.proveedores = []),
    });
  }

  cargarFacturas(): void {
    this.cargandoFacturas = true;
    this.api.getFacturas().subscribe({
      next: (data) => {
        // normalize and deduplicate by id to avoid duplicate keys causing DOM mismatch
        if (Array.isArray(data)) {
          const seen = new Set<number>();
          const dedup: Factura[] = [];
          for (const f of data) {
            if (f && typeof f.id === 'number') {
              if (seen.has(f.id)) {
                console.warn('Duplicate factura id detected when loading facturas:', f.id);
                continue;
              }
              seen.add(f.id);
            }
            dedup.push(f);
          }
          // Order by invoice number descending so latest appear first in resumen
          this.facturas = dedup.sort((a, b) => {
            const an = Number(a?.number ?? 0);
            const bn = Number(b?.number ?? 0);
            return bn - an;
          });
        } else {
          this.facturas = data as any;
        }

        this.facturasFiltradas = Array.isArray(this.facturas) ? [...this.facturas] : [];
        if (Array.isArray(this.facturas)) {
          this.facturasTotal = this.facturas.length;
          this.facturasLastPage = Math.max(
            1,
            Math.ceil(this.facturasTotal / this.pageSizeFacturas),
          );
          this.facturasPage = 1;
        }
        this.cargandoFacturas = false;
      },
      error: () => {
        this.errorFacturas = 'Error al cargar las facturas.';
        this.cargandoFacturas = false;
      },
    });
  }

  get facturasTotalPages(): number {
    return Math.max(1, this.facturasLastPage ?? 1);
  }

  get facturasPaged(): Factura[] {
    if (!Array.isArray(this.facturas)) return [];
    const source = this.facturasServerPaged ? this.facturas : this.facturasFiltradas;
    const start = (this.facturasPage - 1) * this.pageSizeFacturas;
    return source.slice(start, start + this.pageSizeFacturas);
  }

  get facturasVisiblePages(): number[] {
    return this.visiblePages(this.facturasTotalPages, this.facturasPage, 3);
  }

  goToFacturasPage(n: number) {
    if (n < 1 || n > this.facturasTotalPages) return;
    this.facturasPage = n;
  }
  prevFacturas() {
    if (this.facturasPage > 1) this.facturasPage--;
  }
  nextFacturas() {
    if (this.facturasPage < this.facturasTotalPages) this.facturasPage++;
  }
  goToFacturasFirst() {
    this.goToFacturasPage(1);
  }
  goToFacturasLast() {
    this.goToFacturasPage(this.facturasTotalPages);
  }

  // copy of visiblePages helper from pos component
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
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // ── Facturas ──
  iniciarEdicion(f: Factura): void {
    console.log('iniciarEdicion -> id', f.id);
    // close any expanded detail panel to avoid mixed UI states
    this.expandedFacturaId = null;
    this.editandoId = Number(f.id);
    this.editForm = {
      cliente_id: f.cliente_id ?? f.cliente?.id ?? undefined,
      user_id: f.user_id ?? this.auth.getCurrentUser()?.id ?? undefined,
      total_amount: Number(f.total_amount ?? 0),
      status: f.status ?? 'pending',
      invoice_date: f.invoice_date ?? '',
      due_date: f.due_date ?? '',
      payment_method: f.payment_method ?? '',
    };
  }

  trackByFacturaId(index: number, item: Factura): number {
    // Use index in the key when duplicate ids might exist; returning a string is allowed
    // but keep signature compatible by returning a composite number when possible.
    // Prefer a stable composite key: id combined with index.
    if (typeof item.id === 'number') return Number(`${item.id}${index}`);
    return index;
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.editForm = {};
  }

  // ── Crear factura ──
  cancelarNuevaFactura(): void {
    this.createForm = {};
    this.vistaActiva = 'facturas';
  }

  showFacturas(): void {
    this.vistaActiva = 'facturas';
  }

  showCrearFactura(): void {
    // prepare form and fetch fresh next-number from server so it's always up-to-date
    this.createForm = this.createForm ?? { detalles: [] };
    // ensure series is set (may have been set in cargarEmpresa earlier)
    const seriesToQuery = this.createForm.series || undefined;
    this.api.getNextFacturaNumber(seriesToQuery).subscribe({
      next: (resp) => {
        if (resp && typeof resp.next === 'number') {
          this.createForm.number = resp.next;
        }
      },
      error: () => {
        // ignore; backend will assign number on create
      },
    });
    this.vistaActiva = 'factura';
  }

  // ── Clientes (CRUD) ──
  showClientes(): void {
    this.vistaActiva = 'clientes';
    // ensure fresh list
    this.cargarClientes();
    this.clienteForm = {};
    this.editingClienteId = null;
  }

  startEditCliente(c: Cliente): void {
    this.editingClienteId = c.id;
    this.clienteForm = { nombre: c.nombre, email: c.email, phone: c.phone, address: c.address };
  }

  cancelEditCliente(): void {
    this.editingClienteId = null;
    this.clienteForm = {};
    // Return to main facturas view like cancelarNuevaFactura
    this.vistaActiva = 'facturas';
  }

  saveCliente(): void {
    this.clienteFormError = '';
    if (!this.clienteForm || !this.clienteForm.nombre) {
      this.clienteFormError = 'El nombre es obligatorio.';
      return;
    }

    const name = String(this.clienteForm.nombre || '').trim();
    const email = String(this.clienteForm.email || '')
      .trim()
      .toLowerCase();
    const phone = String(this.clienteForm.phone || '').trim();
    const address = String(this.clienteForm.address || '').trim();

    // Check duplicate name (case-insensitive), excluding currently editing client
    const dupName = (this.clientes || []).some(
      (c) =>
        c.id !== this.editingClienteId &&
        String(c.nombre || '')
          .trim()
          .toLowerCase() === name.toLowerCase(),
    );
    if (dupName) {
      this.clienteFormError = 'Ya existe un cliente con ese nombre.';
      return;
    }

    // If email, phone and address are all provided, ensure no existing client has the same triple
    if (email && phone && address) {
      const dupContact = (this.clientes || []).some((c) => {
        if (c.id === this.editingClienteId) return false;
        const ce = String(c.email || '')
          .trim()
          .toLowerCase();
        const cp = String(c.phone || '').trim();
        const ca = String(c.address || '').trim();
        return ce === email && cp === phone && ca === address;
      });
      if (dupContact) {
        this.clienteFormError = 'Ya existe un cliente con el mismo email, teléfono y dirección.';
        return;
      }
    }

    this.clienteSaving = true;
    const payload: Partial<Cliente> = {
      nombre: name,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
    };
    if (this.editingClienteId) {
      this.api.updateCliente(this.editingClienteId, payload).subscribe({
        next: () => {
          this.clienteSaving = false;
          this.cargarClientes();
          this.cancelEditCliente();
        },
        error: () => {
          this.clienteSaving = false;
        },
      });
    } else {
      this.api.createCliente(payload).subscribe({
        next: () => {
          this.clienteSaving = false;
          this.cargarClientes();
          this.clienteForm = {};
        },
        error: () => {
          this.clienteSaving = false;
        },
      });
    }
  }

  deleteCliente(id: number): void {
    if (!confirm('¿Eliminar este cliente?')) return;
    this.api.deleteCliente(id).subscribe({
      next: () => this.cargarClientes(),
      error: () => {},
    });
  }

  // ── Items para nueva factura ──
  addItemToCreate(): void {
    if (!this.newItemProductoId) return;
    if (this.newItemLoadingProducto) return; // avoid adding while price is loading
    const pid = Number(this.newItemProductoId);
    const cantidad = Number(this.newItemCantidad) || 0;
    const precio = Number(this.newItemPrecio) || 0;
    const descripcion = String(this.newItemDescripcion || '').trim();
    if (cantidad <= 0 || precio < 0) return;
    if (!this.createForm.detalles) this.createForm.detalles = [];
    this.createForm.detalles.push({
      producto_id: pid,
      cantidad,
      precio_unitario: precio,
      descripcion,
    });
    // reset temp
    this.newItemProductoId = null;
    this.newItemDescripcion = '';
    this.newItemCantidad = 1;
    this.newItemPrecio = 0;
  }

  addManualItemToCreate(): void {
    const nombre = String(this.newItemManualNombre || '').trim();
    const cantidad = Number(this.newItemManualCantidad) || 0;
    const precio = Number(this.newItemManualPrecio) || 0;
    if (!nombre) return;
    if (cantidad <= 0 || precio < 0) return;
    if (!this.createForm.detalles) this.createForm.detalles = [];
    const detalleItem = {
      producto_id: null,
      cantidad,
      precio_unitario: precio,
      // keep descripcion as entered; if nombre was left empty, use descripcion as fallback for display
      descripcion: this.newItemManualDescripcion || '',
      nombre: nombre || this.newItemManualDescripcion || '',
    };
    this.createForm.detalles.push(detalleItem as any);
    // reset manual inputs
    this.newItemManualNombre = '';
    this.newItemManualCantidad = 1;
    this.newItemManualPrecio = 0;
    this.newItemManualDescripcion = '';
  }

  onSelectProducto(productId: number | null): void {
    if (productId === null || productId === undefined) {
      this.newItemPrecio = 0;
      return;
    }
    const pid = Number(productId);
    const p = (this.productos || []).find((x) => x.id === pid);
    if (p) {
      this.newItemPrecio = this.parsePrecio((p as any).precio);
      // auto-fill description if product provides one
      if ((p as any).descripcion) this.newItemDescripcion = (p as any).descripcion;
      return;
    }

    // If product not present in local cache, fetch from API and cache it
    this.newItemLoadingProducto = true;
    this.newItemPrecio = 0;
    this.api.getProducto(pid).subscribe({
      next: (prod) => {
        this.newItemPrecio = this.parsePrecio((prod as any).precio);
        if ((prod as any).descripcion) this.newItemDescripcion = (prod as any).descripcion;
        // cache fetched product for future selections
        if (prod && typeof (prod as any).id === 'number') {
          this.productos = Array.isArray(this.productos) ? this.productos : [];
          const exists = this.productos.find((x) => x.id === (prod as any).id);
          if (!exists) this.productos.push(prod as any);
        }
        this.newItemLoadingProducto = false;
      },
      error: (err) => {
        console.error('[billing] getProducto error:', err);
        this.newItemPrecio = 0;
        this.newItemLoadingProducto = false;
      },
    });
  }

  removeCreateItem(index: number): void {
    if (!this.createForm.detalles) return;
    this.createForm.detalles.splice(index, 1);
  }

  computeCreateTotal(): number {
    if (!this.createForm.detalles || this.createForm.detalles.length === 0)
      return Number(this.createForm.total_amount ?? 0);
    return this.createForm.detalles.reduce(
      (s, it) => s + Number(it.cantidad) * Number(it.precio_unitario),
      0,
    );
  }

  // IVA configuration (frontend visual only). Backend will perform its own tax calculations.
  readonly IVA_PERCENT = 21;
  readonly EXAMPLE_IBAN = 'ES00 0000 0000 0000 0000';

  computeCreateIvaAmount(): number {
    const subtotal = this.computeCreateTotal();
    // round to 2 decimals
    return Math.round(subtotal * (this.IVA_PERCENT / 100) * 100) / 100;
  }

  computeCreateDisplayedTotal(): number {
    const subtotal = this.computeCreateTotal();
    const iva = this.computeCreateIvaAmount();
    return Math.round((subtotal + iva) * 100) / 100;
  }

  formatEUR(value: number): string {
    const n = Number.isFinite(Number(value)) ? Number(value) : 0;
    return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€';
  }

  // Helpers to compute totals for an existing factura (used in detail view)
  computeFacturaSubtotal(f: Factura): number {
    if (!f || !f.detalles || f.detalles.length === 0) return 0;
    return f.detalles.reduce((s, d) => s + Number(d.cantidad) * Number(d.precio_unitario), 0);
  }

  computeFacturaIvaAmount(f: Factura): number {
    const subtotal = this.computeFacturaSubtotal(f);
    return Math.round(subtotal * (this.IVA_PERCENT / 100) * 100) / 100;
  }

  computeFacturaDisplayedTotal(f: Factura): number {
    const subtotal = this.computeFacturaSubtotal(f);
    const iva = this.computeFacturaIvaAmount(f);
    return Math.round((subtotal + iva) * 100) / 100;
  }

  getFacturaIban(f: Factura): string {
    return (f && f.iban) || this.EXAMPLE_IBAN;
  }

  getProductoNombre(producto_id?: number | null): string | number {
    if (producto_id === null || producto_id === undefined) return '';
    const p = (this.productos || []).find((x) => x.id === producto_id);
    return p ? p.nombre : producto_id;
  }

  crearFactura(): void {
    this.createError = '';
    // Validaciones básicas
    if (!this.createForm.cliente_id) {
      this.createError = 'Seleccione un cliente.';
      return;
    }
    // If detalles (items) are present compute total automatically
    if (this.createForm.detalles && this.createForm.detalles.length > 0) {
      const total = this.computeCreateTotal();
      this.createForm.total_amount = total;
    }

    if (!this.createForm.total_amount || Number(this.createForm.total_amount) <= 0) {
      this.createError = 'Introduzca un importe mayor que 0.';
      return;
    }

    this.creando = true;
    // Valores por defecto
    if (!this.createForm.invoice_date) {
      this.createForm.invoice_date = new Date().toISOString().slice(0, 10);
    }
    if (!this.createForm.status) {
      this.createForm.status = 'pending';
    }

    // Añadir user_id desde Auth
    const current = this.auth.getCurrentUser();
    if (current && !this.createForm.user_id) {
      this.createForm.user_id = current.id;
    }

    // Do not send the pre-fetched `number` to the API so the backend
    // can assign the canonical sequential number atomically.
    const payload: any = { ...this.createForm };
    if (Object.prototype.hasOwnProperty.call(payload, 'number')) delete payload.number;

    // debug logs removed

    this.api.createFactura(payload).subscribe({
      next: (resp) => {
        this.creando = false;
        this.createForm = {};
        this.vistaActiva = 'facturas';
        this.cargarFacturas();
      },
      error: (err) => {
        this.creando = false;
        // tratar errores del API
        if (err?.error?.errors) {
          const first = Object.values(err.error.errors)[0] as string[];
          this.createError = first?.[0] ?? 'Error al crear la factura';
        } else if (err?.error?.message) {
          this.createError = err.error.message;
        } else {
          this.createError = 'Error al crear la factura';
        }
      },
    });
  }

  // Reenviar factura a Verifactu (llama al endpoint que usa el servicio mock)
  resendingFacturaId: number | null = null;

  reenviarVerifactu(f: Factura, $event?: Event): void {
    if ($event) $event.stopPropagation();
    if (!confirm('¿Reenviar esta factura a Verifactu?')) return;
    this.resendingFacturaId = f.id;
    this.api.resendVerifactu(f.id).subscribe({
      next: (updated) => {
        // update local factura entry with returned data
        const idx = this.facturas.findIndex((x) => x.id === updated.id);
        if (idx !== -1) this.facturas[idx] = updated;
        this.facturasFiltradas = Array.isArray(this.facturas) ? [...this.facturas] : [];
        this.resendingFacturaId = null;
      },
      error: (err) => {
        console.error('Error reenviando a Verifactu', err);
        alert('Error al reenviar a Verifactu');
        this.resendingFacturaId = null;
      },
    });
  }

  guardarEdicion(): void {
    console.log('guardarEdicion -> editandoId', this.editandoId, 'editForm', this.editForm);
    if (!this.editandoId) return;
    this.editError = '';
    const id = this.editandoId;
    // try to find the original factura in the main list first, then in the filtered list
    const original =
      (this.facturas || []).find((f) => f.id === id) ||
      (this.facturasFiltradas || []).find((f) => f.id === id);
    const originalFactura = original as Factura | undefined;
    if (!original) {
      this.editError = 'Factura original no encontrada.';
      return;
    }

    // Build payload ensuring required fields are present (fallback to original)
    const current = this.auth.getCurrentUser();
    const originalClienteId =
      originalFactura?.cliente_id ?? originalFactura?.cliente?.id ?? undefined;

    const payload: Partial<Factura> = {
      cliente_id: this.editForm.cliente_id ?? originalClienteId,
      // ensure user_id is always sent: prefer editForm, then original, then current user
      user_id:
        this.editForm.user_id ?? originalFactura?.user_id ?? (current ? current.id : undefined),
      total_amount: Number(this.editForm.total_amount ?? originalFactura?.total_amount ?? 0),
      status: this.editForm.status ?? originalFactura?.status ?? 'pending',
      invoice_date: this.editForm.invoice_date ?? originalFactura?.invoice_date ?? '',
      due_date: this.editForm.due_date ?? originalFactura?.due_date ?? '',
      payment_method: this.editForm.payment_method ?? originalFactura?.payment_method,
    };

    this.guardando = true;
    this.api.updateFactura(id, payload).subscribe({
      next: () => {
        this.guardando = false;
        this.editandoId = null;
        this.cargarFacturas();
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error actualizando factura', err);
        if (err?.error?.errors) {
          const first = Object.values(err.error.errors)[0] as string[];
          this.editError = first?.[0] ?? 'Error al actualizar la factura';
        } else if (err?.error?.message) {
          this.editError = err.error.message;
        } else {
          this.editError = 'Error al actualizar la factura';
        }
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

  // ── Filtrado resumén de facturas (cliente, estado, fecha emisión, fecha vencimiento)
  filtrarFacturas(): void {
    this.facturasFiltradas = (this.facturas || []).filter((f) => {
      const facturaClienteId = Number(f.cliente_id ?? f.cliente?.id ?? -1);
      const filtroClienteId =
        this.facturasFiltroCliente === '' ? null : Number(this.facturasFiltroCliente);
      const matchCliente = !filtroClienteId || facturaClienteId === filtroClienteId;
      const matchEstado = !this.facturasFiltroEstado || f.status === this.facturasFiltroEstado;

      let matchEmision = true;
      try {
        if (this.facturasFiltroFechaEmision) {
          const target = new Date(this.facturasFiltroFechaEmision).setHours(0, 0, 0, 0);
          const fechaF = new Date(f.invoice_date).setHours(0, 0, 0, 0);
          if (fechaF !== target) matchEmision = false;
        }
      } catch (e) {
        matchEmision = true;
      }

      let matchVenc = true;
      try {
        if (this.facturasFiltroFechaVencimiento) {
          const target2 = new Date(this.facturasFiltroFechaVencimiento).setHours(0, 0, 0, 0);
          const fechaV = f.due_date ? new Date(f.due_date).setHours(0, 0, 0, 0) : null;
          if (fechaV === null || fechaV !== target2) matchVenc = false;
        }
      } catch (e) {
        matchVenc = true;
      }

      return matchCliente && matchEstado && matchEmision && matchVenc;
    });

    // dedupe filtered results as well (safety)
    if (Array.isArray(this.facturasFiltradas)) {
      const seen2 = new Set<number>();
      this.facturasFiltradas = this.facturasFiltradas.filter((f) => {
        if (f && typeof f.id === 'number') {
          if (seen2.has(f.id)) return false;
          seen2.add(f.id);
        }
        return true;
      });

      // ensure filtered list keeps the same ordering (number desc)
      this.facturasFiltradas.sort((a, b) => {
        const an = Number(a?.number ?? 0);
        const bn = Number(b?.number ?? 0);
        return bn - an;
      });

      this.facturasTotal = this.facturasFiltradas.length;
      this.facturasLastPage = Math.max(1, Math.ceil(this.facturasTotal / this.pageSizeFacturas));
      this.facturasPage = 1;
    }

    this.facturasServerPaged = false;
  }

  limpiarFiltrosFacturas(): void {
    this.facturasFiltroCliente = '';
    this.facturasFiltroEstado = '';
    this.facturasFiltroFechaEmision = '';
    this.facturasFiltroFechaVencimiento = '';
    this.facturasFiltradas = Array.isArray(this.facturas) ? [...this.facturas] : [];
    this.facturasTotal = this.facturasFiltradas.length;
    this.facturasLastPage = Math.max(1, Math.ceil(this.facturasTotal / this.pageSizeFacturas));
    this.facturasPage = 1;
    // keep client-side mode after clearing to match POS behavior
    this.facturasServerPaged = false;
  }

  toggleFactura(id: number): void {
    this.expandedFacturaId = this.expandedFacturaId === id ? null : id;
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
}
