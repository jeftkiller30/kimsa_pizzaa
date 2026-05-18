import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarFechaPage } from './editar-fecha.page';

describe('EditarFechaPage', () => {
  let component: EditarFechaPage;
  let fixture: ComponentFixture<EditarFechaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarFechaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
