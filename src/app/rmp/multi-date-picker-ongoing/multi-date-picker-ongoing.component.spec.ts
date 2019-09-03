import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDatePickerOngoingComponent } from './multi-date-picker-ongoing.component';

describe('MultiDatePickerOngoingComponent', () => {
  let component: MultiDatePickerOngoingComponent;
  let fixture: ComponentFixture<MultiDatePickerOngoingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDatePickerOngoingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDatePickerOngoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
