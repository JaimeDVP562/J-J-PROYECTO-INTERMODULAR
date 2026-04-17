import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const base = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── Productos ───────────────────────────────────────────────────────────
  describe('Productos', () => {
    it('getProductos() hace GET a /productos', () => {
      service.getProductos().subscribe();
      const req = httpMock.expectOne(`${base}/productos`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('createProducto() hace POST a /productos', () => {
      const payload = { nombre: 'Test', precio: 9.99, stock_quantity: 5 };
      service.createProducto(payload).subscribe();
      const req = httpMock.expectOne(`${base}/productos`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ id: 1, ...payload });
    });

    it('updateProducto() hace PUT a /productos/:id', () => {
      service.updateProducto(1, { nombre: 'Nuevo' }).subscribe();
      const req = httpMock.expectOne(`${base}/productos/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });

    it('deleteProducto() hace DELETE a /productos/:id', () => {
      service.deleteProducto(1).subscribe();
      const req = httpMock.expectOne(`${base}/productos/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  // ── Clientes ────────────────────────────────────────────────────────────
  describe('Clientes', () => {
    it('getClientes() hace GET a /clientes', () => {
      service.getClientes().subscribe();
      const req = httpMock.expectOne(`${base}/clientes`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('createCliente() hace POST a /clientes', () => {
      const payload = { nombre: 'Cliente Test', email: 'c@test.com' };
      service.createCliente(payload).subscribe();
      const req = httpMock.expectOne(`${base}/clientes`);
      expect(req.request.method).toBe('POST');
      req.flush({ id: 1, ...payload });
    });
  });

  // ── Ventas ──────────────────────────────────────────────────────────────
  describe('Ventas', () => {
    it('getVentas() hace GET a /ventas con paginación', () => {
      service.getVentas(2, 5).subscribe();
      const req = httpMock.expectOne(`${base}/ventas?page=2&limit=5`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: [] });
    });
  });

  // ── Jornadas ────────────────────────────────────────────────────────────
  describe('Jornadas', () => {
    it('iniciarJornada() hace POST a /jornadas', () => {
      service.iniciarJornada().subscribe();
      const req = httpMock.expectOne(`${base}/jornadas`);
      expect(req.request.method).toBe('POST');
      req.flush({ id: 1 });
    });

    it('finalizarJornada() hace PATCH a /jornadas/:id/fin', () => {
      service.finalizarJornada(3).subscribe();
      const req = httpMock.expectOne(`${base}/jornadas/3/fin`);
      expect(req.request.method).toBe('PATCH');
      req.flush({ id: 3 });
    });
  });

  // ── Manejo de errores ───────────────────────────────────────────────────
  describe('Manejo de errores HTTP', () => {
    it('getProductos() propaga error cuando la API falla', (done) => {
      service.getProductos().subscribe({
        error: (err: Error) => {
          expect(err.message).toBeTruthy();
          done();
        },
      });
      httpMock.expectOne(`${base}/productos`).flush(
        { message: 'No autorizado' },
        { status: 401, statusText: 'Unauthorized' },
      );
    });

    it('createCliente() propaga error 422 de validación', (done) => {
      service.createCliente({ nombre: '' }).subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('El nombre es obligatorio');
          done();
        },
      });
      httpMock.expectOne(`${base}/clientes`).flush(
        { message: 'El nombre es obligatorio' },
        { status: 422, statusText: 'Unprocessable Entity' },
      );
    });
  });
});
