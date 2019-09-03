import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingScheduleComponent } from './ongoing-schedule.component';

describe('OngoingScheduleComponent', () => {
  let component: OngoingScheduleComponent;
  let fixture: ComponentFixture<OngoingScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
