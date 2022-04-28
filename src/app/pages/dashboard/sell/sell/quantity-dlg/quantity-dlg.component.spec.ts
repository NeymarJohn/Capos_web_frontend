import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityDlgComponent } from './quantity-dlg.component';

describe('QuantityDlgComponent', () => {
  let component: QuantityDlgComponent;
  let fixture: ComponentFixture<QuantityDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantityDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
