import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePrintComponent } from './store-print.component';

describe('StorePrintComponent', () => {
  let component: StorePrintComponent;
  let fixture: ComponentFixture<StorePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorePrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
