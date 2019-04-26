import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitLandingPageComponent } from './submit-landing-page.component';

describe('SubmitLandingPageComponent', () => {
  let component: SubmitLandingPageComponent;
  let fixture: ComponentFixture<SubmitLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
