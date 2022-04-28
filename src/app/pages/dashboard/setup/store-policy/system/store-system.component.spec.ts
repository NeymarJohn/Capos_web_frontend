import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSystemComponent } from './store-system.component';

describe('StoreSystemComponent', () => {
  let component: StoreSystemComponent;
  let fixture: ComponentFixture<StoreSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
