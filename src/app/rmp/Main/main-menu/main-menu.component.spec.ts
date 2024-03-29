import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MainMenuComponent } from './main-menu.component';
import { DebugElement } from "@angular/core";
import { AuthenticationService } from 'src/app/authentication.service';
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  let router: Router;

  beforeEach(async(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      declarations: [MainMenuComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule],
      providers: []
    })
      .compileComponents();
  }));

  //Unit test cases written by Aneesha Biju

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(MainMenuComponent);
    // get test component from the fixture
    component = fixture.componentInstance;
    // fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('Calling role() should navigate to semantic', async(() => {
    let component = fixture.componentInstance;
    let router = TestBed.inject(Router);
    let navigateSpy = spyOn(router, 'navigate');
    component.role();
    expect(navigateSpy).toHaveBeenCalledWith(['semantic']);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read user info from authentication service', () => {
    let userData = { role: "predefined_role", first_name: "predefined_firstName", last_name: "predefined_last_name" };
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
})