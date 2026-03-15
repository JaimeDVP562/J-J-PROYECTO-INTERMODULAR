import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import {
  Venta,
  Devolucion,
  CierreCaja,
  Producto,
  Cliente,
  Categoria,
  Proveedor,
  ItemCarrito,
} from '../models/models';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.html',
  styleUrls: ['./pos.css'],
})
export class PosComponent implements OnInit, AfterViewInit {
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

  // Facturación / listados
  seccionActiva: 'tpv' | 'listado' = 'tpv';
  vistaActiva: any = 'ventas';

  // Ventas (lista)
  ventas: Venta[] = [];
  cargandoVentas = false;
  errorVentas = '';
  devolucionVentaId: number | null = null;
  motivoDevolucion = '';
  passwordDevolucion = '';
  procesandoDevolucion = false;
  errorDevolucion = '';

  // Devoluciones
  devoluciones: Devolucion[] = [];
  cargandoDevoluciones = false;

  // Cierres de caja
  cierres: CierreCaja[] = [];
  cargandoCierres = false;
  expandedCierreId: number | null = null;

  ngOnInit(): void {
    forkJoin({
      productos: this.api.getProductos(),
      clientes: this.api.getClientes(),
      categorias: this.api.getCategorias(),
      proveedores: this.api.getProveedores(),
    }).subscribe({
      next: ({ productos, clientes, categorias, proveedores }) => {
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

  ngAfterViewInit(): void {
    // Al entrar en TPV, desplaza automáticamente hasta las pestañas de facturación/ventas
    setTimeout(() => {
      document.querySelector('.billing')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  cambiarVista(v: any): void {
    // Note: 'facturas' view is handled in the separate `BillingComponent`.
    this.vistaActiva = v;
    if (v === 'ventas') this.cargarVentas();
    if (v === 'devoluciones') this.cargarDevoluciones();
    if (v === 'cierres') this.cargarCierres();
  }

  // Facturas are managed in `BillingComponent`.

  cargarVentas(): void {
    if (this.ventas.length > 0) return;
    this.cargandoVentas = true;
    this.api.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.cargandoVentas = false;
      },
      error: () => {
        this.errorVentas = 'Error al cargar ventas.';
        this.cargandoVentas = false;
      },
    });
  }

  cargarDevoluciones(): void {
    if (this.devoluciones.length > 0) return;
    this.cargandoDevoluciones = true;
    this.api.getDevoluciones().subscribe({
      next: (data) => {
        this.devoluciones = data;
        this.cargandoDevoluciones = false;
      },
      error: () => {
        this.cargandoDevoluciones = false;
      },
    });
  }

  cargarCierres(): void {
    if (this.cierres.length > 0) return;
    this.cargandoCierres = true;
    this.api.getCierresCaja().subscribe({
      next: (data) => {
        this.cierres = data;
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

  // Factura CRUD removed from POS — handled by `BillingComponent`.

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

  // ── Helpers ──
  get totalVentas(): number {
    return this.ventas.reduce((sum, v) => sum + Number(v.total), 0);
  }
}
