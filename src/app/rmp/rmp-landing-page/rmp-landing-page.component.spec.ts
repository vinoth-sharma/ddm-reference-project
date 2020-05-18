import { async, ComponentFixture, TestBed, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { RmpLandingPageComponent } from './rmp-landing-page.component';
import { HeaderComponent } from '../../header/header.component';
import { RequestOnBehalfComponent } from '../request-on-behalf/request-on-behalf.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from "angular4-multiselect-dropdown/angular4-multiselect-dropdown";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DjangoService } from '../django.service';
import { DataProviderService } from '../data-provider.service';
import 'jquery';
import { AuthenticationService } from "src/app/authentication.service";
import Utils from '../../../utils';
import { MaterialModule } from "../../material.module";
import { MatNativeDateModule } from '@angular/material/core';

// Angular test cases written by Ganesha
describe('RmpLandingPageComponent', () => {
  let component: RmpLandingPageComponent;
  let fixture: ComponentFixture<RmpLandingPageComponent>;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let djangoservice: DjangoService;
  const datePipe: DatePipe = new DatePipe('en-US');
  let authService: AuthenticationService;
  let dataProvider: DataProviderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatNativeDateModule,
        RouterModule,
        FormsModule,
        NgbDatepickerModule,
        NgbTimepickerModule,
        AngularMultiSelectModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
        MaterialModule,
        ReactiveFormsModule
      ],
      declarations: [RmpLandingPageComponent, HeaderComponent,
        RequestOnBehalfComponent, NgToasterComponent],
      providers: [DatePipe, AuthenticationService]
    })
      .compileComponents();
    injector = getTestBed();
    httpMock = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthenticationService);
    dataProvider = TestBed.get(DataProviderService);
    djangoservice = TestBed.get(DjangoService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmpLandingPageComponent);
    component = fixture.debugElement.componentInstance;
    spyOn(Utils, 'showSpinner');
    spyOn(Utils, 'hideSpinner');
    fixture.detectChanges();
  });

  it('should execute getHeaderDetails method', fakeAsync(() => {
    const a = {
      'role': 'admin',
      'first_name': 'Ganesh',
      'last_name': 'm'
    };
    authService.myMethod(a, 1, '');
    authService.myMethod$.subscribe(role => expect(role).toEqual(a));
  }));

  it('should execute getCurrentLookUpTable method', fakeAsync(() => {
    const a = {
      'message': 'success',
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
        'concensus_data_da': [
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
    dataProvider.changelookUpTableData(a);
    tick(1500);
    dataProvider.currentlookUpTableData.
      subscribe(res => {
        expect(res).toEqual(a);
        expect(component.info).toEqual(res);
      });
  }));

  it('should check main menu tab', fakeAsync(() => {
    fixture.detectChanges();
    const bannerDe: DebugElement = fixture.debugElement;
    const bannerEl: HTMLElement = bannerDe.nativeElement;
    expect(bannerEl.querySelector('.main-menu').textContent).toEqual('Main Menu');
  }));

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