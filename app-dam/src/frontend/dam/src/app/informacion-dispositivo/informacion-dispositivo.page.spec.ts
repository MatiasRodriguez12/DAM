import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacionDispositivoPage } from './informacion-dispositivo.page';

describe('InformacionDispositivoPage', () => {
  let component: InformacionDispositivoPage;
  let fixture: ComponentFixture<InformacionDispositivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionDispositivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
