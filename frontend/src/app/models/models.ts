export interface Categoria {
  id: number;
  nombre: string;
  created_at?: string;
  updated_at?: string;
}

export interface Proveedor {
  id: number;
  nombre: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  productos?: Producto[];
  created_at?: string;
  updated_at?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  sku?: string;
  descripcion?: string;
  precio: number;
  stock_quantity: number;
  categoria_id?: number;
  proveedor_id: number;
  categoria?: Categoria;
  proveedor?: Proveedor;
  created_at?: string;
  updated_at?: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  phone?: string;
  address?: string;
  facturas?: Factura[];
  created_at?: string;
  updated_at?: string;
}

export interface Factura {
  id: number;
  cliente_id: number;
  user_id?: number;
  cliente?: Cliente;
  total_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  invoice_date: string;
  due_date?: string;
  detalles?: DetalleFactura[];
  created_at?: string;
  updated_at?: string;
}

export interface DetalleFactura {
  id: number;
  factura_id: number;
  producto_id: number;
  producto?: Producto;
  cantidad: number;
  precio_unitario: number;
  created_at?: string;
  updated_at?: string;
}

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fecha_contratacion: string;
  salario?: number;
  puesto: string;
  created_at?: string;
  updated_at?: string;
}

export interface Inventario {
  id: number;
  producto_id: number;
  producto?: Producto;
  cantidad_disponible: number;
  cantidad_minima: number;
  ubicacion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DetalleVenta {
  id: number;
  venta_id: number;
  producto_id: number;
  producto?: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at?: string;
  updated_at?: string;
}

export interface Devolucion {
  id: number;
  venta_id: number;
  venta?: Venta;
  user_id: number;
  user?: User;
  motivo?: string;
  importe: number;
  fecha: string;
  created_at?: string;
}

export interface Venta {
  id: number;
  user_id: number;
  cliente_id?: number;
  user?: User;
  cliente?: Cliente;
  total: number;
  fecha_venta: string;
  metodo_pago: string;
  notas?: string;
  tipo?: 'venta' | 'pago_proveedor';
  concepto?: string;
  devuelta: boolean;
  detalles?: DetalleVenta[];
  devolucion?: Devolucion;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  photo?: string | null;
  created_at?: string;
}

export interface Jornada {
  id: number;
  user_id: number;
  user?: User;
  inicio: string;
  fin?: string | null;
  duracion_minutos?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ResumenJornada {
  user_id: number;
  nombre: string;
  email: string;
  rol: string;
  total_minutos: number;
  jornada_activa?: Jornada | null;
  num_jornadas: number;
  periodos?: { inicio: string; fin: string | null }[];
}

export interface ResumenMensualUsuario {
  dias_trabajados: number;
  total_minutos: number;
  detalle_dias: { fecha: string; minutos: number; jornadas: number }[];
}

export interface ResumenMensualAdmin {
  user_id: number;
  nombre: string;
  dias_trabajados: number;
  total_minutos: number;
  num_jornadas: number;
}

export interface CierreCaja {
  id: number;
  user_id: number;
  user?: User;
  fecha: string;
  efectivo_retirado: number;
  importe_datafono: number;
  total_ventas: number;
  diferencia: number;
  notas?: string;
  // Computed for admin/gerente
  efectivo_esperado?: number;
  tarjeta_esperada?: number;
  created_at?: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface NuevaVenta {
  cliente_id?: number | null;
  metodo_pago: 'efectivo' | 'tarjeta' | 'mixto';
  notas?: string;
  items: { producto_id: number; cantidad: number; precio_unitario: number }[];
}

export interface EstadisticasHoy {
  ingresos: number;
  gastos: number;
  diferencia: number;
  num_operaciones: number;
  ticket_medio: number;
  num_devoluciones: number;
  importe_devoluciones: number;
}

export interface EstadisticasUsuario {
  user_id: number;
  nombre: string;
  num_ventas: number;
  total: number;
  promedio: number;
  num_devoluciones: number;
  importe_devoluciones: number;
}

export interface Estadisticas {
  desde: string;
  hasta: string;
  ingresos: number;
  gastos: number;
  diferencia: number;
  num_operaciones: number;
  ticket_medio: number;
  num_devoluciones: number;
  importe_devoluciones: number;
  hoy: EstadisticasHoy;
  usuarios_hoy: EstadisticasUsuario[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}
