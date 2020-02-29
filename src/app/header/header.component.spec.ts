import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { DataProviderService } from '../rmp/data-provider.service';
import { AuthenticationService } from '../authentication.service';
import { BehaviorSubject } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MaterialModule } from '../material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { Router, RouterState } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { SortTableComponent } from '../sort-table/sort-table.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router
  @Component({
    template: 'dummy'
  })
  class DummyComponent { }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, DummyComponent],
      providers: [
        { provide: AuthenticationService, useClass: AuthenticationMockMockService },
        { provide: DataProviderService, useClass: DataProviderMockMockService }
      ],
      imports: [BrowserAnimationsModule, MaterialModule, HttpClientTestingModule, ToastrModule.forRoot({
        preventDuplicates: true
      }), RouterTestingModule.withRoutes([
        { path: 'roles', component: DummyComponent }
      ])]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.debugElement.componentInstance;
    fixture.autoDetectChanges(true);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });


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

  })

  it('should read notifications from data provider service', () => {
    let notificationData = [{
      ddm_rmp_request_status_comment_id: 1,
      comment_timestamp: "2020-02-26T15:14:29.530548-05:00",
      comment: "Being Tested",
      comment_read_flag: false,
      audience: "",
      commentor: "Testor",
      users_table: 2,
      ddm_rmp_post_report: 81
    }];
    let notificationList;
    let setBuilder = []
    let service = fixture.debugElement.injector.get(DataProviderService);
    service.changeNotificationData(notificationData);
    fixture.detectChanges();
    service.currentNotifications.subscribe(element => {
      notificationList = element
      notificationList.map(item => {
        setBuilder.push(item.ddm_rmp_post_report)
      })
      expect(setBuilder.length).toBeGreaterThan(0)
    })
  })


  // it("should route to /roles when clicked on Roles And Responsibilities button", async(() => {
  //   component.roleName.role = "Admin"
  //   let element = fixture.debugElement.nativeElement;
  //   router = TestBed.get(Router)
  //   let spy = spyOn(router, 'navigate')
  //   let button = element.querySelector('.menuList')
  //   button.click();
  //   fixture.debugElement.query(By.css(".rolesAndResponsibilities")).triggerEventHandler('click', null)
  //   expect(spy).toHaveBeenCalledWith(['roles'])
  // }))


  it("should route to /roles when clicked on Roles And Responsibilities button", async(() => {
    let buttonSelector = ".rolesAndResponsibilities"
    let trh = new TestRouteHandling(component,TestBed,fixture,buttonSelector)
    expect(trh.whenClickedOnMenuItems()).toHaveBeenCalledWith(['roles'])
  }))

  it("should route to /logs when clicked on Log Entry button", async(() => {
    let buttonSelector = ".logEntry"
    let trh = new TestRouteHandling(component,TestBed,fixture,buttonSelector)
    expect(trh.whenClickedOnMenuItems()).toHaveBeenCalledWith(['logs'])
  }))

  it("should route to /user when clicked header Image", async(() => {
    let buttonSelector = "#DDM_logo"
    let trh = new TestRouteHandling(component,TestBed,fixture,buttonSelector)
    expect(trh.whenClickedOnButton()).toHaveBeenCalledWith(['user'])
  }))

 

  it("should download a blob object from server ond open it in an new window",()=>{
    let buttonSelector = ".help"
    let trh = new TestRouteHandling(component,TestBed,fixture,buttonSelector)
    trh.whenClickedOnMenuItems()

    // expect(trh.whenClickedOnMenuItems()).toHaveBeenCalledWith(['logs'])
    // expect(trh.whenClickedOnMenuItems()).toHaveBeenCalled()
  })



});


class AuthenticationMockMockService {
 public myMethodSubject = new BehaviorSubject<any>("");
 public myMethod$ = this.myMethodSubject.asObservable();

  myMethod(data, dummyOne, dummyTwo) {
    this.myMethodSubject.next(data)
  }

  getHelpRedirection(value:string){
  
  }
}

class DataProviderMockMockService {
  private notifications = new BehaviorSubject<object>(null);
  currentNotifications = this.notifications.asObservable();

  changeNotificationData(notification: object) {
    this.notifications.next(notification)
  }
}

class TestRouteHandling {

  public element;
  public router;
  public spy;
  public button;
  public urlSpy;
  public authService;

  constructor(public component,public testbed,public fixture,public buttonSelector){
    this.element = this.fixture.debugElement.nativeElement;
    this.router = this.testbed.get(Router);
    this.spy = spyOn(this.router, 'navigate');
    this.button = this.element.querySelector('.menuList');
    this.authService = this.fixture.debugElement.injector.get(AuthenticationService)
  }
  whenClickedOnMenuItems(){
    this.component.roleName.role = "Admin";
    this.button.click();
    this.fixture.debugElement.query(By.css(this.buttonSelector)).triggerEventHandler('click', null)
    return this.spy;
  }

  whenClickedOnButton(){
    this.button = this.element.querySelector(this.buttonSelector)
    this.button.click();
    return this.spy;
  }

  whenClickedOnStackedMenu(){
    let urlSpy = spyOn(window.navigator,"msSaveOrOpenBlob")
    this.component.roleName.role = "Admin";
      let spys = spyOn(this.authService,"getHelpRedirection").and.returnValue(new Blob());
  
    this.button.click();
    console.log("RMP",this.fixture.debugElement.query(By.css(this.buttonSelector)))
    // this.fixture.debugElement.query(By.css(this.buttonSelector)).triggerEventHandler('click', null);
    // this.fixture.debugElement.query(By.css(".button-rmp")).triggerEventHandler('click', "RMP");
    // console.log("rmp", this.fixture.debugElement.query(By.css(".button-rmp")))
  
    // return spys
    
  }
}

