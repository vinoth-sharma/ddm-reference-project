import { Component, OnInit, SimpleChanges, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AdditionalReqModalComponent } from '../additional-req-modal/additional-req-modal.component';
import { AuthenticationService } from 'src/app/authentication.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { SubmitRequestService } from "../submit-request.service";
import { DataProviderService } from '../../data-provider.service';
import { Subscription } from 'rxjs';
import { ReviewReqModalComponent } from '../review-req-modal/review-req-modal.component';

const moment = _moment;
const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-vehicle-event-status',
  templateUrl: './vehicle-event-status.component.html',
  styleUrls: ['./vehicle-event-status.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class VehicleEventStatusComponent implements OnInit {

  filtered_MD = {
    model_years: [],
    divisions: [],
    vehicle: [],
    allocation: [],
    merchandising: [],
    distribution_entity: [],
    order_type: []
  }
  selected = {
    model_years: [],
    divisions: [],
    vehicle: [],
    allocation: [],
    merchandising: [],
    distribution_entity: [],
    order_type: []
  }
  public distibutionEntityRadio = "Summary"
  public orderTypeRadio = "Summary"

  public checkBxMD1 = {
    commonly_req_field: [],
    opt_content_avail: [],
    order_event_avail_ds: []
  }
  public selected_checkbox = {
    commonly_req_field: [],
    opt_content_avail: [],
    order_event_avail_ds: []
  }
  public checkboxMD2 = {
    sales_avail: [],
    days_supply1: [],
    days_supply2: [],
    days_supply3: [],
    days_supply4: [],
    penetration: [],
    time_to_turn: [],
    turn_rate: []
  }
  public fromDateDOSP = new FormControl();
  public toDateDOSP = new FormControl();
  public minDateDosp: Date = null;
  public minOrderEventDate: Date = null;

  public keyDataEle: any = {
    masterData: [],
    selected: [],
    others: {
      ddm_rmp_lookup_dropdown_order_event_id: 0,
      order_event: "",
      checked: false
    },
    orderEvtFromDate: new FormControl(),
    orderEvtToDate: new FormControl()
  }

  l_lookupTableMD: any = {};
  l_selectedReqData: any = {};

  public req_body = {
    dosp_start_date: null,
    dosp_end_date: null,
    checkbox_data: [],
    division_selected: { dropdown: [], radio_button: "Display" },
    model_year: { dropdown: [], radio_button: "Display" },
    vehicle_line: { dropdown: [], radio_button: "Display" },
    allocation_group: { dropdown: [], radio_button: "Display" },
    merchandizing_model: { dropdown: [], radio_button: "Display" },
    order_event: { dropdown: [] },
    distribution_data: [],
    order_type: { dropdown: [], radio_button: "" },
    data_date_range: { StartDate: null, EndDate: null },
    report_detail: {
      title: "",
      status: "Pending",
      created_on: new Date(),
      assigned_to: "",
      additional_req: "",
      report_type: "ots",
      status_date: null,
      on_behalf_of: "",
      link_to_results: "",
      link_title: "",
      requestor: "",
      query_criteria: "",
      is_vin_level_report: null,
      is_summary_report: null,
      business_req: ""
    },
    report_id: null,
    other_desc: ""
  }
  public user_name = "";
  public user_role = "";
  display_message = "Create Request to proceed with vehicle event status";
  messageClass = "red";

  subjectSubscription: Subscription;

  constructor(public matDialog: MatDialog,
    private dataProvider: DataProviderService,
    public ngToaster: NgToasterComponent,
    public submitService: SubmitRequestService,
    public auth_service: AuthenticationService,
    public ngZone: NgZone,
    public changeDetRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"];
        this.req_body.report_detail.requestor = this.user_name;
        this.user_role = role["role"]
      }
    })
    this.dataProvider.currentlookUpTableData.subscribe((tableDate: any) => {
      this.l_lookupTableMD = tableDate ? JSON.parse(JSON.stringify(tableDate.data)) : {};
      this.refillMasterDatatoOptions();
    })

    this.subjectSubscription = this.submitService.requestStatusEmitter.subscribe((res: any) => {
      if (res.type === "srw") {
        this.l_selectedReqData = res.data;
        this.refillDivisionsMD(res.data.division_dropdown);
        this.fillReportDetails(res.data)
        this.refillSelectedRequestData(res.data);
        this.messageClass = "red";

        let l_status = res.data.status;
        let l_reportId = res.data.ddm_rmp_post_report_id;
        let l_reqType = res.data.report_type;
        //ots is the code for VES page
        this.display_message = `Request #${l_reportId} (Request type - ${l_reqType === "ots" ? "Vehicle event status" : "Dealer Allocation"})`;

        if (res.type === "srw" && (l_status === "Cancelled" || l_status === "Completed")) {
          this.req_body.report_detail.status = l_status;
          if (l_status === "Cancelled")
            this.req_body.report_id = null;
          else if (l_status === "Completed" && !res.data.frequency_data.some(freq => freq.ddm_rmp_lookup_select_frequency_id === 39))
            this.req_body.report_id = null;
          else {
            this.messageClass = "green";
            this.req_body.report_id = l_reportId;
          }
        }
        else if (res.type === "srw" && l_status === "Incomplete") {
          this.messageClass = "red";
          this.req_body.report_id = l_reportId;
          this.display_message = `Request #${l_reportId} ( ${l_status} )`;
          this.req_body.report_detail.status = "Pending";
        }
        else if (res.type === "srw" && l_status != "Incomplete") {
          this.messageClass = "green";
          this.req_body.report_id = l_reportId;
          this.req_body.report_detail.status = l_status;
        }
      }
    })

    this.submitService.updateLoadingStatus({ status: true, comp: "ves" })
  }

  public refillMasterDatatoOptions() {
    this.filtered_MD.model_years = this.l_lookupTableMD.model_year;
    this.filtered_MD.distribution_entity = this.l_lookupTableMD.type_data;
    this.filtered_MD.order_type = this.l_lookupTableMD.order_type;
    this.keyDataEle.masterData = this.l_lookupTableMD.order_event;
    //refilling checkbox master data
    this.resetCheckboxData();

    this.l_lookupTableMD.checkbox_data.sort(sortCheckbox).forEach(l_checkbox => {
      if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 1)
        this.checkBxMD1.commonly_req_field.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 2)
        this.checkBxMD1.opt_content_avail.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 3)
        this.checkBxMD1.order_event_avail_ds.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 4) {
        if ([18, 19].includes(l_checkbox.ddm_rmp_lookup_ots_checkbox_values_id))
          this.checkboxMD2.days_supply1.push(l_checkbox);
        else if ([16, 17].includes(l_checkbox.ddm_rmp_lookup_ots_checkbox_values_id))
          this.checkboxMD2.days_supply2.push(l_checkbox);
        else if ([20, 21].includes(l_checkbox.ddm_rmp_lookup_ots_checkbox_values_id))
          this.checkboxMD2.days_supply3.push(l_checkbox);
        else if ([56, 57].includes(l_checkbox.ddm_rmp_lookup_ots_checkbox_values_id))
          this.checkboxMD2.days_supply4.push(l_checkbox);
      }
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 5)
        this.checkboxMD2.sales_avail.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 7)
        this.checkboxMD2.penetration.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 8)
        this.checkboxMD2.time_to_turn.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 9)
        this.checkboxMD2.turn_rate.push(l_checkbox)
    });

    let daysSupplyCB = ds => {
      if (ds.field_values.includes(30)) {
        ds['label'] = "30 days"
        ds['checked'] = false;
      }
      else {
        ds['checked'] = false;
        ds['label'] = "90 days"
      }
    }

    this.checkboxMD2.days_supply1.forEach(daysSupplyCB);
    this.checkboxMD2.days_supply2.forEach(daysSupplyCB);
    this.checkboxMD2.days_supply3.forEach(daysSupplyCB);
    this.checkboxMD2.days_supply4.forEach(daysSupplyCB);
    this.checkboxMD2.turn_rate.forEach(daysSupplyCB);
  }

  public refillDivisionsMD(divisions) {
    this.selected.divisions = divisions;
    this.filtered_MD.divisions = divisions;
    this.filtered_MD.vehicle = this.l_lookupTableMD.vehicle_data;
    this.multiSelectChange('division');
  }

  public multiSelectChange(type) {
    switch (type) {
      case 'division':
        this.divisionDependencies();
        break;
      case 'vehicle':
        this.vehicleDependencies();
        break;
      case 'allocation':
        this.allocationDependencies();
        break;
      default:
        break;
    }
  }

  public divisionDependencies() {
    let l_division_ids = this.selected.divisions.map(ele => ele[this.division_settings.primary_key]);
    let divisionCBFunc = function (ele) {
      if (l_division_ids.includes(ele.ddm_rmp_lookup_division)) {
        return ele
      }
    }
    this.filtered_MD.vehicle = this.l_lookupTableMD.vehicle_data.filter(divisionCBFunc);
    this.selected.vehicle = this.selected.vehicle.filter(divisionCBFunc);
    this.vehicleDependencies();
  }

  public vehicleDependencies() {
    let l_vehicle_ids = this.selected.vehicle.map(ele => ele.ddm_rmp_lookup_dropdown_vehicle_line_brand_id);
    let vehicleCBFunc = function (ele) {
      if (l_vehicle_ids.includes(ele.ddm_rmp_lookup_dropdown_vehicle_line_brand)) {
        return ele
      }
    }
    this.filtered_MD.allocation = this.l_lookupTableMD.allocation_grp.filter(vehicleCBFunc);
    this.selected.allocation = this.l_lookupTableMD.allocation_grp.filter(vehicleCBFunc);
    this.allocationDependencies();
  }

  public allocationDependencies() {
    let l_allocation_ids = this.selected.allocation.map(ele => ele.ddm_rmp_lookup_dropdown_allocation_group_id);
    let allocationCBFunc = function (ele) {
      if (l_allocation_ids.includes(ele.ddm_rmp_lookup_dropdown_allocation_group)) {
        return ele
      }
    }
    this.filtered_MD.merchandising = this.l_lookupTableMD.merchandising_data.filter(allocationCBFunc);
    this.selected.merchandising = this.selected.merchandising.filter(allocationCBFunc);
  }

  public onDOSPDateSelection() {
    let from = this.fromDateDOSP.value;
    let to = this.toDateDOSP.value;
    //conditions to manage minDateDosp when from,to selected 
    if (from) {
      this.minDateDosp = new Date(from.year(), from.month(), from.date());
      if (to) {
        to = +to >= +from ? to : "";
        this.toDateDOSP = +to >= +from ? this.toDateDOSP : new FormControl();
      }
    }
    let startDateDOSP = "", endDateDOSP = ""
    if (from && to) {
      startDateDOSP = from.year() + "-" + (from.month() + 1) + "-" + from.date();
      endDateDOSP = to.year() + "-" + (to.month() + 1) + "-" + to.date();
      this.req_body.dosp_start_date = startDateDOSP;
      this.req_body.dosp_end_date = endDateDOSP;
    }
    else {
      this.req_body.dosp_start_date = null;
      this.req_body.dosp_end_date = null;
    }
  }

  public onOrderEventdateSelection() {
    let from = this.keyDataEle.orderEvtFromDate.value;
    let to = this.keyDataEle.orderEvtToDate.value;

    //conditions to manage minDate when from,to selected 
    if (from) {
      this.minOrderEventDate = new Date(from.year(), from.month(), from.date());
      if (to) {
        to = +to >= +from ? to : "";
        this.keyDataEle.orderEvtToDate = +to >= +from ? this.keyDataEle.orderEvtToDate : new FormControl();
      }
    }
    let startDate = null;
    let endDate = null;
    if (from && to) {
      startDate = from.year() + "-" + (from.month() + 1) + "-" + from.date();
      endDate = to.year() + "-" + (to.month() + 1) + "-" + to.date();
      this.req_body.data_date_range = { StartDate: startDate, EndDate: endDate };
    }
    else {
      this.req_body.data_date_range = { StartDate: null, EndDate: null };
    }
  }

  public openAdditionalReqModal() {
    if (!this.selected.model_years.length)
      this.ngToaster.error("Model year is mandatory.")
    else if (!this.selected.vehicle.length)
      this.ngToaster.error("Vehicel line brand is mandatory.")
    else if (!this.selected.distribution_entity.length)
      this.ngToaster.error("Distribution Entity is mandatory.")
    else if (this.keyDataEle.others.checked && !this.keyDataEle.others.order_event.length) {
      this.ngToaster.error("Please enter the Key Data Elements.")
    }
    else if (this.keyDataEle.others.checked && !this.req_body.data_date_range.StartDate) {
      this.ngToaster.error("Please select the date range for Key Data Elements.")
    }
    else if (this.keyDataEle.selected.length && !this.req_body.data_date_range.StartDate) {
      this.ngToaster.error("Please select the date range for Key Data Elements.")
    }
    else {
      let obj = {
        checkboxData: this.getSelectedCheckboxData(),
        l_title: this.req_body.report_detail.title,
        l_addReq: this.req_body.report_detail.additional_req,
        l_isVvinReq: this.req_body.report_detail.is_vin_level_report,
        l_isSummaryReq: this.req_body.report_detail.is_summary_report,
        l_businessReq: this.req_body.report_detail.business_req,
        l_requestId: this.req_body.report_id,
        l_prevSeletedFiles: this.submitService.fileObjectDetails
      }
      if (!(this.keyDataEle.others.checked || this.keyDataEle.selected.length)) {
        this.req_body.data_date_range = { StartDate: null, EndDate: null };
      }
      const dialogRef = this.matDialog.open(AdditionalReqModalComponent, {
        data: obj, disableClose: true
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.openReviewModal(result);
        }
      })
    }
  }

  public openReviewModal(result) {
    this.req_body.model_year.dropdown = this.selected.model_years;
    this.req_body.vehicle_line.dropdown = this.selected.vehicle;
    this.req_body.allocation_group.dropdown = this.selected.allocation;
    this.req_body.merchandizing_model.dropdown = this.selected.merchandising;

    if (this.keyDataEle.others.checked) {
      this.req_body.order_event.dropdown = [this.keyDataEle.others];
    }
    else
      this.req_body.order_event.dropdown = this.keyDataEle.selected;

    this.req_body.distribution_data = this.selected.distribution_entity.map(de => {
      let obj = {
        value: de.type_data_desc,
        id: de.ddm_rmp_lookup_ots_type_data_id,
        radio: this.distibutionEntityRadio
      }
      return obj
    })
    this.req_body.order_type.dropdown = this.selected.order_type;
    this.req_body.order_type.radio_button = this.orderTypeRadio;

    this.req_body.checkbox_data = result.data.cb.map(cbEle => {
      return {
        value: cbEle.field_values,
        id: cbEle.ddm_rmp_lookup_ots_checkbox_values_id,
        desc: cbEle.desc ? cbEle.desc : ""
      }
    });
    this.req_body.report_detail.on_behalf_of = this.submitService.getSubmitOnBehalf();
    this.req_body.report_detail.title = result.data.reportTitle;
    this.req_body.report_detail.additional_req = result.data.addReq;
    this.req_body.report_detail.status_date = new Date();
    this.req_body.report_detail.is_vin_level_report = result.data.isVinLevel;
    this.req_body.report_detail.is_summary_report = result.data.isSummaryReport;
    this.req_body.report_detail.business_req = result.data.businessReq;

    this.openPreviewModal(result);
  }

  openPreviewModal(result) {
    const dialogRef = this.matDialog.open(ReviewReqModalComponent, {
      data: {
        reqBody: this.req_body,
        selectedReqData: this.l_selectedReqData,
        selectedFile: result.data.selectedFile,
        allFileNames: result.data.allFileNames
      }, disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      //Don't do anything
    })
  }

  refillSelectedRequestData(data) {
    //stop the function when ost_data is null 
    if (!data['ost_data'])
      return true

    let l_data = data.ost_data;

    let vehicleIds = l_data.vehicle_line.map(ele => ele.ddm_rmp_lookup_dropdown_vehicle_line_brand);
    this.selected.vehicle = this.l_lookupTableMD.vehicle_data.filter(vehicle => {
      if (vehicleIds.includes(vehicle.ddm_rmp_lookup_dropdown_vehicle_line_brand_id))
        return vehicle
    })
    this.multiSelectChange('vehicle')
    let allocationIds = l_data.allocation_group.map(ele => ele.ddm_rmp_lookup_dropdown_allocation_group);
    this.selected.allocation = this.l_lookupTableMD.allocation_grp.filter(allocation => {
      if (allocationIds.includes(allocation.ddm_rmp_lookup_dropdown_allocation_group_id))
        return allocation
    })
    this.multiSelectChange('allocation')
    let merchandisingIds = l_data.merchandizing_model.map(ele => ele.ddm_rmp_lookup_dropdown_merchandising_model);
    this.selected.merchandising = this.l_lookupTableMD.merchandising_data.filter(allocation => {
      if (merchandisingIds.includes(allocation.ddm_rmp_lookup_dropdown_merchandising_model_id))
        return allocation
    })

    let modelYrIds = l_data.model_year.map(ele => ele.ddm_rmp_lookup_dropdown_model_year);
    this.selected.model_years = this.l_lookupTableMD.model_year.filter(my => {
      if (modelYrIds.includes(my.ddm_rmp_lookup_dropdown_model_year_id))
        return my
    })

    let distributionIds = l_data.distribution_data.map(ele => ele.ddm_rmp_lookup_ots_type_data);
    this.selected.distribution_entity = this.l_lookupTableMD.type_data.filter(de => {
      if (distributionIds.includes(de.ddm_rmp_lookup_ots_type_data_id))
        return de
    })
    this.distibutionEntityRadio = l_data.distribution_data.length ? l_data.distribution_data[0].radio_btn : "Summary";

    let orderIds = l_data.order_type.map(ele => ele.ddm_rmp_lookup_dropdown_order_type);
    this.selected.order_type = this.l_lookupTableMD.order_type.filter(ot => {
      if (orderIds.includes(ot.ddm_rmp_lookup_dropdown_order_type_id))
        return ot
    })
    this.orderTypeRadio = l_data.order_type.length ? l_data.order_type[0].display_summary_value : "Summary";

    let f_dosp = l_data.data_date_range[0].dosp_start_date
    let t_dsop = l_data.data_date_range[0].dosp_end_date
    let f_dataEle = l_data.data_date_range[0].start_date
    let t_dataEle = l_data.data_date_range[0].end_date

    if (f_dosp) {
      this.req_body.dosp_start_date = f_dosp;
      this.req_body.dosp_end_date = t_dsop;
      this.fromDateDOSP.setValue(this.formatedDateToMoment(f_dosp));
      this.toDateDOSP.setValue(this.formatedDateToMoment(t_dsop));
      this.minDateDosp = new Date(f_dosp);

    }
    if (f_dataEle) {
      this.req_body.data_date_range = { StartDate: f_dataEle, EndDate: t_dataEle };
      this.keyDataEle.orderEvtFromDate.setValue(this.formatedDateToMoment(f_dataEle));
      this.keyDataEle.orderEvtToDate.setValue(this.formatedDateToMoment(t_dataEle));
    }

    //reset selected array
    for (const key in this.selected_checkbox) {
      if (this.selected_checkbox.hasOwnProperty(key)) {
        this.selected_checkbox[key] = [];
      }
    }

    let len = l_data.checkbox_data.length;
    for (let index = 0; index < len; index++) {
      const element = l_data.checkbox_data[index];
      for (const attr in this.checkBxMD1) {
        if (this.checkBxMD1.hasOwnProperty(attr)) {
          const objEle = this.checkBxMD1[attr];
          let foundEle = objEle.find(ele => ele.ddm_rmp_lookup_ots_checkbox_values_id === element.ddm_rmp_lookup_ots_checkbox_values)
          if (foundEle) {
            if (foundEle.description)
              foundEle['desc'] = element.description_text;
            this.selected_checkbox[attr].push(foundEle);
            break;
          }
        }
      }

      for (const attr in this.checkboxMD2) {
        if (this.checkboxMD2.hasOwnProperty(attr)) {
          const objEle = this.checkboxMD2[attr];
          objEle.forEach(cb => {
            if (cb.ddm_rmp_lookup_ots_checkbox_values_id === element.ddm_rmp_lookup_ots_checkbox_values)
              cb['checked'] = true;
          });
        }
      }
    }
    // to trigger change detection
    this.selected_checkbox.commonly_req_field = [...this.selected_checkbox.commonly_req_field];
    this.selected_checkbox.opt_content_avail = [...this.selected_checkbox.opt_content_avail];
    this.selected_checkbox.order_event_avail_ds = [...this.selected_checkbox.order_event_avail_ds];

    // updating Key Data Elements for Date Range
    if (l_data.order_event.length === 1 && !l_data.order_event[0].ddm_rmp_lookup_dropdown_order_event) {
      this.keyDataEle.others.order_event = l_data.order_event[0].order_event;
      this.keyDataEle.others.checked = true;
      this.keyDataEle_settings.isDisabled = true;
    }
    else {
      let keyEleIds = l_data.order_event.map(oe => oe.ddm_rmp_lookup_dropdown_order_event)
      this.keyDataEle.selected = this.keyDataEle.masterData.filter(oe => {
        if (keyEleIds.includes(oe.ddm_rmp_lookup_dropdown_order_event_id))
          return oe
      })
    }
  }

  formatedDateToMoment(str) {
    return moment(new Date(str))
  }

  //refill the existing report details 
  fillReportDetails(data) {
    this.req_body.report_detail.title = data.title;
    this.req_body.report_detail.additional_req = data.additional_req;
    this.req_body.report_detail.created_on = data.report_data.created_on;
    this.req_body.report_detail.assigned_to = data.report_data.assigned_to;
    this.req_body.report_detail.requestor = data.report_data.requestor;
    this.req_body.report_detail.link_title = data.report_data.link_title;
    this.req_body.report_detail.link_to_results = data.report_data.link_to_results;
    this.req_body.report_detail.query_criteria = data.report_data.query_criteria;
    this.req_body.report_detail.is_vin_level_report = data.report_data.is_vin_level_report;
    this.req_body.report_detail.is_summary_report = data.report_data.is_summary_report;
    this.req_body.report_detail.business_req = data.report_data.business_req;
  }

  public getSelectedCheckboxData() {
    let l_checkbox_data = [];
    l_checkbox_data.push(...this.selected_checkbox.commonly_req_field, ...this.selected_checkbox.opt_content_avail, ...this.selected_checkbox.order_event_avail_ds)

    for (const key in this.checkboxMD2) {
      if (this.checkboxMD2.hasOwnProperty(key)) {
        const element = this.checkboxMD2[key];
        element.forEach(ele => {
          if (ele['checked'])
            l_checkbox_data.push(ele)
        });
      }
    }
    return l_checkbox_data
  }

  checkKeyDataEle(event) {
    if (event.checked)
      this.keyDataEle_settings.isDisabled = true;
    else
      this.keyDataEle_settings.isDisabled = false;
  }

  resetCheckboxData() {
    for (const key in this.checkBxMD1) {
      if (this.checkBxMD1.hasOwnProperty(key)) {
        this.checkBxMD1[key] = [];
      }
    }
    for (const key in this.selected_checkbox) {
      if (this.selected_checkbox.hasOwnProperty(key)) {
        this.selected_checkbox[key] = [];
      }
    }
    for (const key in this.checkboxMD2) {
      if (this.checkboxMD2.hasOwnProperty(key)) {
        this.checkboxMD2[key] = [];
      }
    }
  }

  public model_yr_settings = {
    label: "Model Years",
    primary_key: 'ddm_rmp_lookup_dropdown_model_year_id',
    label_key: 'model_year',
    title: "",
    isDisabled: false
  };

  public division_settings = {
    label: "Division",
    primary_key: 'ddm_rmp_lookup_division',
    label_key: 'division_desc',
    title: "",
    isDisabled: true
  };

  public vehicle_settings = {
    label: "Vehicle Line Brands",
    primary_key: 'ddm_rmp_lookup_dropdown_vehicle_line_brand_id',
    label_key: 'vehicle_line_brand',
    title: "",
    isDisabled: false
  };

  public allocation_settings = {
    label: "Allocation Groups",
    primary_key: 'ddm_rmp_lookup_dropdown_allocation_group_id',
    label_key: 'allocation_group',
    title: "",
    isDisabled: false
  };

  public merchandising_settings = {
    label: "Merchandising Models",
    primary_key: 'ddm_rmp_lookup_dropdown_merchandising_model_id',
    label_key: 'merchandising_model',
    title: "",
    isDisabled: false
  };


  public distribution_settings = {
    label: "Distribution Entities",
    primary_key: 'ddm_rmp_lookup_ots_type_data_id',
    label_key: 'type_data_desc',
    title: "",
    isDisabled: false
  };

  public orderType_settings = {
    label: "Order Types",
    primary_key: 'ddm_rmp_lookup_dropdown_order_type_id',
    label_key: 'order_type',
    title: "",
    isDisabled: false
  };

  public commonly_req_field_settings = {
    label: "Common Fields",
    primary_key: 'ddm_rmp_lookup_ots_checkbox_values_id',
    label_key: 'field_values',
    title: "",
    isDisabled: false
  };

  public option_content_avail_settings = {
    label: "Option Contents",
    primary_key: 'ddm_rmp_lookup_ots_checkbox_values_id',
    label_key: 'field_values',
    title: "",
    isDisabled: false
  };

  public order_event_avail_settings = {
    label: "Order Events",
    primary_key: 'ddm_rmp_lookup_ots_checkbox_values_id',
    label_key: 'field_values',
    title: "",
    isDisabled: false
  };

  public keyDataEle_settings = {
    label: "Key Data Elements",
    primary_key: 'ddm_rmp_lookup_dropdown_order_event_id',
    label_key: 'order_event',
    title: "",
    isDisabled: false
  }

  ngOnDestroy() {
    this.subjectSubscription.unsubscribe();
  }
}

function sortCheckbox(a, b) {
  if (a.ddm_rmp_lookup_ots_checkbox_values_id < b.ddm_rmp_lookup_ots_checkbox_values_id) {
    return -1;
  }
  if (a.ddm_rmp_lookup_ots_checkbox_values_id > b.ddm_rmp_lookup_ots_checkbox_values_id) {
    return 1;
  }
  return 0;
}