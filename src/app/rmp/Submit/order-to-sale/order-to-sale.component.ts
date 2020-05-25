// Migrated by Ganesha
import { Component, OnInit, AfterViewInit } from '@angular/core';
import "../../../../assets/debug2.js";
declare var jsPDF: any;
declare var $: any;
import { Router } from "@angular/router";
import { DjangoService } from '../../django.service';
import { DatePipe } from '@angular/common'
import { GeneratedReportService } from '../../generated-report.service'
import { DataProviderService } from "../../data-provider.service";
import { NgToasterComponent } from "../../../custom-directives/ng-toaster/ng-toaster.component";
import Utils from "../../../../utils";
import { ReportCriteriaDataService } from "../../services/report-criteria-data.service";
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';

import {
  FormControl, FormGroupDirective,
  NgForm, FormGroup, FormBuilder
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

const moment = _moment;
const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-order-to-sale',
  templateUrl: './order-to-sale.component.html',
  styleUrls: ['./order-to-sale.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class OrderToSaleComponent implements OnInit, AfterViewInit {
  public generated_report_status: string;
  public generated_report_id: number;
  public selectedItems = [];
  public dropdownSettings = {};
  public order_to_sales_selection = {};

  public order_to_sale_selection: any;
  public textData;
  public type_data_value = {};
  public finalData = {
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
  public temp_freq = {
    'freq_values': [],
    'desc': []
  }

  public Report = {}
  public report_status: string;
  public Report_title: string;
  public Report_Req: string = "";
  public date: string
  public targetValue: any;
  public saveit = false;
  public fromDate: any = new FormControl();
  public toDate: any = new FormControl();
  public fromDateDOSP: any = new FormControl();
  public toDateDOSP: any = new FormControl();
  public Checkbox_selected = {}
  public targetProd: boolean = true;
  public textChange = false;
  public otsObj = {
    divisionRadio: "Display",
    modelRadio: "Display",
    vlbRadio: "Display",
    alloRadio: "Display",
    merchRadio: "Display",
    orderTypeRadio: "Display",
    otherDesc: ""
  }
  public dateSelect: any;

  public title = 'date-picker';
  public model_start;
  public model_end;
  public dataModel: any;
  public dropdownOptions = ["Original", "Subsequent", "Both"];

  public dropdownSettingsTarget = {};
  public TargetSelect: any;
  public selectedItemsDivision = {};
  public divisionRadioSelection: any;
  public division_index = [];

  public selectedItemsModelYear = [];
  public dropdownSettingsModelYear = {};
  public modelRadio: any;
  public modelYearSelectedItems: any = [];
  public modelYear: any;

  public allocationSelectItems = [];
  public allocationIndex: Array<number> = [];
  public selectedItemsAllocation = [];
  public dropdownSettingsAllocation = {};
  public alloRadio: any;
  public allo: any = [];
  public allocationFinalList = []

  public selectedItemsMerchandize = {};
  public dropdownSettingsMerchandize = {};
  public merchandizeItemsSelect = [];
  public merchandizeFinalList = [];
  public merchandiseRadio: any;
  public merchandizeSelecteditems: any;
  public merchandize: any = [];

  public selectedItemsOrderType = [];
  public dropdownSettingsOrderType = {};
  public orderRadio: any;
  public orderTypeSelecteditems: any = [];
  public orderType: any;

  public vehicleIndex: Array<number> = [];
  public selectedItemsVehicleLine = [];
  public dropdownSettingsVehicleLine = {};
  public vehicleDataSelecteditems: any = []
  public vehicleData: any;

  public selectedItemsOrderEvent = [];
  public dropdownSettingsOrderEvent = {};
  public orderEvent: any = [];

  public gcheck: boolean = false;
  public ncheck: boolean = false;
  public check: boolean = false;

  public orderToSaleDropdowns: any;
  public typeOfData: any;
  public displaySummary: any;
  public orderEventsAvailable: any;
  public dospDataAvailable: any;
  public commonlyRequestedFields: any;
  public commonReqCheckbox = {};

  public distributionEntityFields: any;
  public distributionEntityCheckbox = {};
  public optionContentAvailable: any;
  public optionContentCheckbox = {};
  public daysSupply: any;
  public DaysSupplyCheckbox = {};

  public salesDataAvailable: any;
  public SalesAvailabilityCheckbox = {};
  public DospCheckbox = {};
  public orderEventsCheckbox = {};
  public selectedMonth: any;
  public Checkbox_data: any;
  public Checkbox_value = {};
  public DropValues = {};

  public distributionRadio = "";
  public distId;
  public counter;
  public startDate: {};
  public endDate: {};
  public otsElement: Object;
  public abcd: any;
  public report_message: string;
  public summary: any;
  public restorepage: any;
  public printcontent: any;
  public lookup;
  public userdivdata;
  public divDataSelected = [];
  public reportId = 0;
  public orderEventCheck: any;
  public orderEventId = [];
  public checkboxId = [];
  public left = [];
  public other_description: any[];
  public orderEventCheckFilter: any;
  public file;
  public flag = true;
  public summary_flag = true;
  public typeofdata_flag = false;
  public modal_validation_flag = false;
  public frequency_flag: boolean;
  public contact_flag: boolean;
  public ot_flag = false;

  public contents;
  public enable_edits = false
  public editModes = false;
  public original_content;
  public namings: any;

  public user_role: string;
  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_text = {
    "ddm_rmp_desc_text_id": 12,
    "module_name": "He_OrderToSale",
    "description": ""
  }
  public from_date: string;
  public user_name: string;
  public error_message: string;
  public bac_description: any;
  public fan_desc: any;
  public text_notification: any;
  public market_description: any;
  public zone_description: any;
  public area_description: any;
  public region_description: any;
  public lma_description: any;
  public gmma_description: any;
  public allocation_group: any;
  public model_year: any;
  public merchandising_model: any;
  public vehicle_line_brand: any;
  public order_event: any;
  public order_type: any;
  public checkbox_data: any;
  public report_frequency: any;
  public special_identifier: any;
  public division_dropdown: any;
  public report_frequency_desc: any;
  public other_info: any;
  public startDateDOSP: {};
  public endDateDOSP: {};
  public dosp_calendar_flag: boolean;

  public report_create: any;
  public assigned_to: any;
  public report_on_behalf = "";
  public readOnlyContentHelper = true;
  public enableUpdateData = false;

  public myForm: FormGroup;
  public matcher = new MyErrorStateMatcher();
  public targetStart = "";
  public targetend = "";
  public dateClass: any;
  public targetStartDate: any;
  public targetEndDate: any;
  public targetStartMonth: any;
  public targetEndMonth: any;
  public minOrderEventDate: any = "";
  public minDate: any = "";

  public config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['image']
    ]
  };

  public toolbarTooltips = {
    'font': 'Select a font',
    'size': 'Select a font size',
    'header': 'Select the text style',
    'bold': 'Bold',
    'italic': 'Italic',
    'underline': 'Underline',
    'strike': 'Strikethrough',
    'color': 'Select a text color',
    'background': 'Select a background color',
    'script': {
      'sub': 'Subscript',
      'super': 'Superscript'
    },
    'list': {
      'ordered': 'Numbered list',
      'bullet': 'Bulleted list'
    },
    'indent': {
      '-1': 'Decrease indent',
      '+1': 'Increase indent'
    },
    'direction': {
      'rtl': 'Text direction (right to left | left to right)',
      'ltr': 'Text direction (left ro right | right to left)'
    },
    'align': 'Text alignment',
    'link': 'Insert a link',
    'image': 'Insert an image',
    'formula': 'Insert a formula',
    'clean': 'Clear format',
    'add-table': 'Add a new table',
    'table-row': 'Add a row to the selected table',
    'table-column': 'Add a column to the selected table',
    'remove-table': 'Remove selected table',
    'help': 'Show help'
  };

  constructor(public router: Router,
    public django: DjangoService, public report_id_service: GeneratedReportService, public auth_service: AuthenticationService,
    public DatePipe: DatePipe, public dataProvider: DataProviderService, public toastr: NgToasterComponent,
    public reportDataService: ReportCriteriaDataService,
    private formBuilder: FormBuilder) {
  }

  // execute after html initialized
  public ngAfterViewInit() {
    this.showTooltips();
  }

  // quill editor buttons tooltips display
  public showTooltips() {
    let showTooltip = (which, el) => {
      var tool: any;
      if (which == 'button') {
        tool = el.className.replace('ql-', '');
      }
      else if (which == 'span') {
        tool = el.className.replace('ql-', '');
        tool = tool.substr(0, tool.indexOf(' '));
      }
      if (tool) {
        if (tool === 'blockquote') {
          el.setAttribute('title', 'blockquote');
        }
        else if (tool === 'list' || tool === 'script') {
          if (this.toolbarTooltips[tool][el.value])
            el.setAttribute('title', this.toolbarTooltips[tool][el.value]);
        }
        else if (el.title == '') {
          if (this.toolbarTooltips[tool])
            el.setAttribute('title', this.toolbarTooltips[tool]);
        }
        //buttons with value
        else if (typeof el.title !== 'undefined') {
          if (this.toolbarTooltips[tool][el.title])
            el.setAttribute('title', this.toolbarTooltips[tool][el.title]);
        }
        //defaultlsdfm,nxcm,v vxcn
        else
          el.setAttribute('title', this.toolbarTooltips[tool]);
      }
    };

    let toolbarElement = document.querySelector('.ql-toolbar');
    if (toolbarElement) {
      let matchesButtons = toolbarElement.querySelectorAll('button');
      for (let i = 0; i < matchesButtons.length; i++) {
        showTooltip('button', matchesButtons[i]);
      }
      let matchesSpans = toolbarElement.querySelectorAll('.ql-toolbar > span > span');
      for (let i = 0; i < matchesSpans.length; i++) {
        showTooltip('span', matchesSpans[i]);
      }
    }
  }

  public notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  ngOnInit() {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"]
        this.user_role = role["role"]
      }
    })

    this.dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.lookupDateReassigning(element);
      }
    })

    if (localStorage.getItem('report_id')) {
      this.previousSelections(localStorage.getItem('report_id'));
    }
    this.salesDataAvailable = this.Checkbox_data ? this.Checkbox_data.filter(element => element.checkbox_desc == "Sales and Availability") : [];
  }

  public lookupDateReassigning(element) {
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
    this.setDropDownDefaultSettings();
    $('input.gross-sales').on('click', function () {
      $('input.gross-sales').not(this).prop('checked', false);
    });

    $('input.net-sales').on('click', function () {
      $('input.net-sales').not(this).prop('checked', false);
    });

    this.getOrderToSaleContent();
  }

  // formating date 
  public dateFormat(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }


  public content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner();
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_text['description'] = this.namings;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {

        let temp_desc_text = this.lookup['data']['desc_text']
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 12) {
            temp_desc_text[index] = this.description_text
          }
        })
        this.lookup['data']['desc_text'] = temp_desc_text;
        this.dataProvider.changelookUpTableData(this.lookup)
        this.editModes = false;
        this.ngOnInit()
        this.original_content = this.namings;
        Utils.hideSpinner();
      }, err => {
        Utils.hideSpinner();
      })
    } else {
      this.toastr.error("please enter the data");
    }
  }

  public edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_content;
  }

  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_content;
  }


  public getOrderToSaleContent() {
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
    this.allocationFinalList = this.allo.filter(element => {
      return this.division_index.includes(element.ddm_rmp_lookup_division)
    })
    this.merchandizeFinalList = this.merchandize.filter(element => {
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
  }

  //----------------------------------------------DEPENDENT DROPDOWNS SETTINGS----------------------------------------------------------

  public vehicleItemSelect(item: any) {
    this.selectedItemsVehicleLine.map(element => {
      if (!(this.vehicleIndex.includes(element["ddm_rmp_lookup_dropdown_vehicle_line_brand_id"]))) {
        this.vehicleIndex.push(element["ddm_rmp_lookup_dropdown_vehicle_line_brand_id"])
      }
    })
    this.vehicleSelection(this.vehicleIndex)
  }

  public vehicleItemDeSelect(item: any) {
    this.vehicleIndex.splice(this.vehicleIndex.indexOf(item['ddm_rmp_lookup_dropdown_vehicle_line_brand_id']), 1)

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

  public vehicleSelectAll(items: any) {
    for (let index = 1; index <= items.length; index++) {
      if (!(this.vehicleIndex.includes(index))) {
        this.vehicleIndex.push(index)
      }
    }
    this.vehicleSelection(this.vehicleIndex)
  }

  public vehicleDeSelectAll(items: any) {
    this.vehicleIndex = []
    this.vehicleSelection(this.vehicleIndex)
    this.vehicleDeSelection(this.vehicleIndex)
    this.allocationDeSelectAll(this.selectedItemsAllocation)
  }

  public vehicleSelection(vehicleIndex: any) {
    if (this.vehicleIndex.length != 0) {
      this.allocationFinalList = this.allo.filter(element => {
        return this.vehicleIndex.includes(element["ddm_rmp_lookup_dropdown_vehicle_line_brand"])
      })

      this.merchandizeFinalList = this.merchandize.filter(element => {
        return this.vehicleIndex.includes(element["ddm_rmp_lookup_dropdown_vehicle_line_brand"])
      });
    }
    else if (this.vehicleIndex.length == 0) {
      this.allocationFinalList = this.allo.filter(element => {
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })

      this.merchandizeFinalList = this.merchandize.filter(element => {
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

  public vehicleDeSelection(vehicleIndex: any) {
    this.selectedItemsAllocation = this.selectedItemsAllocation.filter(element => {
      return this.vehicleIndex.includes(element.ddm_rmp_lookup_dropdown_vehicle_line_brand_id)
    })
    this.merchandizeItemsSelect = this.merchandizeItemsSelect.filter(element => {
      return this.vehicleIndex.includes(element.ddm_rmp_lookup_dropdown_vehicle_line_brand_id)
    })

    if (this.vehicleIndex.length == 0) {
      this.allocationFinalList = this.allo.filter(element => {
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })

      this.merchandizeFinalList = this.merchandize.filter(element => {
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })
    }
  }

  public allocationItemsSelect(item: any) {
    this.selectedItemsAllocation.map(element => {
      if (!(this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group_id"]))) {
        this.allocationIndex.push(element["ddm_rmp_lookup_dropdown_allocation_group_id"])
      }
    })
    this.allocationSelection(this.allocationIndex)
  }

  public allocationItemDeSelect(item: any) {
    this.allocationIndex.splice(this.allocationIndex.indexOf(item["ddm_rmp_lookup_dropdown_allocation_group_id"]), 1)
    this.allocationSelection(this.allocationIndex)
    this.allocationDeSelection(this.allocationIndex)
  }

  public allocationSelectAll(items: any) {
    for (let index = 1; index <= items.length; index++) {
      if (!(this.allocationIndex.includes(index))) {
        this.allocationIndex.push(index)
      }
    }
    this.allocationSelection(this.allocationIndex)
  }

  public allocationDeSelectAll(item: any) {
    this.allocationIndex = []
    this.allocationSelection(this.allocationIndex)
    this.allocationDeSelection(this.allocationIndex)
    this.merchandizeFinalList = this.merchandize
  }

  public allocationSelection(allocationIndex: any) {
    if (this.allocationIndex.length != 0) {
      this.merchandizeFinalList = this.merchandize.filter(element => {
        return this.allocationIndex.includes(element["ddm_rmp_lookup_dropdown_allocation_group"])
      })
    }
    else if (this.allocationIndex.length == 0) {
      if (this.vehicleIndex.length != 0) {
        this.merchandizeItemsSelect = this.merchandizeItemsSelect.filter(element => {
          return this.vehicleIndex.includes(element.ddm_rmp_lookup_dropdown_vehicle_line_brand_id)
        })
      }
      else if (this.vehicleIndex.length == 0) {
        this.merchandizeFinalList = this.merchandize.filter(element => {
          return this.division_index.includes(element.ddm_rmp_lookup_division)
        })
      }
    }
  }

  public allocationDeSelection(allocationIndex: any) {
    if (this.allocationIndex.length == 0) {
      if (this.vehicleIndex.length != 0) {
        this.merchandizeItemsSelect = this.merchandizeItemsSelect.filter(element => {
          return this.vehicleIndex.includes(element.ddm_rmp_lookup_dropdown_vehicle_line_brand_id)
        })
      }
      else if (this.vehicleIndex.length == 0) {
        this.merchandizeFinalList = this.merchandize.filter(element => {
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

  public distributionEntityRadio(i, val, event) {
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

  public desc(element) {
    this.textData = element;
  }

  public CheckboxCheck(val, event) {
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

  public CheckboxCheckDropdown(val, event) {
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
      else { this.targetProd = true; }
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

  public selectionChanged(val, ng) {
    for (var i = 0; i < this.finalData.checkbox_data.length; i++) {
      if (this.finalData.checkbox_data[i].id == val) {
        this.finalData.checkbox_data[i].desc = ng
      }
    }
  }

  public getSpecifyContent(val, event) {
    for (var i = 0; i < this.finalData.checkbox_data.length; i++) {
      if (this.finalData.checkbox_data[i].id == val) {
        this.finalData.checkbox_data[i].desc = event.target.value
      }
    }
  }

  //--------------------Final JSON CREATION----------------------------------------------------------------------------------------------
  public DropdownSelected() {
    this.finalData["model_year"] = { "dropdown": this.selectedItemsModelYear, "radio_button": this.otsObj.modelRadio }
    this.finalData["division_selected"] = { "radio_button": this.otsObj.divisionRadio }
    this.finalData["allocation_group"] = { "dropdown": this.selectedItemsAllocation, "radio_button": this.otsObj.alloRadio }
    this.finalData["vehicle_line"] = { "dropdown": this.selectedItemsVehicleLine, "radio_button": this.otsObj.vlbRadio }
    this.finalData["merchandizing_model"] = { "dropdown": this.merchandizeItemsSelect, "radio_button": this.otsObj.merchRadio }
    this.finalData["order_type"] = { "dropdown": this.selectedItemsOrderType, "radio_button": this.otsObj.orderTypeRadio }
    if (this.selectedItemsOrderEvent.length > 0)
      this.finalData["order_event"] = { "dropdown": this.selectedItemsOrderEvent }
    else if (this.otsObj.otherDesc !== '') {
      let otherText = [{
        ddm_rmp_lookup_dropdown_order_event_id: 0,
        order_event: this.otsObj.otherDesc
      }];
      this.finalData["order_event"] = { "dropdown": otherText }
    } else {
      let otherText = [{
        ddm_rmp_lookup_dropdown_order_event_id: 0,
        order_event: ''
      }];
      this.finalData["order_event"] = { "dropdown": [] }
    }
    this.finalData["report_id"] = this.generated_report_id;
    if (this.other_description == undefined) {
      this.finalData["other_desc"] = "";
    }
    else {
      this.finalData["other_desc"] = this.other_description;
    }

    if (this.report_create == null || this.report_create == "" || this.report_create == undefined) {
      this.finalData['report_detail']['created_on'] = ""
      this.report_create = ""
    }
    if (this.assigned_to == null || this.assigned_to == "" || this.assigned_to == undefined) {
      this.finalData['report_detail']['assigned_to'] = ""
      this.assigned_to = ""
    }
    if (this.report_status == "" || this.report_status == null || this.report_status == undefined) {
      this.finalData['report_detail']['status'] = "Pending"
      this.report_status = "Pending"
    }
    this.date = "";
    this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    this.finalData["report_detail"] = {
      "title": this.Report_title,
      "additional_req": this.Report_Req,
      "report_type": "ots",
      "status_date": this.date,
      "status": this.report_status,
      "created_on": this.report_create,
      "assigned_to": this.assigned_to,
      "on_behalf_of": this.report_on_behalf,
      "link_to_results": "",
      "query_criteria": "",
      "link_title": "",
      "requestor": this.user_name
    }
    this.order_to_sale_selection = this.finalData
  }

  public validateInput() {
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
      this.typeofdata_flag = false
      $('#order-review-selection').modal('show');
    }

    if (this.ot_flag == false || this.typeofdata_flag == false) {
      this.flag = true
    }
  }

  public submit() {
    if (this.Report_title == "" || this.Report_title == undefined || this.Report_Req == "" || this.Report_Req == undefined) {
      this.modal_validation_flag = true;
      this.summary_flag = false;
    }
    else {
      this.summary_flag = true;
      this.modal_validation_flag = false
      this.DropdownSelected();

      if (this.reportId != 0) {
      }

      if (this.report_status == "" || this.report_status == null) {
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
      this.order_to_sales_selection = this.finalData;
      Utils.showSpinner();
      this.django.ddm_rmp_order_to_sales_post(this.order_to_sales_selection).subscribe(response => {
        this.getreportSummary();
        if ((<HTMLInputElement>document.getElementById("attach-file1")).files[0] != null) {
          this.files();
        }
        localStorage.removeItem("report_id")
        this.report_id_service.changeUpdate(false)
        this.toastr.success("Report Selections successfully saved for Report Id : #" + this.generated_report_id)

      }, err => {
        Utils.hideSpinner();
        this.toastr.error("Selection is incomplete")
      })
      this.report_id_service.changeSavedChanges(false)
    }
    $('.modal-backdrop').remove();
  }

  public getreportSummary() {
    Utils.showSpinner();
    this.django.get_report_description(this.generated_report_id).subscribe(Response => {
      this.summary = Response
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
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
    })
  }

  public onItemSelect(item: any) {
  }

  //  disable or enable multiselect dropdown based on other value 
  public other_desc(event) {
    if (!this.selectedItemsOrderType.length && event.target.value !== '') {
      this.otsObj.otherDesc = event.target.value;
      this.dropdownSettingsOrderEvent = {
        singleSelection: false,
        primaryKey: 'ddm_rmp_lookup_dropdown_order_event_id',
        labelKey: 'order_event',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        badgeShowLimit: 1,
        enableSearchFilter: true,
        disabled: true
      };
    } else if (this.selectedItemsOrderType.length || event.target.value === '') {
      this.dropdownSettingsOrderEvent = {
        singleSelection: false,
        primaryKey: 'ddm_rmp_lookup_dropdown_order_event_id',
        labelKey: 'order_event',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        badgeShowLimit: 1,
        enableSearchFilter: true,
        disabled: false
      };
    }

  }

  public onSelectAll(items: any) {
  }

  //---------------------------------------Dropdown Radio Buttons---------------------------------------------------------------------

  public AllocationRadio(val) {
    this.alloRadio = val;
  }

  public MerchandizeRadio(val) {
    this.merchandiseRadio = val;
  }

  public OrderRadio(val) {
    this.orderRadio = val;
  }

  public changeReportMessage() {
    this.report_message = "";
    this.report_id_service.changeMessage("");
    this.router.navigate(["user/request-status"]);
    this.report_id_service.changeButtonStatus(true)
  }

  //------------------------------------CALENDAR SETTINGS---------------------------------------------------------------------

  public onOrderEventdateSelection() {
    let from = this.fromDate.value;
    let to = this.toDate.value;

    //conditions to manage minDate when from,to selected 
    if (from) {
      this.minOrderEventDate = new Date(from.year(), from.month(), from.date());
      if (to) {
        to = +to >= +from ? to : "";
        this.toDate = +to >= +from ? this.toDate : new FormControl();
      }
    }

    if (from && to) {
      this.startDate = from.year() + "-" + (from.month() + 1) + "-" + from.date();
      this.endDate = to.year() + "-" + (to.month() + 1) + "-" + to.date();
      this.finalData['data_date_range'] = { "StartDate": this.startDate, "EndDate": this.endDate };
    }
    else {
      this.finalData['data_date_range'] = { "StartDate": "", "EndDate": "" };
    }
  }

  //------------------------------------CALENDAR SETTINGS DOSP---------------------------------------------------------------------

  public onDOSPDateSelection() {
    let from = this.fromDateDOSP.value;
    let to = this.toDateDOSP.value;

    //conditions to manage minDate when from,to selected 
    if (from) {
      this.minDate = new Date(from.year(), from.month(), from.date());
      if (to) {
        to = +to >= +from ? to : "";
        this.toDateDOSP = +to >= +from ? this.toDateDOSP : new FormControl();
      }
    }

    if (from && to) {
      this.startDateDOSP = from.year() + "-" + (from.month() + 1) + "-" + from.date();
      this.endDateDOSP = to.year() + "-" + (to.month() + 1) + "-" + to.date();
      this.finalData['dosp_start_date'] = this.startDateDOSP;
      this.finalData['dosp_end_date'] = this.endDateDOSP;
    }
    else {
      this.finalData['dosp_start_date'] = "";
      this.finalData['dosp_end_date'] = "";
    }
  }

  public back() {
    this.router.navigate(["user/submit-request/select-report-criteria"]);
  }

  public gros() {
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

  public nets() {
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

  public allClick() {
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

  public func() {
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

  public captureScreen() {
    var specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    var doc = new jsPDF();
    doc.setFont("arial");
    let margins = {
      top: 15,
      bottom: 0,
      left: 18,
      width: 170
    };
    doc.fromHTML(
      $('#print').html(), margins.left, margins.top,
      { 'width': 170, 'elementHandlers': specialElementHandlers, 'top_margin': 15 },
      function () { doc.save('sample-file.pdf'); }, margins
    );
  }

  //------------------------------------------START GET Defaults-------------------------------------------------//

  public getDefaultSelections() {
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
  public setDefaultSelections() {
    Utils.showSpinner();
    this.django.get_report_details(this.reportId).subscribe(element => {
      var subData = element["ots_data"]["checkbox_data"];
      for (var x = 0; x <= subData.length - 1; x++) {
        $('.chk').each(function (i, obj) {
          if (subData[x].ddm_rmp_lookup_ots_checkbox_values == $(obj).prop("value")) {
            $(obj).prop("checked", true);
          }
        })
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
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
    });
  }

  //====================================File Upload Functionality====================================================//
  public files() {
    this.file = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];

    if (this.file['type'] == '.csv' || this.file['type'] == '.doc' || this.file['type'] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || this.file['type'] == 'application/vnd.ms-excel') {
      var formData = new FormData();
      formData.append('file_upload', this.file);
      Utils.showSpinner();
      this.django.ddm_rmp_file_data(formData).subscribe(response => {
        Utils.hideSpinner();
      }, err => {
        Utils.hideSpinner();
      });
    }
    else {
      this.toastr.error(this.django.defaultUploadMessage)
    }
  }

  public disableCheck(id) {
    let id_field = '#tod_check' + id
    if ($(id_field).prop("checked")) {
      return false;
    }
    else {
      return true;
    }
  }

  public Check($event, i, val) {
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

  public previousSelections(requestId) {
    Utils.showSpinner();
    this.django.get_report_description(requestId).subscribe(element => {
      if (element['ost_data']) {

        this.selectedItemsAllocation = []
        this.allocationFinalList.forEach(eleAllo => {
          element['ost_data']['allocation_group'].forEach(resAllo => {
            if (eleAllo['ddm_rmp_lookup_dropdown_allocation_group_id'] == resAllo['ddm_rmp_lookup_dropdown_allocation_group']) {
              this.selectedItemsAllocation.push(eleAllo)
            }
          })
        })
        this.merchandizeItemsSelect = []
        this.merchandizeFinalList.forEach(eleMerch => {
          element['ost_data']['merchandizing_model'].forEach(resMerch => {
            if (eleMerch['ddm_rmp_lookup_dropdown_merchandising_model_id'] == resMerch['ddm_rmp_lookup_dropdown_merchandising_model']) {
              this.merchandizeItemsSelect.push(eleMerch)
            }
          })
        })

        this.selectedItemsVehicleLine = []
        this.vehicleDataSelecteditems.forEach(eleVlb => {
          element['ost_data']['vehicle_line'].forEach(resVlb => {
            if (eleVlb['ddm_rmp_lookup_dropdown_vehicle_line_brand_id'] == resVlb['ddm_rmp_lookup_dropdown_vehicle_line_brand']) {
              this.selectedItemsVehicleLine.push(eleVlb)
            }
          })
        })

        this.selectedItemsModelYear = []
        this.modelYearSelectedItems.forEach(eleModel => {
          element['ost_data']['model_year'].forEach(resModel => {
            if (eleModel['ddm_rmp_lookup_dropdown_model_year_id'] == resModel['ddm_rmp_lookup_dropdown_model_year']) {
              this.selectedItemsModelYear.push(eleModel)
            }
          })
        })

        this.selectedItemsOrderType = []
        this.orderTypeSelecteditems.forEach(eleOrderType => {
          element['ost_data']['order_type'].forEach(resOrderType => {
            if (eleOrderType['ddm_rmp_lookup_dropdown_order_type_id'] == resOrderType['ddm_rmp_lookup_dropdown_order_type']) {
              this.selectedItemsOrderType.push(eleOrderType)
            }
          })
        })

        this.selectedItemsOrderEvent = []
        this.orderEvent.forEach(eleEvent => {
          element['ost_data']['order_event'].forEach(resEvent => {
            if (eleEvent['ddm_rmp_lookup_dropdown_order_event_id'] == resEvent['ddm_rmp_lookup_dropdown_order_event']) {
              this.selectedItemsOrderEvent.push(eleEvent)
            }
          })
        })

        if (element['ost_data']['allocation_group'][0]) {
          this.otsObj.alloRadio = element['ost_data']['allocation_group'][0]['display_summary_value']
        }
        if (element['ost_data']['model_year'][0]) {
          this.otsObj.modelRadio = element['ost_data']['model_year'][0]['display_summary_value']
        }
        if (element['ost_data']['division_selected'][0]) {
          this.otsObj.divisionRadio = element['ost_data']['division_selected'][0]['display_summary_value']
        }
        if (element['ost_data']['vehicle_line'][0]) {
          this.otsObj.vlbRadio = element['ost_data']['vehicle_line'][0]['display_summary_value']
        }
        if (element['ost_data']['merchandizing_model'][0]) {
          this.otsObj.merchRadio = element['ost_data']['merchandizing_model'][0]['display_summary_value']
        }
        if (element['ost_data']['order_type'][0]) {
          this.otsObj.orderTypeRadio = element['ost_data']['order_type'][0]['display_summary_value']
        }
        if (element['ost_data']['other_desc'][0]) {
          this.otsObj.otherDesc = element['ost_data']['other_desc'][0]['other_desc']
        }

        if (element['ost_data']['checkbox_data']) {
          var subData = element['ost_data']['checkbox_data']
        }

        var temp = this.finalData;
        temp.checkbox_data = [];
        for (var x = 0; x <= subData.length - 1; x++) {
          $('.chk').each(function (i, obj) {
            if (subData[x]['ddm_rmp_lookup_ots_checkbox_values'] == obj.value) {

              if (subData[x].description_text == "") {
                obj.checked = true;
                this.Checkbox_selected = { "value": subData[x].checkbox_description, "id": subData[x].ddm_rmp_lookup_ots_checkbox_values, "desc": subData[x].description_text };
                temp.checkbox_data.push(this.Checkbox_selected);
                this.dosp_calendar_flag = false;
              }
              else if (subData[x].description_text != "") {
                if (subData[x].checkbox_description == 'Target Production Date') {
                  obj.checked = true;
                  this.targetValue = subData[x].description_text
                  this.targetProd = false;
                }
                else {
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

        //Key Element Calendar//
        temp.data_date_range.StartDate = null;
        temp.data_date_range.EndDate = null;
        if (element['ost_data']['data_date_range'][0]['start_date']) {
          var dateStart = element['ost_data']['data_date_range'][0]['start_date'].toString();
          let dateArr = dateStart.split("-");
          let from = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
          this.fromDate = new FormControl(moment(from));
          this.minOrderEventDate = from;
          this.startDate = from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate();
        }

        if (element['ost_data']['data_date_range'][0]['end_date']) {
          var dateEnd = element['ost_data']['data_date_range'][0]['end_date'].toString();
          let dateArr = dateEnd.split("-");
          let to = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
          this.toDate = new FormControl(moment(to));
          this.endDate = to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate();
          temp.data_date_range = { "StartDate": this.startDate, "EndDate": this.endDate };
        }

        //--------------------DOSP Calendar------------------------
        temp.dosp_start_date = null;
        temp.dosp_end_date = null;

        if (element['ost_data']['data_date_range'][0]['dosp_start_date']) {
          var dateStartDOSP = element['ost_data']['data_date_range'][0]['dosp_start_date'].toString();
          let dateArr = dateStartDOSP.split("-");
          let from = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
          this.fromDateDOSP = new FormControl(moment(from));
          this.minDate = from;
          this.startDateDOSP = from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate();
          temp.dosp_start_date = this.startDateDOSP;
        }

        if (element['ost_data']['data_date_range'][0]['dosp_end_date']) {
          var dateEndDOSP = element['ost_data']['data_date_range'][0]['dosp_end_date'].toString();
          let dateArr = dateEndDOSP.split("-");
          let to = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
          this.toDateDOSP = new FormControl(moment(to));
          this.endDateDOSP = to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate();
          temp.dosp_end_date = this.endDateDOSP;
        }

        var disrtibutionData = element['ost_data']['distribution_data']

        for (var x = 0; x <= disrtibutionData.length - 1; x++) {
          $('.tod_checkbox_group').each(function (i, obj) {
            if (disrtibutionData[x]['ddm_rmp_lookup_ots_type_data'] == obj.value) {
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
        if (report_data.status == "Completed") {
          this.report_status = "Pending"
          this.assigned_to = ""
        }
        else if (report_data.status == "Active") {
          this.report_status = "Active";
          this.assigned_to = report_data.assigned_to
        }
        else {
          this.report_status = "Pending"
        }

        this.report_create = report_data.created_on
        this.report_on_behalf = report_data.on_behalf_of
        this.user_name = report_data.requestor

        this.finalData["model_year"] = { "dropdown": this.selectedItemsModelYear, "radio_button": this.otsObj.modelRadio }
        this.finalData["division_selected"] = { "radio_button": this.otsObj.divisionRadio }
        this.finalData["allocation_group"] = { "dropdown": this.selectedItemsAllocation, "radio_button": this.otsObj.alloRadio }
        this.finalData["vehicle_line"] = { "dropdown": this.selectedItemsVehicleLine, "radio_button": this.otsObj.vlbRadio }
        this.finalData["merchandizing_model"] = { "dropdown": this.merchandizeItemsSelect, "radio_button": this.otsObj.merchRadio }
        this.finalData["order_type"] = { "dropdown": this.selectedItemsOrderType, "radio_button": this.otsObj.orderTypeRadio }

        for (var x = 0; x <= subData.length - 1; x++) {
          if (subData[x].checkbox_description == 'Target Production Date') {
            this.targetProd = false
            this.targetValue = subData[x].description_text
            this.Checkbox_selected = { "value": subData[x].checkbox_description, "id": subData[x].ddm_rmp_lookup_ots_checkbox_values, "desc": this.targetValue };
            temp.checkbox_data.push(this.Checkbox_selected);
          }
        }
        this.finalData = temp
      }
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
    })
  }

  public setDropDownDefaultSettings() {
    this.dropdownSettingsOrderEvent = {
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_dropdown_order_event_id',
      labelKey: 'order_event',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 1,
      enableSearchFilter: true,
      disabled: false
    };

    this.dropdownSettingsAllocation = {
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_dropdown_allocation_group_id',
      labelKey: 'allocation_group',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 2,
      enableSearchFilter: true
    };

    this.dropdownSettingsMerchandize = {
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_dropdown_merchandising_model_id',
      labelKey: 'merchandising_model',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 2,
      enableSearchFilter: true
    };

    this.dropdownSettingsModelYear = {
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_dropdown_model_year_id',
      labelKey: 'model_year',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2
    };

    this.dropdownSettingsOrderType = {
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_dropdown_order_type_id',
      labelKey: 'order_type',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 1,
      enableSearchFilter: true
    };

    this.dropdownSettingsVehicleLine = {
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_dropdown_vehicle_line_brand_id',
      labelKey: 'vehicle_line_brand',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 2,
      enableSearchFilter: true
    };
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid);
    const invalidParent = !!(control && control.parent && control.parent.invalid);
    return (invalidCtrl || invalidParent);
  }
}