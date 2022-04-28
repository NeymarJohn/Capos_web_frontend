import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDlgComponent } from './payment-dlg.component';

describe('HoldDlgComponent', () => {
  let component: PaymentDlgComponent;
  let fixture: ComponentFixture<PaymentDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
