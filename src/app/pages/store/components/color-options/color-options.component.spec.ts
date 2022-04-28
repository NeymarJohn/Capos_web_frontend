import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColorOptionsComponent } from './color-options.component';

describe('ColorOptionsComponent', () => {
  let component: ColorOptionsComponent;
  let fixture: ComponentFixture<ColorOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
