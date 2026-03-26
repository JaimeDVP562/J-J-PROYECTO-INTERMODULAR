import { Component, inject, HostListener } from '@angular/core';
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

  dropdownOpen = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.avatar-wrapper')) {
      this.dropdownOpen = false;
    }
  }

  navigateToPerfil(): void {
    this.dropdownOpen = false;
    this.router.navigate(['/perfil']);
  }

  logout(): void {
    this.dropdownOpen = false;
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
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
