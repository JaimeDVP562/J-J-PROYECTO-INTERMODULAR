import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioCalendar } from './horario-calendar';

describe('HorarioCalendar', () => {
  let component: HorarioCalendar;
  let fixture: ComponentFixture<HorarioCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
