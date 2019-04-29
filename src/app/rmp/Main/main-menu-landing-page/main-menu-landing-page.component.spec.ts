import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuLandingPageComponent } from './main-menu-landing-page.component';

describe('MainMenuLandingPageComponent', () => {
  let component: MainMenuLandingPageComponent;
  let fixture: ComponentFixture<MainMenuLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMenuLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
