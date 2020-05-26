import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerWrapperComponent } from './disclaimer-wrapper.component';

describe('DisclaimerWrapperComponent', () => {
  let component: DisclaimerWrapperComponent;
  let fixture: ComponentFixture<DisclaimerWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
