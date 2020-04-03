import { async, ComponentFixture, TestBed, inject, 
          fakeAsync, tick, getTestBed,discardPeriodicTasks  } from '@angular/core/testing';
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
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
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
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthenticationService } from "src/app/authentication.service";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import Utils from '../../../utils';

describe('RmpLandingPageComponent', () => {
  let component: RmpLandingPageComponent;
  let fixture: ComponentFixture<RmpLandingPageComponent>;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let djangoservice: DjangoService;

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
                RouterTestingModule.withRoutes([]),
                NoopAnimationsModule,
                MatSnackBarModule
                ],
      declarations: [ RmpLandingPageComponent, HeaderComponent,
                      RequestOnBehalfComponent, NgToasterComponent],
      providers:[ DatePipe, NgxSpinnerService , 
                  MatSnackBar, AuthenticationService]
    })
    .compileComponents();
    injector = getTestBed();
    httpMock = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    component = fixture.debugElement.componentInstance;
    spyOn(Utils, 'showSpinner');
    spyOn(Utils, 'hideSpinner');
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute getHeaderDetails method', fakeAsync(() => {
    fixture.detectChanges();
    const a = {
        'role': 'admin',
        'first_name': 'Ganesh',
        'last_name': 'm'
    };
    component.auth_service.myMethod(a,1, '');
    fixture.detectChanges();
    component.auth_service.myMethod$.subscribe(role =>{
      expect(role).toEqual(a);
    });
  }));

  it('should execute getCurrentLookUpTable method', fakeAsync(() =>{
    fixture.detectChanges();
    const a = {
        'message':'success',
        'data': {
          'checkbox_data': [
            {
              "description": false,
              'ddm_rmp_ots_checkbox_group_id': 1,
              'checkbox_desc': "Commonly Requested Fields Available for Display",
              'ddm_rmp_lookup_ots_checkbox_values_id': 1,
              'field_values': "Order Number",
              'tooltip': null
            },
            {
              "description": false,
              'ddm_rmp_ots_checkbox_group_id': 1,
              'checkbox_desc': "Commonly Requested Fields Available for Display",
              'ddm_rmp_lookup_ots_checkbox_values_id': 1,
              'field_values': "Order Number",
              'tooltip': null
            }
          ],
          'allocation_grp_da': [
            {
              'ddm_rmp_lookup_dropdown_allocation_group_da_id': 1,
              'allocation_group': "TAHOE",
              'ddm_rmp_lookup_division': 13
            },
            {
              'ddm_rmp_lookup_dropdown_allocation_group_da_id': 2,
              'allocation_group': "TAHOE",
              'ddm_rmp_lookup_division': 13
            }
          ],
          'admin_note': [
            {
              'ddm_rmp_admin_notes_id': 384,
              'notes_content': "second important . This message has to be displayed =.ds",
              'notes_start_date': "2020-03-04T05:00:00-05:00",
              'notes_end_date': "2020-04-15T03:59:00-04:00",
              'admin_flag': false,
              'admin_note_status': true
            },
            {
              'ddm_rmp_admin_notes_id': 385,
              'notes_content': "second important . This message has to be displayed =.ds",
              'notes_start_date': "2020-03-04T05:00:00-05:00",
              'notes_end_date': "2020-04-15T03:59:00-04:00",
              'admin_flag': false,
              'admin_note_status': true
            }
          ],
          'order_event': [
            {
              'ddm_rmp_lookup_dropdown_order_event_id': 1,
              'order_event': "1000  Order Request Accepted by GM(Non-Retail)"
            },
            {
              'ddm_rmp_lookup_dropdown_order_event_id': 2,
              'order_event': "1000  Order Request Accepted by GM(Non-Retail)"
            }
          ],
          'date_data_da': [
            {
              'ddm_rmp_lookup_da_date_id': 1,
              'date_desc': "Start Date"
            },
            {
              'ddm_rmp_lookup_da_date_id': 2,
              'date_desc': "End Date"
            }
          ],
          'concensus_data_da' : [
            {
              'ddm_rmp_lookup_da_consensus_data_id': 4,
              'cd_values': "Monthly Demand",
              'tooltip': null
            },
            {
              'ddm_rmp_lookup_da_consensus_data_id': 5,
              'cd_values': "Monthly Demand",
              'tooltip': null
            }
          ],
          'report_frequency': [
            {
              'report_frequency_values': "Daily/Weekly (Monday to Friday) only",
              'select_frequency_values': "Monday",
              'ddm_rmp_lookup_report_frequency_id': 1,
              'select_frequency_description': false,
              'ddm_rmp_lookup_select_frequency_id': 18
            },
            {
              'report_frequency_values': "Daily/Weekly (Monday to Friday) only",
              'select_frequency_values': "Monday",
              'ddm_rmp_lookup_report_frequency_id': 2,
              'select_frequency_description': false,
              'ddm_rmp_lookup_select_frequency_id': 18
            }
          ],
          'cycle_data_da': [
            {
              'ddm_rmp_lookup_cycle_id': 1,
              'cycle_desc': "Cycle1"
            },
            {
              'ddm_rmp_lookup_cycle_id': 2,
              'cycle_desc': "Cycle1"
            }
          ],
          'desc_text_admin_documents': [
            {
              'ddm_rmp_desc_text_admin_documents_id': 1,
              'title': "sdaskldjaskl",
              'admin_flag': false,
              'url': "https://html.com"
            },
            {
              'ddm_rmp_desc_text_admin_documents_id': 2,
              'title': "sdaskldjaskl",
              'admin_flag': false,
              'url': "https://html.com"
            }
          ],
          'users_list': [
            {
              'users_table_id': 46,
              'user_id': "QZZ2PZ",
              'first_name': "Kenneth",
              'last_name': "Griessel",
              'dl_list': null,
              'sl_name': null,
              'privileges_name': null,
              'changed_by_user_id': "",
              'email': "kenn.griessel@gm.com",
              'contact_no': "+1 586-419-0477",
              'disclaimer_ack': null,
              'saved_setting': null,
              'designation': "Allocation Manager",
              'office_address': "Detroit, Michigan",
              'department': "Sales, Service & Marketing",
              'carrier': null,
              'region': "North America",
              'telephone': "+1 313-667-1018",
              'alternate_number': null,
              'role': 1
            },
            {
              'users_table_id': 46,
              'user_id': "QZZ2PZ",
              'first_name': "Kenneth",
              'last_name': "Griessel",
              'dl_list': null,
              'sl_name': null,
              'privileges_name': null,
              'changed_by_user_id': "",
              'email': "kenn.griessel@gm.com",
              'contact_no': "+1 586-419-0477",
              'disclaimer_ack': null,
              'saved_setting': null,
              'designation': "Allocation Manager",
              'office_address': "Detroit, Michigan",
              'department': "Sales, Service & Marketing",
              'carrier': null,
              'region': "North America",
              'telephone': "+1 313-667-1018",
              'alternate_number': null,
              'role': 1
            }
          ],
          'yesNo_frequency': [
            {
              'ddm_rmp_lookup_yes_no_frequency_id': 1,
              'frequency_desc': "Yes"
            },
            {
              'ddm_rmp_lookup_yes_no_frequency_id': 1,
              'frequency_desc': "No"
            }
          ],
          'special_identifiers': [
            {
              'ddm_rmp_lookup_special_identifiers': 1,
              'spl_desc': "Business Elite (US and Canada)"
            },
            {
              'ddm_rmp_lookup_special_identifiers': 2,
              'spl_desc': "Business Elite (US and Canada)"
            }
          ],
          'merchandising_data': [
            {
              'ddm_rmp_lookup_dropdown_merchandising_model_id': 1,
              'merchandising_model': "CC15706",
              'ddm_rmp_lookup_dropdown_allocation_group': 1,
              'ddm_rmp_lookup_dropdown_vehicle_line_brand': 115,
              'ddm_rmp_lookup_division': 14
            },
            {
              'ddm_rmp_lookup_dropdown_merchandising_model_id': 1,
              'merchandising_model': "CC15706",
              'ddm_rmp_lookup_dropdown_allocation_group': 1,
              'ddm_rmp_lookup_dropdown_vehicle_line_brand': 115,
              'ddm_rmp_lookup_division': 13
            }
          ],
          'allocation_grp': [
            {
              'ddm_rmp_lookup_dropdown_allocation_group_id': 1,
              'allocation_group': "TAHOE",
              'ddm_rmp_lookup_dropdown_vehicle_line_brand': 115,
              'ddm_rmp_lookup_division': 13
            },
            {
              'ddm_rmp_lookup_dropdown_allocation_group_id': 2,
              'allocation_group': "TAHOE",
              'ddm_rmp_lookup_dropdown_vehicle_line_brand': 115,
              'ddm_rmp_lookup_division': 13
            }
          ],
          'user': 2,
          'vehicle_data': [
            {
              'ddm_rmp_lookup_dropdown_vehicle_line_brand_id': 1,
              'vehicle_line_brand': "Cascada",
              'ddm_rmp_lookup_division': 1
            },
            {
              'ddm_rmp_lookup_dropdown_vehicle_line_brand_id': 2,
              'vehicle_line_brand': "Cascada",
              'ddm_rmp_lookup_division': 1
            }
          ],
          'model_year': [
            {
              'ddm_rmp_lookup_dropdown_model_year_id': 1,
              'model_year': "2017"
            },
            {
              'ddm_rmp_lookup_dropdown_model_year_id': 2,
              'model_year': "2018"
            }
          ],
          'type_data': [
            {
              'ddm_rmp_lookup_ots_type_data_id': 1,
              'type_data_desc': "Retail Only"
            },
            {
              'ddm_rmp_lookup_ots_type_data_id': 2,
              'type_data_desc': "Retail Only"
            }
          ],
          'desc_text_reference_documents': [
            {
              'ddm_rmp_desc_text_reference_documents_id': 20,
              'admin_flag': false,
              'url': "google.com",
              'title': "ckjckjcxnc,xnkddljhfhjkcccc"
            },
            {
              'ddm_rmp_desc_text_reference_documents_id': 21,
              'admin_flag': false,
              'url': "google.com",
              'title': "ckjckjcxnc,xnkddljhfhjkcccc"
            }
          ],
          'order_type': [
            {
              'ddm_rmp_lookup_dropdown_order_type_id': 1,
              'order_type': "T RE"
            },
            {
              'ddm_rmp_lookup_dropdown_order_type_id': 2,
              'order_type': "F DR"
            }
          ],
          'desc_text': [
            {
              'description': "<p>TESTING</p><p>Hari Gautam 3- PT Lead</p>",
              'ddm_rmp_desc_text_id': 26,
              'module_name': "DDM Team"
            },
            {
              'description': "<p>TESTING</p><p>Hari Gautam 4- PT Lead</p>",
              'ddm_rmp_desc_text_id': 27,
              'module_name': "DDM Team"
            }
          ],
          'display_summary': [
            {
              'dm_rmp_lookup_display_summary_id': 1,
              'ds_desc': "Display"
            },
            {
              'ddm_rmp_lookup_display_summary_id': 2,
              'ds_desc': "Summary"
            }
          ]
        }
    };
    component.dataProvider.changelookUpTableData(a);
    tick();
    fixture.detectChanges();
    component.dataProvider.currentlookUpTableData.
      subscribe(res => {
        expect(res).toEqual(a);
        fixture.detectChanges();
        expect(component.info).toEqual(res);
    });
  }));

  it('should ddm_rmp_admin_notes be service call', fakeAsync(async() => {
    const notes_details: object = {
            'notes_content': "second important . This message has to be displayed =.ds change of things",
            'notes_start_date': "2020-03-03 00:00",
            'notes_end_date': "2020-03-13 23:59",
            'admin_flag': false,
            'admin_note_status': true
          };
    let myService = TestBed.get(DjangoService);
    let mySpy = spyOn(myService, 'ddm_rmp_admin_notes').and.callThrough(); //callThrough()
    spyOn(component, 'getDDmRmpAdminNotes').and.callThrough(); //callThrough()
    component.getDDmRmpAdminNotes();
    expect(component.getDDmRmpAdminNotes).toHaveBeenCalled();
    tick(500);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      discardPeriodicTasks();
      expect(component.serviceData).toBe(notes_details);
    });
    expect(myService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1); 
  }));

  it('should check main menu tab', fakeAsync(() => {
    fixture.detectChanges();
    const bannerDe: DebugElement = fixture.debugElement;
    const bannerEl: HTMLElement = bannerDe.nativeElement;
    expect(bannerEl.querySelector('.main-menu').textContent).toEqual('Main Menu');
  }));

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
    spyOn(component, 'addDocument').and.callThrough(); //callThrough()        
      component.addDocument();
      fixture.detectChanges();
      expect(component.addDocument).toHaveBeenCalled();
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

     
  }));

  it('should clear message', fakeAsync(() => {
    fixture.detectChanges();
    component.clearMessage();
    tick(500);
    fixture.detectChanges();
    expect(component.admin_notes).toEqual('');
  }));

  it('should previous message', fakeAsync(() => {
    const notes_details  = { admin_notes : [{
      'notes_content': "second important . This message has to be displayed =.ds change of things",
      'notes_start_date': "2020-03-03 00:00",
      'notes_end_date': "2020-03-13 23:59",
      'admin_flag': false,
      'admin_note_status': true
    }]};   
    let service = fixture.debugElement.injector.get(DjangoService);
    let  spy = spyOn(service,"get_admin_notes").and.returnValue(of(notes_details));
    spyOn(component, 'prevMessage').and.callThrough(); //callThrough()
    component.prevMessage();
    expect(component.prevMessage).toHaveBeenCalled();
    tick(500);
    expect(component.notes).toBe(notes_details.admin_notes);
  }));

  // it('should execute changeStartDateFormat', fakeAsync(() => {
  //   fixture.detectChanges();
  //   spyOn(component, 'changeStartDateFormat').and.callThrough(); //callThrough()
  //   component.changeStartDateFormat();
  //   fixture.detectChanges();
  //   expect(component.customizedFromDate).toBe('23-Mar-2020');
  //   expect(component.changeStartDateFormat).toHaveBeenCalled();
  // }));

  // it('should execute changeEndDateFormat' , fakeAsync(() => {
  //   fixture.detectChanges();
  //   spyOn(component, 'changeEndDateFormat').and.callThrough(); //callThrough()
  //   component.changeEndDateFormat();
  //   expect(component.customizedToDate).toBe('02-Apr-2020');
  //   expect(component.changeEndDateFormat).toHaveBeenCalled();
  // }));

  it('should execute getAdminNotes', fakeAsync(() => {
    const adminNote = {
      'ddm_rmp_admin_notes_id': 384,
      'notes_content': "second important . This message has to be displayed =.ds",
      'notes_start_date': "2020-03-04T05:00:00-05:00",
      'notes_end_date': "2020-04-15T03:59:00-04:00",
      'admin_flag': false,
      'admin_note_status': true
    };
    fixture.detectChanges();
    spyOn(component, 'updateAdminNotesParams').and.callThrough(); //callThrough()
    component.updateAdminNotesParams(adminNote); 
    expect(component.updateAdminNotesParams).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.db_start_date).toBe(adminNote.notes_start_date);
    expect(component.db_end_date).toBe(adminNote.notes_end_date);
    expect(component.note_status).toBe(adminNote.admin_note_status);
    expect(component.admin_notes).toBe(adminNote.notes_content);
  }));
});