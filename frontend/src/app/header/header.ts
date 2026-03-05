import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  public auth = inject(AuthService);
  private router = inject(Router);

  navigateToPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  get nombreUsuario(): string {
    return this.auth.getCurrentUser()?.nombre ?? 'Usuario';
  }

  get fotoUsuario(): string | null {
    return this.auth.getCurrentUser()?.photo ?? null;
  }

  get inicialNombre(): string {
    return this.nombreUsuario.charAt(0).toUpperCase();
  }
}
