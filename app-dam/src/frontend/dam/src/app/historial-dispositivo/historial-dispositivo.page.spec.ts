import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialDispositivoPage } from './historial-dispositivo.page';

describe('HistorialDispositivoPage', () => {
  let component: HistorialDispositivoPage;
  let fixture: ComponentFixture<HistorialDispositivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialDispositivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
