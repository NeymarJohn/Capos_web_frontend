import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfulfilledDlgComponent } from './unfulfilled-dlg.component';

describe('UnfulfilledDlgComponent', () => {
  let component: UnfulfilledDlgComponent;
  let fixture: ComponentFixture<UnfulfilledDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnfulfilledDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfulfilledDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
