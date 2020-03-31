import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RmpLandingPageComponent } from './rmp-landing-page.component';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { HeaderComponent } from "../header/header.component";

describe('RmpLandingPageComponent', () => {
  let component: RmpLandingPageComponent;
  let fixture: ComponentFixture<RmpLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmpLandingPageComponent, HeaderComponent ]
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

  it('Calling role() should navigate to semantic', async(() => {
    let component = fixture.componentInstance;
    let router = TestBed.inject(Router);
    let navigateSpy = spyOn(router, 'navigate');
    component.role();
    expect(navigateSpy).toHaveBeenCalledWith(['semantic']);
  }));

  it('should read user info from authentication service', () => {
    let userData = { role: "Admin", first_name: "Aneesha", last_name: "Biju" };
    let service = fixture.debugElement.injector.get(AuthenticationService);
    service.myMethod(userData, null, null)
    fixture.detectChanges()
    service.myMethod$.subscribe(role => {
      expect(role.role).toEqual(userData.role);
      expect(role.first_name).toEqual(userData.first_name);
      expect(role.last_name).toEqual(userData.last_name)
    })
  });
  class AuthenticationMockMockService {
    public myMethodSubject = new BehaviorSubject<any>("");
    public myMethod$ = this.myMethodSubject.asObservable();

    myMethod(data, dummyOne, dummyTwo) {
      this.myMethodSubject.next(data)
    }
    getHelpRedirection(value: string) {
    }
    constructor() {
      let userData = { role: "predefined_role", first_name: "predefined_firstName", last_name: "predefined_last_name" };
    }
  }
});
