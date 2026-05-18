import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NombreUsuarioPage } from './nombre-usuario.page';

describe('NombreUsuarioPage', () => {
  let component: NombreUsuarioPage;
  let fixture: ComponentFixture<NombreUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NombreUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
