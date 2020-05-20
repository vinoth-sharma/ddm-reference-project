import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { DjangoService } from "../../django.service";
import { SubmitRequestService } from "../submit-request.service";
import Utils from 'src/utils';
import { NgToasterComponent } from '../../../custom-directives/ng-toaster/ng-toaster.component';
import { AuthenticationService } from 'src/app/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { RequestOnbehalfComp } from '../request-onbehalf/request-onbehalf.component';
import { DataProviderService } from '../../data-provider.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'select-report-criteria',
  templateUrl: './select-report-criteria.component.html',
  styleUrls: ['./select-report-criteria.component.css']
})
export class SelectReportCriteriaComp implements OnInit {
  // @Input() lookupMasterData = {};
  // @Input() lookupTableMD = {};

  @Input() selectedReqData: any;
  @Output() requestCreated = new EventEmitter();

  l_lookup_MD: any = {
    market: {},
    other: {}
  }

  l_lookupMasterData: any = {};

  selected = {
    market: [],
    region: [],
    division: [],
    lma: [],
    gmma: [],
    zone: [],
    area: [],
    bac: [],
    fan: []
  }

  filtered_master_data = {
    market: [],
    region: [],
    division: [],
    lma: [],
    gmma: [],
    zone: [],
    area: []
  }

  special_identifiers_obj = {
    bac: [],
    fan: []
  };

  public req_body = {
    frequency: "",
    select_frequency: [],
    special_identifiers: [],
    fan_selection: [],
    market_selection: [],
    division_selection: [],
    country_region_selection: [],
    region_zone_selection: [],
    zone_area_selection: [],
    bac_selection: [],
    gmma_selection: [],
    lma_selection: [],
    report_id: null,
    dl_list: [],
    report_detail: {
      requestor: "",
      status: "Incomplete",
      status_date: null,
      report_type: "",
      title: "",
      additional_req: "",
      created_on: new Date(),
      on_behalf_of: "",
      assigned_to: "",
      link_to_results: "",
      query_criteria: "",
      link_title: ""
    }
  }

  public userData = {
    fullName: "",
    userRole: "",
    email: ""
  }

  response_body = {
    division_selected: [],
    report_id: null,
    on_behalf_of: "",
    status: "",
    message: ""
  }

  constructor(public djangoService: DjangoService,
    public ngToaster: NgToasterComponent,
    public dialog: MatDialog,
    private dataProvider: DataProviderService,
    public submitService: SubmitRequestService,
    public authService: AuthenticationService) {
    this.authService.myMethod$.subscribe(role => {
      if (role) {
        this.userData.fullName = role['first_name'] + ' ' + role['last_name']
        this.userData.userRole = role['role']
        this.userData.email = role['email']
      }
    })
  }

  ngOnInit() {
    this.dataProvider.currentlookupData.subscribe(element => {
      // console.log(element);
      // this.lookupMasterData = element;
      this.l_lookup_MD.market = element;
      if (this.l_lookup_MD.market) {
        this.filtered_master_data.market = this.l_lookup_MD.market.market_data;
      }
    })

    this.dataProvider.currentlookUpTableData.subscribe((tableDate: any) => {
      // console.log(tableDate);
      // this.lookupTableMasterData = tableDate ? tableDate.data : {};
      this.l_lookup_MD.other = tableDate ? tableDate.data : {};
      if (this.l_lookup_MD.other) {
        this.special_identifiers_obj.bac = []
        this.special_identifiers_obj.fan = []
        this.refillLookupTableData();
      }
    })
    // console.log("src done");
    this.submitService.updateLoadingStatus({ status: true, comp: "src" })
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.l_lookup_MD.market = this.lookupMasterData;
    // this.l_lookup_MD.other = this.lookupTableMD;
    // if (this.l_lookup_MD.market) {
    //   this.filtered_master_data.market = this.l_lookup_MD.market.market_data;
    // }
    // if (this.l_lookup_MD.other) {
    //   console.log(this.l_lookup_MD.other);
    //   this.special_identifiers_obj.bac = []
    //   this.special_identifiers_obj.fan = []
    //   this.refillLookupTableData();

    // }
    // console.log(this.special_identifiers_obj);

    if (this.selectedReqData) {
      // console.log(this.selectedReqData);
      this.refillSelectedRequestData(this.selectedReqData);
    }

  }

