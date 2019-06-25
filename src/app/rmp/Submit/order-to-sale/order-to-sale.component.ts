import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from "@angular/router";
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { ToastrService } from "ngx-toastr";
import { RepotCriteriaDataService } from "../../services/report-criteria-data.service";
import * as jspdf from '../../../../assets/cdn/jspdf.min.js';
import {PdfUtility} from '../../Main/pdf-utility';
import html2canvas from 'html2canvas';
import * as Rx from "rxjs";
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';  //CKEDITOR CHANGE 
// import { ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';
// import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { AuthenticationService } from "src/app/authentication.service";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-to-sale',
  templateUrl: './order-to-sale.component.html',
  styleUrls: ['./order-to-sale.component.css']
})
export class OrderToSaleComponent implements OnInit,AfterViewInit {


  abc = [
    // {ddm_rmp_lookup_division_id : 5, ddm_rmp_lookup_market : 1 , division_desc  :"025 - Holden(US)"},
    // {ddm_rmp_lookup_division_id : 8, ddm_rmp_lookup_market : 2 , division_desc  :"001 - Chevrolet(Canada)"}
    { ddm_rmp_lookup_division_id: 14, ddm_rmp_lookup_market: 3, division_desc: "012 - GMC(Export)" }
  ]

  generated_report_status: string;
  generated_report_id: number;
  selectedItems = [];
  dropdownSettings = {};
  order_to_sales_selection = {};

  order_to_sale_selection: object;
  public editorConfig = {            //CKEDITOR CHANGE 
    removePlugins : ['ImageUpload','ImageButton','MediaEmbed','Iframe','Blockquote','Strike','Save'],
    fontSize : {
      options : [
        9,11,13,'default',17,19,21,23,24
      ]
    }
    // extraPlugins: [this.MyUploadAdapterPlugin]
  };

  textData;
  // finalObject = []
  type_data_value = {};
  finalData = {
    "checkbox_data": [],
    'distribution_data': [],
    'data_date_range': {"StartDate" : null, "EndDate" : null},
  }
  Report = {}
  Report_title: String;
  Report_Req: String;
  date: String
  
  saveit = false;
  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;

  title = 'date-picker';
  model_start;
  model_end;

  dropdownOptions = [{"option": "Original"},{"option": "Subsequent"},{"option": "Both"}];
  config = {
    displayKey: "option", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 3
  };

  //----------------------------------------------Dropdown settings--------------------------------------------------------------------

  selectedItemsDivision = {};
  dropdownSettingsDivision = {};
  divisionRadioSelection: any;
  division_index = [];

  selectedItemsModelYear = {};
  dropdownSettingsModelYear = {};
  modelRadio: any;
  modelYearSelectedItems: any;
  modelYear: any;

  allocationSelectItems = [];
  allocationIndex: Array<number> = [];
  selectedItemsAllocation = [];
  dropdownSettingsAllocation = {};
  alloRadio: any;
  // allocationGroupselecteditems: any;
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

  //==================================================================================================================================


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

  startDate: {};
  endDate: {};
  otsElement: Object;
  abcd: any;
  report_message: string;
  summary: Object;
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
  pdfGenerationProgress: number;
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
  
  user_role : string;
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
  targetProd: boolean;
  bac_description: any;
  fan_desc: any;

