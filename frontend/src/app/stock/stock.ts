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
  mostrarFormProveedor = false;
  nuevoProveedor: Partial<Proveedor> = {};
  guardandoProveedor = false;
  errorProveedor = '';

  // Stock en edición
  actualizandoStockId: number | null = null;

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
  }

  // ── Stock +/- ──────────────────────────────────────────────────────
  cambiarStock(p: Producto, delta: number): void {
    const nuevo = Math.max(0, p.stock_quantity + delta);
    if (nuevo === p.stock_quantity) return;
    this.actualizandoStockId = p.id;
    this.api.updateProducto(p.id, { stock_quantity: nuevo }).subscribe({
      next: () => {
        p.stock_quantity = nuevo;
        this.actualizandoStockId = null;
      },
      error: () => { this.actualizandoStockId = null; },
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
    this.guardandoProducto = true;
    this.api.createProducto(this.nuevoProducto).subscribe({
      next: () => {
        this.guardandoProducto = false;
        this.mostrarFormProducto = false;
        this.api.getProductos().subscribe(p => {
          this.productos = p;
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
  }

  cancelarEditProveedor(): void {
    this.editandoProveedorId = null;
    this.editProvForm = {};
  }

  guardarProveedor(): void {
    if (!this.editandoProveedorId) return;
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
