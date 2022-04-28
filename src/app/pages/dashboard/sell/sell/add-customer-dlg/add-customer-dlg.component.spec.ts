import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerDlgComponent } from './add-customer-dlg.component';

describe('AddCustomerDlgComponent', () => {
  let component: AddCustomerDlgComponent;
  let fixture: ComponentFixture<AddCustomerDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
