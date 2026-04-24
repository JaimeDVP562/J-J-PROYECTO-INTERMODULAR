import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  styleUrls: ['./pos.css'],
})
export class PosComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);
  private cd = inject(ChangeDetectorRef);

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
  // Ventas - filtrado
  ventasFiltradas: Venta[] = [];
  ventasBusqueda = '';
  ventasFiltroUsuario: number | '' = '';
  ventasFiltroCliente: number | '' = '';
  ventasFiltroMetodo: string | '' = '';
  ventasFiltroEstado: 'todos' | 'devuelta' | 'normal' = 'todos';
  ventasFechaDesde: string = '';
  ventasFechaHasta: string = '';
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

  // Productos pagination
  pageSizeProductos = 12;
  productosPage = 1;
  productosTotal = 0;
  productosLastPage = 1;

  // UI toggles to show/hide lists
  // show ventas list by default so edit buttons are visible in the summary
  showVentasList = false;
  private resizing = false;
  private lastCartWidth = 380;

  // Devoluciones
  devoluciones: any[] = [];
  devolucionesFiltradas: any[] = [];
  cargandoDevoluciones = false;
  pageSizeDevoluciones = 10;
  devolucionesPage = 1;
  devolucionesTotal = 0;
  devolucionesLastPage = 1;

  // Devoluciones - filtros
  devolucionesFiltroUsuario: number | '' = '';
  devolucionesFiltroMotivo: string = '';
  devolucionesFiltroFecha: string = '';

  showDevolucionesList = true;

  // Cierres de caja
  cierres: CierreCaja[] = [];
  cierresFiltrados: CierreCaja[] = [];
  cargandoCierres = false;
  expandedCierreId: number | null = null;
  pageSizeCierres = 10;
  cierresPage = 1;
  cierresTotal = 0;
  cierresLastPage = 1;
  // flags: whether the backend returns paginated responses (server-side paging)
  ventasServerPaged = false;
  devolucionesServerPaged = false;
  cierresServerPaged = false;
  showCierresList = true;

  // Cierres - filtros
  cierresFiltroUsuario: number | '' = '';
  cierresFiltroFecha: string = '';

  // Vista activa para pestañas: venta/ventas/devoluciones/cierres
  // Default to 'venta' so the Sale tab is loaded when entering the module
  vistaActiva: 'venta' | 'ventas' | 'devoluciones' | 'cierres' = 'venta';

  // Mostrar/ocultar catálogo en la pestaña 'venta'
  showCatalog = true;

  // Editar cliente de una venta
  ventaEditId: number | null = null;
  ventaEditClienteId: number | null = null;
  guardandoCliente = false;
  ventaEditOriginalClienteId: number | null = null;
  ventaEditError = '';
  ventaEditSuccess = '';

  get totalVentas(): number {
    const list = this.ventasServerPaged ? this.ventas : this.ventasFiltradas;
    return (list || []).reduce((sum, v) => sum + Number(v.total ?? 0), 0);
  }

  // Helper to obtain a display name for the cliente of a venta.
  ventaClienteNombre(v: any): string {
    try {
      if (!v) return '—';
      if (v.tipo === 'pago_proveedor') return v.concepto ?? '—';
      // prefer embedded cliente object
      if (v.cliente && v.cliente.nombre) return v.cliente.nombre;
      // try common id keys
      const cid = v.cliente_id ?? v.clienteId ?? (v.cliente && v.cliente.id) ?? null;
      if (cid != null && Array.isArray(this.clientes)) {
        const c = this.clientes.find((x) => x.id === cid);
        if (c && c.nombre) return c.nombre;
      }
      return '—';
    } catch (e) {
      return '—';
    }
  }

  /* --- Productos pagination helpers --- */
  get productosTotalPages(): number {
    return Math.max(1, this.productosLastPage ?? 1);
  }
  get productosPaged(): Producto[] {
    if (!Array.isArray(this.productosFiltrados)) return [];
    // No server-side paging for productos currently
    const start = (this.productosPage - 1) * this.pageSizeProductos;
    return this.productosFiltrados.slice(start, start + this.pageSizeProductos);
  }
  get productosPages(): number[] {
    return Array.from({ length: this.productosTotalPages }, (_, i) => i + 1);
  }
  get productosVisiblePages(): number[] {
    return this.visiblePages(this.productosTotalPages, this.productosPage, 3);
  }
  goToProductosPage(n: number) {
    if (n < 1 || n > this.productosTotalPages) return;
    this.productosPage = n;
    // no server call needed; slice will update automatically
  }
  prevProductos() {
    if (this.productosPage > 1) this.productosPage--;
  }
  nextProductos() {
    if (this.productosPage < this.productosTotalPages) this.productosPage++;
  }
  goToProductosFirst() {
    this.goToProductosPage(1);
  }
  goToProductosLast() {
    this.goToProductosPage(this.productosTotalPages);
  }

  /* --- Pagination helpers --- */
  get ventasTotalPages(): number {
    return Math.max(1, this.ventasLastPage ?? 1);
  }
  get ventasPaged(): Venta[] {
    const source = this.ventasServerPaged ? this.ventas : this.ventasFiltradas;
    if (!Array.isArray(source)) return [];
    if (this.ventasServerPaged) {
      // backend already returns current page
      return source;
    }
    const start = (this.ventasPage - 1) * this.pageSizeVentas;
    return source.slice(start, start + this.pageSizeVentas);
  }
  get ventasPages(): number[] {
    return Array.from({ length: this.ventasTotalPages }, (_, i) => i + 1);
  }

  get devolucionesVisiblePages(): number[] {
    return this.visiblePages(this.devolucionesTotalPages, this.devolucionesPage, 3);
  }

  // visible page window (max 3 pages)
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

  get ventasVisiblePages(): number[] {
    return this.visiblePages(this.ventasTotalPages, this.ventasPage, 3);
  }
  goToVentasPage(n: number) {
    if (n < 1 || n > this.ventasTotalPages) return;
    this.ventasPage = n;
    this.cargarVentas();
  }
  goToVentasFirst() {
    this.goToVentasPage(1);
  }
  goToVentasLast() {
    this.goToVentasPage(this.ventasTotalPages);
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
    const source = this.devolucionesServerPaged ? this.devoluciones : this.devolucionesFiltradas;
    if (!Array.isArray(source)) return [];
    if (this.devolucionesServerPaged) return source;
    const start = (this.devolucionesPage - 1) * this.pageSizeDevoluciones;
    return source.slice(start, start + this.pageSizeDevoluciones);
  }
  get devolucionesPages(): number[] {
    return Array.from({ length: this.devolucionesTotalPages }, (_, i) => i + 1);
  }
  goToDevolucionesPage(n: number) {
    if (n < 1 || n > this.devolucionesTotalPages) return;
    this.devolucionesPage = n;
    this.cargarDevoluciones();
  }
  goToDevolucionesFirst() {
    this.goToDevolucionesPage(1);
  }
  goToDevolucionesLast() {
    this.goToDevolucionesPage(this.devolucionesTotalPages);
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
    const source = this.cierresServerPaged ? this.cierres : this.cierresFiltrados;
    if (!Array.isArray(source)) return [];
    if (this.cierresServerPaged) return source;
    const start = (this.cierresPage - 1) * this.pageSizeCierres;
    return source.slice(start, start + this.pageSizeCierres);
  }
  get cierresPages(): number[] {
    return Array.from({ length: this.cierresTotalPages }, (_, i) => i + 1);
  }
  get cierresVisiblePages(): number[] {
    return this.visiblePages(this.cierresTotalPages, this.cierresPage, 3);
  }
  goToCierresPage(n: number) {
    if (n < 1 || n > this.cierresTotalPages) return;
    this.cierresPage = n;
    this.cargarCierres();
  }
  goToCierresFirst() {
    this.goToCierresPage(1);
  }
  goToCierresLast() {
    this.goToCierresPage(this.cierresTotalPages);
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
        if (Array.isArray(this.productosFiltrados)) {
          this.productosTotal = this.productosFiltrados.length;
          this.productosLastPage = Math.max(
            1,
            Math.ceil(this.productosTotal / this.pageSizeProductos),
          );
          this.productosPage = 1;
        }
        this.clientes = clientes;
        this.categorias = categorias;
        this.proveedores = proveedores;
        // assign initial lists if returned in the forkJoin responses
        try {
          const vItems =
            ventas && (ventas.data ?? ventas.items ?? (Array.isArray(ventas) ? ventas : null));
          this.ventas = Array.isArray(vItems) ? this.normalizeListNumbers(vItems, ['total']) : [];
          if (Array.isArray(this.ventas)) {
            this.ventasTotal = this.ventas.length;
            this.ventasLastPage = Math.max(1, Math.ceil(this.ventasTotal / this.pageSizeVentas));
            this.ventasPage = 1;
            this.ventasFiltradas = this.ventas;
          }
        } catch (e) {
          this.ventas = [];
        }
        try {
          const dItems =
            devoluciones &&
            (devoluciones.data ??
              devoluciones.items ??
              (Array.isArray(devoluciones) ? devoluciones : null));
          this.devoluciones = Array.isArray(dItems)
            ? this.normalizeListNumbers(dItems, ['importe'])
            : [];
          if (Array.isArray(this.devoluciones)) {
            this.devolucionesTotal = this.devoluciones.length;
            this.devolucionesLastPage = Math.max(
              1,
              Math.ceil(this.devolucionesTotal / this.pageSizeDevoluciones),
            );
            this.devolucionesPage = 1;
            this.devolucionesFiltradas = this.devoluciones;
          }
        } catch (e) {
          this.devoluciones = [];
        }
        try {
          const cItems =
            cierres && (cierres.data ?? cierres.items ?? (Array.isArray(cierres) ? cierres : null));
          this.cierres = Array.isArray(cItems) ? this.normalizeCierres(cItems) : [];
          if (Array.isArray(this.cierres)) {
            this.cierresTotal = this.cierres.length;
            this.cierresLastPage = Math.max(1, Math.ceil(this.cierresTotal / this.pageSizeCierres));
            this.cierresPage = 1;
            this.cierresFiltrados = this.cierres;
          }
        } catch (e) {
          this.cierres = [];
        }
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar datos.';
        this.cargando = false;
      },
    });
  }

  // Toggle helpers for template
  toggleShowVentas(): void {
    this.showVentasList = !this.showVentasList;
  }

  toggleShowDevoluciones(): void {
    this.showDevolucionesList = !this.showDevolucionesList;
  }

  toggleShowCierres(): void {
    this.showCierresList = !this.showCierresList;
  }

  startResizeCart(e: MouseEvent): void {
    e.preventDefault();
    this.resizing = true;
    const onMove = (ev: MouseEvent) => this.onResizeCart(ev);
    const onUp = () => {
      this.resizing = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  private onResizeCart(ev: MouseEvent): void {
    if (!this.resizing) return;
    try {
      const container = document.querySelector('.pos-container') as HTMLElement | null;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newWidth = Math.max(200, Math.min(800, rect.right - ev.clientX));
      this.lastCartWidth = newWidth;
      document.documentElement.style.setProperty('--cart-width', newWidth + 'px');
    } catch (e) {
      // ignore
    }
  }

  filtrar(): void {
    const q = this.busqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter((p) => {
      const matchBusqueda =
        !q || p.nombre.toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q);
      const matchCat = !this.categoriaFiltro || p.categoria_id === Number(this.categoriaFiltro);
      return matchBusqueda && matchCat;
    });
    // reset productos pagination when filtering
    if (Array.isArray(this.productosFiltrados)) {
      this.productosTotal = this.productosFiltrados.length;
      this.productosLastPage = Math.max(1, Math.ceil(this.productosTotal / this.pageSizeProductos));
      this.productosPage = 1;
    }
  }

  // Filtrado para el resumen de ventas
  get ventasMetodosDisponibles(): string[] {
    if (!Array.isArray(this.ventas)) return [];
    return Array.from(new Set(this.ventas.map((v) => v.metodo_pago))).filter(Boolean);
  }

  get ventasUsuariosDisponibles(): Array<{ id: number; nombre: string }> {
    if (!Array.isArray(this.ventas)) return [];
    const map = new Map<number, string>();
    for (const v of this.ventas) {
      const u = v.user;
      if (u && (u.id !== undefined || u.nombre)) {
        const id = Number(u.id ?? -1);
        if (!Number.isNaN(id) && id > -1) map.set(id, u.nombre ?? String(id));
      }
    }
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  }

  filtrarVentas(): void {
    // Nuevo filtrado: únicamente por Usuario, Cliente y Método de pago
    this.ventasFiltradas = (this.ventas || []).filter((v) => {
      const matchUsuario =
        !this.ventasFiltroUsuario ||
        Number(v.user?.id ?? v.user?.id ?? v.user?.id) === Number(this.ventasFiltroUsuario);

      const matchCliente =
        !this.ventasFiltroCliente ||
        Number(v.cliente?.id ?? v.cliente?.id ?? v.cliente?.id) ===
          Number(this.ventasFiltroCliente);

      const matchMetodo = !this.ventasFiltroMetodo || v.metodo_pago === this.ventasFiltroMetodo;

      return matchUsuario && matchCliente && matchMetodo;
    });

    // Ensure the UI uses the filtered list (client-side) after an explicit search.
    // This overrides server-paged mode so the template reads from `ventasFiltradas`.
    this.ventasServerPaged = false;

    if (Array.isArray(this.ventasFiltradas)) {
      this.ventasTotal = this.ventasFiltradas.length;
      this.ventasLastPage = Math.max(1, Math.ceil(this.ventasTotal / this.pageSizeVentas));
      this.ventasPage = 1;
    }
  }

  // Devoluciones: usuarios disponibles (from loaded devoluciones)
  get devolucionesUsuariosDisponibles(): Array<{ id: number; nombre: string }> {
    if (!Array.isArray(this.devoluciones)) return [];
    const map = new Map<number, string>();
    for (const d of this.devoluciones) {
      const u = d.user;
      if (u && (u.id !== undefined || u.nombre)) {
        const id = Number(u.id ?? -1);
        if (!Number.isNaN(id) && id > -1) map.set(id, u.nombre ?? String(id));
      }
    }
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  }

  filtrarDevoluciones(): void {
    this.devolucionesFiltradas = (this.devoluciones || []).filter((d) => {
      const matchUsuario =
        !this.devolucionesFiltroUsuario ||
        Number(d.user?.id ?? d.user?.ID) === Number(this.devolucionesFiltroUsuario);

      const matchMotivo =
        !this.devolucionesFiltroMotivo ||
        String(d.motivo || '')
          .toLowerCase()
          .includes(this.devolucionesFiltroMotivo.toLowerCase());

      let matchFecha = true;
      try {
        if (this.devolucionesFiltroFecha) {
          const target = new Date(this.devolucionesFiltroFecha).setHours(0, 0, 0, 0);
          const fechaD = new Date(d.fecha).setHours(0, 0, 0, 0);
          if (fechaD !== target) matchFecha = false;
        }
      } catch (e) {
        matchFecha = true;
      }

      return matchUsuario && matchMotivo && matchFecha;
    });

    if (Array.isArray(this.devolucionesFiltradas)) {
      this.devolucionesTotal = this.devolucionesFiltradas.length;
      this.devolucionesLastPage = Math.max(
        1,
        Math.ceil(this.devolucionesTotal / this.pageSizeDevoluciones),
      );
      this.devolucionesPage = 1;
    }

    this.devolucionesServerPaged = false;
  }

  limpiarFiltrosDevoluciones(): void {
    this.devolucionesFiltroUsuario = '';
    this.devolucionesFiltroMotivo = '';
    this.devolucionesFiltroFecha = '';
    this.devolucionesFiltradas = Array.isArray(this.devoluciones) ? [...this.devoluciones] : [];
    this.devolucionesTotal = this.devolucionesFiltradas.length;
    this.devolucionesLastPage = Math.max(
      1,
      Math.ceil(this.devolucionesTotal / this.pageSizeDevoluciones),
    );
    this.devolucionesPage = 1;
    this.devolucionesServerPaged = false;
  }

  // Cierres: usuarios disponibles (from loaded cierres)
  get cierresUsuariosDisponibles(): Array<{ id: number; nombre: string }> {
    if (!Array.isArray(this.cierres)) return [];
    const map = new Map<number, string>();
    for (const c of this.cierres) {
      const u = c.user;
      if (u && (u.id !== undefined || u.nombre)) {
        const id = Number(u.id ?? -1);
        if (!Number.isNaN(id) && id > -1) map.set(id, u.nombre ?? String(id));
      }
    }
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  }

  filtrarCierres(): void {
    this.cierresFiltrados = (this.cierres || []).filter((c) => {
      const userId = Number(c.user?.id ?? c.user?.id ?? -1);
      const matchUsuario =
        !this.cierresFiltroUsuario || userId === Number(this.cierresFiltroUsuario);
      let matchFecha = true;
      try {
        if (this.cierresFiltroFecha) {
          const target = new Date(this.cierresFiltroFecha).setHours(0, 0, 0, 0);
          const fechaC = new Date(c.fecha).setHours(0, 0, 0, 0);
          if (fechaC !== target) matchFecha = false;
        }
      } catch (e) {
        matchFecha = true;
      }
      return matchUsuario && matchFecha;
    });

    if (Array.isArray(this.cierresFiltrados)) {
      this.cierresTotal = this.cierresFiltrados.length;
      this.cierresLastPage = Math.max(1, Math.ceil(this.cierresTotal / this.pageSizeCierres));
      this.cierresPage = 1;
    }

    this.cierresServerPaged = false;
  }

  limpiarFiltrosCierres(): void {
    this.cierresFiltroUsuario = '';
    this.cierresFiltroFecha = '';
    this.cierresFiltrados = Array.isArray(this.cierres) ? [...this.cierres] : [];
    this.cierresTotal = this.cierresFiltrados.length;
    this.cierresLastPage = Math.max(1, Math.ceil(this.cierresTotal / this.pageSizeCierres));
    this.cierresPage = 1;
    this.cierresServerPaged = false;
  }

  limpiarFiltrosVentas(): void {
    this.ventasFiltroUsuario = '';
    this.ventasFiltroCliente = '';
    this.ventasFiltroMetodo = '';
    // Reset filtered list to the full loaded ventas (client-side)
    this.ventasFiltradas = Array.isArray(this.ventas) ? [...this.ventas] : [];
    this.ventasTotal = this.ventasFiltradas.length;
    this.ventasLastPage = Math.max(1, Math.ceil(this.ventasTotal / this.pageSizeVentas));
    this.ventasPage = 1;
    // Keep client-side mode after clearing (consistent with filtrarVentas behavior)
    this.ventasServerPaged = false;
  }

  agregarAlCarrito(p: Producto): void {
    if (p.stock_quantity <= 0) return;
    const existing = this.carrito.find((i) => i.producto.id === p.id);
    // ensure price fields are numeric to avoid string concatenation
    const precioUnitario = this.parseNumber(p.precio);
    if (existing) {
      if (existing.cantidad < p.stock_quantity) {
        existing.cantidad++;
        existing.subtotal = existing.cantidad * existing.precio_unitario;
      }
    } else {
      this.carrito.push({
        // clone producto to avoid accidental external mutations
        producto: { ...p },
        cantidad: 1,
        precio_unitario: precioUnitario,
        subtotal: precioUnitario,
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
    return this.carrito.reduce((s, i) => s + this.parseNumber(i.subtotal), 0);
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
      error: () => {
        this.errorPago = 'Error al registrar el pago.';
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
        error: () => {
          this.errorCierre = 'Error al guardar el cierre.';
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
        // If backend returns ventas without embedded `cliente` object, try to resolve it
        // from the already-loaded `clientes` list using common keys like `cliente_id`.
        try {
          if (
            Array.isArray(this.ventas) &&
            Array.isArray(this.clientes) &&
            this.clientes.length > 0
          ) {
            this.ventas = this.ventas.map((v: any) => {
              // if there's already a cliente object, keep it
              if (v && v.cliente && typeof v.cliente === 'object') return v;
              // try common id keys
              const cid = v && (v.cliente_id ?? v.clienteId ?? v.cliente?.id ?? null);
              if (cid != null) {
                const cobj = this.clientes.find((c) => c.id === cid) ?? null;
                return { ...v, cliente: cobj };
              }
              return v;
            });
          }
        } catch (e) {
          // ignore mapping errors
        }
        const meta = res && (res.meta ?? res);
        // detect if backend returned pagination metadata
        this.ventasServerPaged = !!(
          meta &&
          (meta.total !== undefined || meta.last_page !== undefined || meta.lastPage !== undefined)
        );
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
        this.devolucionesServerPaged = !!(
          metaD &&
          (metaD.total !== undefined ||
            metaD.last_page !== undefined ||
            metaD.lastPage !== undefined)
        );
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

  cambiarVista(v: 'venta' | 'ventas' | 'devoluciones' | 'cierres'): void {
    // If the same tab is clicked, toggle its expanded state. Otherwise activate and expand it.
    if (this.vistaActiva === v) {
      // toggle the currently active tab
      if (v === 'ventas') {
        this.showVentasList = !this.showVentasList;
        if (this.showVentasList) this.cargarVentas();
      }
      if (v === 'devoluciones') {
        this.showDevolucionesList = !this.showDevolucionesList;
        if (this.showDevolucionesList) this.cargarDevoluciones();
      }
      if (v === 'cierres') {
        this.showCierresList = !this.showCierresList;
        if (this.showCierresList) this.cargarCierres();
      }
    } else {
      this.vistaActiva = v;
      // activate and expand the selected tab
      if (v === 'venta') {
        this.showCatalog = true;
      }
      if (v === 'ventas') {
        this.showCatalog = false;
      }
      if (v === 'ventas') {
        this.showVentasList = true;
        this.cargarVentas();
      }
      if (v === 'devoluciones') {
        this.showDevolucionesList = true;
        this.cargarDevoluciones();
      }
      if (v === 'cierres') {
        this.showCierresList = true;
        this.cargarCierres();
      }
    }
  }

  // (Removed global toggleActiveList and getActiveToggleIcon per request)

  cargarCierres(): void {
    this.cargandoCierres = true;
    this.api.getCierresCaja(this.cierresPage, this.pageSizeCierres).subscribe({
      next: (res) => {
        const items = res && (res.data ?? res.items ?? (Array.isArray(res) ? res : null));
        this.cierres = Array.isArray(items) ? this.normalizeCierres(items) : [];
        const metaC = res && (res.meta ?? res);
        this.cierresServerPaged = !!(
          metaC &&
          (metaC.total !== undefined ||
            metaC.last_page !== undefined ||
            metaC.lastPage !== undefined)
        );
        this.cierresTotal =
          (metaC && (metaC.total ?? metaC.totalItems)) ?? this.cierres.length ?? 0;
        this.cierresLastPage =
          (metaC && (metaC.last_page ?? metaC.lastPage)) ??
          Math.max(1, Math.ceil(this.cierresTotal / this.pageSizeCierres));
        // ensure change detection after loading
        this.cargandoCierres = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.cargandoCierres = false;
        this.cd.detectChanges();
      },
    });
  }

  toggleCierre(id: number): void {
    this.expandedCierreId = this.expandedCierreId === id ? null : id;
  }

  private normalizeCierres(items: any[]): CierreCaja[] {
    return items.map((c: any) => ({
      ...c,
      efectivo_retirado: this.parseNumber(c.efectivo_retirado),
      importe_datafono: this.parseNumber(c.importe_datafono),
      total_ventas: this.parseNumber(c.total_ventas),
      diferencia: this.parseNumber(c.diferencia),
      efectivo_esperado: this.parseNumber(c.efectivo_esperado),
      tarjeta_esperada: this.parseNumber(c.tarjeta_esperada),
    }));
  }

  private parseNumber(v: any): number {
    // keep backward-safe behavior
    if (v === null || v === undefined) return 0;
    if (typeof v === 'number') return v;
    try {
      let s = String(v).trim();
      if (!s) return 0;
      // keep only digits, dot, comma and minus
      s = s.replace(/[^0-9.,\-]/g, '');

      // treat last '.' or ',' as decimal separator
      const lastDot = s.lastIndexOf('.');
      const lastComma = s.lastIndexOf(',');
      const lastSep = Math.max(lastDot, lastComma);

      if (lastSep > -1) {
        const intPart = s.slice(0, lastSep).replace(/[.,]/g, '');
        const decPart = s.slice(lastSep + 1).replace(/[.,]/g, '');
        s = intPart + '.' + decPart;
      } else {
        s = s.replace(/[.,]/g, '');
      }

      const n = Number(s);
      return Number.isFinite(n) ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  // helper to be used from templates to ensure numeric values
  public money(v: any): number {
    return this.parseNumber(v);
  }

  // Generic normalizer: given a list of objects and field names, parse those fields to numbers
  private normalizeListNumbers<T extends Record<string, any>>(items: T[], fields: string[]): T[] {
    return items.map((it) => {
      const copy: any = { ...it };
      for (const f of fields) {
        if (f in copy) copy[f] = this.parseNumber(copy[f]);
      }
      return copy as T;
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

  // --- Editar cliente de venta ---
  seleccionarVentaParaEditar(venta: Venta): void {
    this.ventaEditId = venta.id ?? null;
    this.ventaEditClienteId = venta.cliente?.id ?? null;
    this.ventaEditOriginalClienteId = venta.cliente?.id ?? null;
    this.ventaEditError = '';
    this.ventaEditSuccess = '';
    // Ensure view updates immediately so the overlay/modal appears reliably
    try {
      this.cd.detectChanges();
    } catch (e) {
      // ignore detection errors
    }
  }

  cancelarEditarCliente(): void {
    this.ventaEditId = null;
    this.ventaEditClienteId = null;
  }

  guardarClienteVenta(): void {
    if (!this.ventaEditId) return;
    // validation: ensure there's a change
    const orig = this.ventaEditOriginalClienteId ?? null;
    const current = this.ventaEditClienteId ?? null;
    if (orig === current) {
      this.ventaEditError = 'No hay cambios en el cliente seleccionado.';
      this.ventaEditSuccess = '';
      return;
    }

    this.guardandoCliente = true;
    this.ventaEditError = '';
    const payload: any = { cliente_id: this.ventaEditClienteId ?? null };
    // force numeric id and log for debugging network issues
    const ventaIdNum = Number(this.ventaEditId);
    console.debug('[POS] actualizar venta payload', { ventaId: ventaIdNum, payload });
    this.ventaEditSuccess = 'Enviando cambios...';
    this.api.updateVenta(ventaIdNum, payload).subscribe({
      next: (res) => {
        this.guardandoCliente = false;
        this.ventaEditSuccess = 'Cliente actualizado correctamente.';
        // normalize ids and perform a robust optimistic update in local ventas list
        const updatedVenta = res && ((res.data ?? res) as any);
        try {
          const ventaIdNumRes = Number(
            updatedVenta && updatedVenta.id ? updatedVenta.id : ventaIdNum,
          );
          const clienteObj =
            this.clientes.find((c) => Number(c.id) === Number(this.ventaEditClienteId)) ?? null;

          const idx = this.ventas.findIndex((x) => Number(x.id) === ventaIdNumRes);
          if (idx !== -1) {
            // merge server response if present, otherwise apply optimistic cliente change
            const merged = {
              ...(this.ventas[idx] as any),
              ...(updatedVenta && typeof updatedVenta === 'object' ? updatedVenta : {}),
              cliente: updatedVenta && updatedVenta.cliente ? updatedVenta.cliente : clienteObj,
              cliente_id:
                (updatedVenta && updatedVenta.cliente_id) ?? this.ventaEditClienteId ?? null,
            } as any;
            this.ventas[idx] = merged;
          } else {
            // not found in current list — insert a minimal optimistic record
            const toInsert = {
              ...(updatedVenta && typeof updatedVenta === 'object'
                ? updatedVenta
                : { id: ventaIdNumRes }),
              cliente: updatedVenta && updatedVenta.cliente ? updatedVenta.cliente : clienteObj,
              cliente_id:
                (updatedVenta && updatedVenta.cliente_id) ?? this.ventaEditClienteId ?? null,
            } as any;
            this.ventas.unshift(toInsert);
          }
        } catch (e) {
          // ignore merge errors
        }

        // ensure view updates
        try {
          this.cd.detectChanges();
        } catch (e) {
          // ignore
        }

        // reset editor shortly after showing success
        setTimeout(() => {
          this.ventaEditId = null;
          this.ventaEditClienteId = null;
          this.ventaEditOriginalClienteId = null;
          this.ventaEditSuccess = '';
        }, 900);
      },
      error: (e) => {
        this.guardandoCliente = false;
        console.error('[POS] error updateVenta', e);
        this.ventaEditError = e?.error?.message ?? 'Error al actualizar la venta.';
        this.ventaEditSuccess = '';
      },
    });
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
