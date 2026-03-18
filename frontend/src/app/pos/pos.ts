import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import {
  Producto,
  Cliente,
  Categoria,
  Proveedor,
  ItemCarrito,
  Venta,
  CierreCaja,
} from '../models/models';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.html',
  styleUrl: './pos.css',
})
export class PosComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  // Data
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  clientes: Cliente[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  // Filters
  busqueda = '';
  categoriaFiltro: number | '' = '';

  // Cart
  carrito: ItemCarrito[] = [];
  clienteId: number | null = null;
  metodoPago: 'efectivo' | 'tarjeta' | 'mixto' = 'efectivo';
  notas = '';
  importeEntregado = 0;
  mixtoEfectivo = 0;
  mixtoTarjeta = 0;

  // State
  cargando = true;
  procesando = false;
  error = '';
  ventaRealizada = false;
  totalUltimaVenta = 0;
  vueltaUltimaVenta = 0;

  // Pago a proveedor
  mostrarPagoProveedor = false;
  pagoProveedorForm = {
    proveedor_id: '' as number | '',
    importe: 0,
    concepto: '',
    metodo_pago: 'efectivo' as string,
  };
  errorPago = '';
  procesandoPago = false;

  // Cierre de caja
  mostrarCierreCaja = false;
  totalVentasHoy = 0;
  errorCierre = '';
  guardandoCierre = false;
  cierreCaja = { efectivo_retirado: 0, importe_datafono: 0, notas: '' };

  // Ventas
  ventas: Venta[] = [];
  cargandoVentas = false;
  errorVentas = '';
  devolucionVentaId: number | null = null;
  motivoDevolucion = '';
  passwordDevolucion = '';
  procesandoDevolucion = false;
  errorDevolucion = '';

  // Pagination (client-side)
  pageSizeVentas = 10;
  ventasPage = 1;
  ventasTotal = 0;
  ventasLastPage = 1;

  // Devoluciones
  devoluciones: any[] = [];
  cargandoDevoluciones = false;
  pageSizeDevoluciones = 10;
  devolucionesPage = 1;
  devolucionesTotal = 0;
  devolucionesLastPage = 1;

  // Cierres de caja
  cierres: CierreCaja[] = [];
  cargandoCierres = false;
  expandedCierreId: number | null = null;
  pageSizeCierres = 10;
  cierresPage = 1;
  cierresTotal = 0;
  cierresLastPage = 1;

  // Vista activa para pestañas: facturas/ventas/devoluciones/cierres
  vistaActiva: 'facturas' | 'ventas' | 'devoluciones' | 'cierres' = 'ventas';

  get totalVentas(): number {
    return this.ventas.reduce((sum, v) => sum + Number(v.total ?? 0), 0);
  }

  /* --- Pagination helpers --- */
  get ventasTotalPages(): number {
    return Math.max(1, this.ventasLastPage ?? 1);
  }
  get ventasPaged(): Venta[] {
    return this.ventas;
  }
  get ventasPages(): number[] {
    return Array.from({ length: this.ventasTotalPages }, (_, i) => i + 1);
  }
  goToVentasPage(n: number) {
    if (n < 1 || n > this.ventasTotalPages) return;
    this.ventasPage = n;
    this.cargarVentas();
  }
  prevVentas() {
    if (this.ventasPage > 1) {
      this.ventasPage--;
      this.cargarVentas();
    }
  }
  nextVentas() {
    if (this.ventasPage < this.ventasTotalPages) {
      this.ventasPage++;
      this.cargarVentas();
    }
  }

  get devolucionesTotalPages(): number {
    return Math.max(1, this.devolucionesLastPage ?? 1);
  }
  get devolucionesPaged(): any[] {
    return this.devoluciones;
  }
  get devolucionesPages(): number[] {
    return Array.from({ length: this.devolucionesTotalPages }, (_, i) => i + 1);
  }
  goToDevolucionesPage(n: number) {
    if (n < 1 || n > this.devolucionesTotalPages) return;
    this.devolucionesPage = n;
    this.cargarDevoluciones();
  }
  prevDevoluciones() {
    if (this.devolucionesPage > 1) {
      this.devolucionesPage--;
      this.cargarDevoluciones();
    }
  }
  nextDevoluciones() {
    if (this.devolucionesPage < this.devolucionesTotalPages) {
      this.devolucionesPage++;
      this.cargarDevoluciones();
    }
  }

  get cierresTotalPages(): number {
    return Math.max(1, this.cierresLastPage ?? 1);
  }
  get cierresPaged(): CierreCaja[] {
    return this.cierres;
  }
  get cierresPages(): number[] {
    return Array.from({ length: this.cierresTotalPages }, (_, i) => i + 1);
  }
  goToCierresPage(n: number) {
    if (n < 1 || n > this.cierresTotalPages) return;
    this.cierresPage = n;
    this.cargarCierres();
  }
  prevCierres() {
    if (this.cierresPage > 1) {
      this.cierresPage--;
      this.cargarCierres();
    }
  }
  nextCierres() {
    if (this.cierresPage < this.cierresTotalPages) {
      this.cierresPage++;
      this.cargarCierres();
    }
  }

  ngOnInit(): void {
    forkJoin({
      productos: this.api.getProductos(),
      clientes: this.api.getClientes(),
      categorias: this.api.getCategorias(),
      proveedores: this.api.getProveedores(),
      ventas: this.api.getVentas(),
      devoluciones: this.api.getDevoluciones(),
      cierres: this.api.getCierresCaja(),
    }).subscribe({
      next: ({ productos, clientes, categorias, proveedores, ventas, devoluciones, cierres }) => {
        this.productos = productos;
        this.productosFiltrados = productos;
        this.clientes = clientes;
        this.categorias = categorias;
        this.proveedores = proveedores;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar datos.';
        this.cargando = false;
      },
    });
  }

  filtrar(): void {
    const q = this.busqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter((p) => {
      const matchBusqueda =
        !q || p.nombre.toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q);
      const matchCat = !this.categoriaFiltro || p.categoria_id === Number(this.categoriaFiltro);
      return matchBusqueda && matchCat;
    });
  }

  agregarAlCarrito(p: Producto): void {
    if (p.stock_quantity <= 0) return;
    const existing = this.carrito.find((i) => i.producto.id === p.id);
    if (existing) {
      if (existing.cantidad < p.stock_quantity) {
        existing.cantidad++;
        existing.subtotal = existing.cantidad * existing.precio_unitario;
      }
    } else {
      this.carrito.push({
        producto: p,
        cantidad: 1,
        precio_unitario: p.precio,
        subtotal: p.precio,
      });
    }
  }

  incrementarCantidad(item: ItemCarrito): void {
    if (item.cantidad < item.producto.stock_quantity) {
      item.cantidad++;
      item.subtotal = item.cantidad * item.precio_unitario;
    }
  }

  decrementarCantidad(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      item.subtotal = item.cantidad * item.precio_unitario;
    } else {
      this.eliminarItem(item);
    }
  }

  eliminarItem(item: ItemCarrito): void {
    this.carrito = this.carrito.filter((i) => i !== item);
  }

  setMetodoPago(m: 'efectivo' | 'tarjeta' | 'mixto'): void {
    this.metodoPago = m;
    this.importeEntregado = 0;
    this.mixtoEfectivo = 0;
    this.mixtoTarjeta = 0;
  }

  limpiarCarrito(): void {
    this.carrito = [];
    this.clienteId = null;
    this.metodoPago = 'efectivo';
    this.notas = '';
    this.importeEntregado = 0;
    this.mixtoEfectivo = 0;
    this.mixtoTarjeta = 0;
    this.error = '';
  }

  get totalCarrito(): number {
    return this.carrito.reduce((s, i) => s + i.subtotal, 0);
  }

  get vuelta(): number {
    const entregado =
      this.metodoPago === 'mixto' ? this.mixtoEfectivo + this.mixtoTarjeta : this.importeEntregado;
    return Math.max(0, entregado - this.totalCarrito);
  }

  cobrar(): void {
    if (this.carrito.length === 0) return;
    this.procesando = true;
    this.error = '';

    const payload = {
      cliente_id: this.clienteId ?? undefined,
      metodo_pago: this.metodoPago,
      notas: this.notas || undefined,
      items: this.carrito.map((i) => ({
        producto_id: i.producto.id,
        cantidad: i.cantidad,
        precio_unitario: i.precio_unitario,
      })),
    };

    this.api.crearVentaPOS(payload).subscribe({
      next: () => {
        this.totalUltimaVenta = this.totalCarrito;
        this.vueltaUltimaVenta = this.vuelta;
        this.ventaRealizada = true;
        this.limpiarCarrito();
        this.procesando = false;
        // Refresh products to update stock
        this.api.getProductos().subscribe((p) => {
          this.productos = p;
          this.filtrar();
        });
      },
      error: (e) => {
        this.error = e?.error?.message ?? e?.error?.error ?? 'Error al procesar la venta.';
        this.procesando = false;
      },
    });
  }

  abrirPagoProveedor(): void {
    this.pagoProveedorForm = {
      proveedor_id: '',
      importe: 0,
      concepto: '',
      metodo_pago: 'efectivo',
    };
    this.errorPago = '';
    this.mostrarPagoProveedor = true;
  }

  confirmarPagoProveedor(): void {
    if (!this.pagoProveedorForm.importe || this.pagoProveedorForm.importe <= 0) {
      this.errorPago = 'El importe debe ser mayor que 0.';
      return;
    }
    if (!this.pagoProveedorForm.concepto.trim()) {
      this.errorPago = 'El concepto es obligatorio.';
      return;
    }
    this.procesandoPago = true;
    this.errorPago = '';
    const payload: any = {
      importe: this.pagoProveedorForm.importe,
      concepto: this.pagoProveedorForm.concepto,
      metodo_pago: this.pagoProveedorForm.metodo_pago,
    };
    if (this.pagoProveedorForm.proveedor_id) {
      payload.proveedor_id = this.pagoProveedorForm.proveedor_id;
    }
    this.api.pagarProveedor(payload).subscribe({
      next: () => {
        this.procesandoPago = false;
        this.mostrarPagoProveedor = false;
        alert('Pago a proveedor registrado correctamente.');
      },
      error: (e) => {
        this.errorPago = e?.error?.message ?? 'Error al registrar el pago.';
        this.procesandoPago = false;
      },
    });
  }

  abrirCierreCaja(): void {
    this.cierreCaja = { efectivo_retirado: 0, importe_datafono: 0, notas: '' };
    this.errorCierre = '';
    this.mostrarCierreCaja = true;
    this.api.getTotalVentasHoy().subscribe({
      next: (r) => {
        this.totalVentasHoy = r.total_ventas_hoy;
      },
    });
  }

  get diferenciaCierre(): number {
    return (
      this.cierreCaja.efectivo_retirado + this.cierreCaja.importe_datafono - this.totalVentasHoy
    );
  }

  guardarCierre(): void {
    this.guardandoCierre = true;
    this.errorCierre = '';
    const hoy = new Date().toISOString().split('T')[0];
    this.api
      .crearCierreCaja({
        fecha: hoy,
        efectivo_retirado: this.cierreCaja.efectivo_retirado,
        importe_datafono: this.cierreCaja.importe_datafono,
        notas: this.cierreCaja.notas || undefined,
      })
      .subscribe({
        next: () => {
          this.guardandoCierre = false;
          this.mostrarCierreCaja = false;
          alert('Cierre de caja guardado correctamente.');
        },
        error: (e) => {
          this.errorCierre = e?.error?.message ?? 'Error al guardar el cierre.';
          this.guardandoCierre = false;
        },
      });
  }
  cargarVentas(): void {
    this.cargandoVentas = true;
    this.api.getVentas(this.ventasPage, this.pageSizeVentas).subscribe({
      next: (res) => {
        const items = res && (res.data ?? res.items ?? (Array.isArray(res) ? res : null));
        this.ventas = Array.isArray(items) ? items : [];
        const meta = res && (res.meta ?? res);
        this.ventasTotal = (meta && (meta.total ?? meta.totalItems)) ?? this.ventas.length ?? 0;
        this.ventasLastPage =
          (meta && (meta.last_page ?? meta.lastPage)) ??
          Math.max(1, Math.ceil(this.ventasTotal / this.pageSizeVentas));
        this.cargandoVentas = false;
      },
      error: () => {
        this.errorVentas = 'Error al cargar ventas.';
        this.cargandoVentas = false;
      },
    });
  }

  cargarDevoluciones(): void {
    this.cargandoDevoluciones = true;
    this.api.getDevoluciones(this.devolucionesPage, this.pageSizeDevoluciones).subscribe({
      next: (res) => {
        const items = res && (res.data ?? res.items ?? (Array.isArray(res) ? res : null));
        this.devoluciones = Array.isArray(items) ? items : [];
        const metaD = res && (res.meta ?? res);
        this.devolucionesTotal =
          (metaD && (metaD.total ?? metaD.totalItems)) ?? this.devoluciones.length ?? 0;
        this.devolucionesLastPage =
          (metaD && (metaD.last_page ?? metaD.lastPage)) ??
          Math.max(1, Math.ceil(this.devolucionesTotal / this.pageSizeDevoluciones));
        this.cargandoDevoluciones = false;
      },
      error: () => {
        this.cargandoDevoluciones = false;
      },
    });
  }

  cambiarVista(v: 'facturas' | 'ventas' | 'devoluciones' | 'cierres'): void {
    this.vistaActiva = v;
    if (v === 'ventas') this.cargarVentas();
    if (v === 'devoluciones') this.cargarDevoluciones();
    if (v === 'cierres') this.cargarCierres();
  }

  cargarCierres(): void {
    this.cargandoCierres = true;
    this.api.getCierresCaja(this.cierresPage, this.pageSizeCierres).subscribe({
      next: (res) => {
        const items = res && (res.data ?? res.items ?? (Array.isArray(res) ? res : null));
        this.cierres = Array.isArray(items) ? items : [];
        const metaC = res && (res.meta ?? res);
        this.cierresTotal =
          (metaC && (metaC.total ?? metaC.totalItems)) ?? this.cierres.length ?? 0;
        this.cierresLastPage =
          (metaC && (metaC.last_page ?? metaC.lastPage)) ??
          Math.max(1, Math.ceil(this.cierresTotal / this.pageSizeCierres));
        this.cargandoCierres = false;
      },
      error: () => {
        this.cargandoCierres = false;
      },
    });
  }

  toggleCierre(id: number): void {
    this.expandedCierreId = this.expandedCierreId === id ? null : id;
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

    this.api
      .crearDevolucion(
        this.devolucionVentaId,
        this.passwordDevolucion,
        this.motivoDevolucion || undefined,
      )
      .subscribe({
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
}
