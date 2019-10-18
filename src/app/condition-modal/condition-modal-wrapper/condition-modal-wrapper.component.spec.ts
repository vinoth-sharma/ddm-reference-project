import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionModalWrapperComponent } from './condition-modal-wrapper.component';

describe('ConditionModalWrapperComponent', () => {
  let component: ConditionModalWrapperComponent;
  let fixture: ComponentFixture<ConditionModalWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionModalWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
