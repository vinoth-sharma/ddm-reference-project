import { async, 
        ComponentFixture,
        TestBed, 
        inject, 
        fakeAsync, 
        tick, 
        getTestBed,
        discardPeriodicTasks 
      } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { AngularMultiSelectModule } from "angular4-multiselect-dropdown/angular4-multiselect-dropdown";
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MetricsComponent } from './metrics.component';
import { OrderByPipe } from '../../custom-directives/filters/order-by.pipe';
import { FilterTablePipe } from '../filter-table.pipe';
import { QuillModule } from "ngx-quill";
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule,HttpErrorResponse,HttpClient } from '@angular/common/http';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { MatSnackBar } from "@angular/material/snack-bar";
import { OverlayModule } from "@angular/cdk/overlay";
import { DjangoService } from 'src/app/rmp/django.service';
import { of } from 'rxjs';

describe('MetricsComponent', () => {
  let component: MetricsComponent;
  let fixture: ComponentFixture<MetricsComponent>;
  const role = {
                'email': "Sibasish.Mohanty@mu-sigma.com",
                'role': "Admin",
                'user_id': "LYC59J",
                'role_id': 1,
                'first_name': "Sibasish",
                'last_name': "Mohanty"
              };
  const currentlook = {
    'message': "success",
    'data': {
      'merchandising_data':[
        {
          'ddm_rmp_lookup_dropdown_merchandising_model_id': 1,
          'merchandising_model': "CC15706",
          'ddm_rmp_lookup_dropdown_allocation_group': 1,
          'ddm_rmp_lookup_dropdown_vehicle_line_brand': 115,
          'ddm_rmp_lookup_division': 13
        },
        {
          'ddm_rmp_lookup_dropdown_merchandising_model_id': 2,
          'merchandising_model': "CC15706",
          'ddm_rmp_lookup_dropdown_allocation_group': 2,
          'ddm_rmp_lookup_dropdown_vehicle_line_brand': 115,
          'ddm_rmp_lookup_division': 13
        }
      ],
      'user': 2,
      'desc_text': [
        {
          'description': "<p>TESTING</p><p>Hari Gautam 2- PT Lead</p>",
          'module_name': "DDM Team",
          'ddm_rmp_desc_text_id': 24
        },
        {
          'description': "<p>TESTING</p><p>Hari Gautam 3- PT Lead</p>",
          'module_name': "DDM Team",
          'ddm_rmp_desc_text_id': 26
        }
      ],
      'cycle_data_da': [
        {
          'ddm_rmp_lookup_cycle_id': 1,
          'cycle_desc': "Cycle1"
        },
        {
          'ddm_rmp_lookup_cycle_id': 2,
          'cycle_desc': "Cycle2"
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
          'allocation_group': "SPARK",
          'ddm_rmp_lookup_dropdown_vehicle_line_brand': 113,
          'ddm_rmp_lookup_division': 13
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
      'desc_text_admin_documents': [
        {
          'admin_flag': false,
          'url': "https://html.com",
          'title': "sdaskldjaskl",
          'ddm_rmp_desc_text_admin_documents_id': 1
        },
        {
          'admin_flag': false,
          'url': "https://ddm1.apps.pcfepg2wi.gm.com/#/user/main/reference-documents",
          'title': "newref link 19Oct",
          'ddm_rmp_desc_text_admin_documents_id': 3
        }
      ],
      'allocation_grp_da':[
        {
          'ddm_rmp_lookup_dropdown_allocation_group_da_id': 1,
          'allocation_group': "TAHOE",
          'ddm_rmp_lookup_division': 13
        },
        {
          'ddm_rmp_lookup_dropdown_allocation_group_da_id': 2,
          'allocation_group': "SPARK",
          'ddm_rmp_lookup_division': 13
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
          'users_table_id': 9,
          'user_id': "QZ9YH2",
          'first_name': "Hari N",
          'last_name': "Gautam",
          'dl_list': null,
          'sl_name': ["Test_SL_001"],
          'privileges_name': ["Create/Edit query"],
          'changed_by_user_id': "",
          'email': "hari.gautam@gm.com",
          'contact_no': "+1 928-380-1277",
          'disclaimer_ack': "2019-08-21T03:35:05.497000-04:00",
          'saved_setting': "2019-09-24T16:48:56.890000-04:00",
          'designation': "Performance Engineer",
          'office_address': "Austin, Texas",
          'department': "Information Technology",
          'carrier': "c-spire",
          'region': "North America",
          'telephone': "+1 512-840-2303",
          'alternate_number': "148-3224143",
          'role': 1
        }
      ],
      'vehicle_data':[
        {
          'ddm_rmp_lookup_dropdown_vehicle_line_brand_id': 1,
          'vehicle_line_brand': "Cascada",
          'ddm_rmp_lookup_division': 1
        },
        {
          'ddm_rmp_lookup_dropdown_vehicle_line_brand_id': 2,
          'vehicle_line_brand': "Enclave",
          'ddm_rmp_lookup_division': 1
        }
      ],
      'model_year':[
        {
          'ddm_rmp_lookup_dropdown_model_year_id': 1,
          'model_year': "2017"
        },
        {
          'ddm_rmp_lookup_dropdown_model_year_id': 2,
          'model_year': "2018"
        }
      ],
      'order_type':[
        {
          'ddm_rmp_lookup_dropdown_order_type_id': 1,
          'order_type': "T RE"
        },
        {
          'ddm_rmp_lookup_dropdown_order_type_id': 2,
          'order_type': "F DR"
        }
      ],
      'concensus_data_da':[
        {
          'ddm_rmp_lookup_da_consensus_data_id': 4,
          'cd_values': "Monthly Demand",
          'tooltip': null
        },
        {
          'ddm_rmp_lookup_da_consensus_data_id': 3,
          'cd_values': "Final Allocation",
          'tooltip': "Final volume earned by a dealer after Variance Resolution is ↵complete(resolves +/- differences between Estimated Shipments and Production Consensus across the dealer network)"
        }
      ],
      'checkbox_data':[
                        {
                          'checkbox_desc': "Commonly Requested Fields Available for Display",
                          'description': false,
                          'ddm_rmp_ots_checkbox_group_id': 1,
                          'field_values': "Order Number",
                          'tooltip': null,
                          'ddm_rmp_lookup_ots_checkbox_values_id': 1
                        },
                        {
                          'checkbox_desc': "Commonly Requested Fields Available for Display",
                          'description': false,
                          'ddm_rmp_ots_checkbox_group_id': 1,
                          'field_values': "Vehicle Information Number (VIN)",
                          'tooltip': null,
                          'ddm_rmp_lookup_ots_checkbox_values_id': 2
                        }
        ],
        'report_frequency':[
          {
            'report_frequency_values': "Daily/Weekly (Monday to Friday) only",
            'ddm_rmp_lookup_select_frequency_id': 18,
            'select_frequency_values': "Monday",
            'select_frequency_description': false,
            'ddm_rmp_lookup_report_frequency_id': 1
          },
          {
            'report_frequency_values': "Daily/Weekly (Monday to Friday) only",
            'ddm_rmp_lookup_select_frequency_id': 19,
            'select_frequency_values': "Tuesday",
            'select_frequency_description': false,
            'ddm_rmp_lookup_report_frequency_id': 1
          }
        ],
        'yesNo_frequency':[
          {
            'ddm_rmp_lookup_yes_no_frequency_id': 1,
            'frequency_desc': "Yes"
          },
          {
            'ddm_rmp_lookup_yes_no_frequency_id': 2,
            'frequency_desc': "No"
          }
        ],
        'special_identifiers':[
          {
            'ddm_rmp_lookup_special_identifiers': 1,
            'spl_desc': "Business Elite (US and Canada)"
          },
          {
            'ddm_rmp_lookup_special_identifiers': 2,
            'spl_desc': "Primary Fleet Account Number (FAN)"
          }
        ],
        'type_data':[
          {
            'ddm_rmp_lookup_ots_type_data_id': 1,
          'type_data_desc': "Retail Only"
          },
          {
            'ddm_rmp_lookup_ots_type_data_id': 2,
            'type_data_desc': "Non-Retail (Includes Fleet)"
          }
          
        ],
        'admin_note':[
          {
            'ddm_rmp_admin_notes_id': 399,
            'notes_content': "second important. ahsjkhauyw zjhkfhjkz bxv v cvmnv",
            'notes_start_date': null,
            'notes_end_date': "2020-04-03T03:59:00-04:00",
            'admin_flag': false,
            'admin_note_status': true
          }
        ],
        'display_summary':[
          {
            'ddm_rmp_lookup_display_summary_id': 1,
            'ds_desc': "Display"
          },
          {
            'ddm_rmp_lookup_display_summary_id': 2,
            'ds_desc': "Summary"
          }
        ],
        'order_event':[
          {
            'ddm_rmp_lookup_dropdown_order_event_id': 1,
            'order_event': "1000  Order Request Accepted by GM(Non-Retail)"
          },
          {
            'ddm_rmp_lookup_dropdown_order_event_id': 2,
            'order_event': "1100  Preliminary Order Added(Retail)"
          }
        ],
        'desc_text_reference_documents':[
          {
            'title': "Test URL 18Sep19",
            'url': "https://ddm-dev-temp.apps.pcfepg2wi.gm.com/#/user/main/reference",
            'ddm_rmp_desc_text_reference_documents_id': 22,
            'admin_flag': false
          },
          {
            'title': "ckjckjcxnc,xnkddljhfhjkcccc",
            'url': "Yahoo.com",
            'ddm_rmp_desc_text_reference_documents_id': 25,
            'admin_flag': false
          }
        ]  
    }
  };
  const adminList = {
                    'admin_list':[
                                    {
                                      'first_name': "Kenneth",
                                      'role_name': "Admin",
                                      'users_table_id': 46,
                                      'user_id': "QZZ2PZ",
                                      'last_name': "Griessel"
                                    },
                                    {
                                      'first_name': "Hari N",
                                      'role_name': "Admin",
                                      'users_table_id': 9,
                                      'user_id': "QZ9YH2",
                                      'last_name': "Gautam"
                                    }
                                  ]
                };

  const get_report_matrix = {
    'message': "success",
    'data':[
            {
              created_on: "04-Jan-2020",
              ddm_rmp_status_date: "04-Jan-2020",
              status_date: "2020-01-04T06:13:01.377000Z",
              freq: "One Time",
              id: 3063,
              organization: "Global Business Solutions",
              requestor: "Sibasish Mohanty",
              status: "Completed",
              ddm_rmp_post_report_id: 3063,
              description: [""],
              recipients_count: null,
              assigned_to: "Sibasish Mohanty",
              frequency_data: ["One Time"],
              report_count: 0,
              undefinedFrequency: "Y",
              frequency_data_filtered: ["One Time"]
            },
            {
              created_on: "27-Sep-2019",
              ddm_rmp_status_date: "22-Oct-2019",
              status_date: "2019-10-22T14:26:14.975000Z",
              freq: "Recurring",
              id: 1069,
              organization: "Information Technology",
              requestor: "Dejan Ahmetovic",
              status: "Completed",
              ddm_rmp_post_report_id: 1069,
              description: ["", "", "", "", "", ""],
              recipients_count: null,
              assigned_to: "Nicholas-0 W Theodoracatos-0",
              frequency_data: ["Month End Variance", "Monday", "Wednesday", "15th of the month", "Friday", "15th of the month"],
              report_count: 0,
              undefinedFrequency: "Y",
              MFrequency: "Y",
              WFrequency: "Y",
              FFrequency: "Y",
              frequency_data_filtered: ["Month End Variance", "15th of the month", "15th of the month"]
            }
    ]

  };
  const original_contents = "<p>TESTING</p><p>Hari Gautam 2- PT Lead</p>";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule, MatFormFieldModule,
               MatInputModule, NgbDatepickerModule, NgbTimepickerModule,
               AngularMultiSelectModule, QuillModule.forRoot(),
               MatProgressSpinnerModule, HttpClientTestingModule, OverlayModule],
      declarations: [ MetricsComponent, OrderByPipe, FilterTablePipe, NgToasterComponent],
      providers:[DatePipe, MatSnackBar]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get role details from authservice', fakeAsync(() =>{
    component.auth_service.myMethod(role, '', '');
    component.dataProvider.changelookUpTableData(currentlook);
    tick();
    fixture.detectChanges();
    component.auth_service.myMethod$.subscribe(res => expect(res).toEqual(role));
    component.dataProvider.currentlookUpTableData.subscribe(res =>{
      expect(res).toEqual(currentlook);
      expect(component.content).toEqual(res);
    });
  }));

  it('should execute notify method', fakeAsync(()=> {
    component.enable_edits = false;
    component.editModes = false;
    fixture.detectChanges();
    component.notify();
    tick();
    fixture.detectChanges();
    expect(component.enable_edits).toBe(true);
    expect(component.editModes).toBe(true);
  }));

  it('should execute ngOnInit method', fakeAsync(async() => {
    const tmpData = [
                    {
                      'full_name': "Kenneth Griessel",
                      'users_table_id': 46,
                      'role_id': 1
                    },
                    {
                      'full_name': "Hari N Gautam",
                      'users_table_id': 9,
                      'role_id': 1
                    },
                    {
                      'full_name': "Non-Admin",
                      'users_table_id': "",
                      'role_id': 2
                    }
                  ];
    let service = fixture.debugElement.injector.get(DjangoService);
    let mySpy = spyOn(service, 'getAllAdmins').and.returnValues(of(adminList));
    let mySpy1 = spyOn(service, 'get_report_matrix').and.returnValues(of(get_report_matrix));
    spyOn(component, 'ngOnInit').and.callThrough(); //callThrough()
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    tick(500);
    fixture.detectChanges();
    expect(component.admin_dropdown).toEqual(tmpData);
    expect(component.reports).toEqual(get_report_matrix['data']);
    expect(service).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy1).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
    expect(mySpy1).toHaveBeenCalledTimes(1);
  }));

  it('should execute filterData method', fakeAsync(()=> {
    component.statusFilter = [];
    let res = {
                ddm_rmp_post_report_id: "",
                ddm_rmp_status_date: "",
                created_on: "",
                status: "",
                assigned_to: "",
                requestor: "",
                organization: "",
                recipients_count: "",
                report_count: "",
                freq: "",
                description: ""
              };
    spyOn(component, 'filterData').and.callThrough(); //callThrough()          
    fixture.detectChanges();          
    component.filterData();
    tick(1500);
    fixture.detectChanges();
    expect(component.filterData).toHaveBeenCalled();
    expect(component.searchObj).toEqual(res);          
  }));

  it('should execute textChanged method', fakeAsync(() => {
      const event = {
        'text': ''
      };
      component.textChange = false;
      spyOn(component, 'textChanged').and.callThrough(); //callThrough() 
      fixture.detectChanges();
      component.textChanged(event);
      tick(1500);
      fixture.detectChanges();
      expect(component.textChange).toBe(true);
      expect(component.enableUpdateData).toBe(false);
      expect(component.textChanged).toHaveBeenCalled();
  }));

  it('should execute edit_True method', fakeAsync(() => {
    spyOn(component, 'edit_True').and.callThrough(); //callThrough()
    component.editModes = true;
    component.readOnlyContentHelper = false;
    component.original_contents = "<p>TESTING</p><p>Hari Gautam 2- PT Lead</p>";
    component.edit_True();
    expect(component.edit_True).toHaveBeenCalled();
    tick(500);
    fixture.detectChanges();
    expect(component.editModes).toBe(false);
    expect(component.readOnlyContentHelper).toBe(true);
    expect(component.namings).toBe(original_contents);
  }));

  it('should execute editEnable method', fakeAsync(()=>{
    spyOn(component, 'editEnable').and.callThrough(); //callThrough()
    component.editModes = false;
    component.readOnlyContentHelper = true;
    component.original_contents = "<p>TESTING</p><p>Hari Gautam 2- PT Lead</p>";
    component.editEnable();
    expect(component.editEnable).toHaveBeenCalled();
    tick(500);
    fixture.detectChanges();
    expect(component.editModes).toBe(true);
    expect(component.readOnlyContentHelper).toBe(false);
    expect(component.namings).toBe(original_contents);

  }));

  it('should execute sort method', fakeAsync(() => {
    component.reports =  [
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
    ];
    fixture.detectChanges();
    component.sort('assigned_to');
    fixture.detectChanges();
    expect(component.orderType).toEqual('reverse');
  }));

  it('should execute xlsxJson method', fakeAsync(() => {
    spyOn(component, 'xlsxJson').and.callThrough(); //callThrough()
    component.xlsxJson();

  }));

  it('should execute getMetricsData method', fakeAsync(() => {
    let service = fixture.debugElement.injector.get(DjangoService);
    component.selectedItems = [
      {
        'full_name': "Kenneth Griessel",
        'users_table_id': 46,
        'role_id': 1
      }
    ];
    component.metrics_start_date = {
                                      'year': 2020,
                                      'month': 3,
                                      'day': 7
                                    };
    component.metrics_end_date = {
                                    'year': 2020,
                                    'month': 3,
                                    'day': 27
                                  };
    component.obj = { 
                      'start_date': {
                                      'full_name': "Kenneth Griessel",
                                      'users_table_id': 46,
                                      'role_id': 1
                                    }, 
                      'end_date': {
                                    'year': 2020,
                                    'month': 3,
                                    'day': 7
                                  }, 
                      'users_table_id': [46], 
                      'role_id':1 
                  };
     fixture.detectChanges();             
    let mySpy = spyOn(service, 'metrics_aggregate').and.returnValues(of(component.obj));              
    spyOn(component, 'ngOnInit').and.callThrough(); //callThrough()              

  }));

});
