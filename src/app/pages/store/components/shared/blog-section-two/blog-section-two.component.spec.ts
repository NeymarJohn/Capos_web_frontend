import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlogSectionTwoComponent } from './blog-section-two.component';

describe('BlogSectionTwoComponent', () => {
  let component: BlogSectionTwoComponent;
  let fixture: ComponentFixture<BlogSectionTwoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogSectionTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogSectionTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
