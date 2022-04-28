import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagementReceiptComponent } from './store-management-receipt.component';

describe('StoreManagementReceiptComponent', () => {
  let component: StoreManagementReceiptComponent;
  let fixture: ComponentFixture<StoreManagementReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreManagementReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagementReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
