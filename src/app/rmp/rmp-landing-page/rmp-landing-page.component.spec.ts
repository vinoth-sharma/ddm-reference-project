import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmpLandingPageComponent } from './rmp-landing-page.component';

describe('RmpLandingPageComponent', () => {
  let component: RmpLandingPageComponent;
  let fixture: ComponentFixture<RmpLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmpLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
