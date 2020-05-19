import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { FormsModule } from '@angular/forms';
import { OrderByPipe } from 'angular-pipes';
import { FilterTablePipe } from '../filter-table.pipe';
import { MaterialModule } from 'src/app/material.module';
import { QuillModule } from 'ngx-quill';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthenticationService } from 'src/app/authentication.service';
import { DataProviderService } from '../data-provider.service';
import { ScheduleService } from 'src/app/schedule/schedule.service';
import { of } from 'rxjs';
import { DjangoService } from '../django.service';
import { NgLoaderService } from 'src/app/custom-directives/ng-loader/ng-loader.service';
import Utils from 'src/utils';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { Component, Input, EventEmitter } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgCustomSpinnerComponent } from 'src/app/custom-directives/ng-custom-spinner/ng-custom-spinner.component';
declare var $: any;

// Angular test cases written by Bharath and Deepak Urs G V
describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let reportData = {
    data: [{
      ddm_rmp_post_report_id: 1009,
      ddm_rmp_status_date: "21-Oct-2019",
      title: "test 2019-09-26 16:54:47.759",
      report_name: "1009forlink",
      report_list_id: 683,
      status: "Completed",
      favorites: true,
      description: null,
      frequency: "One Time",
      frequency_data: ["One Time"],
      undefinedFrequency: "Y",
      frequency_data_filtered: "One Time",
      changeFreqReq: false
    },
    {
      ddm_rmp_post_report_id: 1674,
      ddm_rmp_status_date: "01-Oct-2019",
      title: "title",
      report_name: "report_name",
      report_list_id: 390,
      status: "Completed",
      favorites: true,
      description: ["Checking again"],
      frequency: "On Demand Configurable",
      frequency_data: ["Other"],
      undefinedFrequency: "Y",
      frequency_data_filtered: "Other, Checking again",
      changeFreqReq: false
    }, {
      ddm_rmp_post_report_id: 488,
      ddm_rmp_status_date: "19-Sep-2019",
      title: "Request 488 Report",
      report_name: "Request 488 Report",
      report_list_id: 276,
      status: "Completed",
      favorites: true,
      description: null,
      frequency: "On Demand",
      frequency_data: ["Monday"
        , "Wednesday"
        , "Day after Sales Reporting month end close"
        , "15th of the month"
        , "Day after Sales Reporting month end close"
        , "15th of the month"
        , "Mid Month Variance"
        , "Month End Variance"
        , "Tuesday"
      ],
      MFrequency: "Y",
      WFrequency: "Y",
      undefinedFrequency: "Y",
      TFrequency: "Y",
      frequency_data_filtered: "Day after Sales Reporting month end close, 15th of the month, Day after Sales Reporting month end close, 15th of the month, Mid Month Variance, Month End Variance",
      changeFreqReq: true
    }]
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsComponent, OrderByPipe, NgCustomSpinnerComponent, FilterTablePipe, NgToasterComponent],
      imports: [FormsModule, MaterialModule, BrowserAnimationsModule,
        HttpClientTestingModule, RouterTestingModule, QuillModule.forRoot({})],
      providers: [DatePipe, Utils]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
  });


  // it('should create', () => {
  //   spyOn(component, "ngOnInit")
  //   expect(component).toBeTruthy();
  //   expect(component.editModes).toBeFalsy();
  //   let authService = TestBed.inject(AuthenticationService);
  //   let dataService = TestBed.inject(DataProviderService);
  //   let userData = { role: "admin" }
  //   let lookuptabledata = { data: { report_frequency: "report_frequency", desc_text: [{ ddm_rmp_desc_text_id: "22", description: "desc1" }, { ddm_rmp_desc_text_id: "23", description: "desc2" }] }, flag: "is_admin" }
  //   dataService.changelookUpTableData(lookuptabledata);
  //   authService.myMethod(userData, null, null);
  //   expect(component.user_role).toEqual('admin');
  //   expect(component.content).toEqual(lookuptabledata);
  //   expect(component.frequency_selections).toEqual(lookuptabledata.data.report_frequency);
  //   expect(component.original_contents).toEqual(lookuptabledata.data.desc_text[1].description)
  // });

  it("should return values", () => {
    expect(component.getValues({ a: "a", b: "b" })).toEqual(['a', 'b'])
  })

  it("should set semanticLayerId", () => {
    component.router.config = [{ path: "semantic", data: { semantic_id: "2" } }]
    component.getSemanticLayerID();
    expect(component.changeInFreq).toBeTruthy();
    expect(component.semanticLayerId).toEqual("2")
  })

  // it("should read scheduled from scheduled reports", () => {
  //   let scheduleScrvice = TestBed.inject(ScheduleService);
  //   let data = { data: { key: "value" } }
  //   spyOn(scheduleScrvice, "getScheduledReports").and.returnValue(of(data));
  //   component.getScheduledReports();
  //   expect(component.reportDataSource).toEqual(data.data)
  // })

  it("getReportList", () => {
    let djangoService = TestBed.get(DjangoService);
    spyOn(djangoService, "get_report_list").and.returnValue(of(reportData));
    component.getReportList();
    expect(component.reportContainer).toEqual(reportData.data)
  })

  it("should send data to django service", () => {
    let spinnerService = TestBed.inject(NgLoaderService);
    let djangoService = TestBed.inject(DjangoService);
    spyOn(spinnerService, "show")
    let spy = spyOn(spinnerService, "hide");
    spyOn(djangoService, "ddm_rmp_favourite").and.returnValue(of({ message: "success" }))
    let event = { target: { checked: true } }
    component.checked(1, event);
    expect(spy).toHaveBeenCalled();
  })

  it("should sort gased on parameter", () => {
    component.reports = { abc: false };
    component.sort("abc");
    expect(component.orderType).toEqual("reverse")
  })

  it('setOrder() it should toggle reverse and set order', () => {
    component.reverse = false;
    component.order = "order";
    component.setOrder("order");
    expect(component.order).toEqual("order");
    expect(component.reverse).toBeTruthy();
  })

  it("should replace ' g' in text", () => {
    component.enableUpdateData = true;
    component.textChanged({ text: "abcd g hhh" });
    expect(component.enableUpdateData).toBeFalsy
  })

  // it("should push data to to server when clicked on save button and update component properties", () => {
  //   let element = fixture.debugElement.nativeElement;
  //   let toastr = TestBed.inject(NgToasterComponent)
  //   let djangoService = TestBed.inject(DjangoService);
  //   let dataService = TestBed.inject(DataProviderService)

  //   spyOn(djangoService, "ddm_rmp_landing_page_desc_text_put").and.returnValue(of("abc"))
  //   spyOn(component, 'ngOnInit');
  //   let dataServiceSpy = spyOn(dataService, "changelookUpTableData");
  //   let toastrSpy = spyOn(toastr, "success")
  //   component.textChange = false;
  //   component.content = { data: { desc_text: [{ ddm_rmp_desc_text_id: 6, module_name: "What is DDM", description: "nan" }, { ddm_rmp_desc_text_id: 23, module_name: "Help_DDMAdmin", description: "<p>nan vvvv</p>" }] } }
  //   component.description_texts = { description: "", module_name: "", ddm_rmp_desc_text_id: 6 }
  //   component.namings = "namings"
  //   component.content_edits();
  //   expect(component.editModes).toBeFalsy();
  //   expect(component.readOnlyContentHelper).toBeTruthy();
  //   expect(component.description_texts.description).toEqual("namings");
  //   expect(component.content["data"].desc_text[1]).toEqual(component.description_texts);
  //   expect(dataServiceSpy).toHaveBeenCalled();
  //   expect(component.original_contents).toEqual("namings");
  //   expect(toastrSpy).toHaveBeenCalled();
  // })


  // it("edit_True() , Should set properties of the component", () => {
  //   component.original_contents = "original_contents";
  //   component.edit_True();
  //   expect(component.editModes).toBeFalsy();
  //   expect(component.readOnlyContentHelper).toBeTruthy();
  //   expect(component.namings).toBe("original_contents");
  // })

  // it("edit_Enable() , Should set properties of the component", () => {
  //   component.original_contents = "original_contents";
  //   component.editEnable();
  //   expect(component.editModes).toBeTruthy();
  //   expect(component.readOnlyContentHelper).toBeFalsy();
  //   expect(component.namings).toBe("original_contents");
  // })

  // it(" should select and set frequency of component ", () => {
  //   let data = [
  //     {
  //       ddm_rmp_lookup_report_frequency_id: 8,
  //       report_frequency_values: "On Demand",
  //       ddm_rmp_lookup_select_frequency_id: 37,
  //       select_frequency_values: "On Demand",
  //       select_frequency_description: false
  //     },
  //     {
  //       ddm_rmp_lookup_report_frequency_id: 9,
  //       report_frequency_values: "On Demand Configurable",
  //       ddm_rmp_lookup_select_frequency_id: 38,
  //       select_frequency_values: "On Demand Configurable",
  //       select_frequency_description: false
  //     },
  //     {
  //       ddm_rmp_lookup_report_frequency_id: 10,
  //       report_frequency_values: "One Time",
  //       ddm_rmp_lookup_select_frequency_id: 39,
  //       select_frequency_values: "One Time",
  //       select_frequency_description: false
  //     }
  //   ]
  //   let value = [
  //     [{
  //       select_frequency_values: "On Demand",
  //       ddm_rmp_lookup_select_frequency_id: 37,
  //       select_frequency_description: false
  //     }], [{
  //       select_frequency_values: "On Demand Configurable",
  //       ddm_rmp_lookup_select_frequency_id: 38,
  //       select_frequency_description: false,
  //     }], [{
  //       select_frequency_values: "One Time",
  //       ddm_rmp_lookup_select_frequency_id: 39,
  //       select_frequency_description: false
  //     }]]
  //   let key = ["On Demand", "On Demand Configurable", "One Time"];
  //   component.frequency_selections = data;
  //   component.FrequencySelection();
  //   expect(component.obj_keys_on_demand).toEqual(key);
  //   expect(component.freq_val_on_demand).toEqual(value)
  // })

  // it("should set frequency and update data", () => {
  //   let data = {
  //     ddm_rmp_lookup_select_frequency_id: "26",
  //     description: "dd", select_frequency: []
  //   }
  //   component.jsonfinal = data
  //   component.setFrequency();
  //   expect(component.jsonfinal).toEqual(data)
  // })
  // it("should set data post data", () => {
  //   component.changeFrequency = "change";
  //   let spy = spyOn(component, "setFrequency");
  //   let djangoService = TestBed.inject(DjangoService)
  //   let djangoSpy = spyOn(djangoService, "ddm_rmp_frequency_update").and.returnValue(of({}))
  //   component.updateFreq("1");

  //   let postData = {
  //     select_frequency: [],
  //     report_id: 1,
  //     status: "Recurring",
  //     frequency: "change"
  //   }
  //   expect(djangoSpy).toHaveBeenCalled();
  //   expect(component.jsonfinal.select_frequency).toEqual([])
  //   expect(component.jsonfinal['report_id']).toEqual("")
  //   expect(component.jsonfinal['status']).toEqual("")
  //   expect(component.jsonfinal['frequency']).toEqual("")
  //   expect(component.changeInFreq).toEqual(true)
  // })

  // it("Should clear the filtered data", () => {
  //   component.clearFreq();
  //   expect(component.jsonfinal.select_frequency).toEqual([])
  //   expect(component.jsonfinal['report_id']).toEqual("")
  //   expect(component.jsonfinal['status']).toEqual("")
  //   expect(component.jsonfinal['frequency']).toEqual("")
  //   expect(component.changeInFreq).toEqual(true)
  // })
  // it("should change frequency and call get_report_description()", () => {
  //   let requestId = ["1"];
  //   let title = "title";
  //   let date = "date";
  //   let frequency = "daily";
  //   let serverData = { frequency_data: [1, 2, 3] }
  //   let djangoService = TestBed.inject(DjangoService);
  //   spyOn(djangoService, "get_report_description").and.returnValue(of(serverData));
  //   spyOn(component, "showChangeFrequencyModal")
  //   component.changeFreq(requestId, title, date, frequency);
  //   expect(component.changeFrequency).toEqual(frequency);
  //   expect(component.changeFreqId).toEqual(requestId);
  //   expect(component.changeFreqTitle).toEqual(title);
  //   expect(component.changeFreqDate).toEqual(date);
  //   expect(component.frequencyLength).toEqual(serverData.frequency_data)
  // })

  // it("should set a few properties and call setFrequency()", () => {
  //   let val = { ddm_rmp_lookup_select_frequency_id: 1 };
  //   let event = { target: { checked: true } }
  //   let frequencyData = { "ddm_rmp_lookup_select_frequency_id": val.ddm_rmp_lookup_select_frequency_id, "description": "" }
  //   component.jsonfinal = { select_frequency: [] }
  //   let spy = spyOn(component, "setFrequency")
  //   component.frequencyLength = [{ ddm_rmp_lookup_select_frequency_id: 1 }]
  //   component.frequencySelected(val, event);
  //   expect(component.frequencyData).toEqual(frequencyData);
  //   expect(component.jsonfinal.select_frequency).toEqual([frequencyData]);
  //   expect(component.changeInFreq).toBeTruthy();
  //   expect(spy).toHaveBeenCalled();
  // })

  // it("sholud parse the filter property", () => {
  //   component.filters = {
  //     global: "string",
  //     ddm_rmp_post_report_id: "string",
  //     ddm_rmp_status_date: "string",
  //     report_name: "string",
  //     title: "string",
  //     frequency: "string",
  //     frequency_data_filtered: "string"
  //   }
  //   component.filterData();
  //   expect(typeof (component.filters)).toEqual("object")
  // })



  // it("should get data from get_report_description and assegin values to a few properties", () => {
  //   let djangoService = TestBed.inject(DjangoService)
  //   let serverData = {
  //     market_data: [{ market: "a" }, { market: "b" }],
  //     country_region_data: [{ region_desc: "a" }, { region_desc: "b" }],
  //     region_zone_data: [{ zone_desc: "a" }, { zone_desc: "b" }],
  //     zone_area_data: [{ area_desc: "a" }, { area_desc: "b" }],
  //     lma_data: [{ lmg_desc: "a" }, { lmg_desc: "b" }],
  //     gmma_data: [{ gmma_desc: "a" }, { gmma_desc: "b" }],
  //     frequency_data: [{ select_frequency_values: "a", description: "a" }, { select_frequency_values: "b", description: "b" }],
  //     division_dropdown: [{ division_desc: "a" }, { division_desc: "b" }],
  //     special_identifier_data: [{ spl_desc: "a" }, { spl_desc: "b" }],
  //     ost_data: {
  //       allocation_group: [{ allocation_group: "a" }, { allocation_group: "b" }],
  //       model_year: [{ model_year: "a" }, { model_year: "b" }],
  //       vehicle_line: [{ vehicle_line_brand: "a" }, { vehicle_line_brand: "b" }],
  //       merchandizing_model: [{ merchandising_model: "a" }, { merchandising_model: "b" }],
  //       order_event: [{ order_event: "a" }, { order_event: "b" }],
  //       order_type: [{ order_type: "a" }, { order_type: "b" }],
  //       checkbox_data: [{ description_text: "a", checkbox_description: "a" }, { description_text: "b", checkbox_description: "b" }],
  //     },
  //     da_data: {
  //       allocation_grp: [{ allocation_group: "a" }, { allocation_group: "b" }],
  //       model_year: [{ model_year: "a" }, { model_year: "b" }],
  //       concensus_data: [{ cd_values: "a" }, { cd_values: "b" }],
  //     },
  //     bac_data: [{ bac_desc: ["a", "b"] }],
  //     fan_data: [{ fan_data: ["a", "b"] }],
  //     user_data: [{ alternate_number: 222 }]
  //   }
  //   spyOn(djangoService, "get_report_description").and.returnValue(of(serverData));
  //   component.query_criteria_report(1);
  //   expect(component.market_description).toEqual("a, b")
  //   expect(component.region_description).toEqual("a, b")
  //   expect(component.zone_description).toEqual("a, b")
  //   expect(component.area_description).toEqual("a, b")
  //   expect(component.lma_description).toEqual("a, b")
  //   expect(component.gmma_description).toEqual("a, b")
  //   expect(component.report_frequency).toEqual("a-a, b-b")
  //   expect(component.division_dropdown).toEqual("a, b")
  //   expect(component.special_identifier).toEqual("a, b")
  //   expect(component.allocation_group).toEqual("a, b")
  //   expect(component.model_year).toEqual("a, b")

  //   expect(component.vehicle_line_brand).toEqual("a, b")
  //   expect(component.merchandising_model).toEqual("a, b")
  //   expect(component.order_event).toEqual("a, b")
  //   expect(component.order_type).toEqual("a, b")
  //   expect(component.checkbox_data).toEqual("a-a, b-b")
  //   expect(component.allocation_group).toEqual("a, b")
  //   expect(component.model_year).toEqual("a, b")
  //   expect(component.concensus_data).toEqual("a, b")
  //   expect(component.bac_description).toEqual("a, b")
  //   expect(component.fan_desc).toEqual("a, b")
  //   expect(component.text_notification).toEqual(222)
  // })

  it('should check the setSelectedFrequency() methods value set process with OT', () => {
    let testChoice = 'One Time'

    component.setSelectedFrequency(testChoice);

    expect(component.selectedNewFrequency).toEqual(testChoice);
    expect(component.changeInFreq).toEqual(false);
    expect(component.isRecurringFrequencyHidden).toEqual(true);
  })

  it('should check the setSelectedFrequency() methods value set process with OD', () => {
    let testChoice = 'On Demand'

    component.setSelectedFrequency(testChoice);

    expect(component.selectedNewFrequency).toEqual(testChoice);
    expect(component.changeInFreq).toEqual(false);
    expect(component.isRecurringFrequencyHidden).toEqual(false);
  })

  it("should check the jsonFinal['select_frequency'] being set with One Time", () => {
    let testJsonFinal = { select_frequency: [], frequency: 'One Time' };
    let targetJsonFinalSelectFrequency = [{ "ddm_rmp_lookup_select_frequency_id": 39, "description": "" }]

    component.jsonfinal = testJsonFinal;
    component.setFrequency();

    expect(component.jsonfinal.select_frequency).toEqual(targetJsonFinalSelectFrequency);
  })

  it("should check the jsonFinal['select_frequency'] being set with On Demand Configurable", () => {
    let testJsonFinal = { select_frequency: [], frequency: 'On Demand Configurable' };
    let targetJsonFinalSelectFrequency = [{ "ddm_rmp_lookup_select_frequency_id": 38, "description": "" }]

    component.jsonfinal = testJsonFinal;
    component.setFrequency();

    expect(component.jsonfinal.select_frequency).toEqual(targetJsonFinalSelectFrequency);
  })

  it('should check isRecurringFrequencyHidden values inside the API call of changeFreq()', () => {
    let testRequestId = 416;
    spyOn(component, "ngOnInit")
    spyOn(Utils, 'hideSpinner')
    spyOn(Utils, 'showSpinner')

    // One Time frequency case
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(DjangoService);
    fixture.detectChanges();
    service.get_report_description(testRequestId).subscribe(res => {
      res['frequency_of_report'] = 'One Time'
      component.selectedNewFrequency = res['frequency_of_report']

      expect(component.isRecurringFrequencyHidden).toEqual(true)
    })
  });


});