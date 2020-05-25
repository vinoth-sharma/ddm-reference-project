import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerHelpModalComponent } from './disclaimer-help-modal.component';

describe('DisclaimerHelpModalComponent', () => {
  let component: DisclaimerHelpModalComponent;
  let fixture: ComponentFixture<DisclaimerHelpModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerHelpModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerHelpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
