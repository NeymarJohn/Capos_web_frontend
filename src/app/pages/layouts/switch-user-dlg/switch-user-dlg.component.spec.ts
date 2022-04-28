import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchUserDlgComponent } from './switch-user-dlg.component';

describe('HoldDlgComponent', () => {
  let component: SwitchUserDlgComponent;
  let fixture: ComponentFixture<SwitchUserDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchUserDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchUserDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
