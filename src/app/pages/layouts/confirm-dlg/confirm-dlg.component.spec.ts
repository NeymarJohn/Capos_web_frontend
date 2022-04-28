import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDlgComponent } from './confirm-dlg.component';

describe('HoldDlgComponent', () => {
  let component: ConfirmDlgComponent;
  let fixture: ComponentFixture<ConfirmDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
