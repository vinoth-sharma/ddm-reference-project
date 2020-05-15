import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-vehicle-event-status',
  templateUrl: './vehicle-event-status.component.html',
  styleUrls: ['./vehicle-event-status.component.css']
})
export class VehicleEventStatusComponent implements OnInit {
  @Input() lookupTableMD = {};
 
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
  optionConts: string[] = ['Full Option String', 'Preferred Equipment Group (Trim Level Package)', 'Engine','Transmission', 'Exterior Color', 
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
    model_years : [],
    divisions : [],
    vehicle : [],
    allocation : [],
    merchandising : [],
    distribution_entity : [],
    order_type : []
  }
  selected = {
    model_years : [],
    divisions : [],
    vehicle : [],
    allocation : [],
    merchandising : [],
    distribution_entity : [],
    order_type : []

  }

  l_lookupTableMD:any = {};

  ngOnInit() {

  }

  ngOnChanges(simpleChanges : SimpleChanges){
    console.log(simpleChanges);
    console.log(this.lookupTableMD);
    if(simpleChanges.lookupTableMD){
      this.l_lookupTableMD = this.lookupTableMD;
      this.refillMasterDatatoOptions();
    }
  }

  refillMasterDatatoOptions(){
    this.filtered_MD.model_years = this.l_lookupTableMD.model_year; 
    this.filtered_MD.vehicle = this.l_lookupTableMD.vehicle_data;
    this.filtered_MD.allocation = this.l_lookupTableMD.allocation_grp;
   this.filtered_MD.merchandising = this.l_lookupTableMD.merchandising_data;
   this.filtered_MD.distribution_entity = this.l_lookupTableMD.type_data;
   this.filtered_MD.order_type = this.l_lookupTableMD.order_type;

   
  }

  multiSelectChange(event, type) {
    console.log(this.selected);

    switch (type) {
      case 'market':
        // this.MarketDependencies();
        break;
      case 'region':
        // this.regionDependencies();
        break;
      case 'zone':
        // this.zoneDependencies();
        break;
      default:
        break;
    }

  }


  keyElemChecked() {
    if(this.disabled === true) {
      this.keyElem = new FormControl();
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

}
