import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarTelefonoPage } from './editar-telefono.page';

describe('EditarTelefonoPage', () => {
  let component: EditarTelefonoPage;
  let fixture: ComponentFixture<EditarTelefonoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarTelefonoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
