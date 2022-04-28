import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreEmployeeTimesheetComponent } from './store-employee-timesheet.component';

describe('StoreEmployeeTimesheetComponent', () => {
  let component: StoreEmployeeTimesheetComponent;
  let fixture: ComponentFixture<StoreEmployeeTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreEmployeeTimesheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreEmployeeTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
