import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDlgComponent } from './change-dlg.component';

describe('ChangeDlgComponent', () => {
  let component: ChangeDlgComponent;
  let fixture: ComponentFixture<ChangeDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
