import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('isAuthenticated()', () => {
    it('devuelve false cuando no hay token', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('devuelve true cuando hay token en localStorage', () => {
      localStorage.setItem('api_token', 'fake-token');
      expect(service.isAuthenticated()).toBeTrue();
    });
  });

  describe('getCurrentUser()', () => {
    it('devuelve null cuando no hay usuario guardado', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('devuelve el usuario parseado correctamente', () => {
      const user = { id: 1, name: 'Admin', email: 'admin@test.com', rol: 'admin' };
      localStorage.setItem('current_user', JSON.stringify(user));
      const result = service.getCurrentUser();
      expect(result).not.toBeNull();
      expect(result!.rol).toBe('admin');
    });

    it('devuelve null cuando el JSON guardado es inválido', () => {
      localStorage.setItem('current_user', 'esto no es json {{{');
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('isAdmin() / isGerente() / isAdminOrGerente()', () => {
    it('isAdmin() es true para rol admin', () => {
      localStorage.setItem('current_user', JSON.stringify({ rol: 'admin' }));
      expect(service.isAdmin()).toBeTrue();
    });

    it('isAdmin() es false para rol vendedor', () => {
      localStorage.setItem('current_user', JSON.stringify({ rol: 'vendedor' }));
      expect(service.isAdmin()).toBeFalse();
    });

    it('isGerente() es true para rol gerente', () => {
      localStorage.setItem('current_user', JSON.stringify({ rol: 'gerente' }));
      expect(service.isGerente()).toBeTrue();
    });

    it('isAdminOrGerente() es true para admin', () => {
      localStorage.setItem('current_user', JSON.stringify({ rol: 'admin' }));
      expect(service.isAdminOrGerente()).toBeTrue();
    });

    it('isAdminOrGerente() es false para vendedor', () => {
      localStorage.setItem('current_user', JSON.stringify({ rol: 'vendedor' }));
      expect(service.isAdminOrGerente()).toBeFalse();
    });
  });

  describe('login()', () => {
    it('almacena token y usuario tras login exitoso', () => {
      const mockResponse = {
        token: 'abc123',
        user: { id: 1, name: 'Admin', rol: 'admin' },
      };

      service.login('admin@test.com', 'password').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'admin@test.com', password: 'password' });
      req.flush(mockResponse);

      expect(localStorage.getItem('api_token')).toBe('abc123');
      expect(localStorage.getItem('current_user')).toContain('Admin');
    });
  });

  describe('logout()', () => {
    it('elimina token y usuario de localStorage', () => {
      localStorage.setItem('api_token', 'abc123');
      localStorage.setItem('current_user', JSON.stringify({ id: 1 }));

      service.logout().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/logout`);
      req.flush({});

      expect(localStorage.getItem('api_token')).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
    });
  });
});
