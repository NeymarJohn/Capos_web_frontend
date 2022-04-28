import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseRegisterComponent } from './close-register.component';

describe('CloseComponent', () => {
  let component: CloseRegisterComponent;
  let fixture: ComponentFixture<CloseRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
