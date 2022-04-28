import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDlgComponent } from './note-dlg.component';

describe('NoteDlgComponent', () => {
  let component: NoteDlgComponent;
  let fixture: ComponentFixture<NoteDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteDlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
