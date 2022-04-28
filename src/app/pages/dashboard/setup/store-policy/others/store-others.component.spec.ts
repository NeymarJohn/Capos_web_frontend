import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOthersComponent } from './store-others.component';

describe('StoreOthersComponent', () => {
  let component: StoreOthersComponent;
  let fixture: ComponentFixture<StoreOthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreOthersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
