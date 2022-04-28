import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordDlgComponent } from './password-dlg.component';

describe('PasswordDlgComponent', () => {
  let component: PasswordDlgComponent;
  let fixture: ComponentFixture<PasswordDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
