import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Jornada, ResumenJornada } from '../models/models';

@Component({
  selector: 'app-time-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-control.html',
  styleUrl: './time-control.css',
})
export class TimeControlComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  // Admin
  resumen: ResumenJornada[] = [];

  // Usuario normal
  misJornadas: Jornada[] = [];

  cargando = true;
  error = '';

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
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

  formatMin(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}
