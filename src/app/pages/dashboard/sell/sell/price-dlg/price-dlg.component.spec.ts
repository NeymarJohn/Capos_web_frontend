import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceDlgComponent } from './price-dlg.component';

describe('PriceDlgComponent', () => {
  let component: PriceDlgComponent;
  let fixture: ComponentFixture<PriceDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
