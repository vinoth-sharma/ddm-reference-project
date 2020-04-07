import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDatesPickerComponent } from './multiple-dates-picker.component';

describe('MultipleDatesPickerComponent', () => {
  let component: MultipleDatesPickerComponent;
  let fixture: ComponentFixture<MultipleDatesPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleDatesPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleDatesPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
