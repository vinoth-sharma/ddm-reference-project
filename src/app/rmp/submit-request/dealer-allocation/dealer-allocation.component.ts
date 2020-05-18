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

import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { AdditionalReqModalComponent } from '../additional-req-modal/additional-req-modal.component';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
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
  @Input() lookupTableMD = {};
  @Input() divisionData = [];

  constructor(public matDialog: MatDialog,
    public ngToaster: NgToasterComponent,
    public submitService: SubmitRequestService,
    public auth_service: AuthenticationService) { }

  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2016', '2017', '2018', '2019', '2020'];

  division = [{ name: '001-Chevorlet (US)' }, { name: '004-Buick (US)' }, { name: '006-Cadillac (US)' }, { name: '012-GMC (US)' }];
  divisionSltd = [{ name: '001-Chevorlet (US)' }, { name: '004-Buick (US)' }];

  modelYear = new FormControl();
  modelYears: string[] = ['2020', '2019', '2018', '2017'];

  allocGrp = new FormControl();
  allocGrps: string[] = ['BLAZER', 'BOLTEV', 'CAM', 'CAMCON', 'CAPTIM', 'CAPTIV', 'CCRUHD'];

  conData = new FormControl();
  conDatas: string[] = ['Estimated Shipments ', 'Final Allocation', 'Production Consensus (Approved Qty)', 'Monthly Demand', 'Unfufilled Demand', 'Dealer Declined Units']

  startDate = new FormControl();
  endDate = new FormControl();
  // --------------------------------------------------------
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

  req_body = {
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
        created_on: "",
        report_type: "da",
        status: "Pending",
        status_date: "",
        on_behalf_of: "",
        link_to_results: "",
        query_criteria: "",
        link_title: "",
        requestor: ""
    },
    report_id : null
  }

  ngOnInit(): void {
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
    this.divisionDependencies();
    this.filtered_MD.consensus = this.l_lookupTableMD.concensus_data_da;
    this.filtered_MD.model_years = this.l_lookupTableMD.model_year;
    this.filtered_MD.model_years = this.l_lookupTableMD.model_year;
  }

  divisionDependencies() {
    let l_division_ids = this.selected.divisions.map(ele => ele.ddm_rmp_lookup_division_id);
    let divisionCBFunc = function (ele) {
      if (l_division_ids.includes(ele.ddm_rmp_lookup_division)) {
        return ele
      }
    }
    this.filtered_MD.allocation_groups = this.l_lookupTableMD.allocation_grp_da.filter(divisionCBFunc)
    this.selected.allocation_groups = this.selected.allocation_groups.filter(divisionCBFunc);
  }

  openAdditionalReqModal() {
    console.log(this.consensusEndDate);
    console.log(this.consensusStartDate);

    let obj = {
      checkboxData: []
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
    console.log(this.minDate);
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
    primary_key: 'ddm_rmp_lookup_dropdown_allocation_group_id',
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
