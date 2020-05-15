import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {FormControl} from '@angular/forms';
import { COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from "@angular/material/chips";

export interface Dl {
  mail: string;
}
@Component({
  selector: 'app-report-frequency',
  templateUrl: './report-frequency.component.html',
  styleUrls: ['./report-frequency.component.css']
})
export class ReportFrequencyComponent implements OnInit {
  @Input() lookupTableData:any = {}
 @Output() reportFreqEmitter = new EventEmitter();
  constructor() { }
  reportFreq: {}[] = [{ label : 'Yes' ,id : true },{ label : 'No',id: false }];

  dayFreq = new FormControl();
  
  biMonFreq = new FormControl();

  quarFreq = new FormControl();

  onDemFreq = new FormControl();
  // onDemFreqs: string[] = ['On Demand', 'On Demand Configurable'];

  l_lookupData = {
    daily_weekly : [],
    monthly_bimonthly : [],
    quaterly : [],
    freq_dealer_allo : []
  }

  selected = {
    reportFreq_regBasis : false ,
    daily_weekly : [],
    monthly_bimonthly : [],
    monthly_others : false,
    monthly_others_decs : "smaple",
    quaterly : [],
    freq_dealer_allo : [],
    dl_list : []
  }

  ngOnInit(): void {
    console.log(this.lookupTableData);
    
  }

  ngOnChanges(simpleChange : SimpleChanges){
    if(simpleChange.lookupTableData){
      console.log(this.lookupTableData);
      this.refillMasterData();
    }
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  refillMasterData(){
    this.resetMDdata();
    let l_lookuptableData_freq = this.lookupTableData.report_frequency.sort(sortFreq);
    l_lookuptableData_freq.forEach(freq=>{
      if(freq.ddm_rmp_lookup_report_frequency_id === 1)
        this.l_lookupData.daily_weekly.push(freq)
      else if(freq.ddm_rmp_lookup_report_frequency_id === 2)
        this.l_lookupData.monthly_bimonthly.push(freq)
      else if(freq.ddm_rmp_lookup_report_frequency_id === 3)
        this.l_lookupData.quaterly.push(freq)
      else if(freq.ddm_rmp_lookup_report_frequency_id === 4)
        this.l_lookupData.freq_dealer_allo.push(freq)
    })
    console.log(this.l_lookupData);
    
  }

  submitFrequencyData(){
    
    if(this.selected.dl_list.length){
    let req_body = {
      freq : "",
      dl_list : this.selected.dl_list,
      report_freq : []
    }

    if(!this.selected.reportFreq_regBasis){
      req_body.freq = "One Time"
      req_body.report_freq.push({
        ddm_rmp_lookup_select_frequency_id : 39,
        description : ""
      })
    }
    else
      req_body.freq = "Recurring"

    const freqCB = daily => {
      req_body.report_freq.push({
        ddm_rmp_lookup_select_frequency_id: daily.ddm_rmp_lookup_select_frequency_id,
        description: daily.ddm_rmp_lookup_select_frequency_id===26?this.selected.monthly_others_decs:daily.select_frequency_values
      })
    }
    
    this.selected.daily_weekly.forEach(freqCB);
    this.selected.monthly_bimonthly.forEach(freqCB);
    this.selected.quaterly.forEach(freqCB);
    this.l_lookupData.freq_dealer_allo.filter(ele=>ele['checked']).forEach(freq=>{
      req_body.report_freq.push({
        ddm_rmp_lookup_select_frequency_id: freq.ddm_rmp_lookup_select_frequency_id,
        description: freq.select_frequency_description?freq['description'] :freq.select_frequency_values
      })
    })
    console.log(req_body); 
    this.reportFreqEmitter.emit(req_body)
    }
  }

  emailSelectionDone(event){
    this.selected.dl_list = event;
  }

  resetMDdata(){
    this.l_lookupData = {
      daily_weekly : [],
      monthly_bimonthly : [],
      quaterly : [],
      freq_dealer_allo : []
    }
  }
}

function sortFreq( a, b ) {
  if ( a.ddm_rmp_lookup_select_frequency_id < b.ddm_rmp_lookup_select_frequency_id ){
    return -1;
  }
  if ( a.ddm_rmp_lookup_select_frequency_id > b.ddm_rmp_lookup_select_frequency_id ){
    return 1;
  }
  return 0;
}

