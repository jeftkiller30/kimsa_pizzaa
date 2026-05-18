import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailAuthPage } from './email-auth.page';

describe('EmailAuthPage', () => {
  let component: EmailAuthPage;
  let fixture: ComponentFixture<EmailAuthPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
