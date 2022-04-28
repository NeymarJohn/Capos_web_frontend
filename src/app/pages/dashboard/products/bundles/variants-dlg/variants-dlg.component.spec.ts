import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsDlgComponent } from './variants-dlg.component';

describe('VariantsDlgComponent', () => {
  let component: VariantsDlgComponent;
  let fixture: ComponentFixture<VariantsDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariantsDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantsDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
