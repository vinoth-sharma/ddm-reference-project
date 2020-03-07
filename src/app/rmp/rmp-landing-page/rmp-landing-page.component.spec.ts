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
import { DjangoService } from 'src/app/rmp/django.service';
import { HttpRequest } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import * as $ from "jquery";
import { of } from 'rxjs';
// declare var jQuery: any;
// declare var $: any;

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('RmpLandingPageComponent', () => {
  let component: RmpLandingPageComponent;
  let fixture: ComponentFixture<RmpLandingPageComponent>;
  // let djangoService : DjangoService;

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
      providers:[ DatePipe, DjangoService
      // {
      //   provide: DjangoService, userClass: DjangoService
      // }
    ]
    })
    .compileComponents();
    // injector = getTestBed();
    httpMock = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should ddm_rmp_admin_notes be service call', fakeAsync( inject([DjangoService,HttpTestingController]
  //   ,(djangoService:DjangoService, backend: HttpTestingController)  => {
  //     const notes_details: object = {
  //       'notes_content': "second important . This message has to be displayed =.ds change of things",
  //       'notes_start_date': "2020-03-03 00:00",
  //       'notes_end_date': "2020-03-13 23:59",
  //       'admin_flag': false,
  //       'admin_note_status': true
  //     };

  //     console.log('checking-----');

  //     djangoService.ddm_rmp_admin_notes(notes_details).subscribe(res => {
  //       console.log(res, 'response of servcie********88');
  //       expect(res).toBe(res, 'response of service');
  //     })

  // })));

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

          service.ddm_rmp_admin_notes(notes_details).subscribe(res => {
            console.log(res, 'checking result--');
            expect(res).toBe(res, 'result----');
          });
          // let  spy = spyOn(service,"ddm_rmp_admin_notes").and.returnValue(of(notes_details));
          // fixture.detectChanges();
          // fixture.whenStable().then(()=>{
          //   fixture.detectChanges();
          //   expect(component.serviceData).toBe(notes_details)

          // })

  });

  xit('should check main menu tab', () => {
    fixture.detectChanges();
    const bannerDe: DebugElement = fixture.debugElement;
    const bannerEl: HTMLElement = bannerDe.nativeElement;
    expect(bannerEl.querySelector('.main-menu').textContent).toEqual('Main Menu');
  });

  xit('should add addDocuments', fakeAsync(() => {
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    fixture.detectChanges();
    // let service = fixture.debugElement.injector.get(DjangoService);
      const notes_details: object = {
        'notes_content': "second important . This message has to be displayed =.ds change of things",
        'notes_start_date': "2020-03-03 00:00",
        'notes_end_date': "2020-03-13 23:59",
        'admin_flag': false,
        'admin_note_status': true
      };          
      component.addDocument();
      expect(component.notes_details['admin_note_status']).toBe(true, 'admin_note_status');
      expect(component.disp_missing_notes).toBe(true, 'disp_missing_notes');
      expect(component.disp_missing_start_date).toBe(false, 'disp_missing_start_date');
      expect(component.disp_missing_end_date).toBe(false, 'disp_missing_end_date');
      expect(component.notes_details.notes_content).toBe("", 'notes_content');
      expect(component.notes_details.admin_flag).toBe(false, 'admin_flag');
      expect(component.notes_details.notes_start_date).toBe(undefined,'notes_start_date');
      expect(component.notes_details.notes_end_date).toBe(undefined, 'notes_end_date');
       
      // service.ddm_rmp_admin_notes(notes_details)
      //   .subscribe(res => {
      //     console.log(res, 'res---------');
      //     expect(res).toBe(res);
      //   });

      //   const request = httpMock.expectOne((request: HttpRequest<any>) : any => {
      //     expect(request.url).toEqual(`${environment.baseUrl}RMP/read_comments/`);
      //     expect(request.method).toBe('GET');
      //     return true;
      //   }); 

      // request.flush(notes_details);
      // tick();

  }));

  xit('should clear message', () => {
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    fixture.detectChanges();
    component.clearMessage();
    expect(component.admin_notes).toEqual('');
  });

  xit('should previous message', () => {
    let service = fixture.debugElement.injector.get(DjangoService);
    fixture.detectChanges();
    component.prevMessage();
    service.get_admin_notes().subscribe(res => {
      expect(res).toBe(res, 'previous message data');
    });
    // expect(component.notes).toBe([ ], 'notes');
  });

  xit('should getAdminNotes method', ()=> {
    component.changeStartDateFormat();
    component.changeEndDateFormat();
    expect(component.customizedFromDate).toBe('04-Mar-2020', 'customizedFromDate');
    expect(component.customizedToDate).toBe('14-Mar-2020', 'customizedToDate');

    console.log(component.info, 'admin_noteadmin_noteadmin_noteadmin_note');
    // expect(component.info.data.admin_note[0]).toBe(undefined, 'data.admin_note');
    // expect(component.db_start_date).toBe('', 'db_start_date');
    // expect(component.db_end_date).toBe('', 'db_end_date');
    // expect(component.admin_notes).toBe('', 'admin_notes');
    // expect(component.note_status).toBe(false, 'note_status');
  });

  it('should have django service defined', ()=>{
    expect(DjangoService).toBeTruthy();
  })
});




// export class DjangoService {
//   constructor(private httpClient: HttpClient) {}

//   get_admin_notes(){
//     return this.httpClient.get(`${environment.baseUrl}RMP/admin_notes/`)
//   }
  
//   ddm_rmp_admin_notes(admin_notes) {
//     console.log(admin_notes, 'admin_notes-=--admin_notes');
//     return this.httpClient.post(`${environment.baseUrl}RMP/admin_notes/`, admin_notes)
//   }


// }
