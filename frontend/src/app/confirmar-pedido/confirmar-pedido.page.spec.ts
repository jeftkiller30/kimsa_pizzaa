import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarPedidoPage } from './confirmar-pedido.page';

describe('ConfirmarPedidoPage', () => {
  let component: ConfirmarPedidoPage;
  let fixture: ComponentFixture<ConfirmarPedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
