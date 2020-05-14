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
  @Input() lookupTableMD = {};

  l_lookup_MD:any = {
    market : {},
    other : {}
  }

  l_lookupMasterData:any = {};

  selected = {
    market : [],
    region : [],
    division : [],
    lma : [],
    gmma : [],
    zone : [],
    area : [],
    bac : [],
    fan : ["fano"]
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

  special_identifiers_obj = {
    bac : [],
    fan : []
  };

  constructor() { }
  ngOnInit(){

  }

  ngOnChanges(): void {
    this.l_lookup_MD.market =  this.lookupMasterData;
    this.l_lookup_MD.other =  this.lookupTableMD;
    if(this.l_lookup_MD.market){
      this.filtered_master_data.market = this.l_lookup_MD.market.market_data;
    }
    if(this.l_lookup_MD.other){
      console.log(this.l_lookup_MD.other);
      this.special_identifiers_obj.bac= []
      this.special_identifiers_obj.fan= []
      this.refillLookupTableData();

    }
    console.log(this.special_identifiers_obj);
    

  }

  refillLookupTableData(){
    //master data of bac/fan radio button
    this.l_lookup_MD.other.special_identifiers.forEach(si=>{
      if([1,5].includes(si.ddm_rmp_lookup_special_identifiers))
        this.special_identifiers_obj.bac.push(si)
      else
        this.special_identifiers_obj.fan.push(si)
    })

  }


  showData(){
    console.log(this.filtered_master_data);
    console.log(this.selected);
    console.log(this.special_identifiers_obj);
    
  }


  refillDropdownMasterData(){
    this.filtered_master_data.market = this.l_lookup_MD.market.market_data;
  }

  multiSelectChange(event){
    console.log(this.selected);
    this.MarketDependencies();
  }

  MarketDependencies() {
    let l_market_ids = this.selected.market.map(ele=>ele.ddm_rmp_lookup_market_id);
    let vv = function (ele){
      if(l_market_ids.includes(ele.ddm_rmp_lookup_market)){
        return ele
      }
    }
    this.filtered_master_data.region = this.l_lookup_MD.market.region_data.filter(vv)
    this.filtered_master_data.division = this.l_lookup_MD.market.division_data.filter(vv)
    this.filtered_master_data.lma = this.l_lookup_MD.market.lma_data.filter(vv)
    this.filtered_master_data.gmma = this.l_lookup_MD.market.gmma_data.filter(vv)
    console.log(this.selected);
  }

  marketCompareCallback(){

  }

public market_settings = {
  label: "Market",
  primary_key: 'ddm_rmp_lookup_market_id',
  label_key: 'market',
  title : "Market Selection"
};

public region_settings = {
  label: "Region",
  primary_key: 'ddm_rmp_lookup_country_region_id',
  label_key: 'region_desc',
  title : "Region Selection"
};

public zone_settings = {
  label: "Zone",
  primary_key: 'ddm_rmp_lookup_region_zone_id',
  label_key: 'zone_desc',
  title : "Zone Selection"
};

public area_settings = {
  label: "Area",
  primary_key: 'ddm_rmp_lookup_zone_area_id',
  label_key: 'area_desc',
  title : "Area Selection"
};

public gmma_settings = {
  label: "GMMA",
  primary_key: 'ddm_rmp_lookup_gmma_id',
  label_key: 'gmma_desc',
  title : "GMMA Selection"
};

public division_settings = {
  label : "Division",
  primary_key: 'ddm_rmp_lookup_division_id',
  label_key: 'division_desc',
  title : "Division Selection"
};

public lma_settings = {
  label: "LMA",
  primary_key: 'ddm_rmp_lookup_lma_id',
  label_key: 'lmg_desc',
  title : "LMA Selection"
};

}

function masterIdCBFunc(ele){

}