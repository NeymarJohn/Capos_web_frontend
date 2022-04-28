import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPointGiftComponent } from './customer-point-gift.component';

describe('CustomerPointGiftComponent', () => {
  let component: CustomerPointGiftComponent;
  let fixture: ComponentFixture<CustomerPointGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPointGiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPointGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
