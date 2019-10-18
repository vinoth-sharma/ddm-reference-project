import { Component, OnInit, AfterViewInit } from '@angular/core';
import "../../../../assets/debug2.js";
import 'jquery'
declare var jsPDF: any;
declare var $: any;
import { Router } from "@angular/router";
import { NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { ToastrService } from "ngx-toastr";
import { RepotCriteriaDataService } from "../../services/report-criteria-data.service";
import * as Rx from "rxjs";
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';
import { AuthenticationService } from "src/app/authentication.service";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-to-sale',
  templateUrl: './order-to-sale.component.html',
  styleUrls: ['./order-to-sale.component.css']
})
export class OrderToSaleComponent implements OnInit, AfterViewInit {


  abc = [
    { ddm_rmp_lookup_division_id: 14, ddm_rmp_lookup_market: 3, division_desc: "012 - GMC(Export)" }
  ]

  generated_report_status: string;
  generated_report_id: number;
  selectedItems = [];
  dropdownSettings = {};
  order_to_sales_selection = {};

  order_to_sale_selection: object;
  public editorConfig = {
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Times New Roman, Times, serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    removePlugins: ['ImageUpload', 'ImageButton', 'Link', 'MediaEmbed', 'Iframe', 'Save'],
    fontSize: {
      options: [
        9, 11, 13, 'default', 17, 19, 21, 23, 24
      ]
    }
  };

  textData;
  type_data_value = {};
  finalData = {
    "dosp_start_date": null,
    "dosp_end_date": null,
    "checkbox_data": [],
    'distribution_data': [],
    'data_date_range': { "StartDate": null, "EndDate": null },
    'report_detail': {
      'title': "",
      'status': "",
      'created_on': "",
      "assigned_to": "",
      "additional_req": "",
      "report_type": "",
      "status_date": "",
      "on_behalf_of": "",
      "link_to_results": "",
      "link_title": "",
      "requestor": "",
      "query_criteria": ""
    }
  }


  temp_freq = {
    'freq_values': [],
    'desc': []
  }
  Report = {}
  report_status: string;
  Report_title: string;
  Report_Req: string = "";
  date: string
  targetValue : any;
  saveit = false;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  fromDateDOSP: NgbDate;
  toDateDOSP: NgbDate;
  customizedFromDateDOSP: string;
  customizedToDateDOSP: string;
  Checkbox_selected = {}
  targetProd: boolean = true;
  otsObj = {
    divisionRadio : "Display",
    modelRadio : "Display",
    vlbRadio : "Display",
    alloRadio : "Display",
    merchRadio : "Display",
    orderTypeRadio : "Display",
    otherDesc : ""
  }
  dateSelect: any;

  title = 'date-picker';
  model_start;
  model_end;
  dataModel: any;
  dropdownOptions = ["Original", "Subsequent", "Both"];
  config = {
    displayKey: "option",
    search: true,
    limitTo: 3
  };
  
  dropdownSettingsTarget = {};
  TargetSelect: any;
  selectedItemsDivision = {};
  dropdownSettingsDivision = {};
  divisionRadioSelection: any;
  division_index = [];

  selectedItemsModelYear = [];
  dropdownSettingsModelYear = {};
  modelRadio: any;
  modelYearSelectedItems: any;
  modelYear: any;

  allocationSelectItems = [];
  allocationIndex: Array<number> = [];
  selectedItemsAllocation = [];
  dropdownSettingsAllocation = {};
  alloRadio: any;
  allo: any;
  allocationFinalList = []

  selectedItemsMerchandize = {};
  dropdownSettingsMerchandize = {};
  merchandizeItemsSelect = [];
  merchandizeFinalList = [];
  merchandiseRadio: any;
  merchandizeSelecteditems: any;
  merchandize: any;

  selectedItemsOrderType = [];
  dropdownSettingsOrderType = {};
  orderRadio: any;
  orderTypeSelecteditems: any;
  orderType: any;

  vehicleIndex: Array<number> = [];
  selectedItemsVehicleLine = [];
  dropdownSettingsVehicleLine = {};
  vehicleDataSelecteditems: any;
  vehicleData: any;

  selectedItemsOrderEvent = [];
  dropdownSettingsOrderEvent = {};
  orderEvent: any;

  gcheck: boolean;
  ncheck: boolean;
  check: boolean;

  orderToSaleDropdowns: any;
  typeOfData: any;
  displaySummary: any;
  orderEventsAvailable: any;
  dospDataAvailable: any;
  commonlyRequestedFields: any;
  commonReqCheckbox = {};

  distributionEntityFields: any;
  distributionEntityCheckbox = {};
  optionContentAvailable: any;
  optionContentCheckbox = {};
  daysSupply: any;
  DaysSupplyCheckbox = {};

  salesDataAvailable: any;
  SalesAvailabilityCheckbox = {};
  DospCheckbox = {};
  orderEventsCheckbox = {};
  selectedMonth: any;
  Checkbox_data: any;
  Checkbox_value = {};
  DropValues = {};
  obj_keys: Array<string>
  val: {}[];
  obj_keys1: Array<string>
  val1: {}[];
  radioButton: any;
  distributionRadio = "";
  distId;
  counter;
  targetPop = "Select"
  startDate: {};
  endDate: {};
  otsElement: Object;
  abcd: any;
  report_message: string;
  summary: any;
  restorepage: any;
  printcontent: any;
  lookup;
  userdivdata;
  divDataSelected = [];
  reportId = 0;
  orderEventCheck: any;
  orderEventId = [];
  checkboxId = [];
  left = [];
  other_description: any[];
  orderEventCheckFilter: any;
  file;
  flag = true;
  summary_flag = true;
  typeofdata_flag = false;
  modal_validation_flag = false;
  frequency_flag: boolean;
  contact_flag: boolean;
  ot_flag = false;

  contents;
  enable_edits = false
  editModes = false;
  original_content;
  namings: any;
  editorHelp: any;
  public Editor = ClassicEditor;

  user_role: string;
  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  description_text = {
    "ddm_rmp_desc_text_id": 12,
    "module_name": "He_OrderToSale",
    "description": ""
  }
  from_date: string;
  user_name: string;
  customizedFromDate: string;
  customizedToDate: string;
  error_message: string;
  
  bac_description: any;
  fan_desc: any;
  text_notification: any;
  market_description: any;
  zone_description: any;
  area_description: any;
  region_description: any;
  lma_description: any;
  gmma_description: any;
  allocation_group: any;
  model_year: any;
  merchandising_model: any;
  vehicle_line_brand: any;
  order_event: any;
  order_type: any;
  checkbox_data: any;
  report_frequency: any;
  special_identifier: any;
  division_dropdown: any;
  report_frequency_desc: any;
  other_info: any;
  startDateDOSP: {};
  endDateDOSP: {};
  hoveredDateDOSP: NgbDate;
  dosp_calendar_flag: boolean;
  temp_min_date: NgbDate;
  temp_max_date: NgbDate;
  temp_max_date_DOSP: NgbDate;
  temp_min_date_DOSP: NgbDate;
  report_create: any;
  assigned_to: any;
  report_on_behalf = "";

