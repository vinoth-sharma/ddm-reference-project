import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
  getTestBed,
  discardPeriodicTasks
} from '@angular/core/testing';
import { RequestStatusComponent } from './request-status.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from "angular4-multiselect-dropdown/angular4-multiselect-dropdown";
import { OrderByPipe } from '../../custom-directives/filters/order-by.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuillModule } from "ngx-quill";
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiDatePickerOngoingComponent } from '../multi-date-picker-ongoing/multi-date-picker-ongoing.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { MatSnackBar } from "@angular/material/snack-bar";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { DjangoService } from 'src/app/rmp/django.service';
import { AuthenticationService } from "src/app/authentication.service";
import { of, BehaviorSubject } from 'rxjs';
import { environment } from "../../../environments/environment";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ScheduleService } from '../../schedule/schedule.service';
import Utils from '../../../utils';
import { MaterialModule } from 'src/app/material.module';

describe('RequestStatusComponent', () => {
  let location: Location;
  let router: Router;
  let component: RequestStatusComponent;
  let componentToaster: NgToasterComponent;
  let fixture: ComponentFixture<RequestStatusComponent>;
  let fixtureToaster: ComponentFixture<NgToasterComponent>;
  let httpMock: HttpTestingController;
  const currentNotifications = [
    {
      ddm_rmp_request_status_comment_id: 29,
      comment_timestamp: "2019-09-24T18:56:35.480527-04:00",
      comment: "Testing 2019-09-24 18:54:18",
      comment_read_flag: false,
      audience: "",
      commentor: "Dejan Ahmetovic",
      users_table: 4,
      ddm_rmp_post_report: 124
    },
    {
      ddm_rmp_request_status_comment_id: 30,
      comment_timestamp: "2019-09-24T19:16:27.949980-04:00",
      comment: "Testing 2019-09-24 19:09:32",
      comment_read_flag: false,
      audience: "",
      commentor: "Dejan Ahmetovic",
      users_table: 4,
      ddm_rmp_post_report: 211
    }
  ];
  const role = {
    email: "Sibasish.Mohanty@mu-sigma.com",
    role: "Admin",
    first_name: "Sibasish",
    role_id: 1,
    last_name: "Mohanty",
    user_id: "LYC59J"
  };
  const list = {
    pending_reports: [],
    report_list: [
      {
        ddm_rmp_post_report_id: 16,
        ddm_rmp_status_date: "2019-08-22T08:13:10.028000-04:00",
        status: "Cancelled",
        title: "one time report",
        additional_req: "one time report",
        report_type: "da",
        created_on: "02-Aug-2019",
        on_behalf_of: "",
        assigned_to: "Deepak Urs",
        link_to_results: "",
        query_criteria: "",
        link_title: "",
        favorite: false,
        requestor: "Sibasish Mohanty",
        organization: "Global Business Solutions",
        users_table: 2,
        unread: true
      },
      {
        ddm_rmp_post_report_id: 18,
        ddm_rmp_status_date: "2019-10-19T02:10:59.259000-04:00",
        status: "Cancelled",
        title: "qwertyu",
        additional_req: "qwertyuiop",
        report_type: "da",
        created_on: "02-Aug-2019",
        on_behalf_of: "",
        assigned_to: "Sibasish Mohanty",
        link_to_results: "",
        query_criteria: "",
        link_title: "",
        favorite: false,
        requestor: "Sibasish Mohanty",
        organization: "Global Business Solutions",
        users_table: 2,
        unread: true
      }
    ],
    is_admin: "Admin"
  };
  const currentLook = {
    message: "success",
    data: {
      report_frequency: [
        {
          select_frequency_values: "Monday",
          select_frequency_description: false,
          ddm_rmp_lookup_report_frequency_id: 1,
          report_frequency_values: "Daily/Weekly (Monday to Friday) only",
          ddm_rmp_lookup_select_frequency_id: 18
        },
        {
          select_frequency_values: "Tuesday",
          select_frequency_description: false,
          ddm_rmp_lookup_report_frequency_id: 1,
          report_frequency_values: "Daily/Weekly (Monday to Friday) only",
          ddm_rmp_lookup_select_frequency_id: 19
        }
      ],
      yesNo_frequency: [
        {
          ddm_rmp_lookup_yes_no_frequency_id: 1,
          frequency_desc: "Yes"
        },
        {
          ddm_rmp_lookup_yes_no_frequency_id: 2,
          frequency_desc: "No"
        }
      ],
      date_data_da: [
        {
          ddm_rmp_lookup_da_date_id: 1,
          date_desc: "Start Date"
        },
        {
          ddm_rmp_lookup_da_date_id: 2,
          date_desc: "End Date"
        }
      ],
      desc_text_admin_documents: [
        {
          admin_flag: false,
          title: "sdaskldjaskl",
          url: "https://html.com",
          ddm_rmp_desc_text_admin_documents_id: 1
        },
        {
          admin_flag: false,
          title: "newref link 19Oct",
          url: "https://ddm1.apps.pcfepg2wi.gm.com/#/user/main/reference-documents",
          ddm_rmp_desc_text_admin_documents_id: 3
        }
      ],
      desc_text_reference_documents: [
        {
          title: "Test URL 18Sep19",
          url: "https://ddm-dev-temp.apps.pcfepg2wi.gm.com/#/user/main/reference",
          admin_flag: false,
          ddm_rmp_desc_text_reference_documents_id: 22
        },
        {
          title: "ckjckjcxnc,xnkddljhfhjkcccc",
          url: "Yahoo.com",
          admin_flag: false,
          ddm_rmp_desc_text_reference_documents_id: 25
        }
      ],
      cycle_data_da: [
        {
          ddm_rmp_lookup_cycle_id: 1,
          cycle_desc: "Cycle1"
        },
        {
          ddm_rmp_lookup_cycle_id: 2,
          cycle_desc: "Cycle2"
        }
      ],
      desc_text: [
        {
          ddm_rmp_desc_text_id: 25,
          description: "<p>TESTING</p><p>Hari Gautam 2- PT Lead</p>",
          module_name: "DDM Team"
        },
        {
          ddm_rmp_desc_text_id: 26,
          description: "<p>TESTING</p><p>Hari Gautam 3- PT Lead</p>",
          module_name: "DDM Team"
        }
      ],
      model_year: [
        {
          ddm_rmp_lookup_dropdown_model_year_id: 1,
          model_year: "2017"
        },
        {
          ddm_rmp_lookup_dropdown_model_year_id: 2,
          model_year: "2018"
        }
      ],
      users_list: [
        {
          users_table_id: 46,
          user_id: "QZZ2PZ",
          first_name: "Kenneth",
          last_name: "Griessel",
          dl_list: null,
          sl_name: null,
          privileges_name: null,
          changed_by_user_id: "",
          email: "kenn.griessel@gm.com",
          contact_no: "+1 586-419-0477",
          disclaimer_ack: null,
          saved_setting: null,
          designation: "Allocation Manager",
          office_address: "Detroit, Michigan",
          department: "Sales, Service & Marketing",
          carrier: null,
          region: "North America",
          telephone: "+1 313-667-1018",
          alternate_number: null,
          role: 1
        },
        {
          sers_table_id: 9,
          user_id: "QZ9YH2",
          first_name: "Hari N",
          last_name: "Gautam",
          dl_list: null,
          sl_name: ["Test_SL_001"],
          privileges_name: ["Create/Edit query"],
          changed_by_user_id: "",
          email: "hari.gautam@gm.com",
          contact_no: "+1 928-380-1277",
          disclaimer_ack: "2019-08-21T03:35:05.497000-04:00",
          saved_setting: "2019-09-24T16:48:56.890000-04:00",
          designation: "Performance Engineer",
          office_address: "Austin, Texas",
          department: "Information Technology",
          carrier: "c-spire",
          region: "North America",
          telephone: "+1 512-840-2303",
          alternate_number: "148-3224143",
          role: 1
        }
      ],
      special_identifiers: [
        {
          ddm_rmp_lookup_special_identifiers: 1,
          spl_desc: "Business Elite (US and Canada)"
        },
        {
          ddm_rmp_lookup_special_identifiers: 2,
          spl_desc: "Primary Fleet Account Number (FAN)"
        }
      ],
      order_event: [
        {
          ddm_rmp_lookup_dropdown_order_event_id: 1,
          order_event: "1000  Order Request Accepted by GM(Non-Retail)"
        },
        {
          ddm_rmp_lookup_dropdown_order_event_id: 2,
          order_event: "1100  Preliminary Order Added(Retail)"
        }
      ],
      admin_note: [{
        ddm_rmp_admin_notes_id: 400,
        notes_content: "second important. ahsjkhauyw zjhkfhjkz bxv v cvmnv",
        notes_start_date: null,
        notes_end_date: "2020-04-04T03:59:00-04:00",
        admin_flag: false,
        admin_note_status: false
      }],
      checkbox_data: [
        {
          ddm_rmp_ots_checkbox_group_id: 1,
          tooltip: null,
          ddm_rmp_lookup_ots_checkbox_values_id: 1,
          description: false,
          field_values: "Order Number",
          checkbox_desc: "Commonly Requested Fields Available for Display"
        },
        {
          ddm_rmp_ots_checkbox_group_id: 1,
          tooltip: null,
          ddm_rmp_lookup_ots_checkbox_values_id: 2,
          description: false,
          field_values: "Vehicle Information Number (VIN)",
          checkbox_desc: "Commonly Requested Fields Available for Display"
        }
      ],
      user: 2,
      display_summary: [
        {
          ddm_rmp_lookup_display_summary_id: 1,
          ds_desc: "Display"
        },
        {
          ddm_rmp_lookup_display_summary_id: 2,
          ds_desc: "Summary"
        }
      ],
      type_data: [
        {
          ddm_rmp_lookup_ots_type_data_id: 1,
          type_data_desc: "Retail Only"
        },
        {
          ddm_rmp_lookup_ots_type_data_id: 2,
          type_data_desc: "Non-Retail (Includes Fleet)"
        }
      ],
      allocation_grp_da: [
        {
          ddm_rmp_lookup_dropdown_allocation_group_da_id: 1,
          allocation_group: "TAHOE",
          ddm_rmp_lookup_division: 13
        },
        {
          ddm_rmp_lookup_dropdown_allocation_group_da_id: 2,
          allocation_group: "SPARK",
          ddm_rmp_lookup_division: 13
        }
      ],
      order_type: [
        {
          ddm_rmp_lookup_dropdown_order_type_id: 1,
          order_type: "T RE"
        },
        {
          ddm_rmp_lookup_dropdown_order_type_id: 2,
          order_type: "F DR"
        }
      ],
      vehicle_data: [
        {
          ddm_rmp_lookup_dropdown_vehicle_line_brand_id: 1,
          vehicle_line_brand: "Cascada",
          ddm_rmp_lookup_division: 1
        },
        {
          ddm_rmp_lookup_dropdown_vehicle_line_brand_id: 2,
          vehicle_line_brand: "Enclave",
          ddm_rmp_lookup_division: 1
        }
      ],
      concensus_data_da: [
        {
          ddm_rmp_lookup_da_consensus_data_id: 4,
          cd_values: "Monthly Demand",
          tooltip: null
        },
        {
          ddm_rmp_lookup_da_consensus_data_id: 3,
          cd_values: "Final Allocation",
          tooltip: "Final volume earned by a dealer after Variance Resolution is ↵complete(resolves +/- differences between Estimated Shipments and Production Consensus across the dealer network)"
        }
      ],
      merchandising_data: [
        {
          ddm_rmp_lookup_dropdown_merchandising_model_id: 1,
          merchandising_model: "CC15706",
          ddm_rmp_lookup_dropdown_allocation_group: 1,
          ddm_rmp_lookup_dropdown_vehicle_line_brand: 115,
          ddm_rmp_lookup_division: 13
        },
        {
          ddm_rmp_lookup_dropdown_merchandising_model_id: 2,
          merchandising_model: "1DU48",
          ddm_rmp_lookup_dropdown_allocation_group: 2,
          ddm_rmp_lookup_dropdown_vehicle_line_brand: 113,
          ddm_rmp_lookup_division: 13
        }
      ],
      allocation_grp: [
        {
          ddm_rmp_lookup_dropdown_allocation_group_id: 1,
          allocation_group: "TAHOE",
          ddm_rmp_lookup_dropdown_vehicle_line_brand: 115,
          ddm_rmp_lookup_division: 13
        },
        {
          ddm_rmp_lookup_dropdown_allocation_group_id: 2,
          allocation_group: "SPARK",
          ddm_rmp_lookup_dropdown_vehicle_line_brand: 113,
          ddm_rmp_lookup_division: 13
        }
      ]
    }
  };

  const lookupValues = {
    data: {
      order_event: [
        {
          ddm_rmp_lookup_dropdown_order_event_id: 1,
          order_event: "1000  Order Request Accepted by GM(Non-Retail)"
        },
        {
          ddm_rmp_lookup_dropdown_order_event_id: 2,
          order_event: "1100  Preliminary Order Added(Retail)"
        }
      ],
      merchandising_data: [
        {
          ddm_rmp_lookup_dropdown_merchandising_model_id: 1,
          merchandising_model: "CC15706",
          ddm_rmp_lookup_dropdown_allocation_group: 1,
          ddm_rmp_lookup_dropdown_vehicle_line_brand: 115,
          ddm_rmp_lookup_division: 13
        },
        {
          ddm_rmp_lookup_dropdown_merchandising_model_id: 2,
          merchandising_model: "1DU48",
          ddm_rmp_lookup_dropdown_allocation_group: 2,
          ddm_rmp_lookup_dropdown_vehicle_line_brand: 113,
          ddm_rmp_lookup_division: 13
        }
      ],
      allocation_grp_da: [
        {
          ddm_rmp_lookup_dropdown_allocation_group_da_id: 1,
          allocation_group: "TAHOE",
          ddm_rmp_lookup_division: 13
        },
        {
          ddm_rmp_lookup_dropdown_allocation_group_da_id: 2,
          allocation_group: "SPARK",
          ddm_rmp_lookup_division: 13
        }
      ],
      desc_text_reference_documents: [
        {
          title: "Test URL 18Sep19",
          ddm_rmp_desc_text_reference_documents_id: 22,
          admin_flag: false,
          url: "https://ddm-dev-temp.apps.pcfepg2wi.gm.com/#/user/main/reference"
        },
        {
          title: "ckjckjcxnc,xnkddljhfhjkcccc",
          ddm_rmp_desc_text_reference_documents_id: 25,
          admin_flag: false,
          url: "Yahoo.com"
        }
      ],
      admin_note: [
        {
          ddm_rmp_admin_notes_id: 400,
          notes_content: "second important. ahsjkhauyw zjhkfhjkz bxv v cvmnv",
          notes_start_date: null,
          notes_end_date: "2020-04-04T03:59:00-04:00",
          admin_flag: false,
          admin_note_status: false
        }
      ],
      yesNo_frequency: [
        {
          ddm_rmp_lookup_yes_no_frequency_id: 1,
          frequency_desc: "Yes"
        },
        {
          ddm_rmp_lookup_yes_no_frequency_id: 2,
          frequency_desc: "No"
        }
      ],
      allocation_grp: [
        {
          ddm_rmp_lookup_dropdown_allocation_group_id: 1,
          allocation_group: "TAHOE",
          ddm_rmp_lookup_dropdown_vehicle_line_brand: 115,
          ddm_rmp_lookup_division: 13
        },
        {
          ddm_rmp_lookup_dropdown_allocation_group_id: 2,
          allocation_group: "SPARK",
          ddm_rmp_lookup_dropdown_vehicle_line_brand: 113,
          ddm_rmp_lookup_division: 13
        }
      ],
      special_identifiers: [
        {
          ddm_rmp_lookup_special_identifiers: 1,
          spl_desc: "Business Elite (US and Canada)"
        },
        {
          ddm_rmp_lookup_special_identifiers: 2,
          spl_desc: "Primary Fleet Account Number (FAN)"
        }
      ],
      type_data: [
        {
          ddm_rmp_lookup_ots_type_data_id: 1,
          type_data_desc: "Retail Only"
        },
        {
          ddm_rmp_lookup_ots_type_data_id: 2,
          type_data_desc: "Non-Retail (Includes Fleet)"
        }
      ],
      users_list: [
        {
          users_table_id: 46,
          user_id: "QZZ2PZ",
          first_name: "Kenneth",
          last_name: "Griessel",
          dl_list: null,
          sl_name: null,
          privileges_name: null,
          changed_by_user_id: "",
          email: "kenn.griessel@gm.com",
          contact_no: "+1 586-419-0477",
          disclaimer_ack: null,
          saved_setting: null,
          designation: "Allocation Manager",
          office_address: "Detroit, Michigan",
          department: "Sales, Service & Marketing",
          carrier: null,
          region: "North America",
          telephone: "+1 313-667-1018",
          alternate_number: null,
          role: 1
        },
        {
          users_table_id: 9,
          user_id: "QZ9YH2",
          first_name: "Hari N",
          last_name: "Gautam",
          dl_list: null,
          sl_name: ["Test_SL_001"],
          privileges_name: ["Create/Edit query"],
          changed_by_user_id: "",
          email: "hari.gautam@gm.com",
          contact_no: "+1 928-380-1277",
          disclaimer_ack: "2019-08-21T03:35:05.497000-04:00",
          saved_setting: "2019-09-24T16:48:56.890000-04:00",
          designation: "Performance Engineer",
          office_address: "Austin, Texas",
          department: "Information Technology",
          carrier: "c-spire",
          region: "North America",
          telephone: "+1 512-840-2303",
          alternate_number: "148-3224143",
          role: 1
        }
      ],
      display_summary: [
        {
          ddm_rmp_lookup_display_summary_id: 1,
          ds_desc: "Display"
        },
        {
          ddm_rmp_lookup_display_summary_id: 2,
          ds_desc: "Summary"
        }
      ],
      desc_text_admin_documents: [
        {
          title: "sdaskldjaskl",
          admin_flag: false,
          ddm_rmp_desc_text_admin_documents_id: 1,
          url: "https://html.com"
        },
        {
          title: "newref link 19Oct",
          admin_flag: false,
          ddm_rmp_desc_text_admin_documents_id: 3,
          url: "https://ddm1.apps.pcfepg2wi.gm.com/#/user/main/reference-documents"
        }
      ],
      checkbox_data: [
        {
          checkbox_desc: "Commonly Requested Fields Available for Display",
          field_values: "Order Number",
          ddm_rmp_lookup_ots_checkbox_values_id: 1,
          ddm_rmp_ots_checkbox_group_id: 1,
          description: false,
          tooltip: null
        },
        {
          checkbox_desc: "Commonly Requested Fields Available for Display",
          field_values: "Vehicle Information Number (VIN)",
          ddm_rmp_lookup_ots_checkbox_values_id: 2,
          ddm_rmp_ots_checkbox_group_id: 1,
          description: false,
          tooltip: null
        }
      ],
      concensus_data_da: [
        {
          ddm_rmp_lookup_da_consensus_data_id: 4,
          cd_values: "Monthly Demand",
          tooltip: null
        },
        {
          ddm_rmp_lookup_da_consensus_data_id: 3,
          cd_values: "Final Allocation",
          tooltip: "Final volume earned by a dealer after Variance Resolution is ↵complete(resolves +/- differences between Estimated Shipments and Production Consensus across the dealer network)"
        }
      ],
      desc_text: [
        {
          ddm_rmp_desc_text_id: 25,
          module_name: "DDM Team",
          description: "<p>TESTING</p><p>Hari Gautam 2- PT Lead</p>"
        },
        {
          ddm_rmp_desc_text_id: 26,
          module_name: "DDM Team",
          description: "<p>TESTING</p><p>Hari Gautam 3- PT Lead</p>"
        }
      ],
      report_frequency: [
        {
          report_frequency_values: "Daily/Weekly (Monday to Friday) only",
          select_frequency_description: false,
          ddm_rmp_lookup_select_frequency_id: 18,
          ddm_rmp_lookup_report_frequency_id: 1,
          select_frequency_values: "Monday"
        },
        {
          report_frequency_values: "Daily/Weekly (Monday to Friday) only",
          select_frequency_description: false,
          ddm_rmp_lookup_select_frequency_id: 19,
          ddm_rmp_lookup_report_frequency_id: 1,
          select_frequency_values: "Tuesday"
        }
      ],
      cycle_data_da: [
        {
          ddm_rmp_lookup_cycle_id: 1,
          cycle_desc: "Cycle1"
        },
        {
          ddm_rmp_lookup_cycle_id: 2,
          cycle_desc: "Cycle2"
        }
      ],
      vehicle_data: [
        {
          ddm_rmp_lookup_dropdown_vehicle_line_brand_id: 1,
          vehicle_line_brand: "Cascada",
          ddm_rmp_lookup_division: 1
        },
        {
          ddm_rmp_lookup_dropdown_vehicle_line_brand_id: 2,
          vehicle_line_brand: "Enclave",
          ddm_rmp_lookup_division: 1
        }
      ],
      model_year: [
        {
          ddm_rmp_lookup_dropdown_model_year_id: 1,
          model_year: "2017"
        },
        {
          ddm_rmp_lookup_dropdown_model_year_id: 2,
          model_year: "2018"
        }
      ],
      date_data_da: [
        {
          ddm_rmp_lookup_da_date_id: 1,
          date_desc: "Start Date"
        },
        {
          ddm_rmp_lookup_da_date_id: 2,
          date_desc: "End Date"
        }
      ],
      order_type: [
        {
          ddm_rmp_lookup_dropdown_order_type_id: 1,
          order_type: "T RE"
        },
        {
          ddm_rmp_lookup_dropdown_order_type_id: 2,
          order_type: "F DR"
        }
      ],
      user: 2
    },
    message: "success"
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AngularMultiSelectModule,
        RouterTestingModule.withRoutes([]),
        QuillModule.forRoot(),MatProgressSpinnerModule,
        NgbTypeaheadModule, MatChipsModule, MatAutocompleteModule,
        MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule,
        NgbDatepickerModule, NgbTimepickerModule, HttpClientTestingModule,
        MatSnackBarModule, NoopAnimationsModule],
      declarations: [RequestStatusComponent, OrderByPipe,
        MultiDatePickerOngoingComponent, NgToasterComponent],
      providers: [DatePipe, MatSnackBar, DataProviderService, AuthenticationService
      ],
    })
      .compileComponents();
    httpMock = TestBed.get(HttpTestingController);

  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(RequestStatusComponent);
    router.initialNavigation();
    component = fixture.componentInstance;
    spyOn(Utils, 'showSpinner');
    spyOn(Utils, 'hideSpinner');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check dataProvider service currentNotifications method', fakeAsync(() => {
    let service = TestBed.get(DjangoService);
    let mySpy = spyOn(service, 'get_notifications').and.returnValues(currentNotifications[0]);
    const res = service.get_notifications();
    tick(1500);
    fixture.detectChanges();
    expect(res).toEqual(currentNotifications[0]);
    expect(service).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute getRoleDetails method', fakeAsync(() => {
    fixture.detectChanges();
    component.getRoleDetails();
    let service = TestBed.get(AuthenticationService);
    service.myMethod(role, null, null);
    expect(component.user_role).toEqual(role.role);
    expect(service).toBeDefined();
  }));

  it('should execute dataProvider service currentlookUpTableData method',
    fakeAsync(() => {
      fixture.detectChanges();
      component.currentLookUpTableData();
      let dataProviderService = TestBed.get(DataProviderService);
      let djangoService = TestBed.get(DjangoService);
      dataProviderService.changelookUpTableData(currentLook);
      expect(component.lookup).toEqual(currentLook);
      tick(1500);
      fixture.detectChanges();
      expect(dataProviderService).toBeDefined();
    }));

  it('should execute ngOnInit method', fakeAsync(() => {
    fixture.detectChanges();
    let djangoService = TestBed.get(DjangoService);
    let mySpy = spyOn(component, 'ngOnInit').and.callThrough(); //callThrough()
    let myService = spyOn(djangoService, "getLookupValues").and.returnValue(of(lookupValues));
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.discList).toBe(lookupValues.data.users_list);
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute textChanged method', fakeAsync(() => {
    let event = {
      text: ''
    };
    component.textChange = false;
    fixture.detectChanges();
    component.textChanged(event);
    expect(component.textChange).toBeTruthy();
    expect(component.enableUpdateData).toBeFalsy();

    event['text'] = 'change';
    component.textChange = false;
    component.textChanged(event);
    expect(component.textChange).toBeTruthy();
    expect(component.enableUpdateData).toBeTruthy();
  }));

  it('should execute content_edits method', fakeAsync(() => {

  }));

  it('should execute resetHelpParams method', fakeAsync(() => {
    component.editModes = true;
    component.readOnlyContentHelper = false;
    component.original_contents = 'testing content';
    component.resetHelpParams();
    expect(component.editModes).toBeFalsy();
    expect(component.readOnlyContentHelper).toBeTruthy();
    expect(component.namings).toEqual(component.original_contents);
  }));

  it('should execute editEnable method', fakeAsync(() => {
    component.editModes = false;
    component.readOnlyContentHelper = true;
    component.original_contents = 'testing content';
    component.editEnable();
    expect(component.editModes).toBeTruthy();
    expect(component.readOnlyContentHelper).toBeFalsy();
    expect(component.namings).toEqual(component.original_contents);
  }));

  it('should execute sort method', fakeAsync(() => {
    component.reports = list.report_list;
    fixture.detectChanges();
    component.sort('assigned_to');
    fixture.detectChanges();
    expect(component.orderType).toEqual('reverse');
  }));

  it('should execute Report_request method', fakeAsync(() => {
    component.reports = list.report_list;
    let element = {
      ddm_rmp_post_report_id: 16
    };
    let event = {
      target: {
        checked: true
      }
    };
    let res = [{
      ddm_rmp_post_report_id: 16,
      ddm_rmp_status_date: "2019-08-22T08:13:10.028000-04:00",
      status: "Cancelled",
      title: "one time report",
      additional_req: "one time report",
      report_type: "da",
      created_on: "02-Aug-2019",
      on_behalf_of: "",
      assigned_to: "Deepak Urs",
      link_to_results: "",
      query_criteria: "",
      link_title: "",
      favorite: false,
      requestor: "Sibasish Mohanty",
      organization: "Global Business Solutions",
      users_table: 2,
      unread: true,
      isChecked: true
    }];
    fixture.detectChanges();
    component.Report_request(element, event);
    expect(component.finalData).toEqual(res);
  }));

  it('should execute open method', fakeAsync(() => {
    let element = {
      ddm_rmp_post_report_id: 16,
      user_id: 3
    };
  }));

  it('should execute CheckCancel method', fakeAsync(() => {
    component.reports = list.report_list;
    fixture.detectChanges();
    component.CheckCancel();
  }));

  it('should execute cancel method', fakeAsync(() => {
    component.finalData = [{
      ddm_rmp_post_report_id: 16
    }];
    fixture.detectChanges();

    let djangoService = TestBed.get(DjangoService);
    spyOn(component, 'Cancel').and.callThrough(); //callThrough()
    let mySpy = spyOn(djangoService, 'cancel_report').and.
      returnValues(of(component.cancel_report.cancel_reports));
    component.Cancel();
    expect(component.cancel_response).toEqual(component.cancel_report.cancel_reports);
    expect(component.Cancel).toHaveBeenCalled();
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute AssignTBD method', fakeAsync(() => {
    component.finalData = [{
      ddm_rmp_post_report_id: 16
    }];
    const res = ['a', 'b', 'c', 'd'];
    fixture.detectChanges();
    let djangoService = TestBed.get(DjangoService);
    spyOn(component, 'AssignTBD').and.callThrough(); //callThrough()
    let mySpy = spyOn(djangoService, 'ddm_rmp_tbd_req_put').and.
      returnValues(of(res));
    component.AssignTBD();
    expect(component.assign_res).toEqual(res);
    expect(component.AssignTBD).toHaveBeenCalled();
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);

  }));

  it('should execute TBD method', fakeAsync(() => {
    let element = {
      ddm_rmp_post_report_id: 16
    };
    spyOn(component, 'TBD').and.callThrough(); //callThrough()
    component.TBD(element);
    expect(component.TBD).toHaveBeenCalled();
    expect(component.assignReportId).toEqual(element.ddm_rmp_post_report_id);
  }));

  it('should execute TBDsave method', fakeAsync(() => {
    fixtureToaster = TestBed.createComponent(NgToasterComponent);
    componentToaster = fixtureToaster.componentInstance;
    component.assignReportId = 5;
    component.tbdselectedItems_report = [
      {
        users_table_id: 8,
        full_name: 'ganesh'
      }
    ];
    const res = ['a', 'b', 'c', 'd'];
    fixture.detectChanges();
    let djangoService = TestBed.get(DjangoService);
    spyOn(component, 'TBDsave').and.callThrough(); //callThrough()
    spyOn(componentToaster, 'success').and.callThrough(); // callThrough
    let mySpy = spyOn(djangoService, 'assign_owner_post').and.
      returnValues(of(res));
    component.TBDsave();
    componentToaster.success('success');
    tick(1500);
    fixture.detectChanges();
    expect(component.TBDsave).toHaveBeenCalled();
    expect(componentToaster.success).toHaveBeenCalled();
    expect(component.Tbd_res).toEqual(res);
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute Assign_AssignTo method', fakeAsync(() => {
    component.finalData = [{
      ddm_rmp_post_report_id: 16
    }];
    const res = ['a', 'b', 'c', 'd'];
    fixture.detectChanges();
    let djangoService = TestBed.get(DjangoService);
    spyOn(component, 'Assign_AssignTo').and.callThrough(); //callThrough()
    let mySpy = spyOn(djangoService, 'ddm_rmp_assign_to').and.
      returnValues(of(res));
    component.Assign_AssignTo();
    tick(1500);
    fixture.detectChanges();
    expect(component.assigned_res).toEqual(res);
    expect(component.Assign_AssignTo).toHaveBeenCalled();
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute TBD_Assigned method', fakeAsync(() => {
    component.assignReportId = 13;
    component.tbdselectedItemsAssigned = [
      {
        full_name: 'ganesh'
      }
    ];
    const res = ['a', 'b', 'c', 'd'];
    fixture.detectChanges();
    let djangoService = TestBed.get(DjangoService);
    spyOn(component, 'TBD_Assigned').and.callThrough(); //callThrough()
    spyOn(componentToaster, 'success').and.callThrough(); // callThrough
    let mySpy = spyOn(djangoService, 'ddm_rmp_assign_to').and.
      returnValues(of(res));
    component.TBD_Assigned();
    componentToaster.success('success');
    tick(1500);
    fixture.detectChanges();
    expect(component.TBD_Assigned).toHaveBeenCalled();
    expect(componentToaster.success).toHaveBeenCalled();
    expect(component.tbd_assign_res).toEqual(res);
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute closeTBD_Assigned method', fakeAsync(() => {

    spyOn(component, 'closeTBD_Assigned').and.callThrough(); //callThrough()
    component.closeTBD_Assigned();
    expect(component.closeTBD_Assigned).toHaveBeenCalled();
    expect(component.tbdselectedItemsAssigned.length).toBeFalsy();
  }));

  it('should execute closeTBD method', fakeAsync(() => {
    spyOn(component, 'closeTBD').and.callThrough(); //callThrough()
    component.closeTBD();
    expect(component.closeTBD).toHaveBeenCalled();
    expect(component.tbdselectedItems_report.length).toBeFalsy();
  }));

  it('should execute sort_by method', fakeAsync(() => {
    component.sorted_by = "asc";
    fixture.detectChanges();
    spyOn(component, 'sort_by').and.callThrough(); //callThrough()
    let djangoService = fixture.debugElement.injector.get(DjangoService);
    let mySpy = spyOn(djangoService, 'list_of_reports').and.
      returnValues(of(list["report_list"]));
    component.sort_by();
    tick(1500);
    fixture.detectChanges();
    expect(component.sort_by).toHaveBeenCalled();
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute accept method', fakeAsync(() => {
    component.finalData = [{
      ddm_rmp_post_report_id: 16,
      status: "Cancelled"
    }];
    const res = ['a', 'b', 'c', 'd'];
    fixture.detectChanges();
    spyOn(component, 'Accept').and.callThrough(); //callThrough()
    component.Accept();
    expect(component.finalData.length).toBeFalsy();
    expect(component.errorModalMessageRequest).toEqual('status for the report 16 is already Cancelled and can not be accepted');
    expect(component.Accept).toHaveBeenCalled();

    component.finalData = [{
      ddm_rmp_post_report_id: 16,
      status: "Incomplete"
    }];
    fixture.detectChanges();
    component.Accept();
    expect(component.finalData.length).toBeFalsy();
    expect(component.errorModalMessageRequest).toEqual('status for the report 16 is Incomplete and can not be accepted. Please complete the report');
    expect(component.Accept).toHaveBeenCalled();

    component.finalData = [{
      ddm_rmp_post_report_id: 16,
      status: ""
    }];
    fixture.detectChanges();
    component.Accept();
  }));

  it('should execute post_link method', fakeAsync(() => {
    component.checkbox_length = 0;
    component.finalData = [{
      status: "Incomplete"
    }];
    fixture.detectChanges();
    spyOn(component, 'post_link').and.callThrough(); //callThrough()
    component.post_link();
    expect(component.errorModalMessageRequest).toEqual("Select a report to post link for it");

    component.checkbox_length = 1;
    fixture.detectChanges();
    component.post_link();
    expect(component.errorModalMessageRequest).toEqual("Request not Active yet. Can't post link to results.");
    expect(component.post_link).toHaveBeenCalled();

    component.checkbox_length = 6;
    fixture.detectChanges();
    component.post_link();
    expect(component.errorModalMessageRequest).toEqual("You cannot post link on multiple reports at once");
    expect(component.post_link).toHaveBeenCalled();
  }));

  it('should execute closePostLink method', fakeAsync(() => {
    spyOn(component, 'closePostLink').and.callThrough(); //callThrough()
    component.closePostLink();
    expect(component.hidVar).toBeTruthy();
    expect(component.closePostLink).toHaveBeenCalled();
  }));

  it('should execute addDocument method', fakeAsync(() => {
    const result = {
      'report_id': 16,
      "link_title": 'xyz',
      "link_to_results": 'https://xyz.com'
    };
    component.documentName = '';
    component.documentUrl = '';
    component.finalData = [{
      ddm_rmp_post_report_id: 16
    }];
    component.hidVar = true;
    fixture.detectChanges();
    spyOn(component, 'addDocument').and.callThrough(); //callThrough()
    component.addDocument();
    expect(component.hidVar).toBeFalsy();
    expect(component.addDocument).toHaveBeenCalled();

    component.documentName = 'xyz';
    component.documentUrl = 'https://xyz.com';
    component.checkbox_length = 1;
    fixture.detectChanges();
    let djangoService = fixture.debugElement.injector.get(DjangoService);
    let mySpy = spyOn(djangoService, 'post_link').and.
      returnValues(of(result));
    component.addDocument();
    expect(component.add_response).toEqual(result);
    expect(component.addDocument).toHaveBeenCalled();
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);

    component.checkbox_length = 0;
    fixture.detectChanges();
    component.addDocument();
    expect(component.errorModalMessageRequest).toEqual("Select a report to post a link");
    expect(component.addDocument).toHaveBeenCalled();
  }));

  it('should execute checkbox_validation method', fakeAsync(() => {
    component.checkbox_length = 0;
    fixture.detectChanges();
    spyOn(component, 'checkbox_validation').and.callThrough(); //callThrough()
    component.checkbox_validation();
    expect(component.errorModalMessageRequest).toEqual("Select a report to comment on it");
    expect(component.checkbox_validation).toHaveBeenCalled();

    component.checkbox_length = 2;
    fixture.detectChanges();
    component.checkbox_validation();
    expect(component.errorModalMessageRequest).toEqual("You cannot comment on multiple reports at once");
    expect(component.checkbox_validation).toHaveBeenCalled();

    component.checkbox_length = 1;
    fixture.detectChanges();
    component.checkbox_validation();
    expect(component.comment_text).toEqual('');
    expect(component.checkbox_validation).toHaveBeenCalled();
  }));

  it('should execute extract_comment method', fakeAsync(() => {
    component.comment_text = '';
    fixture.detectChanges();
    spyOn(component, 'extract_comment').and.callThrough(); //callThrough()
    component.extract_comment();
    expect(component.errorModalMessageRequest).toEqual("Enter some comment");
    const result = {
      'data': [{ message: 'message success' }]
    };
    component.user_name = 'xyz';
    component.reports = list['reports'];
    component.comment_text = 'hsfdd';
    component.comment_list = [];
    fixture.detectChanges();
    let djangoService = fixture.debugElement.injector.get(DjangoService);
    let mySpy = spyOn(djangoService, 'post_report_comments').and.
      returnValues(of(result));
    component.extract_comment();
    expect(component.comment_list).toEqual(result['data']);
    expect(component.comment_text).toEqual('');
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute NewReportOnSelectedCriteria method', fakeAsync(() => {
    component.checkbox_length = 0;
    fixture.detectChanges();
    spyOn(component, 'NewReportOnSelectedCriteria').and.callThrough(); //callThrough()
    component.NewReportOnSelectedCriteria();
    expect(component.errorModalMessageRequest).toEqual("Select at least one report");
    expect(component.NewReportOnSelectedCriteria).toHaveBeenCalled();

    component.checkbox_length = 2;
    fixture.detectChanges();
    component.NewReportOnSelectedCriteria();
    expect(component.errorModalMessageRequest).toEqual("Can select only one report for generating new report with same criteria");
    expect(component.NewReportOnSelectedCriteria).toHaveBeenCalled();
  }));

  it('should execute getRequestId method', fakeAsync(() => {
    let element = {
      ddm_rmp_post_report_id: 16,
      requestor: ''
    };
    const result = {
      frequency_data:
        [
          {
            select_frequency_values: 'cheking'
          }
        ]
    };
    let djangoService = fixture.debugElement.injector.get(DjangoService);
    let mySpy = spyOn(djangoService, 'get_report_description').and.
      returnValues(of(result));
    spyOn(component, 'getRequestId').and.callThrough(); //callThrough()            
    component.getRequestId(element);
    expect(component.getRequestId).toHaveBeenCalled();
    expect(component.summary).toEqual(result);
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);

    element.requestor = 'TBD';
    component.getRequestId(element);
    expect(component.errorModalMessageRequest).toEqual("Assign an owner first to create the report");
    expect(component.getRequestId).toHaveBeenCalled();
  }));

  it('should execute postLink method', fakeAsync(() => {
    const result = {
      report_id: [{
        report_list_id: 30
      }]
    };
    // spyOn(component, 'postLink').and.callThrough(); //callThrough() 
    let djangoService = fixture.debugElement.injector.get(DjangoService);
    let mySpy = spyOn(djangoService, 'get_report_description').and.
      returnValues(of(result));
    component.postLink(3);
  }));

  it('should execute getLink method', fakeAsync(() => {
    const result = {
      data: {
        url: 'https://xyz'
      }
    };
    let djangoService = fixture.debugElement.injector.get(DjangoService);
    spyOn(component, 'getLink').and.callThrough(); //callThrough()
    let mySpy = spyOn(djangoService, 'get_report_link').and.
      returnValues(of(result));
    component.getLink(3);
    tick();
    fixture.detectChanges();
    expect(component.link_response).toEqual(result);
    expect(component.getLink).toHaveBeenCalled();
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute addContact method', fakeAsync(() => {
    component.model = 'xyz';
    component.contacts = [];
    component.dl_flag = true;
    fixture.detectChanges();
    spyOn(component, 'addContact').and.callThrough(); //callThrough()
    component.addContact();
    expect(component.addContact).toHaveBeenCalled();
    expect(component.contacts).toEqual(['xyz']);
    expect(component.dl_flag).toEqual(false);
    expect(component.model).toEqual('');
  }));

  it('should execute updateDL method', fakeAsync(() => {
    const result = 'check';
    spyOn(component, 'updateDL').and.callThrough(); //callThrough()
    let djangoService = fixture.debugElement.injector.get(DjangoService);
    let mySpy = spyOn(djangoService, 'report_distribution_list').and.
      returnValues(of(result));
    component.updateDL();
    tick(1500);
    expect(component.updateDL).toHaveBeenCalled();
    expect(djangoService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));

  it('should execute filterData method', fakeAsync(() => {
    component.searchObj = '';
    component.statusFilter = [
      {
        status: 'Active'
      }
    ];
    fixture.detectChanges();
    spyOn(component, 'filterData').and.callThrough(); //callThrough()
    component.filterData();
    expect(component.filterData).toHaveBeenCalled();
    expect(component.filters.status).toEqual('Active');
    expect(component.searchObj).toEqual({ global: '', status: 'Active' });
  }));

});