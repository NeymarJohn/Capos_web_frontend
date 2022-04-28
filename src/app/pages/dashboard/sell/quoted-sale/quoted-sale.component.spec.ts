import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotedSaleComponent } from './quoted-sale.component';

describe('QuotedSaleComponent', () => {
  let component: QuotedSaleComponent;
  let fixture: ComponentFixture<QuotedSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotedSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotedSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
