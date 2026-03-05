import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Jornada, ResumenJornada, ResumenMensualUsuario, ResumenMensualAdmin } from '../models/models';

@Component({
  selector: 'app-time-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-control.html',
  styleUrl: './time-control.css',
})
export class TimeControlComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  vistaActiva: 'hoy' | 'mensual' = 'hoy';

  // Admin
  resumen: ResumenJornada[] = [];

  // Usuario normal
  misJornadas: Jornada[] = [];

  // Resumen mensual
  mesSeleccionado = new Date().getMonth() + 1;
  anoSeleccionado = new Date().getFullYear();
  resumenMensualUsuario: ResumenMensualUsuario | null = null;
  resumenMensualAdmin: ResumenMensualAdmin[] = [];
  cargandoMensual = false;

  cargando = true;
  error = '';

  meses = [
    { n: 1, label: 'Enero' }, { n: 2, label: 'Febrero' }, { n: 3, label: 'Marzo' },
    { n: 4, label: 'Abril' }, { n: 5, label: 'Mayo' }, { n: 6, label: 'Junio' },
    { n: 7, label: 'Julio' }, { n: 8, label: 'Agosto' }, { n: 9, label: 'Septiembre' },
    { n: 10, label: 'Octubre' }, { n: 11, label: 'Noviembre' }, { n: 12, label: 'Diciembre' },
  ];

  ngOnInit(): void {
    if (this.auth.isAdminOrGerente()) {
      this.api.getResumenJornadasHoy().subscribe({
        next: (r) => { this.resumen = r; this.cargando = false; },
        error: () => { this.error = 'Error al cargar el resumen.'; this.cargando = false; },
      });
    } else {
      this.api.getJornadas().subscribe({
        next: (j) => { this.misJornadas = j; this.cargando = false; },
        error: () => { this.error = 'Error al cargar jornadas.'; this.cargando = false; },
      });
    }
  }

  cargarMensual(): void {
    this.cargandoMensual = true;
    this.api.getResumenMensual(this.mesSeleccionado, this.anoSeleccionado).subscribe({
      next: (data: any) => {
        if (this.auth.isAdminOrGerente()) {
          this.resumenMensualAdmin = data;
        } else {
          this.resumenMensualUsuario = data;
        }
        this.cargandoMensual = false;
      },
      error: () => { this.cargandoMensual = false; },
    });
  }

  formatMin(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}
