import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AdditionalReqModalComponent } from '../additional-req-modal/additional-req-modal.component';
import { AuthenticationService } from 'src/app/authentication.service';
import Utils from 'src/utils';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { SubmitRequestService } from "../submit-request.service";

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
  @Input() lookupTableMD = {};
  @Input() divisionData = [];

  constructor(public matDialog: MatDialog,
    public ngToaster: NgToasterComponent,
    public submitService: SubmitRequestService,
    public auth_service: AuthenticationService) { }

  disabled = false;
  // ---------------------------------------------------------

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

  checkBxMD1 = {
    commonly_req_field: [],
    opt_content_avail: [],
    order_event_avail_ds: []
  }
  selected_checkbox = {
    commonly_req_field: [],
    opt_content_avail: [],
    order_event_avail_ds: []
  }

  checkboxMD2 = {
    sales_avail: [],
    days_supply: [],
    penetration: [],
    time_to_turn: [],
    turn_rate: []
  }
  public fromDateDOSP: any = new FormControl();
  public toDateDOSP: any = new FormControl();
  public minDateDosp: Date = null;

  // public orderEvtToDate: any = new FormControl();
  public minOrderEventDate: Date = null;

  public keyDataEle = {
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

  private othersDescIds = [5, 8, 15, 54];
  public req_body = {
    dosp_start_date: "",
    dosp_end_date: "",
    checkbox_data: [],
    division_selected : { dropdown: [], radio_button: "Display" },
    model_year: { dropdown: [], radio_button: "Display" },
    vehicle_line: { dropdown: [], radio_button: "Display" },
    allocation_group: { dropdown: [], radio_button: "Display" },
    merchandizing_model: { dropdown: [], radio_button: "Display" },
    order_event : { dropdown: [] },
    distribution_data: [],
    order_type: { dropdown: [], radio_button: "" },
    data_date_range: { StartDate: "", EndDate: "" },
    report_detail: {
      title: "",
      status: "",
      created_on: null,
      assigned_to: "",
      additional_req: "",
      report_type: "ots",
      status_date: null,
      on_behalf_of: "",
      link_to_results: "",
      link_title: "",
      requestor: "",
      query_criteria: ""
    },
    report_id : null,
    other_desc : ""
  }

  user_name = "";
  user_role = "";

  ngOnInit() {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"]
        this.user_role = role["role"]
      }
    })
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    console.log(simpleChanges);
    console.log(this.lookupTableMD);
    if (this.divisionData.length && this.lookupTableMD) {
      this.l_lookupTableMD = this.lookupTableMD;
      this.refillMasterDatatoOptions();
    }
  }

  refillMasterDatatoOptions() {
    this.selected.divisions = this.divisionData;
    this.filtered_MD.divisions = this.divisionData;
    this.filtered_MD.vehicle = this.l_lookupTableMD.vehicle_data;

    this.filtered_MD.model_years = this.l_lookupTableMD.model_year;
    this.multiSelectChange('division')

    this.filtered_MD.distribution_entity = this.l_lookupTableMD.type_data;
    this.filtered_MD.order_type = this.l_lookupTableMD.order_type;

    this.keyDataEle.masterData = this.l_lookupTableMD.order_event;

    //refilling checkbox master data
    this.resetCheckboxData();
    this.l_lookupTableMD.checkbox_data.forEach(l_checkbox => {
      if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 1)
        this.checkBxMD1.commonly_req_field.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 2)
        this.checkBxMD1.opt_content_avail.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 3)
        this.checkBxMD1.order_event_avail_ds.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 4)
        this.checkboxMD2.days_supply.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 5)
        this.checkboxMD2.sales_avail.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 7)
        this.checkboxMD2.penetration.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 8)
        this.checkboxMD2.time_to_turn.push(l_checkbox)
      else if (l_checkbox.ddm_rmp_ots_checkbox_group_id === 9)
        this.checkboxMD2.turn_rate.push(l_checkbox)
    });


  }

  multiSelectChange(type) {
    // console.log(this.filtered_MD);
    // console.log(this.selected);
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

  divisionDependencies() {
    let l_division_ids = this.selected.divisions.map(ele => ele.ddm_rmp_lookup_division_id);
    let divisionCBFunc = function (ele) {
      if (l_division_ids.includes(ele.ddm_rmp_lookup_division)) {
        return ele
      }
    }
    this.filtered_MD.vehicle = this.l_lookupTableMD.vehicle_data.filter(divisionCBFunc)
    this.selected.vehicle = this.selected.vehicle.filter(divisionCBFunc);
    this.vehicleDependencies();
  }

  vehicleDependencies() {
    let l_vehicle_ids = this.selected.vehicle.map(ele => ele.ddm_rmp_lookup_dropdown_vehicle_line_brand_id);
    let vehicleCBFunc = function (ele) {
      if (l_vehicle_ids.includes(ele.ddm_rmp_lookup_division)) {
        return ele
      }
    }
    this.filtered_MD.allocation = this.l_lookupTableMD.allocation_grp.filter(vehicleCBFunc)
    this.selected.allocation = this.selected.allocation.filter(vehicleCBFunc);
    this.allocationDependencies();
  }

  allocationDependencies() {
    let l_allocation_ids = this.selected.allocation.map(ele => ele.ddm_rmp_lookup_dropdown_allocation_group_id);
    let allocationCBFunc = function (ele) {
      if (l_allocation_ids.includes(ele.ddm_rmp_lookup_dropdown_allocation_group)) {
        return ele
      }
    }
    this.filtered_MD.merchandising = this.l_lookupTableMD.merchandising_data.filter(allocationCBFunc)
    this.selected.merchandising = this.selected.merchandising.filter(allocationCBFunc);
  }

  public onDOSPDateSelection() {
    let from = this.fromDateDOSP.value;
    let to = this.toDateDOSP.value;
    console.log(from);
    console.log(from.toISOString());

    //conditions to manage minDateDosp when from,to selected 
    if (from) {
      this.minDateDosp = new Date(from.year(), from.month(), from.date());
      if (to) {
        to = +to >= +from ? to : "";
        this.toDateDOSP = +to >= +from ? this.toDateDOSP : new FormControl();
      }
    }
    let startDateDOSP = "",endDateDOSP = ""
    if (from && to) {
      startDateDOSP = from.year() + "-" + (from.month() + 1) + "-" + from.date();
      endDateDOSP = to.year() + "-" + (to.month() + 1) + "-" + to.date();
      this.req_body.dosp_start_date = startDateDOSP;
      this.req_body.dosp_end_date = endDateDOSP;
    }
    else {
      console.log("else");
      
      this.req_body.dosp_start_date = "";
      this.req_body.dosp_end_date = "";
    }
    console.log(this.req_body.dosp_start_date);
    

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
      this.req_body.data_date_range = { StartDate : startDate, EndDate : endDate };
    }
    else {
      this.req_body.data_date_range = { StartDate : "", EndDate : "" };
    }
  }

  openAdditionalReqModal() {
    let obj = {
      checkboxData: this.getSelectedCheckboxData()
    }
    const dialogRef = this.matDialog.open(AdditionalReqModalComponent, {
      data: obj
    })
    dialogRef.afterClosed().subscribe(result => {
      // this.dialogClosed();
      console.log(result);
      if (result) {
        this.openReviewModal(result);
      }
    })


  }

  openReviewModal(result) {
    console.log(result);

    console.log(this.selected);
    console.log(this.fromDateDOSP);
    // console.log(this.fromDateDOSP.toISOString());

    // this.req_body.dosp_start_date = this.fromDateDOSP.value?.toISOString();
    // this.req_body.dosp_end_date = this.toDateDOSP.value?.toISOString();
    // this.req_body.data_date_range.StartDate = this.keyDataEle.orderEvtFromDate.value?.toISOString();
    // this.req_body.data_date_range.EndDate = this.keyDataEle.orderEvtToDate.value?.toISOString();

    this.req_body.model_year.dropdown = this.selected.model_years;
    this.req_body.vehicle_line.dropdown = this.selected.vehicle;
    this.req_body.allocation_group.dropdown = this.selected.allocation;
    this.req_body.merchandizing_model.dropdown = this.selected.merchandising;
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

    let cbWithDesc = result.data.cb;
    this.req_body.checkbox_data = result.data.cbComplete.map(cbEle => {
      if (this.othersDescIds.includes(cbEle.ddm_rmp_lookup_ots_checkbox_values_id)) {
        let obj = cbWithDesc.find(ele => ele.ddm_rmp_lookup_ots_checkbox_values_id === cbEle.ddm_rmp_lookup_ots_checkbox_values_id)
        return {
          value: obj.field_values,
          id: obj.ddm_rmp_lookup_ots_checkbox_values_id,
          desc: obj.desc
        }
      }
      else {
        return {
          value: cbEle.field_values,
          id: cbEle.ddm_rmp_lookup_ots_checkbox_values_id,
          desc: cbEle.desc ? cbEle.desc : ""
        }
      }
    })

    this.req_body.report_detail.title = result.data.reportTitle;
    this.req_body.report_detail.additional_req = result.data.addReq;
    this.req_body.report_detail.requestor = this.user_name;
    this.req_body.report_detail.status_date = new Date();
    this.req_body.report_detail.created_on = new Date();
    this.req_body.report_detail.status = "Pending";
    this.req_body.report_id = 10;
    // this.req_body.division_selected.dropdown = this.selected.divisions;
    console.log(this.req_body);

    Utils.showSpinner();
    this.submitService.submitVehicelEventStatus(this.req_body).subscribe(response => {
      console.log(response);
      Utils.hideSpinner();
      this.ngToaster.success("Vehicle Event status upadated successfully")
    }, err => {
      Utils.hideSpinner();
      console.log(err);
    });
  }



  getSelectedCheckboxData() {
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

  // keyElemChecked() {
  //   if (this.disabled === true) {
  //     this.keyElem = new FormControl();
  //   }
  // }

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
    label: "Models",
    primary_key: 'ddm_rmp_lookup_dropdown_model_year_id',
    label_key: 'model_year',
    title: ""
  };

  public division_settings = {
    label: "Division",
    primary_key: 'ddm_rmp_lookup_division_id',
    label_key: 'division_desc',
    title: ""
  };

  public vehicle_settings = {
    label: "Vehicle Line Brands",
    primary_key: 'ddm_rmp_lookup_dropdown_vehicle_line_brand_id',
    label_key: 'vehicle_line_brand',
    title: ""
  };

  public allocation_settings = {
    label: "Allocation Groups(s)",
    primary_key: 'ddm_rmp_lookup_dropdown_allocation_group_id',
    label_key: 'allocation_group',
    title: ""
  };

  public merchandising_settings = {
    label: "Merchandising Model",
    primary_key: 'ddm_rmp_lookup_dropdown_merchandising_model_id',
    label_key: 'merchandising_model',
    title: ""
  };


  public distribution_settings = {
    label: "Distribution Entities",
    primary_key: 'ddm_rmp_lookup_ots_type_data_id',
    label_key: 'type_data_desc',
    title: ""
  };

  public orderType_settings = {
    label: "Order Types",
    primary_key: 'ddm_rmp_lookup_dropdown_order_type_id',
    label_key: 'order_type',
    title: ""
  };

  public commonly_req_field_settings = {
    label: "Common fields",
    primary_key: 'ddm_rmp_lookup_ots_checkbox_values_id',
    label_key: 'field_values',
    title: ""
  };

  public option_content_avail_settings = {
    label: "Option Contents",
    primary_key: 'ddm_rmp_lookup_ots_checkbox_values_id',
    label_key: 'field_values',
    title: ""
  };

  public order_event_avail_settings = {
    label: "Order Events",
    primary_key: 'ddm_rmp_lookup_ots_checkbox_values_id',
    label_key: 'field_values',
    title: ""
  };

  public keyDataEle_settings = {
    label: "Key Data Elements",
    primary_key: 'ddm_rmp_lookup_dropdown_order_event_id',
    label_key: 'order_event',
    title: ""
  }
}

