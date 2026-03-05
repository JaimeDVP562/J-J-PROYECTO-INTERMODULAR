import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class HelpComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  form = { empresa: '', descripcion: '' };
  enviando = false;
  exito = '';
  error = '';

  ngOnInit(): void {
    // Pre-fill empresa if available
  }

  enviar(): void {
    if (!this.form.empresa.trim() || !this.form.descripcion.trim()) {
      this.error = 'Nombre de empresa y descripción son obligatorios.';
      return;
    }
    this.enviando = true;
    this.exito = '';
    this.error = '';

    this.api.enviarAyuda(this.form.empresa, this.form.descripcion).subscribe({
      next: (res) => {
        this.exito = res.mensaje ?? 'Mensaje enviado correctamente.';
        this.form = { empresa: '', descripcion: '' };
        this.enviando = false;
      },
      error: (e) => {
        this.error = e?.error?.error ?? 'Error al enviar el mensaje. Inténtalo más tarde.';
        this.enviando = false;
      },
    });
  }
}
