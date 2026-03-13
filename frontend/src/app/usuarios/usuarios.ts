import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class UsuariosComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  usuarios: User[] = [];
  cargando = true;
  error = '';

  // Añadir
  mostrarForm = false;
  nuevoUsuario: Partial<User> & { password?: string } = {};
  errorForm = '';
  guardando = false;

  // Editar
  editandoId: number | null = null;
  editForm: Partial<User> & { password?: string } = {};
  editError = '';

  // Eliminar
  eliminandoId: number | null = null;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.api.getUsuarios().subscribe({
      next: (u) => { this.usuarios = u; this.cargando = false; },
      error: () => { this.error = 'Error al cargar usuarios.'; this.cargando = false; },
    });
  }

  abrirForm(): void {
    this.nuevoUsuario = { rol: 'vendedor' };
    this.errorForm = '';
    this.mostrarForm = true;
    this.editandoId = null;
  }

  crearUsuario(): void {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      this.errorForm = 'Nombre, email y contraseña son obligatorios.';
      return;
    }
    this.guardando = true;
    this.api.createUsuario(this.nuevoUsuario as any).subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarForm = false;
        this.cargar();
      },
      error: (e) => {
        this.errorForm = e?.error?.message ?? 'Error al crear usuario.';
        this.guardando = false;
      },
    });
  }

  iniciarEdicion(u: User): void {
    this.editandoId = u.id;
    this.editForm = { nombre: u.nombre, email: u.email, rol: u.rol, password: '' };
    this.editError = '';
    this.mostrarForm = false;
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.editForm = {};
  }

  guardarEdicion(): void {
    if (!this.editandoId) return;
    this.guardando = true;
    const payload: any = { ...this.editForm };
    if (!payload.password) delete payload.password;
    this.api.updateUsuario(this.editandoId, payload).subscribe({
      next: () => {
        this.guardando = false;
        this.editandoId = null;
        this.cargar();
      },
      error: (e) => {
        this.editError = e?.error?.message ?? 'Error al actualizar.';
        this.guardando = false;
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
    this.eliminandoId = id;
    this.api.deleteUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.eliminandoId = null;
      },
      error: () => { this.eliminandoId = null; },
    });
  }

  rolLabel(rol: string): string {
    const map: Record<string, string> = { gerente: 'Gerente', vendedor: 'Vendedor' };
    return map[rol] ?? rol;
  }
}
