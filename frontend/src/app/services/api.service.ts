import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Estadisticas,
  Producto,
  Cliente,
  Proveedor,
  Categoria,
  Factura,
  DetalleFactura,
  Empleado,
  Inventario,
  Venta,
  DetalleVenta,
  Jornada,
  ResumenJornada,
  ResumenMensualUsuario,
  ResumenMensualAdmin,
  User,
  CierreCaja,
  Devolucion,
  NuevaVenta,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  private handleError(error: HttpErrorResponse): Observable<never> {
    const mensaje =
      error.error?.message ?? error.error?.error ?? `Error ${error.status}: ${error.statusText}`;
    return throwError(() => new Error(mensaje));
  }

  // Productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`).pipe(catchError(this.handleError));
  }
  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/productos/${id}`).pipe(catchError(this.handleError));
  }
  createProducto(data: Partial<Producto>): Observable<any> {
    return this.http.post(`${this.baseUrl}/productos`, data).pipe(catchError(this.handleError));
  }
  updateProducto(id: number, data: Partial<Producto>): Observable<any> {
    return this.http.put(`${this.baseUrl}/productos/${id}`, data).pipe(catchError(this.handleError));
  }
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/${id}`).pipe(catchError(this.handleError));
  }

  // Clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/clientes`).pipe(catchError(this.handleError));
  }
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/clientes/${id}`).pipe(catchError(this.handleError));
  }
  createCliente(data: Partial<Cliente>): Observable<any> {
    return this.http.post(`${this.baseUrl}/clientes`, data).pipe(catchError(this.handleError));
  }
  updateCliente(id: number, data: Partial<Cliente>): Observable<any> {
    return this.http.put(`${this.baseUrl}/clientes/${id}`, data).pipe(catchError(this.handleError));
  }
  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clientes/${id}`).pipe(catchError(this.handleError));
  }

  // Proveedores
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.baseUrl}/proveedores`).pipe(catchError(this.handleError));
  }
  getProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.baseUrl}/proveedores/${id}`).pipe(catchError(this.handleError));
  }
  createProveedor(data: Partial<Proveedor>): Observable<any> {
    return this.http.post(`${this.baseUrl}/proveedores`, data).pipe(catchError(this.handleError));
  }
  updateProveedor(id: number, data: Partial<Proveedor>): Observable<any> {
    return this.http.put(`${this.baseUrl}/proveedores/${id}`, data).pipe(catchError(this.handleError));
  }
  deleteProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/proveedores/${id}`).pipe(catchError(this.handleError));
  }

  // Categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`).pipe(catchError(this.handleError));
  }
  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/categorias/${id}`).pipe(catchError(this.handleError));
  }
  createCategoria(data: Partial<Categoria>): Observable<any> {
    return this.http.post(`${this.baseUrl}/categorias`, data).pipe(catchError(this.handleError));
  }
  updateCategoria(id: number, data: Partial<Categoria>): Observable<any> {
    return this.http.put(`${this.baseUrl}/categorias/${id}`, data).pipe(catchError(this.handleError));
  }
  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categorias/${id}`).pipe(catchError(this.handleError));
  }

  // Facturas
  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.baseUrl}/facturas`).pipe(catchError(this.handleError));
  }
  getNextFacturaNumber(series?: string): Observable<{ series: string; next: number }> {
    const q = series ? `?series=${encodeURIComponent(series)}` : '';
    return this.http
      .get<{ series: string; next: number }>(`${this.baseUrl}/facturas/next-number${q}`)
      .pipe(catchError(this.handleError));
  }
  getEmpresa(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/empresa`).pipe(catchError(this.handleError));
  }
  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.baseUrl}/facturas/${id}`).pipe(catchError(this.handleError));
  }
  createFactura(data: Partial<Factura>): Observable<any> {
    return this.http.post(`${this.baseUrl}/facturas`, data).pipe(catchError(this.handleError));
  }
  updateFactura(id: number, data: Partial<Factura>): Observable<any> {
    return this.http.put(`${this.baseUrl}/facturas/${id}`, data).pipe(catchError(this.handleError));
  }
  deleteFactura(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/facturas/${id}`).pipe(catchError(this.handleError));
  }
  resendVerifactu(id: number): Observable<Factura> {
    return this.http
      .post<Factura>(`${this.baseUrl}/facturas/${id}/resend-verifactu`, {})
      .pipe(catchError(this.handleError));
  }

  // Empleados
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}/empleados`).pipe(catchError(this.handleError));
  }
  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/empleados/${id}`).pipe(catchError(this.handleError));
  }
  createEmpleado(data: Partial<Empleado>): Observable<any> {
    return this.http.post(`${this.baseUrl}/empleados`, data).pipe(catchError(this.handleError));
  }
  updateEmpleado(id: number, data: Partial<Empleado>): Observable<any> {
    return this.http.put(`${this.baseUrl}/empleados/${id}`, data).pipe(catchError(this.handleError));
  }
  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/empleados/${id}`).pipe(catchError(this.handleError));
  }

  // Inventarios
  getInventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.baseUrl}/inventarios`).pipe(catchError(this.handleError));
  }
  getInventario(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.baseUrl}/inventarios/${id}`).pipe(catchError(this.handleError));
  }
  createInventario(data: Partial<Inventario>): Observable<any> {
    return this.http.post(`${this.baseUrl}/inventarios`, data).pipe(catchError(this.handleError));
  }
  updateInventario(id: number, data: Partial<Inventario>): Observable<any> {
    return this.http.put(`${this.baseUrl}/inventarios/${id}`, data).pipe(catchError(this.handleError));
  }
  deleteInventario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/inventarios/${id}`).pipe(catchError(this.handleError));
  }

  // Ventas
  getVentas(page: number = 1, limit: number = 10): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/ventas?page=${page}&limit=${limit}`)
      .pipe(catchError(this.handleError));
  }
  getVenta(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.baseUrl}/ventas/${id}`).pipe(catchError(this.handleError));
  }
  crearVentaPOS(data: NuevaVenta): Observable<Venta> {
    return this.http.post<Venta>(`${this.baseUrl}/ventas`, data).pipe(catchError(this.handleError));
  }
  pagarProveedor(data: {
    proveedor_id?: number;
    importe: number;
    concepto: string;
    metodo_pago: string;
  }): Observable<Venta> {
    return this.http
      .post<Venta>(`${this.baseUrl}/ventas/pago-proveedor`, data)
      .pipe(catchError(this.handleError));
  }
  getVentasHoy(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.baseUrl}/ventas/mis-hoy`).pipe(catchError(this.handleError));
  }
  updateVenta(id: number, data: Partial<Venta>): Observable<any> {
    return this.http.put(`${this.baseUrl}/ventas/${id}`, data).pipe(catchError(this.handleError));
  }
  deleteVenta(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ventas/${id}`).pipe(catchError(this.handleError));
  }

  // Devoluciones
  getDevoluciones(page: number = 1, limit: number = 10): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/devoluciones?page=${page}&limit=${limit}`)
      .pipe(catchError(this.handleError));
  }
  getDevolucionesHoy(page: number = 1, limit: number = 10): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/devoluciones/mis-hoy?page=${page}&limit=${limit}`)
      .pipe(catchError(this.handleError));
  }
  crearDevolucion(venta_id: number, password: string, motivo?: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/devoluciones`, { venta_id, password, motivo })
      .pipe(catchError(this.handleError));
  }

  // Cierre de caja
  getCierresCaja(page: number = 1, limit: number = 10): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/cierre-cajas?page=${page}&limit=${limit}`)
      .pipe(catchError(this.handleError));
  }
  getTotalVentasHoy(): Observable<{ total_ventas_hoy: number; fecha: string }> {
    return this.http
      .get<any>(`${this.baseUrl}/cierre-cajas/total-hoy`)
      .pipe(catchError(this.handleError));
  }
  crearCierreCaja(data: Partial<CierreCaja>): Observable<any> {
    return this.http.post(`${this.baseUrl}/cierre-cajas`, data).pipe(catchError(this.handleError));
  }

  // Jornadas
  getJornadas(): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(`${this.baseUrl}/jornadas`).pipe(catchError(this.handleError));
  }
  getJornadaActiva(): Observable<Jornada | null> {
    return this.http
      .get<Jornada | null>(`${this.baseUrl}/jornadas/activa`)
      .pipe(
        map((j) => (j != null && typeof j === 'object' && 'id' in j ? j : null)),
        catchError(this.handleError),
      );
  }
  iniciarJornada(): Observable<Jornada> {
    return this.http.post<Jornada>(`${this.baseUrl}/jornadas`, {}).pipe(catchError(this.handleError));
  }
  finalizarJornada(id: number): Observable<Jornada> {
    return this.http
      .patch<Jornada>(`${this.baseUrl}/jornadas/${id}/fin`, {})
      .pipe(catchError(this.handleError));
  }
  getResumenJornadasHoy(): Observable<ResumenJornada[]> {
    return this.http
      .get<ResumenJornada[]>(`${this.baseUrl}/jornadas/resumen-hoy`)
      .pipe(catchError(this.handleError));
  }
  getResumenMensual(
    mes: number,
    ano: number,
  ): Observable<ResumenMensualUsuario | ResumenMensualAdmin[]> {
    return this.http
      .get<any>(`${this.baseUrl}/jornadas/resumen-mensual?mes=${mes}&ano=${ano}`)
      .pipe(catchError(this.handleError));
  }
  getJornadasUsuario(userId: number, mes: number, ano: number): Observable<Jornada[]> {
    return this.http
      .get<Jornada[]>(`${this.baseUrl}/jornadas/usuario/${userId}?mes=${mes}&ano=${ano}`)
      .pipe(catchError(this.handleError));
  }
  createJornadaAdmin(data: { user_id: number; inicio: string; fin?: string }): Observable<Jornada> {
    return this.http
      .post<Jornada>(`${this.baseUrl}/jornadas/admin`, data)
      .pipe(catchError(this.handleError));
  }
  updateJornada(id: number, data: { inicio: string; fin?: string | null }): Observable<Jornada> {
    return this.http
      .put<Jornada>(`${this.baseUrl}/jornadas/${id}`, data)
      .pipe(catchError(this.handleError));
  }
  deleteJornada(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/jornadas/${id}`).pipe(catchError(this.handleError));
  }

  // Gestión de usuarios (admin)
  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/usuarios`).pipe(catchError(this.handleError));
  }
  createUsuario(data: Partial<User> & { password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, data).pipe(catchError(this.handleError));
  }
  updateUsuario(id: number, data: Partial<User> & { password?: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, data).pipe(catchError(this.handleError));
  }
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`).pipe(catchError(this.handleError));
  }

  // Perfil
  getPerfil(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/perfil`).pipe(catchError(this.handleError));
  }
  getPerfilById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/perfil/${id}`).pipe(catchError(this.handleError));
  }
  updatePerfil(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/perfil`, data).pipe(catchError(this.handleError));
  }

  // Ayuda
  enviarAyuda(empresa: string, descripcion: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/ayuda`, { empresa, descripcion })
      .pipe(catchError(this.handleError));
  }

  // Estadísticas
  getEstadisticas(desde: string, hasta: string): Observable<Estadisticas> {
    return this.http
      .get<Estadisticas>(`${this.baseUrl}/estadisticas?desde=${desde}&hasta=${hasta}`)
      .pipe(catchError(this.handleError));
  }
}
