import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBatchCashierComponent } from './store-batch-cashier.component';

describe('StoreBatchCashierComponent', () => {
  let component: StoreBatchCashierComponent;
  let fixture: ComponentFixture<StoreBatchCashierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreBatchCashierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreBatchCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
