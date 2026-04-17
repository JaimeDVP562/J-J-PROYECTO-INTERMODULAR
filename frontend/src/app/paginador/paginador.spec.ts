import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginadorComponent } from './paginador';

describe('PaginadorComponent', () => {
  let component: PaginadorComponent;
  let fixture: ComponentFixture<PaginadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginadorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginadorComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('paginas() devuelve el número correcto de páginas', () => {
    component.totalPaginas = 5;
    expect(component.paginas).toEqual([1, 2, 3, 4, 5]);
  });

  it('anterior() emite la página anterior', () => {
    component.paginaActual = 3;
    component.totalPaginas = 5;
    spyOn(component.paginaCambiada, 'emit');
    component.anterior();
    expect(component.paginaCambiada.emit).toHaveBeenCalledWith(2);
  });

  it('siguiente() emite la página siguiente', () => {
    component.paginaActual = 2;
    component.totalPaginas = 5;
    spyOn(component.paginaCambiada, 'emit');
    component.siguiente();
    expect(component.paginaCambiada.emit).toHaveBeenCalledWith(3);
  });

  it('no emite cuando se está en la primera página y se llama anterior()', () => {
    component.paginaActual = 1;
    component.totalPaginas = 5;
    spyOn(component.paginaCambiada, 'emit');
    component.anterior();
    expect(component.paginaCambiada.emit).not.toHaveBeenCalled();
  });

  it('no emite cuando se está en la última página y se llama siguiente()', () => {
    component.paginaActual = 5;
    component.totalPaginas = 5;
    spyOn(component.paginaCambiada, 'emit');
    component.siguiente();
    expect(component.paginaCambiada.emit).not.toHaveBeenCalled();
  });

  it('irA() emite la página indicada', () => {
    component.paginaActual = 1;
    component.totalPaginas = 10;
    spyOn(component.paginaCambiada, 'emit');
    component.irA(7);
    expect(component.paginaCambiada.emit).toHaveBeenCalledWith(7);
  });

  it('irA() no emite si la página está fuera de rango', () => {
    component.paginaActual = 3;
    component.totalPaginas = 5;
    spyOn(component.paginaCambiada, 'emit');
    component.irA(0);
    component.irA(6);
    expect(component.paginaCambiada.emit).not.toHaveBeenCalled();
  });

  it('irA() no emite si ya estamos en esa página', () => {
    component.paginaActual = 3;
    component.totalPaginas = 5;
    spyOn(component.paginaCambiada, 'emit');
    component.irA(3);
    expect(component.paginaCambiada.emit).not.toHaveBeenCalled();
  });
});
