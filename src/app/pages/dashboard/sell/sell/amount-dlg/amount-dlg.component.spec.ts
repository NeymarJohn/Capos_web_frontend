import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountDlgComponent } from './amount-dlg.component';

describe('AmountDlgComponent', () => {
  let component: AmountDlgComponent;
  let fixture: ComponentFixture<AmountDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
