import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from "../material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import Utils from '../../utils';
declare var $: any;
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { AuthenticationService } from '../authentication.service';
import { ScheduleService } from '../schedule/schedule.service'

import { ScheduledReportsComponent } from './scheduled-reports.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { ShowSignatureSchedularComponent } from '../show-signature-schedular/show-signature-schedular.component'
import { MultipleDatesPickerComponent } from '../multiple-dates-picker/multiple-dates-picker.component';


@Component({
  template: 'test'
})
class testComponent { }

@NgModule({
  imports : [ MatSort, MatPaginator, MatTableDataSource ]
})
class testingComponent { }

// MatSort, MatPaginator, MatTableDataSource, 
describe('ScheduledReportsComponent', () => {
  let component: ScheduledReportsComponent;
  let fixture: ComponentFixture<ScheduledReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduledReportsComponent, ScheduleComponent, MultipleDatesPickerComponent, ShowSignatureSchedularComponent ],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule, MaterialModule.forRoot(), QuillModule.forRoot({})],
      providers : [ Utils ]
      // MatPaginator, MatSort, MatTableDataSource,
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should route to Semantic reports page on click of 'Back' button", async(() => {
    let buttonSelector = ".btn-modification"
    let trh = new TestRouteHandling(component, TestBed, fixture, buttonSelector)
    expect(trh.whenClickedGoToReports()).toHaveBeenCalledWith(['semantic/sem-reports/home'])
  }))

  it('should get the scheduled report data by shadowing the deleteScheduledReport()', () => {
    let mockScheduleReportId: number = 11;
    fixture = TestBed.createComponent(ScheduledReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(ScheduleService);
    fixture.detectChanges();
    service.getScheduleReportData(mockScheduleReportId).subscribe(res=>{
      spyOn(Utils, 'hideSpinner');
      spyOn($,'modal')

      expect(service.scheduleReportIdFlag).toEqual(res['data']['report_schedule_id'] || null)
      expect(component.scheduleDataToBeSent).toEqual(res['data']);
      expect(Utils.hideSpinner).toHaveBeenCalled();
      expect($.modal).toHaveBeenCalled();
    })
    
  })

  it('should get the details of a scheduled reports by shadowing deleteScheduledReport()', () => {
    let testProcuredScheduledReportId = 45;

    fixture = TestBed.createComponent(ScheduledReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(ScheduleService);
    fixture.detectChanges();
    service.deleteScheduledReport(testProcuredScheduledReportId).subscribe(res => {
      spyOn(component, 'tableSorting');
      spyOn(Utils, 'hideSpinner')

      expect(component.tableSorting).toHaveBeenCalled()
      expect(Utils.hideSpinner).toHaveBeenCalled()
    })
  });

  it(' should manually handle the ngOnInit() ', () =>{
    let testSemanticLayerId = 45;

    fixture = TestBed.createComponent(ScheduledReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(ScheduleService);

    service.getScheduledReports(testSemanticLayerId).subscribe(res=>{
      spyOn(component,'getSemanticId')
      spyOn(component,'paginator')
      spyOn(component,'sort')
      
      expect(component.dataSource).toEqual(res['data']);
      expect(component.getSemanticId).toHaveBeenCalled();
      expect(component.dataSource).toEqual(new MatTableDataSource(component.dataSource))
      expect(component.paginator).toHaveBeenCalled();
      expect(component.sort).toHaveBeenCalled();
      expect(component.isLoading).toEqual(false);
    })

  })

});

class TestRouteHandling {

  public element;
  public router;
  public spy;
  public button;
  public urlSpy;
  public authService;

  constructor(public component, public testbed, public fixture, public buttonSelector) {
    this.element = this.fixture.debugElement.nativeElement;
    this.router = this.testbed.get(Router);
    this.spy = spyOn(this.router, 'navigate');
    this.button = this.element.querySelector('.btn-modification');
    this.authService = this.fixture.debugElement.injector.get(AuthenticationService)
  }
  whenClickedGoToReports() {
    // this.component.roleName.role = "Admin";
    this.button.click();
    this.fixture.debugElement.query(By.css(this.buttonSelector)).triggerEventHandler('click', null)
    return this.spy;
  }
  whenClickedOnButton() {
    this.button = this.element.querySelector(this.buttonSelector)
    this.button.click();
    return this.spy;
  }
}

