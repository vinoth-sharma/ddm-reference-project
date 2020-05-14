import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
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
 
  constructor() { }
  reportFreq: {}[] = [{ label : 'Yes' ,id : true },{ label : 'No',id: false }];

  dayFreq = new FormControl();
  
  biMonFreq = new FormControl();

  quarFreq = new FormControl();

  onDemFreq = new FormControl();
  // onDemFreqs: string[] = ['On Demand', 'On Demand Configurable'];

  lookupData = {
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
    monthly_others_decs : "",
    quaterly : [],
    freq_dealer_allo : []
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
        this.lookupData.daily_weekly.push(freq)
      else if(freq.ddm_rmp_lookup_report_frequency_id === 2)
        this.lookupData.monthly_bimonthly.push(freq)
      else if(freq.ddm_rmp_lookup_report_frequency_id === 3)
        this.lookupData.quaterly.push(freq)
      else if(freq.ddm_rmp_lookup_report_frequency_id === 4)
        this.lookupData.freq_dealer_allo.push(freq)
    })
    console.log(this.lookupData);
    
  }

  resetMDdata(){
    this.lookupData = {
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