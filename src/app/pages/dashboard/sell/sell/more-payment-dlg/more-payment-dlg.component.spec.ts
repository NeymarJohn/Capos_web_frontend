import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorePaymentDlgComponent } from './more-payment-dlg.component';

describe('MorePaymentDlgComponent', () => {
  let component: MorePaymentDlgComponent;
  let fixture: ComponentFixture<MorePaymentDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorePaymentDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MorePaymentDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