  constructor(private router: Router, calendar: NgbCalendar,
    private django: DjangoService, private report_id_service: GeneratedReportService,private auth_service : AuthenticationService,
    private DatePipe: DatePipe, private spinner: NgxSpinnerService, private dataProvider: DataProviderService, private toastr: ToastrService,
    private reportDataService: RepotCriteriaDataService) {
      this.auth_service.myMethod$.subscribe(role =>{
        if (role) {
          this.user_name = role["first_name"] + " " + role["last_name"]
          this.user_role = role["role"]
        }
      })    

    this.gcheck = false;
    this.ncheck = false;
    this.check = false;
    // this.lookup = dataProvider.getLookupTableData();
    dataProvider.currentlookUpTableData.subscribe(element=>{
      if(element){
        this.lookup = element

        let ref = this.lookup['data']['desc_text']
    let temps = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 12;
    })
    // //console.log(temp);
    this.original_content = temps.description;
    this.namings = this.original_content;

    this.reportDataService.getReportID().subscribe(ele => {
      this.reportId = ele;
    });

    this.report_id_service.currentSelections.subscribe(report_id => {
      this.generated_report_id = report_id
      console.log(report_id)
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

    //Dropdowns--------------------------------------------------
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
      badgeShowLimit:2,
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


    //-----------------------------------------------------------

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
    // this.userdivdata = dataProvider.getUserSelectionData();
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  notify(){
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  ngOnInit() {
    this.targetProd =true;
  }

  ngAfterViewInit(){
    ClassicEditor.create(document.querySelector('#ckEditorHelp'), this.editorConfig).then(editor => {
      this.editorHelp = editor;
      // //console.log('Data: ', this.editorData);
      this.editorHelp.setData(this.namings);
      this.editorHelp.isReadOnly = true;
      // ClassicEditor.builtinPlugins.map(plugin => //console.log(plugin.pluginName))
    })
      .catch(error => {
        //console.log('Error: ', error);
      });
  }

  content_edits(){
    this.spinner.show()
    this.editModes = false;
    this.editorHelp.isReadOnly = true;
    this.description_text['description'] = this.editorHelp.getData();
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {

      let temp_desc_text = this.lookup['data']['desc_text']
      temp_desc_text.map((element,index)=>{
        if(element['ddm_rmp_desc_text_id']==12){
          temp_desc_text[index] = this.description_text
        }
      })
      this.lookup['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.lookup)  
      //console.log("changed")    
      this.editModes = false;
      this.ngOnInit()
      // //console.log("inside the service")
      // //console.log(response);
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
    // this.loading = true

    this.Checkbox_data = this.lookup.data.checkbox_data


    //---------------------------------------DropDown Data-----------------------------------------------------------------------------

    this.allo = this.lookup.data.allocation_grp;
    this.modelYearSelectedItems = this.lookup.data.model_year;
    this.merchandize = this.lookup.data.merchandising_data;
    this.orderTypeSelecteditems = this.lookup.data.order_type;
    this.vehicleData = this.lookup.data.vehicle_data;
    this.orderEvent = this.lookup.data.order_event;

    this.vehicleDataSelecteditems = this.vehicleData.filter(element => {
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
    } else {
      this.displaySummary[1][0].default = "unchecked";
    }




    //--------------------------------For type of Data Selection--------------------------------------------------------------
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
  //================================================================================================================================
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
    this.vehicleSelection(this.vehicleIndex)
    this.vehicleDeSelection(this.vehicleIndex)
    this.allocationIndex = []
    if (this.selectedItemsAllocation) {
      this.selectedItemsAllocation.map(element => {
        if (!(this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group_id"]))) {
          this.allocationIndex.push(element["ddm_rmp_lookup_dropdown_allocation_group_id"])
        }
      })
    }
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
    this.allocationFinalList = this.allo.filter(element => {
      return this.vehicleIndex.includes(element["ddm_rmp_lookup_dropdown_vehicle_line_brand"])
    })
  }

  vehicleDeSelection(vehicleIndex: any) {
    this.selectedItemsAllocation = this.selectedItemsAllocation.filter(element => {
      return this.vehicleIndex.includes(element.ddm_rmp_lookup_dropdown_vehicle_line_brand_id)
    })
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
  }

  allocationDeSelectAll(item: any) {
    this.allocationIndex = []
    this.allocationSelection(this.allocationIndex)
    this.allocationDeSelection(this.allocationDeSelection)
  }

  allocationSelection(allocationIndex: any) {
    this.merchandizeFinalList = this.merchandize.filter(element => {
      return this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group"])
    })
  }

  allocationDeSelection(allocationIndex: any) {
    this.merchandizeItemsSelect = this.merchandizeItemsSelect.filter(element => {
      return this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group"])
    })
  }

  //=========================================================================================================================
  //-----------------------------CHECKBOXES------------------------------------------------------------------------------------

  DistributionEntityRadio(val, event) {

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
    //console.log(this.finalData.checkbox_data)
  }

  CheckboxCheckDropdown(val, event) {
    if (event.target.checked) {
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_ots_checkbox_values_id.toString()))).disabled = false
      this.commonReqCheckbox = { 
        "value": val.field_values, 
        "id": val.ddm_rmp_lookup_ots_checkbox_values_id, 
        "desc": this.textData 
      };
      if(val.ddm_rmp_lookup_ots_checkbox_values_id == 5){
        this.targetProd = false;
      }
      this.finalData.checkbox_data.push(this.commonReqCheckbox);
    }
    else {
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_ots_checkbox_values_id.toString()))).disabled = true;
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_ots_checkbox_values_id.toString()))).value = "";
      for (var i = 0; i < this.finalData.checkbox_data.length; i++) {
        if (this.finalData.checkbox_data[i].id == val.ddm_rmp_lookup_ots_checkbox_values_id) {
          var index = this.finalData.checkbox_data.indexOf(this.finalData.checkbox_data[i]);
          this.finalData.checkbox_data.splice(index, 1);
          if(val.ddm_rmp_lookup_ots_checkbox_values_id == 5){
            this.targetProd = true;
          }
        }
      }
    }

  }

