import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-vehicle-event-status',
  templateUrl: './vehicle-event-status.component.html',
  styleUrls: ['./vehicle-event-status.component.css']
})
export class VehicleEventStatusComponent implements OnInit {
  @Input() lookupTableMD = {};
  @Input() divisionData = [];

  constructor() { }

  disabled = false;

  division = [{ name: '001-Chevorlet (US)' }, { name: '004-Buick (US)' }, { name: '006-Cadillac (US)' }, { name: '012-GMC (US)' }];
  divisionSltd = [{ name: '001-Chevorlet (US)' }, { name: '004-Buick (US)' }];

  ddEntity = new FormControl();
  ddEntitys: string[] = ['Retail Only', 'Non-Retail (Includes Fleet)', 'Fleet Only']

  modelYear = new FormControl();
  modelYears: string[] = ['2020', '2019', '2018', '2017'];

  vehLineBrand = new FormControl();
  vehLineBrands: string[] = ['ATS', 'AV', 'Acadia', 'Blazer', 'Bolt', 'CT5', 'CT6', 'CTS', 'Camaro', 'Canyon'];

  orderType = new FormControl();
  orderTypes: string[] = ['FBC', 'FBN', 'FCN', 'FDD', 'FDR', 'FDS', 'FEF'];

  allocGrps = new FormControl();
  allocGrpss: string[] = ['ATS', 'AV', 'BLAZER', 'BOLTEV', 'CAM', 'CAMALL', 'CAMCON'];

  merchModel = new FormControl();
  merchModels: string[] = ['15560', '15760', '1AG37', '1AG67', '1AH37', '1AJ67', '1AK67'];

  commonfield = new FormControl();
  commonfields: string[] = ['Order Number', 'Vehicle Information Number (VIN)', 'Plant Code', 'Delivery Type', 'Target Production Date',
    'Manufacturer\'s Suggested Retail Price (MSRP)'];

  optionCont = new FormControl();
  optionConts: string[] = ['Full Option String', 'Preferred Equipment Group (Trim Level Package)', 'Engine', 'Transmission', 'Exterior Color',
    'Interior Color', 'Other Production Options', 'Family of Options'];

  orderEvent = new FormControl();
  orderEvents: string[] = ['1000 Order Request accepted by GM (Non Retail)', '1100 Preliminary Order Added (Retail)',
    '2000 [Placed Order]Accepted by GM', '2500 Order sent to POMS', '3000 Order Accepted', '3800 Produced', '4000 Available to Ship',
    '4150 Original Invoice', '4B10 Available for Export Shipping', '4200 Shipped', '4250 Ocean Dispatched'];

  turnaround = new FormControl();
  turnarounds: string[] = ['Penetration by Number: Ordered', 'Penetration by Number: Sold', 'Penetration by umber: Produced', 'Turn Rate',
    'Gross Days Supply using: 90 days Sales', 'Net Days Supply using: 90 dayssale', 'Days Supply using: 90 dayssale', 'Adjusted Time to Turn'];

  saleAvl = new FormControl();
  saleAvls: string[] = ['Total Sales (Event 6000)', 'Inventory (Event 5000)', 'Total 30 day sales', 'Total 90 day sales', 'Total Model year sales',
    'In system (Events 2500-3800)', 'In transit (Events 4000-4800)', 'Total Available (Events 2500-5000)', 'Aged Inventory'];

  keyElem = new FormControl();
  keyElems: string[] = ['1000 Order Request Accepted by GM (Non Retail)', '1100 Preliminary Order Added (Retail)', '2000 (Placed Order) Accepted by GM',
    '2500 Order sent to POMS', '3000 Order Accepted', '3800 Produced', '4000 Available to Ship'];

  startDate = new FormControl(new Date())

  endDate = new FormControl(new Date())

  startPicker = new FormControl(new Date())

  endPicker = new FormControl(new Date())
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

  l_lookupTableMD: any = {};

  ngOnInit() {

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

  keyElemChecked() {
    if (this.disabled === true) {
      this.keyElem = new FormControl();
    }
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
}