  constructor(private router: Router, calendar: NgbCalendar,
    private django: DjangoService, private report_id_service: GeneratedReportService, private auth_service: AuthenticationService,
    private DatePipe: DatePipe, private spinner: NgxSpinnerService, private dataProvider: DataProviderService, private toastr: ToastrService,
    private reportDataService: RepotCriteriaDataService) {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"]
        this.user_role = role["role"]
      }
    })

    this.gcheck = false;
    this.ncheck = false;
    this.check = false;
    dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.lookup = element
        let ref = this.lookup['data']['desc_text']
        let temps = ref.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 12;
        })
        if (temps) {
          this.original_content = temps.description;
        }
        else {
          this.original_content = ""
        }
        this.namings = this.original_content;
        this.reportDataService.getReportID().subscribe(ele => {
          this.reportId = ele;
        });

        this.report_id_service.currentSelections.subscribe(report_id => {
          this.generated_report_id = report_id
        })
        this.report_id_service.currentstatus.subscribe(status => {
          this.generated_report_status = status
        })
        this.report_id_service.currentDivisionSelected.subscribe(divisions => {
          if (divisions != null) {
            this.divDataSelected = divisions
          }
          else {
            this.divDataSelected = []
          }
        })

        if (this.generated_report_id == 0)
          this.report_message = "";
        else {
          this.report_message = "Request #" + this.generated_report_id + " " + this.generated_report_status
        }
        this.spinner.show()
        this.otsElement = this.userdivdata
        this.abcd = this.otsElement
        this.divDataSelected.map(element => {
          if (!(this.division_index.includes(element['ddm_rmp_lookup_division_id']))) {
            this.division_index.push(element['ddm_rmp_lookup_division_id'])
          }
        })

        this.selectedItemsDivision = [];
        this.selectedItemsModelYear = [];
        this.selectedItemsAllocation = [];
        this.selectedItemsMerchandize = [];
        this.selectedItemsVehicleLine = [];
        this.selectedItemsOrderType = [];
        this.selectedItemsOrderEvent = [];
        this.dropdownSettingsOrderEvent = {
          singleSelection: false,
          idField: 'ddm_rmp_lookup_dropdown_order_event_id',
          textField: 'order_event',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 1,
          allowSearchFilter: true
        };

        this.dropdownSettingsDivision = {
          singleSelection: false,
          idField: '',
          textField: '',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 2,
          allowSearchFilter: true
        };

        this.dropdownSettingsAllocation = {
          singleSelection: false,
          idField: 'ddm_rmp_lookup_dropdown_allocation_group_id',
          textField: 'allocation_group',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 2,
          allowSearchFilter: true
        };

        this.dropdownSettingsMerchandize = {
          singleSelection: false,
          idField: 'ddm_rmp_lookup_dropdown_merchandising_model_id',
          textField: 'merchandising_model',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 2,
          allowSearchFilter: true
        };

        this.dropdownSettingsModelYear = {
          singleSelection: false,
          idField: 'ddm_rmp_lookup_dropdown_model_year_id',
          textField: 'model_year',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 2,
          allowSearchFilter: true
        };

        this.dropdownSettingsOrderType = {
          singleSelection: false,
          idField: 'ddm_rmp_lookup_dropdown_order_type_id',
          textField: 'order_type',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 2,
          badgeShowLimit: 2,
          allowSearchFilter: true
        };

        this.dropdownSettingsVehicleLine = {
          text: "Brand",
          singleSelection: false,
          idField: 'ddm_rmp_lookup_dropdown_vehicle_line_brand_id',
          textField: 'vehicle_line_brand',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 2,
          allowSearchFilter: true
        };

        this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 2,
          allowSearchFilter: true
        };

        $('input.gross-sales').on('click', function () {
          $('input.gross-sales').not(this).prop('checked', false);
        });

        $('input.net-sales').on('click', function () {
          $('input.net-sales').not(this).prop('checked', false);
        });

        this.getOrderToSaleContent();

      }
    })

    if (localStorage.getItem('report_id')) {
      this.spinner.show();
      this.previousSelections(localStorage.getItem('report_id'));
    }
    else{
      this.spinner.hide();
    }
  }

  notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  ngOnInit() {
    // this.targetProd = true;
    this.salesDataAvailable = this.Checkbox_data.filter(element => element.checkbox_desc == "Sales and Availability")
  }

  ngAfterViewInit() {
    ClassicEditor.create(document.querySelector('#ckEditorHelp'), this.editorConfig).then(editor => {
      this.editorHelp = editor;
      this.editorHelp.setData(this.namings);
      this.editorHelp.isReadOnly = true;
    })
      .catch(error => {
      });
  }

  content_edits() {
    this.spinner.show()
    this.editModes = false;
    this.editorHelp.isReadOnly = true;
    this.description_text['description'] = this.editorHelp.getData();
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {

      let temp_desc_text = this.lookup['data']['desc_text']
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 12) {
          temp_desc_text[index] = this.description_text
        }
      })
      this.lookup['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.lookup)
      this.editModes = false;
      this.ngOnInit()
      this.original_content = this.namings;
      this.editorHelp.setData(this.namings)
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {
    if (this.editModes) {
      this.editorHelp.isReadOnly = true;
    } else {
      this.editorHelp.isReadOnly = false;
    }
    this.editModes = !this.editModes;
    this.namings = this.original_content;
    this.editorHelp.setData(this.namings)
    $('#edit_button').show()
  }


  getOrderToSaleContent() {
    this.Checkbox_data = this.lookup.data.checkbox_data

    //---------------------------------------DropDown Data-----------------------------------------------------------------------------
    
    this.allo = this.lookup.data.allocation_grp.sort((a, b) => a.allocation_group > b.allocation_group ? 1 : -1);
    this.modelYearSelectedItems = this.lookup.data.model_year
    this.merchandize = this.lookup.data.merchandising_data.sort((a, b) => a.merchandising_model > b.merchandising_model ? 1 : -1);
    this.orderTypeSelecteditems = this.lookup.data.order_type.sort((a, b) => a.order_type > b.order_type ? 1 : -1);
    this.vehicleData = this.lookup.data.vehicle_data.sort((a, b) => a.vehicle_line_brand > b.vehicle_line_brand ? 1 : -1);
    this.orderEvent = this.lookup.data.order_event.sort((a, b) => a.order_event > b.order_event ? 1 : -1);
    this.vehicleDataSelecteditems = this.vehicleData.filter(element => {
      return this.division_index.includes(element.ddm_rmp_lookup_division)
    })
      this.allocationFinalList = this.allo.filter(element=>{
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })
      this.merchandizeFinalList = this.merchandize.filter(element=>{
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })
    

    //------------------------------- For the Dropdowns-----------------------------------------------------------------------
    //------------------------------- For Checkbox groups--------------------------------------------------------------------

    this.orderEventsAvailable = this.Checkbox_data.filter(element => element.checkbox_desc == "Order Events Available for Display");
    this.commonlyRequestedFields = this.Checkbox_data.filter(element => element.checkbox_desc == "Commonly Requested Fields Available for Display");
    this.optionContentAvailable = this.Checkbox_data.filter(element => element.checkbox_desc == "Option Content Available for Display")
    this.dospDataAvailable = this.Checkbox_data.filter(element => element.checkbox_desc == "DOSP Data Available")
    this.salesDataAvailable = this.Checkbox_data.filter(element => element.checkbox_desc == "Sales and Availability")
    this.daysSupply = this.Checkbox_data.filter(element => element.checkbox_desc == "Days Supply, Time to Turn and Turn Rate");
    if (this.reportId != 0) {
      this.setDefaultSelections();
    }

    //------------------------------- For Display and Summary Radio Buttons--------------------------------------------------

    this.displaySummary = this.lookup.data.display_summary;
    this.displaySummary = Array.of(this.displaySummary);
    if (this.displaySummary[0][0].ddm_rmp_lookup_display_summary_id == '1') {
      this.displaySummary[0][0].default = "checked";
      this.displaySummary[0][1].checked = true;
      this.displaySummary[0][0].checked = false;
    } else {
      this.displaySummary[1][0].default = "unchecked";
    }

    this.typeOfData = this.lookup.data.type_data;
    this.typeOfData.sort((a, b) => (a.ddm_rmp_lookup_ots_type_data_id > b.ddm_rmp_lookup_ots_type_data_id) ? 1 : ((b.ddm_rmp_lookup_ots_type_data_id > a.ddm_rmp_lookup_ots_type_data_id) ? -1 : 0));

    //----------------------------------- Alternate method for populating checkboxes--------------------------------------------------------
    this.Checkbox_data.map((element) => {
      if (element.checkbox_desc in this.Checkbox_value) {
        this.Checkbox_value[element.checkbox_desc].push(element.field_values)
        this.Checkbox_value[element.checkbox_desc].push(element.description)

      }
      else {
        this.Checkbox_value[element.checkbox_desc] = [];
        this.Checkbox_value[element.checkbox_desc].push(element.field_values)
        this.Checkbox_value[element.checkbox_desc].push(element.description)
      }
    })

    this.spinner.hide()
  }

  //----------------------------------------------DEPENDENT DROPDOWNS SETTINGS----------------------------------------------------------

  vehicleItemSelect(item: any) {
    this.selectedItemsVehicleLine.map(element => {
      if (!(this.vehicleIndex.includes(element["ddm_rmp_lookup_dropdown_vehicle_line_brand_id"]))) {
        this.vehicleIndex.push(element["ddm_rmp_lookup_dropdown_vehicle_line_brand_id"])
      }
    })
    this.vehicleSelection(this.vehicleIndex)
  }

  vehicleItemDeSelect(item: any) {
    this.vehicleIndex.splice(this.vehicleIndex.indexOf(item['ddm_rmp_lookup_dropdown_vehicle_line_brand_id']), 1)
    console.log(this.vehicleIndex)
    this.vehicleSelection(this.vehicleIndex)
    this.vehicleDeSelection(this.vehicleIndex)
    this.allocationIndex = []
      this.selectedItemsAllocation.map(element => {
        if (!(this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group_id"]))) {
          this.allocationIndex.push(element["ddm_rmp_lookup_dropdown_allocation_group_id"])
        }
        this.vehicleSelection(this.vehicleIndex)
        this.vehicleDeSelection(this.vehicleIndex)
      })
    this.allocationSelection(this.allocationIndex)
    this.allocationDeSelection(this.allocationIndex)
  }

  vehicleSelectAll(items: any) {
    for (let index = 1; index <= items.length; index++) {
      if (!(this.vehicleIndex.includes(index))) {
        this.vehicleIndex.push(index)
      }
    }
    this.vehicleSelection(this.vehicleIndex)
  }

  vehicleDeSelectAll(items: any) {
    this.vehicleIndex = []
    this.vehicleSelection(this.vehicleIndex)
    this.vehicleDeSelection(this.vehicleIndex)
    this.allocationDeSelectAll(this.selectedItemsAllocation)
  }

  vehicleSelection(vehicleIndex: any) {
    if(this.vehicleIndex.length != 0){
      this.allocationFinalList = this.allo.filter(element => {
        return this.vehicleIndex.includes(element["ddm_rmp_lookup_dropdown_vehicle_line_brand"])
      })

      this.merchandizeFinalList = this.merchandize.filter(element =>{
        return this.vehicleIndex.includes(element["ddm_rmp_lookup_dropdown_vehicle_line_brand"])
      });
    }
    else if(this.vehicleIndex.length == 0){
      this.allocationFinalList = this.allo.filter(element=>{
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })

      this.merchandizeFinalList = this.merchandize.filter(element=>{
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })
    }

    this.allocationIndex = []
      this.selectedItemsAllocation.map(element => {
        if (!(this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group_id"]))) {
          this.allocationIndex.push(element["ddm_rmp_lookup_dropdown_allocation_group_id"])
        }
      })
    
  }

  vehicleDeSelection(vehicleIndex: any) {

      this.selectedItemsAllocation = this.selectedItemsAllocation.filter(element => {
        return this.vehicleIndex.includes(element.ddm_rmp_lookup_dropdown_vehicle_line_brand_id)
      })
      this.merchandizeItemsSelect = this.merchandizeItemsSelect.filter(element =>{
        return this.vehicleIndex.includes(element.ddm_rmp_lookup_dropdown_vehicle_line_brand_id)
      })
    
    if(this.vehicleIndex.length == 0){
      this.allocationFinalList = this.allo.filter(element=>{
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })

      this.merchandizeFinalList = this.merchandize.filter(element=>{
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })
    }
    
  }

  allocationItemsSelect(item: any) {
    this.selectedItemsAllocation.map(element => {
      if (!(this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group_id"]))) {
        this.allocationIndex.push(element["ddm_rmp_lookup_dropdown_allocation_group_id"])
      }
    })
    this.allocationSelection(this.allocationIndex)
  }

  allocationItemDeSelect(item: any) {
    this.allocationIndex.splice(this.allocationIndex.indexOf(item["ddm_rmp_lookup_dropdown_allocation_group_id"]), 1)
    this.allocationSelection(this.allocationIndex)
    this.allocationDeSelection(this.allocationIndex)
  }

  allocationSelectAll(items: any) {
    for (let index = 1; index <= items.length; index++) {
      if (!(this.allocationIndex.includes(index))) {
        this.allocationIndex.push(index)
      }
    }
    this.allocationSelection(this.allocationIndex)
  }

  allocationDeSelectAll(item: any) {
    this.allocationIndex = []
    this.allocationSelection(this.allocationIndex)
    this.allocationDeSelection(this.allocationIndex)
    this.merchandizeFinalList = this.merchandize
  }

  allocationSelection(allocationIndex: any) {
    if(this.allocationIndex.length != 0){
      this.merchandizeFinalList = this.merchandize.filter(element => {
        return this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group"])
      })
    }
    else if(this.allocationIndex.length == 0){
      if(this.vehicleIndex.length != 0){
        this.merchandizeItemsSelect = this.merchandizeItemsSelect.filter(element =>{
          return this.vehicleIndex.includes(element.ddm_rmp_lookup_dropdown_vehicle_line_brand_id)
        })
      }
      else if(this.vehicleIndex.length == 0){
        this.merchandizeFinalList = this.merchandize.filter(element=>{
          return this.division_index.includes(element.ddm_rmp_lookup_division)
        })
      }
    }
  }

  allocationDeSelection(allocationIndex: any) {
    if (this.allocationIndex.length == 0) {
      if(this.vehicleIndex.length != 0){
        this.merchandizeItemsSelect = this.merchandizeItemsSelect.filter(element =>{
          return this.vehicleIndex.includes(element.ddm_rmp_lookup_dropdown_vehicle_line_brand_id)
        })
      }
      else if(this.vehicleIndex.length == 0){
        this.merchandizeFinalList = this.merchandize.filter(element=>{
          return this.division_index.includes(element.ddm_rmp_lookup_division)
        })
      }
    }
    else {
      this.merchandizeItemsSelect = this.merchandizeItemsSelect.filter(element => {
        return this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group"])
      })
    }
  }

  //-----------------------------CHECKBOXES------------------------------------------------------------------------------------

  DistributionEntityRadio(i,val, event) {


    if(this.finalData.distribution_data){}

    let DistributionEntityId = event.target.id
    let DistributionEntityIdentifier = DistributionEntityId.charAt(6)
    DistributionEntityIdentifier = +DistributionEntityIdentifier
    if (this.finalData.distribution_data) {
      this.finalData.distribution_data = this.finalData.distribution_data.filter(element => {
        return element.id != DistributionEntityIdentifier + 1
      })
    }
    this.distributionRadio = event.target.value;
    this.distributionEntityCheckbox = {
      "value": val.type_data_desc,
      "id": val.ddm_rmp_lookup_ots_type_data_id,
      "radio": this.distributionRadio
    };
    this.finalData.distribution_data.push(this.distributionEntityCheckbox);
  }

  desc(element) {
    this.textData = element;
  }

  CheckboxCheck(val, event) {
    if (event.target.checked) {
      if (this.textData == undefined) {
        this.commonReqCheckbox = { "value": val.field_values, "id": val.ddm_rmp_lookup_ots_checkbox_values_id, "desc": "" };
      } else {
        this.commonReqCheckbox = { "value": val.field_values, "id": val.ddm_rmp_lookup_ots_checkbox_values_id, "desc": this.textData };
      }
      this.finalData.checkbox_data.push(this.commonReqCheckbox);
    }
    else {
      for (var i = 0; i < this.finalData.checkbox_data.length; i++) {
        if (this.finalData.checkbox_data[i].id == val.ddm_rmp_lookup_ots_checkbox_values_id) {
          var index = this.finalData.checkbox_data.indexOf(this.finalData.checkbox_data[i]);
          this.finalData.checkbox_data.splice(index, 1);
        }
      }
    }
    this.textData = "";
    if (val.field_values == "Orders Processed in DOSP" && event.target.checked) {
      this.dosp_calendar_flag = false
    }
    else
      this.dosp_calendar_flag = true;
  }

  CheckboxCheckDropdown(val, event) {
    if (event.target.checked) {
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_ots_checkbox_values_id.toString()))).disabled = false
      this.commonReqCheckbox = {
        "value": val.field_values,
        "id": val.ddm_rmp_lookup_ots_checkbox_values_id,
        "desc": this.textData
      };
      if (val.ddm_rmp_lookup_ots_checkbox_values_id == 5) {
        this.targetProd = false;
      }
      else{this.targetProd = true;}
      this.finalData.checkbox_data.push(this.commonReqCheckbox);
    }
    else {
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_ots_checkbox_values_id.toString()))).disabled = true;
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_ots_checkbox_values_id.toString()))).value = "";
      for (var i = 0; i < this.finalData.checkbox_data.length; i++) {
        if (this.finalData.checkbox_data[i].id == val.ddm_rmp_lookup_ots_checkbox_values_id) {
          var index = this.finalData.checkbox_data.indexOf(this.finalData.checkbox_data[i]);
          this.finalData.checkbox_data.splice(index, 1);
          if (val.ddm_rmp_lookup_ots_checkbox_values_id == 5) {
            this.targetProd = true;
          }
        }
      }
    }
  }

  selectionChanged(val, ng) {
    for (var i = 0; i < this.finalData.checkbox_data.length; i++) {
      if (this.finalData.checkbox_data[i].id == val) {
        this.finalData.checkbox_data[i].desc = ng
      }
    }
  }
  
  getSpecifyContent(val, event) {
    for (var i = 0; i < this.finalData.checkbox_data.length; i++) {
      if (this.finalData.checkbox_data[i].id == val) {
        this.finalData.checkbox_data[i].desc = event.target.value
      }
    }
  }

  //--------------------Final JSON CREATION----------------------------------------------------------------------------------------------
  DropdownSelected() {

    this.finalData["model_year"] = { "dropdown": this.selectedItemsModelYear, "radio_button": this.otsObj.modelRadio }
    this.finalData["division_selected"] = { "radio_button": this.otsObj.divisionRadio }
    this.finalData["allocation_group"] = { "dropdown": this.selectedItemsAllocation, "radio_button": this.otsObj.alloRadio }
    this.finalData["vehicle_line"] = { "dropdown": this.selectedItemsVehicleLine, "radio_button": this.otsObj.vlbRadio }
    this.finalData["merchandizing_model"] = { "dropdown": this.merchandizeItemsSelect, "radio_button": this.otsObj.merchRadio }
    this.finalData["order_type"] = { "dropdown": this.selectedItemsOrderType, "radio_button": this.otsObj.orderTypeRadio }
    this.finalData["order_event"] = { "dropdown": this.selectedItemsOrderEvent }
    this.finalData["report_id"] = this.generated_report_id;
    if (this.other_description == undefined) {
      this.finalData["other_desc"] = "";
    }
    else {
      this.finalData["other_desc"] = this.other_description;
    }

    if(this.report_create == null || this.report_create == "" || this.report_create == undefined){
      this.finalData['report_detail']['created_on'] = ""
      this.report_create = ""
    }

    if(this.assigned_to == null || this.assigned_to == "" || this.assigned_to == undefined){
      this.finalData['report_detail']['assigned_to'] = ""
      this.assigned_to = ""
    }
    if(this.report_status == "" || this.report_status == null || this.report_status == undefined){
      this.finalData['report_detail']['status'] = "Pending"
      this.report_status = "Pending"
    }
    

    this.date = "";
    this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    this.finalData["report_detail"] = { "title": this.Report_title,
        "additional_req": this.Report_Req, 
        "report_type": "ots",
         "status_date": this.date,
          "status": this.report_status,
          "created_on" : this.report_create,
          "assigned_to" : this.assigned_to,
          "on_behalf_of": this.report_on_behalf,
          "link_to_results": "",
           "query_criteria": "",
            "link_title": "", 
            "requestor": this.user_name }
    this.order_to_sale_selection = this.finalData

  }

  validateInput() {
    var selected_check = []
    $(".tod_checkbox_group:checkbox").each(function () {
      var $this = $(this);
      if ($this.is(":checked")) {
        let temp_id = $this.attr("id");
        temp_id = temp_id[9]
        selected_check.push(Number(temp_id) + 1);
      }
    })

    this.finalData["distribution_data"] = this.finalData["distribution_data"].filter(element => {
      return selected_check.includes(element["id"])
    })

    if (this.selectedItemsOrderType === undefined || Object.keys(this.selectedItemsOrderType).length == 0) {
      this.ot_flag = true;
    }
    else {
      this.ot_flag = false;
    }

    if (this.finalData["distribution_data"].length == 0 || this.finalData["distribution_data"] == undefined) {
      this.flag = false;
      this.typeofdata_flag = true
    }
    else if (this.finalData["distribution_data"].length != 0) {
      console.log((this.finalData["distribution_data"]))
      this.typeofdata_flag = false
      $('#order-review-selection').modal('show');
    }

    if (this.ot_flag == false || this.typeofdata_flag == false) {
      this.flag = true


    }
    console.log("Flag" + this.flag)
    //// console.log(this.finalData)
  }

  submit() {
    if (this.Report_title == "" || this.Report_title == undefined || this.Report_Req == "" || this.Report_Req == undefined) {
      this.modal_validation_flag = true;
      this.summary_flag = false;
    }
    else {
      this.summary_flag = true;
      //$("#review_close:button").click()
      this.modal_validation_flag = false
      this.spinner.show();
      this.DropdownSelected();

      if (this.reportId != 0) {
      }

      if(this.report_status == "" || this.report_status == null){
        this.finalData
      }

      let checkedTodBoxes = []
      $(".tod_checkbox_group").each(function () {
        var $this = $(this);
        if ($this.is(":checked")) {
          let id = +($this.attr("id"))[9]
          checkedTodBoxes.push(id + 1)
        }
      })
      let filteredDistributionData = this.finalData.distribution_data
      this.order_to_sales_selection = this.finalData


      this.django.ddm_rmp_order_to_sales_post(this.order_to_sales_selection).subscribe(response => {
        this.getreportSummary();
        if ((<HTMLInputElement>document.getElementById("attach-file1")).files[0] != null) {
          this.files();
        }
        localStorage.removeItem("report_id")
        this.report_id_service.changeUpdate(false)
        this.toastr.success("Report Selections successfully saved for Report Id : #" + this.generated_report_id, "Success:")

      }, err => {
        this.spinner.hide();
        this.toastr.error("Selection is incomplete", "Error:")
      })

      this.report_id_service.changeSavedChanges(false)
    }
    $('.modal-backdrop').remove();
  }
  getreportSummary() {
    this.django.get_report_description(this.generated_report_id).subscribe(Response => {
      this.summary = Response
      this.spinner.hide()
      let tempArray = []
      if (this.summary["market_data"].length != 0) {
        if (this.summary["market_data"] == []) {
          this.market_description = []
        } else {
          this.summary["market_data"].map(element => {
            tempArray.push(element.market)
          })
        }
        this.market_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["country_region_data"].length != 0) {
        if (this.summary["country_region_data"] == []) {
          this.region_description = []
        } else {
          this.summary["country_region_data"].map(element => {
            tempArray.push(element.region_desc)
          })
        }
        this.region_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["division_dropdown"].length != 0) {
        if (this.summary["division_dropdown"] == []) {
          this.division_dropdown = []
        } else {
          this.summary["division_dropdown"].map(element => {
            tempArray.push(element.division_desc)
          })
        }
        this.division_dropdown = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["region_zone_data"].length != 0) {
        if (this.summary["region_zone_data"] == []) {
          this.zone_description = []
        } else {
          this.summary["region_zone_data"].map(element => {
            tempArray.push(element.zone_desc)
          })
        }
        this.zone_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["zone_area_data"].length != 0) {
        if (this.summary["zone_area_data"] == []) {
          this.area_description = []
        } else {
          this.summary["zone_area_data"].map(element => {
            tempArray.push(element.area_desc)
          })
        }
        this.area_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["lma_data"].length != 0) {
        if (this.summary["lma_data"] == []) {
          this.lma_description = []
        } else {
          this.summary["lma_data"].map(element => {
            tempArray.push(element.lmg_desc)
          })
        }
        this.lma_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["gmma_data"].length != 0) {
        if (this.summary["gmma_data"] == []) {
          this.gmma_description = []
        } else {
          this.summary["gmma_data"].map(element => {
            tempArray.push(element.gmma_desc)
          })
        }
        this.gmma_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["frequency_data"].length != 0) {
        if (this.summary["frequency_data"] == []) {
          this.report_frequency = []
        } else {
          this.summary["frequency_data"].map(element => {
            if (element.description != '') {
              tempArray.push(element.select_frequency_values + "-" + element.description)
            }
            else {
              tempArray.push(element.select_frequency_values)
            }
          })
        }
        this.report_frequency = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["special_identifier_data"].length != 0) {
        if (this.summary["special_identifier_data"] == []) {
          this.special_identifier = []
        } else {
          this.summary["special_identifier_data"].map(element => {
            tempArray.push(element.spl_desc)
          })
        }
        this.special_identifier = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["bac_data"].length != 0) {
        if (this.summary["bac_data"][0]["bac_desc"] == null) {
          this.bac_description = []
        } else {
          this.bac_description = (this.summary["bac_data"][0].bac_desc).join(", ");
        }
      }
      else {
        this.bac_description = []
      }

      if (this.summary["fan_data"].length != 0) {
        if (this.summary["fan_data"][0]["fan_data"] == null) {
          this.fan_desc = []
        } else {
          this.fan_desc = this.summary["fan_data"][0].fan_data.join(", ");
        }
      }
      else {
        this.fan_desc = []
      }
      tempArray = []
      if (this.summary["ost_data"]["allocation_group"].length != 0) {
        if (this.summary["ost_data"]["allocation_group"] == []) {
          this.allocation_group = []
        } else {
          this.summary["ost_data"]["allocation_group"].map(element => {
            tempArray.push(element.allocation_group)
          })
        }
        this.allocation_group = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["ost_data"]["model_year"].length != 0) {
        if (this.summary["ost_data"]["model_year"] == []) {
          this.model_year = []
        } else {
          this.summary["ost_data"]["model_year"].map(element => {
            tempArray.push(element.model_year)
          })
        }
        this.model_year = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["ost_data"]["vehicle_line"].length != 0) {
        if (this.summary["ost_data"]["vehicle_line"] == []) {
          this.vehicle_line_brand = []
        } else {
          this.summary["ost_data"]["vehicle_line"].map(element => {
            tempArray.push(element.vehicle_line_brand)
          })
        }
        this.vehicle_line_brand = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["ost_data"]["merchandizing_model"].length != 0) {
        if (this.summary["ost_data"]["merchandizing_model"] == []) {
          this.merchandising_model = []
        } else {
          this.summary["ost_data"]["merchandizing_model"].map(element => {
            tempArray.push(element.merchandising_model)
          })
        }
        this.merchandising_model = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["ost_data"]["order_event"].length != 0) {
        if (this.summary["ost_data"]["order_event"] == []) {
          this.order_event = []
        } else {
          this.summary["ost_data"]["order_event"].map(element => {
            tempArray.push(element.order_event)
          })
        }
        this.order_event = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["ost_data"]["order_type"].length != 0) {
        if (this.summary["ost_data"]["order_type"] == []) {
          this.order_type = []
        } else {
          this.summary["ost_data"]["order_type"].map(element => {
            tempArray.push(element.order_type)
          })
        }
        this.order_type = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["ost_data"]["checkbox_data"].length != 0) {
        if (this.summary["ost_data"]["checkbox_data"] == []) {
          this.checkbox_data = []
        } else {
          this.summary["ost_data"]["checkbox_data"].map(element => {
            if (element.description_text != '') {
              tempArray.push(element.checkbox_description + "-" + element.description_text)
            }
            else {
              tempArray.push(element.checkbox_description)
            }
          })
        }
        this.checkbox_data = tempArray.join(", ");
      }
      this.other_info = this.summary["ost_data"]["other_desc"][0]["other_desc"];
      this.text_notification = this.summary["user_data"][0]['alternate_number'];
      this.spinner.hide();

      if (this.summary['frequency_data'].length == 0)
        this.frequency_flag = false
      else {
        this.frequency_flag = true
      }
      if (this.summary['user_data'][0].contact_no == "") {
        this.contact_flag = false
      }
      else {
        this.contact_flag = true
      }
    }, err => {
      this.spinner.hide();
    })
  }

  onItemSelect(item: any) {
  }
  other_desc(event) {
    this.otsObj.otherDesc = event.target.value
  }
  onSelectAll(items: any) {
  }

  //---------------------------------------Dropdown Radio Buttons---------------------------------------------------------------------

  AllocationRadio(val) {
    this.alloRadio = val;
  }

  MerchandizeRadio(val) {
    this.merchandiseRadio = val;
  }

  OrderRadio(val) {
    this.orderRadio = val;
  }

  changeReportMessage() {
    this.report_message = "";
    this.report_id_service.changeMessage("");
    this.router.navigate(["user/request-status"]);
    this.report_id_service.changeButtonStatus(true)
  }

  //------------------------------------CALENDAR SETTINGS---------------------------------------------------------------------
  changeStartDateFormat() {
    this.customizedFromDate = this.DatePipe.transform(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "dd-MMM-yyyy")
    console.log(this.customizedFromDate)
  }
  changeEndDateFormat() {
    this.customizedToDate = this.DatePipe.transform(new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day), "dd-MMM-yyyy")
  }
  onDateSelection(date: NgbDate) {
    console.log(this.dateSelect);
    console.log(this.fromDate);
    console.log(this.toDate);
    
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.changeStartDateFormat();
    }
    else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.changeEndDateFormat();
    }
    else {
      this.toDate = null;
      this.fromDate = date;
      this.changeStartDateFormat();
    }

    if (this.toDate == null || this.fromDate == null || this.toDate == undefined && this.fromDate == undefined) {
      this.finalData['data_date_range'] = { "StartDate": "", "EndDate": "" };
    }
    else {
      this.startDate = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;
      this.endDate = this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day;
      this.finalData['data_date_range'] = { "StartDate": this.startDate, "EndDate": this.endDate };

    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  //------------------------------------CALENDAR SETTINGS DOSP---------------------------------------------------------------------
  changeStartDateFormatDOSP() {
    this.customizedFromDateDOSP = this.DatePipe.transform(new Date(this.fromDateDOSP.year, this.fromDateDOSP.month - 1, this.fromDateDOSP.day), "dd-MMM-yyyy")
  }
  changeEndDateFormatDOSP() {
    this.customizedToDateDOSP = this.DatePipe.transform(new Date(this.toDateDOSP.year, this.toDateDOSP.month - 1, this.toDateDOSP.day), "dd-MMM-yyyy")
  }
  onDateSelectionDOSP(date: NgbDate) {
    console.log(date);
    if (!this.fromDateDOSP && !this.toDateDOSP) {
      this.fromDateDOSP = date;
      this.changeStartDateFormatDOSP();
    }
    else if (this.fromDateDOSP && !this.toDateDOSP && date.after(this.fromDateDOSP)) {
      this.toDateDOSP = date;
      this.changeEndDateFormatDOSP();
    }
    else {
      this.toDateDOSP = null;
      this.fromDateDOSP = date;
      this.changeStartDateFormatDOSP();
    }

    if (this.toDateDOSP == null || this.fromDateDOSP == null || this.toDateDOSP == undefined && this.fromDateDOSP == undefined) {
      this.finalData['dosp_start_date'] = "";
      this.finalData['dosp_end_date'] = "";
    }
    else {
      this.startDateDOSP = this.fromDateDOSP.year + "-" + this.fromDateDOSP.month + "-" + this.fromDateDOSP.day;
      this.endDateDOSP = this.toDateDOSP.year + "-" + this.toDateDOSP.month + "-" + this.toDateDOSP.day;
      this.finalData['dosp_start_date'] = this.startDateDOSP;
      this.finalData['dosp_end_date'] = this.endDateDOSP;

    }
  }

  isHoveredDOSP(date: NgbDate) {
    return this.fromDateDOSP && !this.toDateDOSP && this.hoveredDateDOSP && date.after(this.fromDateDOSP) && date.before(this.hoveredDateDOSP);
  }

  isInsideDOSP(date: NgbDate) {
    return date.after(this.fromDateDOSP) && date.before(this.toDateDOSP);
  }

  isRangeDOSP(date: NgbDate) {
    return date.equals(this.fromDateDOSP) || date.equals(this.toDateDOSP) || this.isInsideDOSP(date) || this.isHoveredDOSP(date);
  }
  back() {
    this.router.navigate(["user/submit-request/select-report-criteria"]);
  }

  gros() {
    if (this.gcheck == false) {
      $('.gross-sales').prop("disabled", false);
      this.gcheck = true;
    }

    else {
      $(".gross-sales").prop("disabled", true);
      $(".gross-sales").prop("checked", false);
      this.gcheck = false;
    }
  }

  nets() {
    if (this.ncheck == false) {
      $('.net-sales').prop("disabled", false);
      this.ncheck = true;
    }

    else {
      $(".net-sales").prop("disabled", true);
      $(".net-sales").prop("checked", false);
      this.ncheck = false;
    }
  }

  allClick() {
    if (this.check == false) {

      $(".events").prop("checked", true);
      this.check = true;
      this.orderEventCheck = this.lookup.data.checkbox_data.filter(element => element.ddm_rmp_ots_checkbox_group_id == 3)
      for (var i = 0; i < this.orderEventCheck.length; i++) {
        this.orderEventId.push(this.orderEventCheck[i].ddm_rmp_lookup_ots_checkbox_values_id)
      }
      for (i = 0; i < this.finalData.checkbox_data.length; i++) {
        this.checkboxId.push(this.finalData.checkbox_data[i].id)
      }

      for (i = 0; i < this.orderEventCheck.length; i++) {
        if (this.checkboxId.indexOf(this.orderEventId[i]) == -1) {
          this.orderEventCheckFilter = this.orderEventCheck.filter(element => element.ddm_rmp_lookup_ots_checkbox_values_id == this.orderEventId[i]);
          this.finalData.checkbox_data.push({
            "value": this.orderEventCheckFilter[0].field_values,
            "id": this.orderEventId[i],
            "desc": ""

          })
        }
      }
    }
    else {
      $(".events").prop("checked", false);
      this.check = false;
      this.orderEventCheck = this.lookup.data.checkbox_data.filter(element => element.ddm_rmp_ots_checkbox_group_id == 3)

      for (var i = 0; i < this.orderEventCheck.length; i++) {
        this.orderEventId.push(this.orderEventCheck[i].ddm_rmp_lookup_ots_checkbox_values_id)
      }
      for (i = 0; i < this.finalData.checkbox_data.length; i++) {
        this.checkboxId.push(this.finalData.checkbox_data[i].id)
      }

      for (i = 0; i < this.orderEventCheck.length; i++) {
        this.finalData.checkbox_data = this.finalData.checkbox_data.filter(element => element.id != this.orderEventId[i])
      }
      this.orderEventId = [];
      this.checkboxId = [];
    }
  }

  func() {
    if ((this.selectedItemsOrderEvent).length > 0) {
      var x = document.getElementById("calendars");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }
    else {
      $("#calendars").hide()
    }
  }

  captureScreen() {
    var specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    var doc = new jsPDF();
    doc.setFont("arial");

    doc.fromHTML(
      $('#print').html(), 15, 15,
      { 'width': 170, 'elementHandlers': specialElementHandlers, 'top_margin': 15 },
      function () { doc.save('sample-file.pdf'); }

    )
  }

  //------------------------------------------START GET Defaults-------------------------------------------------//

  getDefaultSelections() {
    var retail, nonRetail, fleet;
    var temp = this.finalData;
    $.each($("input[class='chk']:checked"), function () {
      let chkDataCheckbox = {}
      chkDataCheckbox = { "id": $(this).val(), "value": $(this).val(), "desc": "none" };
      temp.checkbox_data.push(chkDataCheckbox);
    });
    this.finalData = temp;
    var sdate = $("#fromDate").val();
    var tdate = $("#toDate").val();
    this.finalData['data_date_range'] = { "StartDate": sdate, "EndDate": tdate };
    if ($("#disSumOT0").prop("checked")) {
      this.orderRadio = "Display";
    } else {
      this.orderRadio = "Summary";
    }
    this.finalData["order_type"] = { "dropdown": this.selectedItemsOrderType, "radio_button": this.orderRadio };

    this.finalData["other_desc"] = $("#otherText").val();
    if ($("#disSum00").prop("checked")) {
      retail = "Display";
    } else {
      retail = "Summary";
    }
    var retailData = {
      "id": "1",
      "value": "Retail Only",
      "radio": retail,
    }

    if ($("#disSum10").prop("checked")) {
      nonRetail = "Display";
    } else {
      nonRetail = "Summary";
    }
    var nonRetailData = {
      "id": "2",
      "value": "Non-Retail (Includes Fleet)",
      "radio": nonRetail,
    }

    if ($("#disSum20").prop("checked")) {
      fleet = "Display";
    } else {
      fleet = "Summary";
    }
    var fleetData = {
      "id": "3",
      "value": "Fleet Only",
      "radio": fleet,
    }
    this.finalData["distribution_data"].push(retailData);
    this.finalData["distribution_data"].push(nonRetailData);
    this.finalData["distribution_data"].push(fleetData);
  }

  //------------------------------------------------------START SET Defaults-------------------------------------------//
  setDefaultSelections() {
    this.django.get_report_details(this.reportId).subscribe(element => {
      var subData = element["ots_data"]["checkbox_data"];
      try {
        for (var x = 0; x <= subData.length - 1; x++) {
          $('.chk').each(function (i, obj) {
            if (subData[x].ddm_rmp_lookup_ots_checkbox_values == $(obj).prop("value")) {
              $(obj).prop("checked", true);
            }
          })
        }
      }
      catch (err) {
      }
      var typeData = element["ots_data"]["distribution_data"];
      for (var i = 0; i <= typeData.length - 1; i++) {
        if (typeData[i].value == "Retail Only") {
          if (typeData[i].radio_btn == "Display") {
            $("#disSum01").prop("checked", true);
          } else {
            $("#disSum00").prop("checked", true);
          }
        }
        if (typeData[i].value == "Retail Only") {
          if (typeData[i].radio_btn == "Summary") {
            $("#disSum01").prop("checked", true);
          } else {
            $("#disSum00").prop("checked", true);
          }
        }
        if (typeData[i].value == "Non-Retail (Includes Fleet") {
          if (typeData[i].radio_btn == "Summary") {
            $("#disSum10").prop("checked", true);
          } else {
            $("#disSum11").prop("checked", true);
          }
        }
        if (typeData[i].value == "Fleet Only") {
          if (typeData[i].radio_btn == "Summary") {
            $("#disSum20").prop("checked", true);
          } else {
            $("#disSum21").prop("checked", true);
          }
        }
      }
      var orderType = element['ots_data']['order_type'][0];
      if (orderType) {
        if (orderType.display_summary_value == "Summary") {
          $("#disSumOT1").prop("checked", true);
        } else {
          $("#disSumOT0").prop("checked", true);
        }
      }
      //date picker data
      if (element['ost_data']) {
        var dateData = element["ots_data"]["data_date_range"][0];
        $("#fromDate").val(dateData.start_date);
        $("#toDate").val(dateData.end_date);
      }

      //Data element for Date Range      
      if (element['ost_data']) {
        var otherData = element['ots_data']['other_desc'][0];
        $("#otherText").val(otherData.other_desc);
      }

      var selectedItemsOrder = element["ots_data"]["order_event"];
      this.selectedItemsOrderType = [];
      this.orderTypeSelecteditems.forEach(element1 => {
        selectedItemsOrder.map(element2 => {
          if (element1['ddm_rmp_lookup_dropdown_order_type_id'] == element2.ddm_rmp_lookup_dropdown_order_event) {
            this.selectedItemsOrderType.push(element1)
          }
        })
      })

      var selectedItemsType = element["ots_data"]["order_type"];
      this.selectedItemsOrderEvent = [];
      this.orderEvent.forEach(element1 => {
        selectedItemsType.map(element2 => {
          if (element1['ddm_rmp_lookup_dropdown_order_event_id'] == element2.ddm_rmp_lookup_dropdown_order_type) {
            this.selectedItemsOrderEvent.push(element1);
          }
        })
      });
    });
  }

  //====================================File Upload Functionality====================================================//
  files() {
    this.file = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    var formData = new FormData();
    formData.append('file_upload', this.file);

    this.spinner.show();
    this.django.ddm_rmp_file_data(formData).subscribe(response => {
      this.spinner.hide()
    }, err => {
      this.spinner.hide();
    });
  }

  disableCheck(id) {
    let id_field = '#tod_check' + id
    if ($(id_field).prop("checked")) {
      return false;
    }
    else {
      return true;
    }
  }

  // pushDE(){
  //   $.each($("input[class='tod_checkbox_group']:checked"), function (){
  //     for(var i=0; i<2;i++){
  //       if(document.getElementsByClassName("DEinput" + i).checked){}
  //     }
  //   })
  // }



  Check($event, i, val) {
    console.log('HERE',val);
    console.log($event);
    if ($event.target.checked) {
      const id = `disSum${i}1`;
      const radioButton = <HTMLInputElement>document.getElementById(id);
      radioButton.checked = true;
      this.distributionEntityCheckbox = {
        value: val.type_data_desc,
        id: val.ddm_rmp_lookup_ots_type_data_id,
        radio: radioButton.value
      };
      this.finalData.distribution_data.push(this.distributionEntityCheckbox);
    }
  }

  // enable(){
  //   if($('#drop5').is(':checked')){
  //     this.targetProd = false;
  //   }
  // }


  previousSelections(requestId){
    this.spinner.show();
    this.django.get_report_description(requestId).subscribe(element => {
      console.log(element);
      if(element['ost_data']){
        
      this.selectedItemsAllocation = []
        this.allocationFinalList.forEach(eleAllo=>{
          element['ost_data']['allocation_group'].forEach(resAllo=>{
            if(eleAllo['ddm_rmp_lookup_dropdown_allocation_group_id'] == resAllo['ddm_rmp_lookup_dropdown_allocation_group']){
              this.selectedItemsAllocation.push(eleAllo)
            }
          })
        })

      this.merchandizeItemsSelect = []
        this.merchandizeFinalList.forEach(eleMerch =>{
          element['ost_data']['merchandizing_model'].forEach(resMerch=>{
            if(eleMerch['ddm_rmp_lookup_dropdown_merchandising_model_id'] == resMerch['ddm_rmp_lookup_dropdown_merchandising_model']){
              this.merchandizeItemsSelect.push(eleMerch)
            }
          })
        })

      this.selectedItemsVehicleLine = []
        this.vehicleDataSelecteditems.forEach(eleVlb =>{
          element['ost_data']['vehicle_line'].forEach(resVlb =>{
            if(eleVlb['ddm_rmp_lookup_dropdown_vehicle_line_brand_id'] == resVlb['ddm_rmp_lookup_dropdown_vehicle_line_brand']){
              this.selectedItemsVehicleLine.push(eleVlb)
            }
          })
        })

        this.selectedItemsModelYear = []
          this.modelYearSelectedItems.forEach(eleModel =>{
            element['ost_data']['model_year'].forEach(resModel =>{
              if(eleModel['ddm_rmp_lookup_dropdown_model_year_id'] == resModel['ddm_rmp_lookup_dropdown_model_year']){
                this.selectedItemsModelYear.push(eleModel)
              }
            })
          })

        this.selectedItemsOrderType = []
          this.orderTypeSelecteditems.forEach(eleOrderType =>{
            element['ost_data']['order_type'].forEach(resOrderType =>{
              if(eleOrderType['ddm_rmp_lookup_dropdown_order_type_id'] == resOrderType['ddm_rmp_lookup_dropdown_order_type']){
                this.selectedItemsOrderType.push(eleOrderType)
              }
            })
          })

        this.selectedItemsOrderEvent = []
          this.orderEvent.forEach(eleEvent =>{
            element['ost_data']['order_event'].forEach(resEvent =>{
              if(eleEvent['ddm_rmp_lookup_dropdown_order_event_id'] == resEvent['ddm_rmp_lookup_dropdown_order_event']){
                this.selectedItemsOrderEvent.push(eleEvent)
              }
            })
          })
          
        if(element['ost_data']['allocation_group'][0]){
          this.otsObj.alloRadio = element['ost_data']['allocation_group'][0]['display_summary_value']
        }
        if(element['ost_data']['model_year'][0]){
          this.otsObj.modelRadio = element['ost_data']['model_year'][0]['display_summary_value']
        }
        if(element['ost_data']['division_selected'][0]){
          this.otsObj.divisionRadio = element['ost_data']['division_selected'][0]['display_summary_value']
        }
        if(element['ost_data']['vehicle_line'][0]){
          this.otsObj.vlbRadio = element['ost_data']['vehicle_line'][0]['display_summary_value']
        }
        if(element['ost_data']['merchandizing_model'][0]){
          this.otsObj.merchRadio = element['ost_data']['merchandizing_model'][0]['display_summary_value']
        }
        if(element['ost_data']['order_type'][0]){
          this.otsObj.orderTypeRadio = element['ost_data']['order_type'][0]['display_summary_value']
        }
        if(element['ost_data']['other_desc'][0]){
          this.otsObj.otherDesc = element['ost_data']['other_desc'][0]['other_desc']
        }

        if(element['ost_data']['checkbox_data']){
          var subData = element['ost_data']['checkbox_data']
        }
       
        console.log(this.otsObj.modelRadio);
        console.log(this.otsObj.divisionRadio);
        console.log(subData);
        var temp = this.finalData;
        temp.checkbox_data = [];
        for(var x=0; x <= subData.length - 1; x++){
          $('.chk').each(function (i, obj) {
            if(subData[x]['ddm_rmp_lookup_ots_checkbox_values'] == obj.value){

              if(subData[x].description_text == ""){
                obj.checked = true;
                this.Checkbox_selected = { "value": subData[x].checkbox_description, "id": subData[x].ddm_rmp_lookup_ots_checkbox_values, "desc": subData[x].description_text };
                temp.checkbox_data.push(this.Checkbox_selected);  
                if($('#calendarsDOSP').is(':checked')){
                  this.dosp_calendar_flag == false;
                }
              }
              else if(subData[x].description_text != ""){
                if(subData[x].checkbox_description == 'Target Production Date'){
                  obj.checked = true;
                  this.targetValue = subData[x].description_text
                  this.targetProd = false;
                }
                else{
                  obj.checked = true;
                  (<HTMLTextAreaElement>(document.getElementById("drop" + subData[x].ddm_rmp_lookup_ots_checkbox_values.toString()))).value = subData[x]['description_text'];
                  (<HTMLTextAreaElement>(document.getElementById("drop" + subData[x].ddm_rmp_lookup_ots_checkbox_values.toString()))).removeAttribute("disabled")
                  this.Checkbox_selected = { "value": subData[x].checkbox_description, "id": subData[x].ddm_rmp_lookup_ots_checkbox_values, "desc": subData[x].description_text };
                  temp.checkbox_data.push(this.Checkbox_selected); 
                }
              }
            }
            
          })
        }

        //Key Element Calendar----------------
          temp.data_date_range.StartDate = null;
          temp.data_date_range.EndDate = null;
          if(element['ost_data']['data_date_range'][0]['start_date']){
            var dateStart = element['ost_data']['data_date_range'][0]['start_date'].toString();
            this.customizedFromDate = dateStart
            
            var startYear = +dateStart.substring(0,4);
            var startMonth = +dateStart.substring(5,7);
            var startDate = +dateStart.substring(8,10);

            this.temp_min_date = <NgbDate>{
              month : startMonth,
              year: startYear,
              day: startDate
            }

            this.fromDate = this.temp_min_date
            this.startDate = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;
          }
          if(element['ost_data']['data_date_range'][0]['end_date']){
            var dateEnd = element['ost_data']['data_date_range'][0]['end_date'].toString();
            this.customizedToDate = dateEnd
            
            var endYear = +dateEnd.substring(0,4);
            var endMonth = +dateEnd.substring(5,7);
            var endDate = +dateEnd.substring(8,10);
            
            this.temp_max_date = <NgbDate>{
              month : endMonth,
              year: endYear,
              day: endDate
            }
            
            this.toDate = this.temp_max_date
            this.endDate = this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day;
            temp.data_date_range = { "StartDate": this.startDate, "EndDate": this.endDate };
          }

          

          //--------------------DOSP Calendar------------------------
          temp.dosp_start_date = null;
          temp.dosp_end_date = null;
          if(element['ost_data']['data_date_range'][0]['dosp_start_date']){
            var dateStartDOSP = element['ost_data']['data_date_range'][0]['dosp_start_date'].toString();
            this.customizedFromDateDOSP = dateStartDOSP

            var startYearDOSP = +dateStartDOSP.substring(0,4);
            var startMonthDOSP = +dateStartDOSP.substring(5,7);
            var startDateDOSP = +dateStartDOSP.substring(8,10);

            this.temp_min_date_DOSP = <NgbDate>{
              month : startMonthDOSP,
              year: startYearDOSP,
              day: startDateDOSP
            }

            this.fromDateDOSP = this.temp_min_date_DOSP
            this.startDateDOSP = this.fromDateDOSP.year + "-" + this.fromDateDOSP.month + "-" + this.fromDateDOSP.day;
            temp.dosp_start_date = this.startDateDOSP;
          }

          if(element['ost_data']['data_date_range'][0]['dosp_end_date']){
            var dateEndDOSP = element['ost_data']['data_date_range'][0]['dosp_end_date'].toString();
            this.customizedToDateDOSP = dateEndDOSP

            var endYearDOSP = +dateEndDOSP.substring(0,4);
            var endMonthDOSP = +dateEndDOSP.substring(5,7);
            var endDateDOSP = +dateEndDOSP.substring(8,10);
            
            this.temp_max_date_DOSP = <NgbDate>{
              month : endMonthDOSP,
              year: endYearDOSP,
              day: endDateDOSP
            }

            this.toDateDOSP = this.temp_max_date_DOSP
            this.endDateDOSP = this.toDateDOSP.year + "-" + this.toDateDOSP.month + "-" + this.toDateDOSP.day;
            temp.dosp_end_date = this.endDateDOSP;
          }
          
          var disrtibutionData = element['ost_data']['distribution_data']
          console.log(disrtibutionData);
          
          for(var x=0; x <= disrtibutionData.length - 1; x++){
            $('.tod_checkbox_group').each(function (i, obj) {
              if(disrtibutionData[x]['ddm_rmp_lookup_ots_type_data'] == obj.value){
                obj.checked = true
                const id = `disSum${obj.value}1`;
                const radioButton = <HTMLInputElement>document.getElementById(id);
                radioButton.checked = true;

            
                this.distributionEntityCheckbox = {
                  value: disrtibutionData[x]['value'],
                  id: disrtibutionData[x]['ddm_rmp_lookup_ots_type_data'],
                  radio: radioButton.value
                };
                temp.distribution_data.push(this.distributionEntityCheckbox);
              }
            })
          }
          
          var report_data = element['report_data']
          this.Report_title = report_data.title
          this.Report_Req = report_data.additional_req
          if(report_data.status == "Completed"){
            this.report_status = "Pending"
            this.assigned_to = ""
          }
          else if(report_data.status == "Active"){
            this.report_status = "Active";
            this.assigned_to = report_data.assigned_to
          }
          else{
            this.report_status = "Pending"
          }

          this.report_create = report_data.created_on
          this.report_on_behalf = report_data.on_behalf_of
          this.user_name = report_data.requestor
        
          // this.finalData['report_detail'] = { "title": this.Report_title,"status": this.report_status, 
          // "additional_req": this.Report_Req, "report_type": "ots", "status_date": this.date, "created_on": this.report_create, 
          // "on_behalf_of": this.report_on_behalf, "assigned_to": this.assigned_to, 
          // "link_to_results": "", "query_criteria": "", "link_title": "", "requestor": this.user_name }

          this.finalData["model_year"] = { "dropdown": this.selectedItemsModelYear, "radio_button": this.otsObj.modelRadio }
          this.finalData["division_selected"] = { "radio_button": this.otsObj.divisionRadio }
          this.finalData["allocation_group"] = { "dropdown": this.selectedItemsAllocation, "radio_button": this.otsObj.alloRadio }
          this.finalData["vehicle_line"] = { "dropdown": this.selectedItemsVehicleLine, "radio_button": this.otsObj.vlbRadio }
          this.finalData["merchandizing_model"] = { "dropdown": this.merchandizeItemsSelect, "radio_button": this.otsObj.merchRadio }
          this.finalData["order_type"] = { "dropdown": this.selectedItemsOrderType, "radio_button": this.otsObj.orderTypeRadio }

        for(var x=0; x <= subData.length- 1; x++){
          if(subData[x].checkbox_description == 'Target Production Date'){
            this.targetProd = false
            this.targetValue = subData[x].description_text
            this.Checkbox_selected = { "value": subData[x].checkbox_description, "id": subData[x].ddm_rmp_lookup_ots_checkbox_values, "desc": this.targetValue };
            temp.checkbox_data.push(this.Checkbox_selected); 
          }
        }

        this.finalData = temp
      }

    })
    this.spinner.hide();
  }
}