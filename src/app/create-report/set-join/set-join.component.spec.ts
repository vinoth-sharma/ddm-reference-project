import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetJoinComponent } from './set-join.component';

describe('SetJoinComponent', () => {
  let component: SetJoinComponent;
  let fixture: ComponentFixture<SetJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetJoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
