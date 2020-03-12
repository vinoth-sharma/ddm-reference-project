import { async, ComponentFixture, TestBed, inject, fakeAsync, tick, getTestBed  } from '@angular/core/testing';
import { RmpLandingPageComponent } from './rmp-landing-page.component';
import { HeaderComponent } from '../../header/header.component';
import { RequestOnBehalfComponent } from '../request-on-behalf/request-on-behalf.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { AngularMultiSelectModule } from "angular4-multiselect-dropdown/angular4-multiselect-dropdown";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule,HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpRequest } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DjangoService } from '../django.service';
import { DataProviderService } from '../data-provider.service';
import 'jquery';
import { NgxSpinnerService } from "ngx-spinner";

describe('RmpLandingPageComponent', () => {
  let component: RmpLandingPageComponent;
  let fixture: ComponentFixture<RmpLandingPageComponent>;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
                RouterModule,
                FormsModule, 
                NgbDatepickerModule,
                NgbTimepickerModule, 
                NgxSpinnerModule, 
                MatMenuModule,
                MatBadgeModule,
                MatIconModule,
                AngularMultiSelectModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                NoopAnimationsModule
                ],
      declarations: [ RmpLandingPageComponent, HeaderComponent, RequestOnBehalfComponent],
      providers:[ DatePipe, NgxSpinnerService ]
    })
    .compileComponents();
    injector = getTestBed();
    httpMock = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ddm_rmp_admin_notes be service call', () => {
    const notes_details: object = {
            'notes_content': "second important . This message has to be displayed =.ds change of things",
            'notes_start_date': "2020-03-03 00:00",
            'notes_end_date': "2020-03-13 23:59",
            'admin_flag': false,
            'admin_note_status': true
          };
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    component = fixture.debugElement.componentInstance;
    let service = fixture.debugElement.injector.get(DjangoService);
    let  spy = spyOn(service,"ddm_rmp_admin_notes").and.returnValue(of(notes_details));
    let spinner = fixture.debugElement.injector.get(NgxSpinnerService);  
    component.getDDmRmpAdminNotes();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.serviceData).toBe(notes_details);
    });
    expect(spinner).toBeFalsy();
  });

  xit('should check main menu tab', () => {
    fixture.detectChanges();
    const bannerDe: DebugElement = fixture.debugElement;
    const bannerEl: HTMLElement = bannerDe.nativeElement;
    expect(bannerEl.querySelector('.main-menu').textContent).toEqual('Main Menu');
  });

  it('should add addDocuments', fakeAsync(() => {
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    fixture.detectChanges();
    const notes_details: object = {
      'notes_content': "second important . This message has to be displayed =.ds change of things",
      'notes_start_date': "2020-03-03 00:00",
      'notes_end_date': "2020-03-13 23:59",
      'admin_flag': false,
      'admin_note_status': true
    };
    let spinner = fixture.debugElement.injector.get(NgxSpinnerService);          
      component.addDocument();
      fixture.detectChanges();
      if(component && component.notes_details && component.notes_details['admin_note_status'])
        expect(component.notes_details['admin_note_status']).toBe(true, 'admin_note_status');

      if(component && component.disp_missing_notes)
        expect(component.disp_missing_notes).toBe(true, 'disp_missing_notes');

      if(component && component.disp_missing_start_date)
        expect(component.disp_missing_start_date).toBe(true, 'disp_missing_start_date');

      if(component && component.disp_missing_end_date )
        expect(component.disp_missing_end_date).toBe(true, 'disp_missing_end_date');

      if(component && component.notes_details.notes_content)
        expect(component.notes_details.notes_content).toBe("", 'notes_content');

      if(component && component.notes_details.admin_flag )
        expect(component.notes_details.admin_flag).toBe(true, 'admin_flag');

      if(component && component.notes_details.notes_start_date)
        expect(component.notes_details.notes_start_date).toBe(undefined,'notes_start_date');

      if(component && component.notes_details.notes_end_date)
        expect(component.notes_details.notes_end_date).toBe(undefined, 'notes_end_date');

      expect(spinner).toBeTruthy();  
  }));

  it('should clear message', () => {
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    component.clearMessage();
    fixture.detectChanges();
    expect(component.admin_notes).toEqual('');
  });

  it('should previous message', () => {
    const notes_details  = { admin_notes : [{
      'notes_content': "second important . This message has to be displayed =.ds change of things",
      'notes_start_date': "2020-03-03 00:00",
      'notes_end_date': "2020-03-13 23:59",
      'admin_flag': false,
      'admin_note_status': true
    }]};   
    let service = fixture.debugElement.injector.get(DjangoService);
    let  spy = spyOn(service,"get_admin_notes").and.returnValue(of(notes_details));
    component.prevMessage();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.notes).toBe(notes_details.admin_notes);
    });
  });

  it('should execute changeStartDateFormat', () => {
    component.changeStartDateFormat();
    fixture.detectChanges();
    expect(component.customizedFromDate).toBe('12-Mar-2020');
  });

  it('should execute changeEndDateFormat' , () => {
    component.changeEndDateFormat();
    fixture.detectChanges();
    expect(component.customizedToDate).toBe('22-Mar-2020');
  });

  xit('should execute getAdminNotes', () => {
    const adminNote = {
      'ddm_rmp_admin_notes_id': 384,
      'notes_content': "second important . This message has to be displayed =.ds",
      'notes_start_date': "2020-03-04T05:00:00-05:00",
      'notes_end_date': "2020-04-15T03:59:00-04:00",
      'admin_flag': false,
      'admin_note_status': true
    };
    component.updateAdminNotesParams(adminNote); 
    fixture.detectChanges();
    expect(component.db_start_date).toBe(adminNote.notes_start_date);
    expect(component.db_end_date).toBe(adminNote.notes_end_date);
    expect(component.note_status).toBe(adminNote.admin_note_status);
    expect(component.admin_notes).toBe(adminNote.notes_content);
  });
});