import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingNotesContainerComponent } from './existing-notes-container.component';

describe('ExistingNotesContainerComponent', () => {
  let component: ExistingNotesContainerComponent;
  let fixture: ComponentFixture<ExistingNotesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingNotesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingNotesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