  selectionChanged(val, event){
    //console.log(event);
    for (var i = 0; i < this.finalData.checkbox_data.length; i++) {
      if (this.finalData.checkbox_data[i].id == val) {
        this.finalData.checkbox_data[i].desc = event.option
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


  //===================================================================================================================================
  //--------------------Final JSON CREATION----------------------------------------------------------------------------------------------
  DropdownSelected() {
    
    this.finalData["model_year"] = { "dropdown": this.selectedItemsModelYear, "radio_button": $("input[name=modelRadio]:checked").val() }
    this.finalData["division_selected"] = { "radio_button": $("input[name=divRadio]:checked").val() }
    this.finalData["allocation_group"] = { "dropdown": this.selectedItemsAllocation, "radio_button": $("input[name=alloRadio]:checked").val() }
    this.finalData["vehicle_line"] = { "dropdown": this.selectedItemsVehicleLine, "radio_button": $("input[name=vehicleRadio]:checked").val() }
    this.finalData["merchandizing_model"] = { "dropdown": this.merchandizeItemsSelect, "radio_button": $("input[name=merchradio]:checked").val() }
    this.finalData["order_type"] = { "dropdown": this.selectedItemsOrderType, "radio_button": $("input[name=orderRadio]:checked").val() }
    this.finalData["order_event"] = { "dropdown": this.selectedItemsOrderEvent }
    this.finalData["report_id"] = this.generated_report_id;
    if (this.other_description == undefined) {
      this.finalData["other_desc"] = ""; 
    }
    else {
    this.finalData["other_desc"] = this.other_description;
    }
    this.date = "";
    this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    this.finalData["report_detail"] = { "title": this.Report_title, "additional_req": this.Report_Req, "report_type": "ots", "status": "Pending", "status_date": this.date, "created_on": "", "on_behalf_of": "", "assigned_to": "", "link_to_results": "", "query_criteria": "", "link_title": "", "requestor": this.user_name }
    this.order_to_sale_selection = this.finalData
   
  }
  
  //==============================================================================================================================
  
  validateInput() {
    //console.log(this.toDate);
    //console.log(this.fromDate)
    //console.log(this.finalData)
    this.from_date = this.DatePipe.transform(this.fromDate, 'dd-MMM-yyyy')
    var selected_check = []
    $(".tod_checkbox_group:checkbox").each(function(){
      var $this = $(this);
      if($this.is(":checked")){
        let temp_id = $this.attr("id");
        temp_id = temp_id[9]
        selected_check.push(Number(temp_id)+1 );
      }
    })
    //console.log(selected_check)

    this.finalData["distribution_data"] = this.finalData["distribution_data"].filter(element=>{
      return selected_check.includes(element["id"])
    })
    
    if (this.selectedItemsOrderType === undefined || Object.keys(this.selectedItemsOrderType).length == 0) {
      // alert("Please make date time range selections")
      this.flag = false;
      this.ot_flag = true;
    }

    else {
      this.ot_flag = false;
    }

    if (this.finalData["distribution_data"].length == 0 || this.finalData["distribution_data"] == undefined ) {
      this.flag = false;
      this.typeofdata_flag = true
    }
    else {
      this.typeofdata_flag = false
    }

    if (this.ot_flag == false || this.typeofdata_flag == false) {
      this.flag = true
    }
    //console.log(this.flag)
    //console.log(this.finalData)
  }

  submit() {
    //console.log(this.Report_title)
    if (this.Report_title == "" || this.Report_title == undefined || this.Report_Req == "" || this.Report_Req == undefined) {
      this.modal_validation_flag = true;
      this.summary_flag = false;

    }
    else {
      this.summary_flag = true;
      $("#review_close:button").click()
      this.modal_validation_flag = false
      this.spinner.show();
      this.DropdownSelected();

      if (this.reportId != 0) {
        // this.getDefaultSelections();
      }

      let checkedTodBoxes = []
      $(".tod_checkbox_group").each(function(){
        var $this = $(this);
        if($this.is(":checked")){
          let id = +($this.attr("id"))[9]
          checkedTodBoxes.push(id+1)
        }
      })
      console.log(checkedTodBoxes)
      let filteredDistributionData = this.finalData.distribution_data
      this.order_to_sales_selection = this.finalData

      console.log(this.finalData)
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
  }
  getreportSummary() {
    this.django.get_report_description(this.generated_report_id).subscribe(Response => {
      this.summary = Response
      //console.log(this.summary)
      this.spinner.hide()
      this.bac_description = (this.summary["bac_data"][0].bac_desc).join(",");
      console.log("Bac")
      console.log(this.bac_description)
      this.fan_desc = this.summary["fan_data"][0].fan_data;
      console.log("Fan")
      console.log(this.fan_desc)
      this.spinner.hide();
      console.log(this.summary)

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
    },err=>{
      this.spinner.hide();
    })
  }

  onItemSelect(item: any) {

  }

  other_desc(event) {
    this.other_description = event.target.value
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

  //=================================================================================================================================
  //------------------------------------CALENDAR SETTINGS---------------------------------------------------------------------
  changeStartDateFormat() {
    this.customizedFromDate= this.DatePipe.transform(new Date(this.fromDate.year, this.fromDate.month-1,this.fromDate.day),"dd-MMM-yyyy")
  }
  changeEndDateFormat() {
    this.customizedToDate= this.DatePipe.transform(new Date(this.toDate.year, this.toDate.month-1,this.toDate.day),"dd-MMM-yyyy")
  }
  onDateSelection(date: NgbDate) {

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

    if(this.toDate == null || this.fromDate == null || this.toDate == undefined && this.fromDate == undefined){
      this.finalData['data_date_range'] = { "StartDate": "", "EndDate": ""};
    }
    else{
      this.startDate = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;
      this.endDate = this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day;
      // this.finalData['data_date_range'] = { "StartDate": null, "EndDate": null };
      this.finalData['data_date_range'] = { "StartDate": this.startDate, "EndDate": this.endDate };

    }

  
    // .year+"/"+this.toDate.month+"/"+this.toDate.day;

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

  //=========================================================================================================================
  back() {
    this.router.navigate(["user/submit-request/select-report-criteria"]);
  }
  //-------------------------------------------CHECKBOXES additional functionality--------------------------------------------

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
      //console.log(this.finalData.checkbox_data)
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
      // if(this.orderEventCheck[i].ddm_rmp_ots_checkbox_group_id == this.finalData.checkbox_data.id){
      // var index = this.finalData.checkbox_data.indexOf(this.finalData.checkbox_data[i]);
      // this.finalData.checkbox_data.splice(index,1);

      this.orderEventId = [];
      this.checkboxId = [];
    }
  }
  //===============================================================================================================================

  func() {
    if((this.selectedItemsOrderEvent).length>0)
    { 
      var x = document.getElementById("calendars");
      //console.log(x)
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

  printDiv() {
    this.restorepage = document.body.innerHTML;
    this.printcontent = document.getElementById('editable').innerHTML;
    document.body.innerHTML = this.printcontent;
    window.print();
    document.body.innerHTML = this.restorepage;
    location.reload(true);
  }

  //============================================Pdf function=====================================//
  captureScreen() {
    var data = document.getElementById('order-summary-export');
    var par2
    html2canvas(data).then(canvas => {
      var imageWidth = 208;
      var pageHeight = 295;
      var imageHeight = canvas.height * imageWidth / canvas.width;
      var heightLeft = imageHeight;
      this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
        this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
        heightLeft -= pageHeight;
      }
      PdfUtility.saveBlob(pdf.output('blob'), 'Request #' + this.generated_report_id + '.pdf');
      //pdf.save('Request #' + this.generated_report_id + '.pdf'); // Generated PDF   
    }).catch(error => {
      //console.log(error);
    });
    ;
  }
  //------------------------------------------START GET Defaults-------------------------------------------------//

  getDefaultSelections() {
    var retail, nonRetail, fleet;
    //checkbox data
    var temp = this.finalData;
    $.each($("input[class='chk']:checked"), function () {
      let chkDataCheckbox = {}
      chkDataCheckbox = { "id": $(this).val(), "value": $(this).val(), "desc": "none" };
      temp.checkbox_data.push(chkDataCheckbox);
    });
    this.finalData = temp;
    // date time object
    var sdate = $("#fromDate").val();
    var tdate = $("#toDate").val();
    this.finalData.data_date_range = { "StartDate": sdate, "EndDate": tdate };
    // order type object
    if ($("#disSumOT0").prop("checked")) {
      this.orderRadio = "Display";
    } else {
      this.orderRadio = "Summary";
    }
    this.finalData["order_type"] = { "dropdown": this.selectedItemsOrderType, "radio_button": this.orderRadio };

    this.finalData["other_desc"] = $("#otherText").val();
    //distribution data object
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

    // //console.log("JSON DATA:: "+JSON.stringify(this.finalData));

  }

  //------------------------------------------END GET Defaults---------------------------------------------------------// 
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
        //console.log("Error Occ");
      }
      //type data radio buttons    
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
      //Order type data
      var orderType = element['ots_data']['order_type'][0];
      if (orderType.display_summary_value == "Summary") {
        $("#disSumOT1").prop("checked", true);
      } else {
        $("#disSumOT0").prop("checked", true);
      }

      //date picker data
      var dateData = element["ots_data"]["data_date_range"][0];
      $("#fromDate").val(dateData.start_date);
      $("#toDate").val(dateData.end_date);

      //Data element for Date Range       
      var otherData = element['ots_data']['other_desc'][0];
      $("#otherText").val(otherData.other_desc);

      //Dropdown data type of data
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
  //------------------------------------------------------END SET Defaults-------------------------------------------//
  //====================================File Upload Functionality====================================================//
  files() {
    this.file = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    var formData = new FormData();
    formData.append('display_file', this.file);
    formData.append("ddm_rmp_post_report_id", this.generated_report_id.toString());
    formData.append("ddm_rmp_user_info_id", "1");

    this.spinner.show();
    this.django.ddm_rmp_file_data(formData).subscribe(response => {
      this.spinner.hide()
    });
  }
  //======================================================End File Upload Functionality====================================//

  disableCheck(id) {
    let id_field = '#tod_check' + id
    if ($(id_field).prop("checked")) {
      return false;
    }
    else {
      return true;
    }
    
  }

  Check(id) {
    let id_field = '#tod_check' + id
    if ($(id_field).prop("checked")) {
      return false;
    }
    else {
      return true;
    }
    
  }



}