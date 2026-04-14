import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginador.html',
  styleUrl: './paginador.css',
})
export class PaginadorComponent {
  @Input() paginaActual: number = 1;
  @Input() totalPaginas: number = 1;
  @Input() etiqueta: string = '';

  @Output() paginaCambiada = new EventEmitter<number>();

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irA(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas || pagina === this.paginaActual) return;
    this.paginaCambiada.emit(pagina);
  }

  anterior(): void {
    this.irA(this.paginaActual - 1);
  }

  siguiente(): void {
    this.irA(this.paginaActual + 1);
  }
}