  refillLookupTableData() {
    //master data of bac/fan radio button
    this.l_lookup_MD.other.special_identifiers.forEach(si => {
      if ([1, 5].includes(si.ddm_rmp_lookup_special_identifiers))
        this.special_identifiers_obj.bac.push(si)
      else
        this.special_identifiers_obj.fan.push(si)
    })

  }


  showData() {
    console.log(this.filtered_master_data);
    console.log(this.selected);
    console.log(this.special_identifiers_obj);
  }


  refillDropdownMasterData() {
    this.filtered_master_data.market = this.l_lookup_MD.market.market_data;
  }

  multiSelectChange(event, type) {
    switch (type) {
      case 'market':
        this.MarketDependencies();
        break;
      case 'region':
        this.regionDependencies();
        break;
      case 'zone':
        this.zoneDependencies();
        break;
      default:
        break;
    }

  }

  MarketDependencies() {
    let l_market_ids = this.selected.market.map(ele => ele.ddm_rmp_lookup_market_id);
    let marketCBFunc = function (ele) {
      if (l_market_ids.includes(ele.ddm_rmp_lookup_market)) {
        return ele
      }
    }
    this.filtered_master_data.region = this.l_lookup_MD.market.region_data.filter(marketCBFunc);
    this.filtered_master_data.division = this.l_lookup_MD.market.division_data.filter(marketCBFunc);
    this.filtered_master_data.lma = this.l_lookup_MD.market.lma_data.filter(marketCBFunc);
    this.filtered_master_data.gmma = this.l_lookup_MD.market.gmma_data.filter(marketCBFunc);
    this.resolveSelectedMarketDependencies(marketCBFunc)
    this.regionDependencies();
    this.zoneDependencies();
  }

  resolveSelectedMarketDependencies(callback) {
    this.selected.region = this.selected.region.filter(callback);
    this.selected.division = this.selected.division.filter(callback);
    this.selected.lma = this.selected.lma.filter(callback);
    this.selected.gmma = this.selected.gmma.filter(callback);
  }

  regionDependencies() {
    let l_region_ids = this.selected.region.map(ele => ele.ddm_rmp_lookup_country_region_id);
    let regionCBFunc = function (ele) {
      if (l_region_ids.includes(ele.ddm_rmp_lookup_country_region)) {
        return ele
      }
    }
    this.filtered_master_data.zone = this.l_lookup_MD.market.zones_data.filter(regionCBFunc)
    this.selected.zone = this.selected.zone.filter(regionCBFunc);
    this.zoneDependencies();
  }

  zoneDependencies() {
    let l_zone_ids = this.selected.zone.map(ele => ele.ddm_rmp_lookup_region_zone_id);
    let zoneCBFunc = function (ele) {
      if (l_zone_ids.includes(ele.ddm_rmp_lookup_region_zone)) {
        return ele
      }
    }
    this.filtered_master_data.area = this.l_lookup_MD.market.area_data.filter(zoneCBFunc);
    this.selected.area = this.selected.area.filter(zoneCBFunc);
  }


  repFreqChange(req) {
    // console.log(req);
    if (!this.selected.market.length)
      this.ngToaster.error("Market selection is mandatory")
    else if (!this.selected.division.length)
      this.ngToaster.error("Division selection is mandatory")
    else
      this.submitReportCriteria(req);
  }

