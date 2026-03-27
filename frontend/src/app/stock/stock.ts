import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Inventario, Producto, Proveedor, Categoria } from '../models/models';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
})
export class StockComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  inventarios: Inventario[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  inventariosFiltrados: Inventario[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  proveedores: Proveedor[] = [];
  categorias: Categoria[] = [];
  cargando = true;
  error = '';

  vistaActiva: 'inventario' | 'productos' | 'proveedores' = 'inventario';

  // Filters (productos)
  busquedaProducto = '';
  // Generic filters applied to all three tabs
  filtroTexto = '';
  filtroCategoria: number | '' = '';
  filtroProveedor: number | '' = '';

  // Añadir producto
  mostrarFormProducto = false;
  nuevoProducto: Partial<Producto> = {};
  guardandoProducto = false;
  errorProducto = '';

  // Editar proveedor
  editandoProveedorId: number | null = null;
  editProvForm: Partial<Proveedor> = {};
  editProvError = '';
  mostrarFormProveedor = false;
  nuevoProveedor: Partial<Proveedor> = {};
  guardandoProveedor = false;
  errorProveedor = '';

  // Stock en edición
  actualizandoStockId: number | null = null;
  stockAjuste: { [id: number]: number } = {};

  // Paginación
  readonly porPagina = 10;
  paginaInventario = 1;
  paginaProductos = 1;
  paginaProveedores = 1;

  get inventariosPaginados(): Inventario[] {
    const i = (this.paginaInventario - 1) * this.porPagina;
    return this.inventariosFiltrados.slice(i, i + this.porPagina);
  }
  get totalPaginasInventario(): number {
    return Math.ceil(this.inventariosFiltrados.length / this.porPagina);
  }

  get productosPaginados(): Producto[] {
    const i = (this.paginaProductos - 1) * this.porPagina;
    return this.productosFiltrados.slice(i, i + this.porPagina);
  }
  get totalPaginasProductos(): number {
    return Math.ceil(this.productosFiltrados.length / this.porPagina);
  }

  get proveedoresPaginados(): Proveedor[] {
    const i = (this.paginaProveedores - 1) * this.porPagina;
    return this.proveedoresFiltrados.slice(i, i + this.porPagina);
  }
  get totalPaginasProveedores(): number {
    return Math.ceil(this.proveedoresFiltrados.length / this.porPagina);
  }

  irAPagina(pagina: 'inventario' | 'productos' | 'proveedores', p: number): void {
    if (pagina === 'inventario') {
      if (p >= 1 && p <= this.totalPaginasInventario) this.paginaInventario = p;
    } else if (pagina === 'productos') {
      if (p >= 1 && p <= this.totalPaginasProductos) this.paginaProductos = p;
    } else {
      if (p >= 1 && p <= this.totalPaginasProveedores) this.paginaProveedores = p;
    }
  }

  // Enhanced pagination helpers (mirror POS/Billing behavior)
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

  /* Inventario pagination helpers */
  get inventariosPages(): number[] {
    return Array.from({ length: Math.max(1, this.totalPaginasInventario) }, (_, i) => i + 1);
  }
  get inventariosVisiblePages(): number[] {
    return this.visiblePages(this.totalPaginasInventario, this.paginaInventario, 3);
  }
  prevInventario() {
    if (this.paginaInventario > 1) this.paginaInventario--;
  }
  nextInventario() {
    if (this.paginaInventario < this.totalPaginasInventario) this.paginaInventario++;
  }
  goToInventarioFirst() {
    this.paginaInventario = 1;
  }
  goToInventarioLast() {
    this.paginaInventario = this.totalPaginasInventario || 1;
  }

  /* Productos pagination helpers */
  get productosPages(): number[] {
    return Array.from({ length: Math.max(1, this.totalPaginasProductos) }, (_, i) => i + 1);
  }
  get productosVisiblePages(): number[] {
    return this.visiblePages(this.totalPaginasProductos, this.paginaProductos, 3);
  }
  prevProductos() {
    if (this.paginaProductos > 1) this.paginaProductos--;
  }
  nextProductos() {
    if (this.paginaProductos < this.totalPaginasProductos) this.paginaProductos++;
  }
  goToProductosFirst() {
    this.paginaProductos = 1;
  }
  goToProductosLast() {
    this.paginaProductos = this.totalPaginasProductos || 1;
  }

  /* Proveedores pagination helpers */
  get proveedoresPages(): number[] {
    return Array.from({ length: Math.max(1, this.totalPaginasProveedores) }, (_, i) => i + 1);
  }
  get proveedoresVisiblePages(): number[] {
    return this.visiblePages(this.totalPaginasProveedores, this.paginaProveedores, 3);
  }
  prevProveedores() {
    if (this.paginaProveedores > 1) this.paginaProveedores--;
  }
  nextProveedores() {
    if (this.paginaProveedores < this.totalPaginasProveedores) this.paginaProveedores++;
  }
  goToProveedoresFirst() {
    this.paginaProveedores = 1;
  }
  goToProveedoresLast() {
    this.paginaProveedores = this.totalPaginasProveedores || 1;
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    forkJoin({
      inventarios: this.api.getInventarios(),
      productos: this.api.getProductos(),
      proveedores: this.api.getProveedores(),
      categorias: this.api.getCategorias(),
    }).subscribe({
      next: ({ inventarios, productos, proveedores, categorias }) => {
        this.inventarios = inventarios;
        this.productos = productos;
        this.productosFiltrados = productos;
        this.inventariosFiltrados = inventarios;
        this.proveedoresFiltrados = proveedores;
        this.proveedores = proveedores;
        this.categorias = categorias;
        this.inicializarAjustes(productos);
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar el stock.';
        this.cargando = false;
      },
    });
  }

  filtrarProductos(): void {
    // Backwards-compatible: keep existing method but delegate to generic filter
    this.filtrarStock();
  }

  filtrarStock(): void {
    const q = (this.filtroTexto || '').toLowerCase();

    // Productos
    this.productosFiltrados = this.productos.filter((p) => {
      const matchQ =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        (p.sku ?? '').toLowerCase().includes(q) ||
        (p.descripcion ?? '').toLowerCase().includes(q) ||
        String(p.proveedor_id ?? '')
          .toLowerCase()
          .includes(q);
      const matchCat = !this.filtroCategoria || p.categoria_id === Number(this.filtroCategoria);
      const matchProv = !this.filtroProveedor || p.proveedor_id === Number(this.filtroProveedor);
      return matchQ && matchCat && matchProv;
    });
    this.paginaProductos = 1;

    // Inventarios (filter by producto fields)
    this.inventariosFiltrados = this.inventarios.filter((inv) => {
      const p = this.productos.find((x) => x.id === inv.producto_id);
      if (!p) return false;
      const matchQ =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        (p.sku ?? '').toLowerCase().includes(q) ||
        (p.descripcion ?? '').toLowerCase().includes(q) ||
        String(p.proveedor_id ?? '')
          .toLowerCase()
          .includes(q);
      const matchCat = !this.filtroCategoria || p.categoria_id === Number(this.filtroCategoria);
      const matchProv = !this.filtroProveedor || p.proveedor_id === Number(this.filtroProveedor);
      return matchQ && matchCat && matchProv;
    });
    this.paginaInventario = 1;

    // Proveedores
    this.proveedoresFiltrados = this.proveedores.filter((prov) => {
      const matchQ =
        !q ||
        prov.nombre.toLowerCase().includes(q) ||
        (prov.contact_email ?? '').toLowerCase().includes(q) ||
        (prov.phone ?? '').toLowerCase().includes(q);
      const matchProv = !this.filtroProveedor || prov.id === Number(this.filtroProveedor);
      return matchQ && matchProv;
    });
    this.paginaProveedores = 1;
  }

  limpiarFiltrosStock(): void {
    this.filtroTexto = '';
    this.filtroCategoria = '';
    this.filtroProveedor = '';
    this.filtrarStock();
  }

  // ── Inicializar mapa de ajuste ─────────────────────────────────────
  inicializarAjustes(productos: Producto[]): void {
    for (const p of productos) {
      this.stockAjuste[p.id] = p.stock_quantity;
    }
  }

  // ── Establecer stock directo ────────────────────────────────────────
  establecerStock(p: Producto): void {
    const nuevo = Math.max(0, Math.round(this.stockAjuste[p.id] ?? p.stock_quantity));
    if (nuevo === p.stock_quantity) return;
    this.actualizandoStockId = p.id;
    this.api.updateProducto(p.id, { stock_quantity: nuevo }).subscribe({
      next: () => {
        p.stock_quantity = nuevo;
        this.stockAjuste[p.id] = nuevo;
        this.actualizandoStockId = null;
      },
      error: () => {
        this.stockAjuste[p.id] = p.stock_quantity;
        this.actualizandoStockId = null;
      },
    });
  }

  // ── Eliminar producto ──────────────────────────────────────────────
  eliminarProducto(id: number): void {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    this.api.deleteProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter((p) => p.id !== id);
        this.inventarios = this.inventarios.filter((i) => i.producto_id !== id);
        this.filtrarProductos();
      },
    });
  }

  // ── Añadir producto ───────────────────────────────────────────────
  abrirFormProducto(): void {
    this.nuevoProducto = { stock_quantity: 0, precio: 0 };
    this.mostrarFormProducto = true;
    this.errorProducto = '';
  }

  guardarProducto(): void {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.proveedor_id) {
      this.errorProducto = 'Nombre y proveedor son obligatorios.';
      return;
    }
    const nombreDup = this.productos.some(
      (p) => p.nombre.trim().toLowerCase() === this.nuevoProducto.nombre!.trim().toLowerCase(),
    );
    if (nombreDup) {
      this.errorProducto = 'Ya existe un producto con ese nombre.';
      return;
    }
    this.guardandoProducto = true;
    this.api.createProducto(this.nuevoProducto).subscribe({
      next: () => {
        this.guardandoProducto = false;
        this.mostrarFormProducto = false;
        this.api.getProductos().subscribe((p) => {
          this.productos = p;
          this.inicializarAjustes(p);
          this.filtrarProductos();
        });
      },
      error: (e) => {
        this.errorProducto = e?.error?.message ?? 'Error al crear el producto.';
        this.guardandoProducto = false;
      },
    });
  }

  // ── Proveedores ────────────────────────────────────────────────────
  iniciarEditProveedor(p: Proveedor): void {
    this.editandoProveedorId = p.id;
    this.editProvForm = {
      nombre: p.nombre,
      contact_email: p.contact_email,
      phone: p.phone,
      address: p.address,
    };
    this.editProvError = '';
  }

  cancelarEditProveedor(): void {
    this.editandoProveedorId = null;
    this.editProvForm = {};
    this.editProvError = '';
  }

  guardarProveedor(): void {
    if (!this.editandoProveedorId) return;
    const nombreDup =
      this.editProvForm.nombre &&
      this.proveedores.some(
        (p) =>
          p.id !== this.editandoProveedorId &&
          p.nombre.trim().toLowerCase() === this.editProvForm.nombre!.trim().toLowerCase(),
      );
    if (nombreDup) {
      this.editProvError = 'Ya existe un proveedor con ese nombre.';
      return;
    }
    const emailDup =
      this.editProvForm.contact_email &&
      this.proveedores.some(
        (p) =>
          p.id !== this.editandoProveedorId &&
          p.contact_email &&
          p.contact_email.trim().toLowerCase() ===
            this.editProvForm.contact_email!.trim().toLowerCase(),
      );
    if (emailDup) {
      this.editProvError = 'Ya existe un proveedor con ese email.';
      return;
    }
    this.editProvError = '';
    this.guardandoProveedor = true;
    this.api.updateProveedor(this.editandoProveedorId, this.editProvForm).subscribe({
      next: () => {
        this.guardandoProveedor = false;
        this.editandoProveedorId = null;
        this.api.getProveedores().subscribe((p) => {
          this.proveedores = p;
          this.filtrarStock();
        });
      },
      error: () => {
        this.guardandoProveedor = false;
      },
    });
  }

  eliminarProveedor(id: number): void {
    if (!confirm('¿Eliminar este proveedor? Esta acción no se puede deshacer.')) return;
    this.api.deleteProveedor(id).subscribe({
      next: () => {
        this.proveedores = this.proveedores.filter((p) => p.id !== id);
        this.filtrarStock();
      },
    });
  }

  abrirFormProveedor(): void {
    this.nuevoProveedor = {};
    this.mostrarFormProveedor = true;
    this.errorProveedor = '';
  }

  crearProveedor(): void {
    if (!this.nuevoProveedor.nombre) {
      this.errorProveedor = 'El nombre es obligatorio.';
      return;
    }
    const nombreDup = this.proveedores.some(
      (p) => p.nombre.trim().toLowerCase() === this.nuevoProveedor.nombre!.trim().toLowerCase(),
    );
    if (nombreDup) {
      this.errorProveedor = 'Ya existe un proveedor con ese nombre.';
      return;
    }
    const emailDup =
      this.nuevoProveedor.contact_email &&
      this.proveedores.some(
        (p) =>
          p.contact_email &&
          p.contact_email.trim().toLowerCase() ===
            this.nuevoProveedor.contact_email!.trim().toLowerCase(),
      );
    if (emailDup) {
      this.errorProveedor = 'Ya existe un proveedor con ese email.';
      return;
    }
    this.guardandoProveedor = true;
    this.api.createProveedor(this.nuevoProveedor).subscribe({
      next: () => {
        this.guardandoProveedor = false;
        this.mostrarFormProveedor = false;
        this.api.getProveedores().subscribe((p) => {
          this.proveedores = p;
          this.filtrarStock();
        });
      },
      error: () => {
        this.errorProveedor = 'Error al crear proveedor.';
        this.guardandoProveedor = false;
      },
    });
  }

  get stockBajo(): number {
    return this.inventarios.filter((i) => i.cantidad_disponible <= i.cantidad_minima).length;
  }

  proveedorNombrePorProducto(productoId: number): string | null {
    const prod = this.productos.find((p) => p.id === productoId);
    if (prod?.proveedor && prod.proveedor.nombre) return prod.proveedor.nombre;
    const prov = this.proveedores.find((pv) => pv.id === prod?.proveedor_id);
    return prov ? prov.nombre : null;
  }
}
