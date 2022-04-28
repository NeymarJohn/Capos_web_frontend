import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagementPaymentComponent } from './store-management-payment.component';

describe('StoreManagementPaymentComponent', () => {
  let component: StoreManagementPaymentComponent;
  let fixture: ComponentFixture<StoreManagementPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreManagementPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagementPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
