import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreModulesComponent } from './store-modules.component';

describe('StoreModulesComponent', () => {
  let component: StoreModulesComponent;
  let fixture: ComponentFixture<StoreModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
