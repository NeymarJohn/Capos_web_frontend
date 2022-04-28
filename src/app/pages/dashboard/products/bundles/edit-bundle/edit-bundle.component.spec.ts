import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBundleComponent } from './edit-bundle.component';

describe('EditBundleComponent', () => {
  let component: EditBundleComponent;
  let fixture: ComponentFixture<EditBundleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBundleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
