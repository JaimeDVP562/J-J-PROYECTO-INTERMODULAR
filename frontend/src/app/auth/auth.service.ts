import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res?.token) {
          localStorage.setItem('api_token', res.token);
        }
        if (res?.user) {
          localStorage.setItem('current_user', JSON.stringify(res.user));
        }
      }),
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('api_token');
        localStorage.removeItem('current_user');
      }),
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('api_token');
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('current_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.rol === 'admin';
  }

  isGerente(): boolean {
    return this.getCurrentUser()?.rol === 'gerente';
  }

  isAdminOrGerente(): boolean {
    return this.isAdmin() || this.isGerente();
  }
}
