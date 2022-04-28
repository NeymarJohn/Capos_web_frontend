import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetDlgComponent } from './timesheet-dlg.component';

describe('TimesheetDlgComponent', () => {
  let component: TimesheetDlgComponent;
  let fixture: ComponentFixture<TimesheetDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesheetDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