  submitReportCriteria(freqReq) {

    this.req_body.market_selection = this.selected.market;
    this.req_body.division_selection = this.selected.division;
    this.req_body.gmma_selection = this.selected.gmma;
    this.req_body.lma_selection = this.selected.lma;
    this.req_body.country_region_selection = this.selected.region;
    this.req_body.region_zone_selection = this.selected.zone;
    this.req_body.zone_area_selection = this.selected.area;

    this.req_body.bac_selection = this.selected.bac;
    this.req_body.fan_selection = this.selected.fan;

    let specl_identfrs = [];
    for (const key in this.special_identifiers_obj) {
      if (this.special_identifiers_obj.hasOwnProperty(key)) {
        const obj_ele = this.special_identifiers_obj[key];
        obj_ele.forEach(element => {
          if (element['checked'] === "Yes") {
            delete element['checked'];
            specl_identfrs.push(element)
          }
        });
      }
    }

    this.req_body.special_identifiers = specl_identfrs;

    this.req_body.dl_list = freqReq.dl_list;
    this.req_body.select_frequency = freqReq.report_freq;
    this.req_body.frequency = freqReq.freq

    this.req_body.report_detail.requestor = this.userData.fullName;
    // this.req_body.report_detail.created_on = new Date();
    this.req_body.report_detail.status_date = new Date();
    this.req_body.report_detail.on_behalf_of = this.submitService.getSubmitOnBehalf();

    // console.log(this.req_body);

    Utils.showSpinner();
    this.submitService.submitUserMarketSelection(this.req_body).subscribe(response => {
      console.log(response);
      // this.submitService.setSubmitOnBehalf({});
      Utils.hideSpinner();
      this.ngToaster.success("Report created successfully")
      this.response_body.division_selected = response.division_data;
      this.response_body.report_id = response['report_data']['ddm_rmp_post_report_id'];
      this.response_body.status = response['report_data']['status'];
      this.response_body.on_behalf_of = response['report_data']['on_behalf_of'];

      if (response['report_data']['status'] === "Incomplete")
        this.response_body.message = "<span class='red'>Please proceed to 'Dealer Allocation' or 'Vehicle Event Status' from sidebar to complete the Request</span>"
      else if (response['report_data']['status'] === "Pending")
        this.response_body.message = `<span> Request status - ${this.response_body.status} </span>`
      else
        this.response_body.message = ""

      this.req_body.report_id = response['report_data']['ddm_rmp_post_report_id'];
      this.req_body.report_detail.status = response['report_data']['status'];

      this.requestCreated.emit(this.response_body)
    }, err => {
      Utils.hideSpinner();
      console.log(err);
    });

  }

