import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/authentication.service';
import Utils from 'src/utils';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { SubmitRequestService } from "../submit-request.service";
import { Router } from '@angular/router';

import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { AdditionalReqModalComponent } from '../additional-req-modal/additional-req-modal.component';
import { DataProviderService } from '../../data-provider.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'dealer-allocation',
  templateUrl: './dealer-allocation.component.html',
  styleUrls: ['./dealer-allocation.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DealerAllocationComp implements OnInit {

  l_lookupTableMD: any = {}
  user_name = "";
  user_role = "";

  filtered_MD = {
    divisions: [],
    model_years: [],
    allocation_groups: [],
    consensus: []
  }
  selected = {
    divisions: [],
    model_years: [],
    allocation_groups: [],
    consensus: []
  }

  consensusStartDate = new FormControl(moment());
  consensusEndDate = new FormControl(moment());
  minDate = null;

  startCycle = "Cycle 1";
  endCycle = "Cycle 2";

  public req_body = {
      concensus_time_date : {
          startM : "",
          startY : "",
          endM : "",
          endY : "",
          startCycle : "",
          endCycle : ""
      },
      concensus_data : [],
      model_year : { dropdown : [] , radio_button : "Display" },
      allocation_group : { dropdown : [] , radio_button : "Display" },
      division_selected : { dropdown : [] , radio_button : "Display" },
      report_detail: {
        title: "",
        assigned_to: "",
        additional_req: "",
        created_on: new Date(),
        report_type: "da",
        status: "Pending",
        status_date: null,
        on_behalf_of: "",
        link_to_results: "",
        query_criteria: "",
        link_title: "",
        requestor: ""
    },
    report_id : null
  }

  display_message = "";

  constructor(public matDialog: MatDialog,
    public ngToaster: NgToasterComponent,
    public submitService: SubmitRequestService,
    private dataProvider: DataProviderService,
    private  router : Router,
    public auth_service: AuthenticationService) { }

  ngOnInit(): void {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"]
        this.user_role = role["role"];
        this.req_body.report_detail.requestor = this.user_name;
      }
    })
    this.dataProvider.currentlookUpTableData.subscribe((tableDate: any) => {
      this.l_lookupTableMD = tableDate ? JSON.parse(JSON.stringify(tableDate.data)) : {};
      this.refillMasterDatatoOptions();
    })

    this.submitService.requestStatusEmitter.subscribe((res:any)=>{
      if(res.type === "src"){
        this.refillDivisionMD(res.data.division_selected);
        this.req_body.report_id = res.data.report_id;
        this.display_message = `<span class="red">Request #${this.req_body.report_id} - Incomplete</span>`
      }
      else if (res.type === "srw" && res.data.status === "Incomplete") {
        this.division_settings.primary_key = "ddm_rmp_lookup_division"
        this.refillDivisionMD(res.data.division_dropdown);
        this.req_body.report_id = res.data.ddm_rmp_post_report_id;
        this.display_message = `<span class="red">Request #${this.req_body.report_id} - Incomplete</span>`
        // this.refillSelectedRequestData(request.data);
        this.fillReportDetails(res.data);
      }
      else if (res.type === "srw" && res.data.status != "Incomplete") {
        // console.log(res.data);
        this.division_settings.primary_key = "ddm_rmp_lookup_division"
        this.refillDivisionMD(res.data.division_dropdown);

        this.req_body.report_detail.status = res.data.status;
        this.req_body.report_id = res.data.ddm_rmp_post_report_id;

        if (res.data.report_type === "ots"){
          this.display_message = `<span class="green">Request #${this.req_body.report_id} - ${this.req_body.report_detail.status}</span>
                                . Report Type - Vehicle event status<br> Though you can submit new vehicle event status`
        }
        else{
          this.display_message = `<span class="green">Request #${this.req_body.report_id} - ${this.req_body.report_detail.status}</span>`
          this.refillSelectedRequestData(res.data);
        }
        this.fillReportDetails(res.data);

      }
    })

    this.submitService.updateLoadingStatus({status: true, comp : "da"})
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
  }

  refillDivisionMD(divisions){
    this.selected.divisions = divisions;
    this.filtered_MD.divisions = divisions;
    this.divisionDependencies();
  }

  refillMasterDatatoOptions() {
    this.filtered_MD.consensus = this.l_lookupTableMD.concensus_data_da;
    this.filtered_MD.model_years = this.l_lookupTableMD.model_year;
  }

  divisionDependencies() {
    let l_division_ids = this.selected.divisions.map(ele => ele[this.division_settings.primary_key]);
    let divisionCBFunc = function (ele) {
      if (l_division_ids.includes(ele.ddm_rmp_lookup_division)) {
        return ele
      }
    }
    this.filtered_MD.allocation_groups = this.l_lookupTableMD.allocation_grp_da.filter(divisionCBFunc)
    this.selected.allocation_groups = this.selected.allocation_groups.filter(divisionCBFunc);
  }

  openAdditionalReqModal() {
    if(!this.selected.model_years.length)  
      this.ngToaster.error("Please select Model year")
    else if(!this.selected.allocation_groups.length)
      this.ngToaster.error("Please select allocation group")
    else if(!this.selected.consensus.length)
      this.ngToaster.error("Please select Consensus data")
    else{
      let obj = {
        checkboxData: [],
        l_title : this.req_body.report_detail.title,
        l_addReq : this.req_body.report_detail.additional_req
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

  }

  openReviewModal(result) {
    // console.log(this.selected);
    this.req_body.allocation_group.dropdown = this.selected.allocation_groups;
    this.req_body.model_year.dropdown = this.selected.model_years;
    this.req_body.concensus_data = this.selected.consensus.map(cons=>{
      return {
        value : cons.cd_values,
        id : cons.ddm_rmp_lookup_da_consensus_data_id
      }
    })

    this.req_body.report_detail.title = result.data.reportTitle;
    this.req_body.report_detail.additional_req = result.data.addReq;
    this.req_body.report_detail.status_date = new Date();
    this.req_body.report_detail.on_behalf_of = this.submitService.getSubmitOnBehalf();
    
    this.req_body.concensus_time_date.startCycle = this.startCycle;
    this.req_body.concensus_time_date.endCycle = this.endCycle;
    let from = this.consensusStartDate.value;
    let to = this.consensusEndDate.value;
    this.req_body.concensus_time_date.startM = from.format("MMMM");
    this.req_body.concensus_time_date.startY = from.year();
    this.req_body.concensus_time_date.endM = to.format("MMMM");
    this.req_body.concensus_time_date.endY = to.year();

    // console.log(this.req_body);
    Utils.showSpinner();
    this.submitService.submitDealerAllocation(this.req_body).subscribe(response => {
      // console.log(response);
      Utils.hideSpinner();
      this.submitService.setSubmitOnBehalf("","");
      this.ngToaster.success("Request Updated successfully");
      this.router.navigate(["user/request-status"]);
    }, err => {
      Utils.hideSpinner();
      console.log(err);
    });

  }

  refillSelectedRequestData(data){
    let l_data = data.da_data;

    let modelYrIds = l_data.model_year.map(ele=> ele.ddm_rmp_lookup_dropdown_model_year);
    this.selected.model_years = this.l_lookupTableMD.model_year.filter(my=>{
      if (modelYrIds.includes(my.ddm_rmp_lookup_dropdown_model_year_id))
      return my
    })

    let allocationIds = l_data.allocation_grp.map(ele=> ele.ddm_rmp_lookup_dropdown_allocation_group);
    this.selected.allocation_groups = this.l_lookupTableMD.allocation_grp_da.filter(allo=>{
      if (allocationIds.includes(allo.ddm_rmp_lookup_dropdown_allocation_group_da_id))
      return allo
    })

    let consensusIds = l_data.concensus_data.map(ele=> ele.ddm_rmp_lookup_da_consensus_data_id);
    this.selected.consensus = this.l_lookupTableMD.concensus_data_da.filter(cons=>{
      if (consensusIds.includes(cons.ddm_rmp_lookup_da_consensus_data_id))
      return cons
    })

    this.startCycle = l_data.concensus_time_date[0].ddm_rmp_start_cycle;
    let l_startM =  l_data.concensus_time_date[0].ddm_rmp_start_month;
    let l_startY =  l_data.concensus_time_date[0].ddm_rmp_start_year;
    this.consensusStartDate.setValue(this.dateStrToMoment(l_startM,l_startY))
    this.minDate = this.dateStrToMoment(l_startM,l_startY)

    this.endCycle = l_data.concensus_time_date[0].ddm_rmp_end_cycle
    let l_endM =  l_data.concensus_time_date[0].ddm_rmp_end_month
    let l_endY =  l_data.concensus_time_date[0].ddm_rmp_end_year
    this.consensusEndDate.setValue(this.dateStrToMoment(l_endM,l_endY))
  }

  dateStrToMoment(month,yr){
    let str = yr +'-'+ month;
    return moment(new Date(str))
  }

  fillReportDetails(data){
    this.req_body.report_detail.title = data.title;
    this.req_body.report_detail.additional_req = data.additional_req;
    this.req_body.report_detail.created_on = data.report_data.created_on;
    this.req_body.report_detail.assigned_to = data.report_data.assigned_to;
    this.req_body.report_detail.requestor = data.report_data.requestor;
    this.req_body.report_detail.link_title = data.report_data.link_title;
    this.req_body.report_detail.link_to_results  = data.report_data.link_to_results;
    this.req_body.report_detail.query_criteria = data.report_data.query_criteria;
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.consensusStartDate.value;
    ctrlValue.year(normalizedYear.year());
    this.consensusStartDate.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    let from = this.consensusStartDate.value;
    let to = this.consensusEndDate.value;
    from.month(normalizedMonth.month());
    this.consensusStartDate.setValue(from);
    if (from) {
      this.minDate = new Date(from.toISOString());
      // this.minOrderEventDate = new Date(ctrlValue.year(), ctrlValue.month(), ctrlValue.date());
      if (this.consensusEndDate.value) {
        to = +to >= +from ? to : "";
        this.consensusEndDate = +to >= +from ? this.consensusEndDate : new FormControl(moment(this.minDate));
      }
    }
    datepicker.close();
  }

  chosenYearHandler1(normalizedYear: Moment) {
    const ctrlValue = this.consensusEndDate.value;
    ctrlValue.year(normalizedYear.year());
    this.consensusEndDate.setValue(ctrlValue);
  }

  chosenMonthHandler1(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.consensusEndDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.consensusEndDate.setValue(ctrlValue);
    datepicker.close();
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

  public allocation_settings = {
    label: "Allocation Groups(s)",
    primary_key: 'ddm_rmp_lookup_dropdown_allocation_group_da_id',
    label_key: 'allocation_group',
    title: ""
  };

  public consensus_settings = {
    label: "Available Consensus",
    primary_key: "ddm_rmp_lookup_da_consensus_data_id",
    label_key: "cd_values",
    title: ""
  };

}
