import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerPrivilegesComponent } from './scheduler-privileges.component';

describe('SchedulerPrivilegesComponent', () => {
  let component: SchedulerPrivilegesComponent;
  let fixture: ComponentFixture<SchedulerPrivilegesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerPrivilegesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerPrivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
