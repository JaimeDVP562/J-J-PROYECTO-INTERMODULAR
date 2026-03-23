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
  proveedores: Proveedor[] = [];
  categorias: Categoria[] = [];
  cargando = true;
  error = '';

  vistaActiva: 'inventario' | 'productos' | 'proveedores' = 'inventario';

  // Filters (productos)
  busquedaProducto = '';
  categoriaFiltro: number | '' = '';

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
    return this.inventarios.slice(i, i + this.porPagina);
  }
  get totalPaginasInventario(): number { return Math.ceil(this.inventarios.length / this.porPagina); }

  get productosPaginados(): Producto[] {
    const i = (this.paginaProductos - 1) * this.porPagina;
    return this.productosFiltrados.slice(i, i + this.porPagina);
  }
  get totalPaginasProductos(): number { return Math.ceil(this.productosFiltrados.length / this.porPagina); }

  get proveedoresPaginados(): Proveedor[] {
    const i = (this.paginaProveedores - 1) * this.porPagina;
    return this.proveedores.slice(i, i + this.porPagina);
  }
  get totalPaginasProveedores(): number { return Math.ceil(this.proveedores.length / this.porPagina); }

  irAPagina(pagina: 'inventario' | 'productos' | 'proveedores', p: number): void {
    if (pagina === 'inventario') {
      if (p >= 1 && p <= this.totalPaginasInventario) this.paginaInventario = p;
    } else if (pagina === 'productos') {
      if (p >= 1 && p <= this.totalPaginasProductos) this.paginaProductos = p;
    } else {
      if (p >= 1 && p <= this.totalPaginasProveedores) this.paginaProveedores = p;
    }
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
        this.proveedores = proveedores;
        this.categorias = categorias;
        this.inicializarAjustes(productos);
        this.cargando = false;
      },
      error: () => { this.error = 'Error al cargar el stock.'; this.cargando = false; },
    });
  }

  filtrarProductos(): void {
    const q = this.busquedaProducto.toLowerCase();
    this.productosFiltrados = this.productos.filter(p => {
      const matchQ = !q
        || p.nombre.toLowerCase().includes(q)
        || (p.sku ?? '').toLowerCase().includes(q)
        || (p.descripcion ?? '').toLowerCase().includes(q);
      const matchCat = !this.categoriaFiltro || p.categoria_id === Number(this.categoriaFiltro);
      return matchQ && matchCat;
    });
    this.paginaProductos = 1;
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
        this.productos = this.productos.filter(p => p.id !== id);
        this.inventarios = this.inventarios.filter(i => i.producto_id !== id);
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
      p => p.nombre.trim().toLowerCase() === this.nuevoProducto.nombre!.trim().toLowerCase()
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
        this.api.getProductos().subscribe(p => {
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
    this.editProvForm = { nombre: p.nombre, contact_email: p.contact_email, phone: p.phone, address: p.address };
    this.editProvError = '';
  }

  cancelarEditProveedor(): void {
    this.editandoProveedorId = null;
    this.editProvForm = {};
    this.editProvError = '';
  }

  guardarProveedor(): void {
    if (!this.editandoProveedorId) return;
    const nombreDup = this.editProvForm.nombre && this.proveedores.some(
      p => p.id !== this.editandoProveedorId &&
           p.nombre.trim().toLowerCase() === this.editProvForm.nombre!.trim().toLowerCase()
    );
    if (nombreDup) { this.editProvError = 'Ya existe un proveedor con ese nombre.'; return; }
    const emailDup = this.editProvForm.contact_email && this.proveedores.some(
      p => p.id !== this.editandoProveedorId &&
           p.contact_email && p.contact_email.trim().toLowerCase() === this.editProvForm.contact_email!.trim().toLowerCase()
    );
    if (emailDup) { this.editProvError = 'Ya existe un proveedor con ese email.'; return; }
    this.editProvError = '';
    this.guardandoProveedor = true;
    this.api.updateProveedor(this.editandoProveedorId, this.editProvForm).subscribe({
      next: () => {
        this.guardandoProveedor = false;
        this.editandoProveedorId = null;
        this.api.getProveedores().subscribe(p => this.proveedores = p);
      },
      error: () => { this.guardandoProveedor = false; },
    });
  }

  eliminarProveedor(id: number): void {
    if (!confirm('¿Eliminar este proveedor? Esta acción no se puede deshacer.')) return;
    this.api.deleteProveedor(id).subscribe({
      next: () => { this.proveedores = this.proveedores.filter(p => p.id !== id); },
    });
  }

  abrirFormProveedor(): void {
    this.nuevoProveedor = {};
    this.mostrarFormProveedor = true;
    this.errorProveedor = '';
  }

  crearProveedor(): void {
    if (!this.nuevoProveedor.nombre) { this.errorProveedor = 'El nombre es obligatorio.'; return; }
    const nombreDup = this.proveedores.some(
      p => p.nombre.trim().toLowerCase() === this.nuevoProveedor.nombre!.trim().toLowerCase()
    );
    if (nombreDup) { this.errorProveedor = 'Ya existe un proveedor con ese nombre.'; return; }
    const emailDup = this.nuevoProveedor.contact_email && this.proveedores.some(
      p => p.contact_email && p.contact_email.trim().toLowerCase() === this.nuevoProveedor.contact_email!.trim().toLowerCase()
    );
    if (emailDup) { this.errorProveedor = 'Ya existe un proveedor con ese email.'; return; }
    this.guardandoProveedor = true;
    this.api.createProveedor(this.nuevoProveedor).subscribe({
      next: () => {
        this.guardandoProveedor = false;
        this.mostrarFormProveedor = false;
        this.api.getProveedores().subscribe(p => this.proveedores = p);
      },
      error: () => { this.errorProveedor = 'Error al crear proveedor.'; this.guardandoProveedor = false; },
    });
  }

  get stockBajo(): number {
    return this.inventarios.filter(i => i.cantidad_disponible <= i.cantidad_minima).length;
  }
}
