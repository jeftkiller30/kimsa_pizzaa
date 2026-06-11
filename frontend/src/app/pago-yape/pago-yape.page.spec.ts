import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoYapePage } from './pago-yape.page';

describe('PagoYapePage', () => {
  let component: PagoYapePage;
  let fixture: ComponentFixture<PagoYapePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoYapePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
