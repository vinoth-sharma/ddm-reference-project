import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDatesPickerComponent } from './multi-dates-picker.component';

describe('MultiDatesPickerComponent', () => {
  let component: MultiDatesPickerComponent;
  let fixture: ComponentFixture<MultiDatesPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDatesPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDatesPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
