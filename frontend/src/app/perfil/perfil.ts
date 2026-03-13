import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/models';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  usuario: User | null = null;
  cargando = true;
  error = '';

  // Formulario
  form = { nombre: '', email: '', password: '' };
  guardando = false;
  exito = '';
  errorForm = '';

  // Foto
  fotoFile: File | null = null;
  fotoPreview: string | null = null;

  ngOnInit(): void {
    this.api.getPerfil().subscribe({
      next: (u) => {
        this.usuario = u;
        this.form = { nombre: u.nombre, email: u.email, password: '' };
        this.fotoPreview = u.photo ?? null;
        this.cargando = false;
      },
      error: () => { this.error = 'Error al cargar perfil.'; this.cargando = false; },
    });
  }

  onFotoSeleccionada(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.fotoFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.fotoPreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  guardar(): void {
    this.guardando = true;
    this.exito = '';
    this.errorForm = '';

    const formData = new FormData();
    formData.append('nombre', this.form.nombre);
    formData.append('email', this.form.email);
    if (this.form.password) formData.append('password', this.form.password);
    if (this.fotoFile) formData.append('photo', this.fotoFile);

    this.api.updatePerfil(formData).subscribe({
      next: (res) => {
        this.exito = 'Perfil actualizado correctamente.';
        this.guardando = false;
        this.form.password = '';
        this.fotoFile = null;
        // Update local storage user data
        const user = this.auth.getCurrentUser();
        if (user && res.data) {
          user.nombre = res.data.nombre;
          user.email = res.data.email;
          user.photo = res.data.photo;
          localStorage.setItem('current_user', JSON.stringify(user));
        }
      },
      error: (e) => {
        this.errorForm = e?.error?.message ?? 'Error al actualizar el perfil.';
        this.guardando = false;
      },
    });
  }

  get inicialNombre(): string {
    return (this.usuario?.nombre ?? 'U').charAt(0).toUpperCase();
  }
}
