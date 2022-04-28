import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductDlgComponent } from './add-product-dlg.component';

describe('AddProductDlgComponent', () => {
  let component: AddProductDlgComponent;
  let fixture: ComponentFixture<AddProductDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
