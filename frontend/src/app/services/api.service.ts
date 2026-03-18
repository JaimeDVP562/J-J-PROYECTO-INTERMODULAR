import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  // Productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`);
  }
  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/productos/${id}`);
  }
  createProducto(data: Partial<Producto>): Observable<any> {
    return this.http.post(`${this.baseUrl}/productos`, data);
  }
  updateProducto(id: number, data: Partial<Producto>): Observable<any> {
    return this.http.put(`${this.baseUrl}/productos/${id}`, data);
  }
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/${id}`);
  }

  // Clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/clientes`);
  }
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/clientes/${id}`);
  }
  createCliente(data: Partial<Cliente>): Observable<any> {
    return this.http.post(`${this.baseUrl}/clientes`, data);
  }
  updateCliente(id: number, data: Partial<Cliente>): Observable<any> {
    return this.http.put(`${this.baseUrl}/clientes/${id}`, data);
  }
  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clientes/${id}`);
  }

  // Proveedores
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.baseUrl}/proveedores`);
  }
  getProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.baseUrl}/proveedores/${id}`);
  }
  createProveedor(data: Partial<Proveedor>): Observable<any> {
    return this.http.post(`${this.baseUrl}/proveedores`, data);
  }
  updateProveedor(id: number, data: Partial<Proveedor>): Observable<any> {
    return this.http.put(`${this.baseUrl}/proveedores/${id}`, data);
  }
  deleteProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/proveedores/${id}`);
  }

  // Categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`);
  }
  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/categorias/${id}`);
  }
  createCategoria(data: Partial<Categoria>): Observable<any> {
    return this.http.post(`${this.baseUrl}/categorias`, data);
  }
  updateCategoria(id: number, data: Partial<Categoria>): Observable<any> {
    return this.http.put(`${this.baseUrl}/categorias/${id}`, data);
  }
  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categorias/${id}`);
  }

  // Facturas
  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.baseUrl}/facturas`);
  }
  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.baseUrl}/facturas/${id}`);
  }
  createFactura(data: Partial<Factura>): Observable<any> {
    return this.http.post(`${this.baseUrl}/facturas`, data);
  }
  updateFactura(id: number, data: Partial<Factura>): Observable<any> {
    return this.http.put(`${this.baseUrl}/facturas/${id}`, data);
  }
  deleteFactura(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/facturas/${id}`);
  }

  // Empleados
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}/empleados`);
  }
  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/empleados/${id}`);
  }
  createEmpleado(data: Partial<Empleado>): Observable<any> {
    return this.http.post(`${this.baseUrl}/empleados`, data);
  }
  updateEmpleado(id: number, data: Partial<Empleado>): Observable<any> {
    return this.http.put(`${this.baseUrl}/empleados/${id}`, data);
  }
  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/empleados/${id}`);
  }

  // Inventarios
  getInventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.baseUrl}/inventarios`);
  }
  getInventario(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.baseUrl}/inventarios/${id}`);
  }
  createInventario(data: Partial<Inventario>): Observable<any> {
    return this.http.post(`${this.baseUrl}/inventarios`, data);
  }
  updateInventario(id: number, data: Partial<Inventario>): Observable<any> {
    return this.http.put(`${this.baseUrl}/inventarios/${id}`, data);
  }
  deleteInventario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/inventarios/${id}`);
  }

  // Ventas
  getVentas(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ventas?page=${page}&limit=${limit}`);
  }
  getVenta(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.baseUrl}/ventas/${id}`);
  }
  crearVentaPOS(data: NuevaVenta): Observable<Venta> {
    return this.http.post<Venta>(`${this.baseUrl}/ventas`, data);
  }
  pagarProveedor(data: {
    proveedor_id?: number;
    importe: number;
    concepto: string;
    metodo_pago: string;
  }): Observable<Venta> {
    return this.http.post<Venta>(`${this.baseUrl}/ventas/pago-proveedor`, data);
  }
  getVentasHoy(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.baseUrl}/ventas/mis-hoy`);
  }
  updateVenta(id: number, data: Partial<Venta>): Observable<any> {
    return this.http.put(`${this.baseUrl}/ventas/${id}`, data);
  }
  deleteVenta(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ventas/${id}`);
  }

  // Devoluciones
  getDevoluciones(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/devoluciones?page=${page}&limit=${limit}`);
  }
  getDevolucionesHoy(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/devoluciones/mis-hoy?page=${page}&limit=${limit}`);
  }
  crearDevolucion(venta_id: number, password: string, motivo?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/devoluciones`, { venta_id, password, motivo });
  }

  // Cierre de caja
  getCierresCaja(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cierre-cajas?page=${page}&limit=${limit}`);
  }
  getTotalVentasHoy(): Observable<{ total_ventas_hoy: number; fecha: string }> {
    return this.http.get<any>(`${this.baseUrl}/cierre-cajas/total-hoy`);
  }
  crearCierreCaja(data: Partial<CierreCaja>): Observable<any> {
    return this.http.post(`${this.baseUrl}/cierre-cajas`, data);
  }

  // Jornadas
  getJornadas(): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(`${this.baseUrl}/jornadas`);
  }
  getJornadaActiva(): Observable<Jornada | null> {
    return this.http
      .get<Jornada | null>(`${this.baseUrl}/jornadas/activa`)
      .pipe(map((j) => (j != null && typeof j === 'object' && 'id' in j ? j : null)));
  }
  iniciarJornada(): Observable<Jornada> {
    return this.http.post<Jornada>(`${this.baseUrl}/jornadas`, {});
  }
  finalizarJornada(id: number): Observable<Jornada> {
    return this.http.patch<Jornada>(`${this.baseUrl}/jornadas/${id}/fin`, {});
  }
  getResumenJornadasHoy(): Observable<ResumenJornada[]> {
    return this.http.get<ResumenJornada[]>(`${this.baseUrl}/jornadas/resumen-hoy`);
  }
  getResumenMensual(
    mes: number,
    ano: number,
  ): Observable<ResumenMensualUsuario | ResumenMensualAdmin[]> {
    return this.http.get<any>(`${this.baseUrl}/jornadas/resumen-mensual?mes=${mes}&ano=${ano}`);
  }
  getJornadasUsuario(userId: number, mes: number, ano: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(
      `${this.baseUrl}/jornadas/usuario/${userId}?mes=${mes}&ano=${ano}`,
    );
  }
  createJornadaAdmin(data: { user_id: number; inicio: string; fin?: string }): Observable<Jornada> {
    return this.http.post<Jornada>(`${this.baseUrl}/jornadas/admin`, data);
  }
  updateJornada(id: number, data: { inicio: string; fin?: string | null }): Observable<Jornada> {
    return this.http.put<Jornada>(`${this.baseUrl}/jornadas/${id}`, data);
  }
  deleteJornada(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/jornadas/${id}`);
  }

  // Gestión de usuarios (admin)
  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/usuarios`);
  }
  createUsuario(data: Partial<User> & { password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, data);
  }
  updateUsuario(id: number, data: Partial<User> & { password?: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, data);
  }
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`);
  }

  // Perfil
  getPerfil(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/perfil`);
  }
  getPerfilById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/perfil/${id}`);
  }
  updatePerfil(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/perfil`, data);
  }

  // Ayuda
  enviarAyuda(empresa: string, descripcion: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ayuda`, { empresa, descripcion });
  }

  // Estadísticas
  getEstadisticas(desde: string, hasta: string): Observable<Estadisticas> {
    return this.http.get<Estadisticas>(
      `${this.baseUrl}/estadisticas?desde=${desde}&hasta=${hasta}`,
    );
  }
}
