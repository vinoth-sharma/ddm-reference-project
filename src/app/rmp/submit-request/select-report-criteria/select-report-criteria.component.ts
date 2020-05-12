import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, Input } from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'select-report-criteria',
  templateUrl: './select-report-criteria.component.html',
  styleUrls: ['./select-report-criteria.component.css']
})
export class SelectReportCriteriaComp implements OnInit {
  @Input() lookupMasterData = {};
  l_lookupMasterData:any = {};

  selected = {
    market : [],
    region : [],
    division : [],
    lma : [],
    gmma : [],
    zone : [],
    area : []
  }

  filtered_master_data = {
    market : [],
    region : [],
    division : [],
    lma : [],
    gmma : [],
    zone : [],
    area : []
  }

  constructor() { }
  ngOnInit(): void {
    // console.log(market_settings);
    console.log(this.lookupMasterData);
    this.l_lookupMasterData =  this.lookupMasterData;
    this.refillDropdownMasterData();
  }


  refillDropdownMasterData(){
    this.filtered_master_data.market = this.l_lookupMasterData.market_data;
  }

  onChangeMarket(){
    console.log(this.selected);
    this.MarketDependencies(6);
  }

  MarketDependencies(marketindex: any) {
    console.log(this.filtered_master_data.market);
    console.log(this.l_lookupMasterData);
    let l_market_ids = this.selected.market.map(ele=>ele.ddm_rmp_lookup_market_id);
    let vv = function (ele){
      if(l_market_ids.includes(ele.ddm_rmp_lookup_market)){
        return ele
      }
    }

    this.filtered_master_data.region = this.l_lookupMasterData.region_data.filter(vv)
    this.filtered_master_data.division = this.l_lookupMasterData.division_data.filter(vv)
    this.filtered_master_data.lma = this.l_lookupMasterData.lma_data.filter(vv)
    this.filtered_master_data.gmma = this.l_lookupMasterData.lma_data.filter(vv)

    

    console.log(this.selected);

  }

  marketCompareCallback(){

  }

public market_settings = {
  text: "Market",
  singleSelection: false,
  primaryKey: 'ddm_rmp_lookup_market_id',
  labelKey: 'market',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  classes: "select_report_criteria_multiselect",
  maxHeight: '200px'
};

public region_settings = {
  text: "Region",
  singleSelection: false,
  primaryKey: 'ddm_rmp_lookup_country_region_id',
  labelKey: 'region_desc',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  enableCheckAll: true,
  classes: "select_report_criteria_multiselect",
  maxHeight: '200px'
};

public zone_settings = {
  text: "Zone",
  singleSelection: false,
  primaryKey: 'ddm_rmp_lookup_region_zone_id',
  labelKey: 'zone_desc',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  maxHeight: '200px',
  enableCheckAll: true,
  classes: "select_report_criteria_multiselect"
};

public area_settings = {
  text: "Area",
  singleSelection: false,
  primaryKey: 'ddm_rmp_lookup_zone_area_id',
  labelKey: 'area_desc',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  maxHeight: '200px',
  enableCheckAll: true,
  classes: "select_report_criteria_multiselect"
};

public gmma_settings = {
  text: "GMMA",
  singleSelection: false,
  primaryKey: 'ddm_rmp_lookup_gmma_id',
  labelKey: 'gmma_desc',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  maxHeight: '200px',
  enableCheckAll: true,
  classes: "select_report_criteria_multiselect"
};

public division_settings = {
  text: "Division",
  singleSelection: false,
  primaryKey: 'ddm_rmp_lookup_division_id',
  labelKey: 'division_desc',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  maxHeight: '200px',
  enableCheckAll: true,
  classes: "select_report_criteria_multiselect"
};

public lma_settings = {
  text: "LMA",
  singleSelection: false,
  primaryKey: 'ddm_rmp_lookup_lma_id',
  labelKey: 'lmg_desc',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  maxHeight: '200px',
  enableCheckAll: true,
  classes: "select_report_criteria_multiselect"
};

}

function masterIdCBFunc(ele){

}