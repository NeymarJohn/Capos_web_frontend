import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldDlgComponent } from './hold-dlg.component';

describe('HoldDlgComponent', () => {
  let component: HoldDlgComponent;
  let fixture: ComponentFixture<HoldDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
