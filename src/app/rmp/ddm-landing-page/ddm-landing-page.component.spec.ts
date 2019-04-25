import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdmLandingPageComponent } from './ddm-landing-page.component';

describe('DdmLandingPageComponent', () => {
  let component: DdmLandingPageComponent;
  let fixture: ComponentFixture<DdmLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdmLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdmLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
