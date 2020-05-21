import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitRequestWrapperComponent } from './submit-request-wrapper.component';

describe('SubmitRequestWrapperComponent', () => {
  let component: SubmitRequestWrapperComponent;
  let fixture: ComponentFixture<SubmitRequestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitRequestWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitRequestWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
