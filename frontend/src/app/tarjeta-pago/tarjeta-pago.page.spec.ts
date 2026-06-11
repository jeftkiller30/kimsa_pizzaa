import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaPagoPage } from './tarjeta-pago.page';

describe('TarjetaPagoPage', () => {
  let component: TarjetaPagoPage;
  let fixture: ComponentFixture<TarjetaPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
