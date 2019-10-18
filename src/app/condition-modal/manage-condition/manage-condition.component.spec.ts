import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageConditionComponent } from './manage-condition.component';

describe('ManageConditionComponent', () => {
  let component: ManageConditionComponent;
  let fixture: ComponentFixture<ManageConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
