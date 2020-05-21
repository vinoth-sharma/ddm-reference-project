import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from "@angular/material/chips";
import { SubmitRequestService } from '../../submit-request.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

export interface Dl {
  mail: string;
}
@Component({
  selector: 'app-report-frequency',
  templateUrl: './report-frequency.component.html',
  styleUrls: ['./report-frequency.component.css']
})
export class ReportFrequencyComponent implements OnInit {
  @Input() lookupTableData: any = {}
  // @Input() existingData: any;
  @Output() reportFreqEmitter = new EventEmitter();
  reportFreq: {}[] = [{ label: 'Yes', id: true }, { label: 'No', id: false }];

  l_lookupData = {
    daily_weekly: [],
    monthly_bimonthly: [],
    quaterly: [],
    freq_dealer_allo: []
  }

  selected = {
    reportFreq_regBasis: false,
    daily_weekly: [],
    monthly_bimonthly: [],
    monthly_others: false,
    monthly_others_decs: "",
    quaterly: [],
    freq_dealer_allo: [],
    dl_list: []
  }

  constructor(public subReqService: SubmitRequestService,
    public toaster: NgToasterComponent) { }


  ngOnInit(): void {

    this.subReqService.requestStatusEmitter.subscribe((res:any)=>{
      if(res.type === "srw"){
        this.refillSelectedRequestData(res.data);
      }
    })
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.lookupTableData) {
      this.refillMasterData();
    }
    // console.log(this.existingData);
    // if (this.existingData) {
      // this.refillSelectedRequestData(this.existingData);
    // }
  }

  refillSelectedRequestData(reqData) {
    this.selected = {
      reportFreq_regBasis: false,
      daily_weekly: [],
      monthly_bimonthly: [],
      monthly_others: false,
      monthly_others_decs: "",
      quaterly: [],
      freq_dealer_allo: [],
      dl_list: []
    }

    this.selected.dl_list = reqData.dl_list.map(dl => dl.distribution_list);
    if (reqData.frequency_data.length === 1 && reqData.frequency_data[0].ddm_rmp_lookup_select_frequency_id === 39) {
      this.selected.reportFreq_regBasis = false;
    }
    else {
      this.selected.reportFreq_regBasis = true;
      reqData.frequency_data.forEach(freq => {
        if (freq.ddm_rmp_lookup_report_frequency === 1) {
          this.selected.daily_weekly.push(freq)
        }
        else if (freq.ddm_rmp_lookup_report_frequency === 2) {
          this.selected.monthly_bimonthly.push(freq)
          if (freq.select_frequency_values === "Other") {
            this.selected.monthly_others = true;
            this.selected.monthly_others_decs = freq.description;
          }
        }
        else if (freq.ddm_rmp_lookup_report_frequency === 3)
          this.selected.quaterly.push(freq)
        else if (freq.ddm_rmp_lookup_report_frequency === 4) {
          this.l_lookupData.freq_dealer_allo.forEach(fda => {
            if (fda.ddm_rmp_lookup_select_frequency_id === freq.ddm_rmp_lookup_select_frequency_id) {
              fda['checked'] = true;
              fda['description'] = freq['description']
            }
          })
        }
        // this.selected.freq_dealer_allo.push(freq)
      });

    }
// console.log(this.selected);

  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  refillMasterData() {
    this.resetMDdata();
    let l_lookuptableData_freq = this.lookupTableData.report_frequency.sort(sortFreq);
    l_lookuptableData_freq.forEach(freq => {
      if (freq.ddm_rmp_lookup_report_frequency_id === 1)
        this.l_lookupData.daily_weekly.push(freq)
      else if (freq.ddm_rmp_lookup_report_frequency_id === 2)
        this.l_lookupData.monthly_bimonthly.push(freq)
      else if (freq.ddm_rmp_lookup_report_frequency_id === 3)
        this.l_lookupData.quaterly.push(freq)
      else if (freq.ddm_rmp_lookup_report_frequency_id === 4)
        this.l_lookupData.freq_dealer_allo.push(freq)
    })
  }

  monthBimonChanges(event) {
    if (event.value.length) {
      let flag = event.value.some(ele => ele.select_frequency_values === "Other");
      this.selected.monthly_others = flag;
    }
    else
      this.selected.monthly_others = false;
  }

  validateNdSubmit() {
    if (!this.selected.dl_list.length)
      this.toaster.error("Please add at least one email in Distribution Lis");
    else
      this.submitFrequencyData();
  }

  submitFrequencyData() {

    let req_body = {
      freq: "",
      dl_list: this.selected.dl_list,
      report_freq: []
    }

    if (!this.selected.reportFreq_regBasis) {
      req_body.freq = "One Time"
      req_body.report_freq.push({
        ddm_rmp_lookup_select_frequency_id: 39,
        description: ""
      })
    }
    else {
      req_body.freq = "Recurring"
      const freqCB = daily => {
        req_body.report_freq.push({
          ddm_rmp_lookup_select_frequency_id: daily.ddm_rmp_lookup_select_frequency_id,
          description: daily.select_frequency_values === "Other" ? this.selected.monthly_others_decs : daily.select_frequency_values
        })
      }

      this.selected.daily_weekly.forEach(freqCB);
      this.selected.monthly_bimonthly.forEach(freqCB);
      this.selected.quaterly.forEach(freqCB);
      this.l_lookupData.freq_dealer_allo.filter(ele => ele['checked']).forEach(freq => {
        req_body.report_freq.push({
          ddm_rmp_lookup_select_frequency_id: freq.ddm_rmp_lookup_select_frequency_id,
          description: freq.select_frequency_description ? freq['description'] : freq.select_frequency_values
        })
      })
    }
    // console.log(req_body); 
    if (this.selected.reportFreq_regBasis) {
      if (!req_body.report_freq.length) {
        this.toaster.error("Please select atleast one frequency")
      }
      else if (req_body.report_freq.every(freq => freq['description'].length))
        this.reportFreqEmitter.emit(req_body)
      else
        this.toaster.error("Please specify the value if selected others")
    }
    else
      this.reportFreqEmitter.emit(req_body)
  }

  emailSelectionDone(event) {
    this.selected.dl_list = event;
  }

  resetMDdata() {
    this.l_lookupData = {
      daily_weekly: [],
      monthly_bimonthly: [],
      quaterly: [],
      freq_dealer_allo: []
    }
  }

  compareFn(o1, o2) {
    if (!o1 && !o2)
      return false
    else if (o1.ddm_rmp_lookup_select_frequency_id == o2.ddm_rmp_lookup_select_frequency_id)
      return true;
    else return false
  }

}

function sortFreq(a, b) {
  if (a.ddm_rmp_lookup_select_frequency_id < b.ddm_rmp_lookup_select_frequency_id) {
    return -1;
  }
  if (a.ddm_rmp_lookup_select_frequency_id > b.ddm_rmp_lookup_select_frequency_id) {
    return 1;
  }
  return 0;
}

