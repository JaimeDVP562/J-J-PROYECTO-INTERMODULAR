import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  constructor(
    private router: Router,
    public auth: AuthService,
  ) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        localStorage.removeItem('api_token');
        localStorage.removeItem('current_user');
        this.router.navigate(['/login']);
      },
    });
  }

  get nombreUsuario(): string {
    return this.auth.getCurrentUser()?.nombre ?? 'Usuario';
  }

  get rolUsuario(): string {
    return this.auth.getCurrentUser()?.rol ?? '';
  }
}