  refillSelectedRequestData(reqData) {
    let marketIds = reqData.market_data.map(ele => ele.ddm_rmp_lookup_market);
    this.selected.market = this.l_lookup_MD.market.market_data.filter(market => {
      if (marketIds.includes(market.ddm_rmp_lookup_market_id))
        return market
    });
    this.multiSelectChange({}, "market");

    let divisionIds = reqData.division_dropdown.map(ele => ele.ddm_rmp_lookup_division);
    this.selected.division = this.l_lookup_MD.market.division_data.filter(division => {
      if (divisionIds.includes(division.ddm_rmp_lookup_division_id))
        return division
    });

    let regionIds = reqData.country_region_data.map(ele => ele.ddm_rmp_lookup_country_region);
    this.selected.region = this.l_lookup_MD.market.region_data.filter(region => {
      if (regionIds.includes(region.ddm_rmp_lookup_country_region_id))
        return region
    });
    this.multiSelectChange({}, "region");


    let zoneIds = reqData.region_zone_data.map(ele => ele.ddm_rmp_lookup_region_zone);
    this.selected.zone = this.l_lookup_MD.market.zones_data.filter(zone => {
      if (zoneIds.includes(zone.ddm_rmp_lookup_region_zone_id))
        return zone
    });
    this.multiSelectChange({}, "zone");


    let areaIds = reqData.zone_area_data.map(ele => ele.ddm_rmp_lookup_zone_area);
    this.selected.area = this.l_lookup_MD.market.area_data.filter(area => {
      if (areaIds.includes(area.ddm_rmp_lookup_zone_area_id))
        return area
    });

    let gmmaIds = reqData.gmma_data.map(ele => ele.ddm_rmp_lookup_gmma);
    this.selected.gmma = this.l_lookup_MD.market.gmma_data.filter(gmma => {
      if (gmmaIds.includes(gmma.ddm_rmp_lookup_gmma_id))
        return gmma
    });

    let lmaIds = reqData.lma_data.map(ele => ele.ddm_rmp_lookup_lma);
    this.selected.lma = this.l_lookup_MD.market.lma_data.filter(lma => {
      if (lmaIds.includes(lma.ddm_rmp_lookup_lma_id))
        return lma
    });
    reqData.special_identifier_data.forEach(si => {
      this.special_identifiers_obj.bac.forEach(bac => { if (bac.ddm_rmp_lookup_special_identifiers === si.ddm_rmp_lookup_special_identifiers) bac['checked'] = "Yes" })
      this.special_identifiers_obj.fan.forEach(fan => { if (fan.ddm_rmp_lookup_special_identifiers === si.ddm_rmp_lookup_special_identifiers) fan['checked'] = "Yes" })
    });
    this.selected.bac = reqData.bac_data[0].bac_desc;
    this.selected.fan = reqData.fan_data[0].fan_data;

    this.req_body.report_detail.additional_req = reqData.report_data.additional_req;
    this.req_body.report_detail.assigned_to = reqData.report_data.assigned_to;
    this.req_body.report_detail.created_on = reqData.report_data.created_on;
    this.req_body.report_detail.on_behalf_of = reqData.report_data.on_behalf_of;
    //  this.req_body.report_detail. = reqData.report_data.organization
    this.req_body.report_detail.query_criteria = reqData.report_data.query_criteria;
    //  this.req_body.report_detail. = reqData.report_data.report_name
    this.req_body.report_detail.report_type = reqData.report_data.report_type;
    this.req_body.report_detail.requestor = reqData.report_data.requestor;
    this.req_body.report_detail.status = reqData.report_data.status;
    this.req_body.report_detail.title = reqData.report_data.title;
    this.req_body.report_id = reqData.ddm_rmp_post_report_id;

    this.submitService.setSubmitOnBehalf(this.req_body.report_detail.on_behalf_of,"");
    this.response_body.report_id = this.req_body.report_id;
    this.response_body.status = this.req_body.report_detail.status;
    if (this.req_body.report_detail.status === "Incomplete")
      this.response_body.message = "<span class='red'>Please proceed to 'Dealer Allocation' or 'Vehicle Event Status' from sidebar to complete the Request</span>"
    else if (this.req_body.report_detail.status === "Pending")
      this.response_body.message = `<span> Request status - ${this.response_body.status}</span>`
    else
      this.response_body.message = ""

  }

  openRequestOnBehalf() {
    this.dialog.open(RequestOnbehalfComp, {
      data: {}
    })
  }

  public market_settings = {
    label: "Market",
    primary_key: 'ddm_rmp_lookup_market_id',
    label_key: 'market',
    title: "Market Selection<span class='red'>*</span>"
  };

  public region_settings = {
    label: "Region",
    primary_key: 'ddm_rmp_lookup_country_region_id',
    label_key: 'region_desc',
    title: "Region Selection"
  };

  public zone_settings = {
    label: "Zone",
    primary_key: 'ddm_rmp_lookup_region_zone_id',
    label_key: 'zone_desc',
    title: "Zone Selection"
  };

  public area_settings = {
    label: "Area",
    primary_key: 'ddm_rmp_lookup_zone_area_id',
    label_key: 'area_desc',
    title: "Area Selection"
  };

  public gmma_settings = {
    label: "GMMA",
    primary_key: 'ddm_rmp_lookup_gmma_id',
    label_key: 'gmma_desc',
    title: "GMMA Selection"
  };

  public division_settings = {
    label: "Division",
    primary_key: 'ddm_rmp_lookup_division_id',
    label_key: 'division_desc',
    title: "Division Selection<span class='red'>*</span>"
  };

  public lma_settings = {
    label: "LMA",
    primary_key: 'ddm_rmp_lookup_lma_id',
    label_key: 'lmg_desc',
    title: "LMA Selection"
  };

}
