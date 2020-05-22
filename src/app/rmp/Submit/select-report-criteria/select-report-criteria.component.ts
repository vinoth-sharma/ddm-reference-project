import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;
import { DjangoService } from 'src/app/rmp/django.service'
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common'
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import Utils from '../../../../utils';
import { DataProviderService } from "src/app/rmp/data-provider.service";

import { NgToasterComponent } from '../../../custom-directives/ng-toaster/ng-toaster.component';
import { ReportCriteriaDataService } from "../../services/report-criteria-data.service";
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-report-criteria',
  templateUrl: './select-report-criteria.component.html',
  styleUrls: ['./select-report-criteria.component.css']
})
export class SelectReportCriteriaComponent implements OnInit, AfterViewInit {
  public showReportId: String;
  public update: boolean;
  public onDemandSchedulingValue = null;
  public textChange = false;

  public model: string;
  private userList: Array<string> = []

  public market_selection: object;
  public dealer_allocation_selection: object;
  public market: Array<object>
  public division: Array<object>
  public region: Array<object>
  public zone: Array<object>
  public area: Array<object>
  public gmma: Array<object>
  public lma: Array<object>
  public bac: Array<object>
  public generated_report_id: number;
  public generated_report_status: string;

  public report_status: string;
  public report_create: string;
  public assigned_to: string;
  public report_user: string;
  public report_on_behalf: string;
  public report_title: string;
  public report_req: string;
  public report_type: string;

  public select_report_selection: object;
  public frequencyData: {};
  public identifierData: {};
  public jsonfinal = {
    'frequency': "One Time",
    'select_frequency': [],
    'special_identifiers': [],
    'fan_selection': []
  };


  public validators = [this.startsWithAt]
  public errorMessages = {
    'startsWithAt': "Your items should be strictly Alphanumericals and should be of either 6 or 11 characters"
  }


  public dropdownList_report = [];
  public selectedItems_report = [];
  public dropdownSettings_report = {};

  public regiondropdownList_report = [];
  public regionselectedItems_report = [];
  public regiondropdownSettings_report = {};
  public marketindex = []
  public regiondropdownListfinal_report = []

  public zonedropdownList_report = [];
  public zoneselectedItems_report = [];
  public zonedropdownSettings_report = {};
  public regionindex = []
  public zonedropdownListfinal_report = []

  public areadropdownList_report = [];
  public areaselectedItems_report = [];
  public areadropdownSettings_report = {};
  public zoneindex = []
  public areadropdownListfinal_report = []

  public gmmadropdownList_report = [];
  public gmmaselectedItems_report = [];
  public gmmadropdownSettings_report = {};
  public gmmadropdownListfinal_report = []

  public lmadropdownList_report = [];
  public lmaselectedItems_report = [];
  public lmadropdownSettings_report = {};
  public lmadropdownListfinal_report = []

  public bacselectedItems_report = [];
  public fanselectedItems_report = [];

  public divisiondropdownList_report = [];
  public divisionselectedItems_report = [];
  public divisiondropdownSettings_report = {};
  public divisiondropdownListfinal_report = []

  public special_identifier: any;
  public frequency: any;
  public contacts: Array<string>;
  public checkedList = [];

  public checked = false;
  public disabled = false;
  public market_data: any;
  public select_frequency: any;
  public Select_ots = {};
  public Select_da = {};
  public Select_on_demand = {};
  public Sel = {};

  public obj_keys: Array<string>
  public obj_keys_da: Array<string>
  public obj_keys_on_demand: Array<string>;
  public freq_val: {}[];
  public freq_val_da: {}[];
  public freq_val_on_demand: {}[];
  public date: string;

  public lookup;
  public lookup_data;
  public behalf_email;
  public userMarketSelections;
  public reportId = 0;
  public message: string;
  public proceed_instruction: string;
  public report_id: any;
  public jsonUpdate = {
    'frequency': "One Time",
    'select_frequency': [],
    'special_identifiers': [],
    'fan_selection': []
  };
  public dl_flag = false;


  public contents;
  public enable_edits = false
  public editModes = false;
  public original_contents;
  public namings: any;
  public enableUpdateData = false;

  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_texts = {
    "ddm_rmp_desc_text_id": 10,
    "module_name": "Help_SelectReportCriteria",
    "description": ""
  }
  public behalf = "";
  public user_role: string;
  public select_frequency_ots: any;
  public select_frequency_da: any;
  public on_demand_freq: any;
  public user_name: string;
  public specialIden: boolean;
  public self_email: string;
  public onBehalf: any;
  public readOnlyContentHelper = true;

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


  constructor(private django: DjangoService, private DatePipe: DatePipe,
    private dataProvider: DataProviderService, private auth_service: AuthenticationService,
    private report_id_service: GeneratedReportService,
    public toastr: NgToasterComponent,
    private reportDataService: ReportCriteriaDataService) {
    this.model = "";
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"]
        this.user_role = role["role"]
        this.self_email = role["email"]
      }
    })
    dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.lookup = element
        this.getMarketSelectionData();
      }
    })

    this.report_id_service.on_behalf_email.subscribe(element => {
      if (element) {
        this.behalf_email = element
      }
      else {
        this.behalf_email = ""
      }
    })

    this.report_id_service.saveUpdate.subscribe(element => {
      this.update = element
    })

    this.contacts = []
    if (this.behalf_email) {
      this.contacts.push(this.behalf_email);
    }
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

  getMarketSelectionData() {
    this.dataProvider.currentlookupData.subscribe(element => {
      if (element) {
        this.lookup_data = element
        this.getUserMarketInfo();
        Utils.showSpinner()
        this.reportDataService.getReportID().subscribe(ele => {
          this.reportId = ele;
        });
        this.django.division_selected().subscribe(element => {
          this.userMarketSelections = element;
          this.userSelectionInitialisation();
        }, err => {
        })

        if (this.lookup) {
          let refs = this.lookup['data']['desc_text']
          let temps = refs.find(function (element) {
            return element["ddm_rmp_desc_text_id"] == 10;
          })
          if (temps) {
            this.original_contents = temps.description;
          }
          else { this.original_contents = "" }
          this.namings = this.original_contents;
        }

      }
    })
  }

  notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  addContact() {
    let contact = this.model
    if (contact == "") {
      this.dl_flag = true
    }
    else {
      this.contacts.push(contact);
      this.dl_flag = false
      this.model = "";
    }
  }

  removeContact() {
    var sList = [];
    $('.form-check-input').each(function () {
      sList.push($(this).val() + (this.checked ? "checked" : "not checked"));
    });

    var indList = []
    for (var i = 0; i < sList.length; i++) {
      if (sList[i] == "checked") {
        indList.push(i);
      }
      else {
        indList = indList;
      }
    }
    for (var i = indList.length - 1; i >= 0; i--)
      this.contacts.splice(indList[i], 1);
  }

  ngOnInit() {
    $('#dropdownHolder').find('angular4-multiselect').find('.dropdown-list').css('position', 'relative');
  }

  searchUserList = (text$: Observable<string>) => {
    let vs = text$.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      switchMap(term => {
        return this.django.getDistributionList(term);
      })
    )
    return vs
  }

  textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner()
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_texts['description'] = this.namings;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {

        let temp_desc_text = this.lookup['data']['desc_text']
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 10) {
            temp_desc_text[index] = this.description_texts
          }
        })
        this.lookup['data']['desc_text'] = temp_desc_text
        this.dataProvider.changelookUpTableData(this.lookup)
        this.editModes = false;
        this.ngOnInit()
        this.original_contents = this.namings;
        Utils.hideSpinner()
      }, err => {
        Utils.hideSpinner()
      })
    } else {
      this.toastr.error("please enter the data");
    }
  }

  edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_contents;
  }

  editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_contents;
  }

  cancelUpdate() {
    this.contacts = [];
    localStorage.removeItem('report_id');
    this.update = !this.update;
    this.message = null
    this.proceed_instruction = null;
    $.each($("input[class='special-checkbox']"), function () {
      $(this).prop("checked", false)
    });
    $("#frequency1").prop("checked", "true")
    this.report_id_service.changeUpdate(this.update)
    this.userSelectionInitialisation();
    this.jsonfinal['frequency'] = "One Time"
    this.jsonUpdate['frequency'] = "One Time"
    this.jsonfinal['select_frequency'] = []
    this.jsonUpdate['select_frequency'] = []
  }

  updateSelections() {
    Utils.showSpinner()

    if (this.selectedItems_report.length < 1) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select at least one market to proceed forward</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if ($('.check:radio[name="select-freq"]:checked').length < 1) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select Report Frequency</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if (this.contacts.length < 1) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Add at least one email in Distribution List to proceed forward</h5>";
      document.getElementById("errorTrigger").click()
    }
    else {
      if ($('#frequency0').prop("checked") && $('.sub:checkbox:checked').length < 1) {
        document.getElementById("errorModalMessage").innerHTML = "<h5>Select Frequency for Ongoing Routine Reports</h5>";
        document.getElementById("errorTrigger").click()
      }
      else {

        Utils.showSpinner()
        this.jsonUpdate["report_id"] = localStorage.getItem('report_id')
        this.report_id_service.changeSelection(this.jsonUpdate["report_id"])
        this.jsonUpdate["market_selection"] = this.selectedItems_report
        this.jsonUpdate["division_selection"] = this.divisionselectedItems_report
        this.jsonUpdate["country_region_selection"] = this.regionselectedItems_report
        this.jsonUpdate["region_zone_selection"] = this.zoneselectedItems_report
        this.jsonUpdate["zone_area_selection"] = this.areaselectedItems_report
        this.jsonUpdate["bac_selection"] = this.bacselectedItems_report
        this.jsonUpdate["gmma_selection"] = this.gmmaselectedItems_report
        this.jsonUpdate["lma_selection"] = this.lmaselectedItems_report
        this.jsonUpdate["fan_selection"] = this.fanselectedItems_report
        this.jsonUpdate["dl_list"] = this.contacts

        if (this.behalf == "" || this.behalf == null || this.behalf == undefined) {
          this.behalf = this.report_on_behalf
        }
        if (this.report_status == "Completed" || this.report_status == "Pending") {
          this.report_status = "Pending";
          this.assigned_to = ""
        }
        else if (this.report_status == "Active") {
          this.report_status = "Active"
        }

        this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
        this.jsonUpdate["report_detail"] = {
          "requestor": this.report_user,
          "status": this.report_status,
          "status_date": this.date,
          "report_type": this.report_type,
          "title": this.report_title,
          "additional_req": this.report_req,
          "created_on": this.report_create,
          "on_behalf_of": this.behalf,
          "assigned_to": this.assigned_to,
          "link_to_results": "",
          "query_criteria": "",
          "link_title": ""
        }

        this.jsonUpdate["dl_list"] = this.contacts
      }

      if (localStorage.getItem('report_id')) {
        this.setSpecialIdentifiers();
        this.setFrequency();
      }
      this.report_id_service.changeSavedChanges(true);
    }

    if (!this.jsonUpdate["fan_selection"]) {
      this.jsonUpdate["fan_selection"] = []
    }

    if (this.jsonUpdate['frequency'] == "One Time") {
      var frequencyDatas = { "ddm_rmp_lookup_select_frequency_id": 39, "description": "" };
      this.jsonUpdate['select_frequency'].push(frequencyDatas);
    }

    this.django.ddm_rmp_report_market_selection(this.jsonUpdate).subscribe(response => {
      this.report_id_service.changeDivisionSelected(this.divisionselectedItems_report)
      Utils.hideSpinner()
      this.toastr.success("Request updated successfully.")
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Connection Problem")
    })
  }

  getUserMarketInfo() {
    Utils.showSpinner()
    this.dropdownList_report = this.lookup_data['market_data'].sort((a, b) => a.market > b.market ? 1 : -1);
    this.divisiondropdownList_report = this.lookup_data['division_data'].sort((a, b) => a.division_desc > b.division_desc ? 1 : -1);
    this.regiondropdownList_report = this.lookup_data['region_data'].sort((a, b) => a.region_desc > b.region_desc ? 1 : -1);
    this.zonedropdownList_report = this.lookup_data['zones_data'].sort((a, b) => a.zone_desc > b.zone_desc ? 1 : -1);
    this.areadropdownList_report = this.lookup_data['area_data'].sort((a, b) => a.area_desc > b.area_desc ? 1 : -1);
    this.gmmadropdownList_report = this.lookup_data['gmma_data'].sort((a, b) => a.gmma_desc > b.gmma_desc ? 1 : -1);
    this.lmadropdownList_report = this.lookup_data['lma_data'].sort((a, b) => a.lmg_desc > b.lmg_desc ? 1 : -1);

    this.dropdownSettings_report = {
      text: "Market",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market_id',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "select_report_criteria_multiselect",
      maxHeight: '200px'
    };
    this.regiondropdownSettings_report = {
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
    this.zonedropdownSettings_report = {
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
    this.areadropdownSettings_report = {
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
    this.gmmadropdownSettings_report = {
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

    this.divisiondropdownSettings_report = {
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


    this.lmadropdownSettings_report = {
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


  userSelectionInitialisation() {
    this.market_selection = this.userMarketSelections
    if (this.market_selection['has_previous_selections']) {
      this.selectedItems_report = this.market_selection["market_data"]
      this.divisionselectedItems_report = this.market_selection["division_data"]
      this.regionselectedItems_report = this.market_selection["country_region_data"]
      this.zoneselectedItems_report = this.market_selection["region_zone_data"]
      this.areaselectedItems_report = this.market_selection["zone_area_data"]

      if (this.market_selection["bac_data"].length != 0) {
        this.bacselectedItems_report = this.market_selection["bac_data"][0]['bac_desc']
      }
      else {
        this.bacselectedItems_report = []
      }
      if (this.market_selection['fan_data'].length != 0) {
        this.fanselectedItems_report = this.market_selection["fan_data"][0]['fan_data']
      } else {
        this.fanselectedItems_report = []
      }
      this.gmmaselectedItems_report = this.market_selection["gmma_data"]
      this.lmaselectedItems_report = this.market_selection["lma_data"]

      this.selectedItems_report.map(element => {
        if (!(this.marketindex.includes(element["ddm_rmp_lookup_market_id"]))) {
          this.marketindex.push(element["ddm_rmp_lookup_market_id"])
        }
      })
      this.MarketDependencies(this.marketindex)
      this.specialIdenEnabler();

      this.regionselectedItems_report.map(element => {
        if (!(this.regionindex.includes(element["ddm_rmp_lookup_country_region_id"]))) {
          this.regionindex.push(element["ddm_rmp_lookup_country_region_id"])
        }
      })
      this.regionSelection(this.regionindex)

      this.zoneselectedItems_report.map(element => {
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
      this.zoneSelection(this.zoneindex)

    }
    else {
      Utils.hideSpinner()
    }

    this.special_identifier = this.lookup.data.special_identifiers
    this.frequency = this.lookup.data.yesNo_frequency
    this.select_frequency = this.lookup.data.report_frequency

    this.select_frequency = this.select_frequency.sort(function (a, b) {
      return a.ddm_rmp_lookup_report_frequency_id - b.ddm_rmp_lookup_report_frequency_id
    })

    this.select_frequency = this.select_frequency.sort(function (a, b) {
      return a.ddm_rmp_lookup_select_frequency_id - b.ddm_rmp_lookup_select_frequency_id
    })

    this.select_frequency_ots = this.select_frequency.filter(element => element.ddm_rmp_lookup_report_frequency_id < 4)
    this.select_frequency_da = this.select_frequency.filter(element => element.ddm_rmp_lookup_report_frequency_id == 4)
    this.on_demand_freq = this.select_frequency.filter(element => element.ddm_rmp_lookup_report_frequency_id > 4)

    this.Select_ots = {}
    this.select_frequency_ots.map((element) => {
      if (element['report_frequency_values'] in this.Select_ots) {
        this.Select_ots[element['report_frequency_values']].push({
          "select_frequency_values": element['select_frequency_values'], "ddm_rmp_lookup_select_frequency_id": element['ddm_rmp_lookup_select_frequency_id']
          , "select_frequency_description": element['select_frequency_description']
        })
      }
      else {
        this.Select_ots[element['report_frequency_values']] = []
        this.Select_ots[element['report_frequency_values']].push({ "select_frequency_values": element['select_frequency_values'], "ddm_rmp_lookup_select_frequency_id": element['ddm_rmp_lookup_select_frequency_id'], "select_frequency_description": element['select_frequency_description'] })
      }
    })

    this.obj_keys = Object.keys(this.Select_ots)
    this.freq_val = Object.values(this.Select_ots)

    this.Select_da = {}
    this.select_frequency_da.forEach((element) => {
      if (element.report_frequency_values in this.Select_da) {
        this.Select_da[element.report_frequency_values].push({
          "select_frequency_values": element.select_frequency_values, "ddm_rmp_lookup_select_frequency_id": element.ddm_rmp_lookup_select_frequency_id
          , "select_frequency_description": element.select_frequency_description
        })
      }
      else {
        this.Select_da[element.report_frequency_values] = []
        this.Select_da[element.report_frequency_values].push({ "select_frequency_values": element.select_frequency_values, "ddm_rmp_lookup_select_frequency_id": element.ddm_rmp_lookup_select_frequency_id, "select_frequency_description": element.select_frequency_description })
      }
    })

    this.obj_keys_da = Object.keys(this.Select_da)
    this.freq_val_da = Object.values(this.Select_da)

    this.Select_on_demand = {}
    this.on_demand_freq.map((element) => {
      if (element['report_frequency_values'] in this.Select_on_demand) {
        this.Select_on_demand[element['report_frequency_values']].push({
          "select_frequency_values": element['select_frequency_values'], "ddm_rmp_lookup_select_frequency_id": element['ddm_rmp_lookup_select_frequency_id']
          , "select_frequency_description": element['select_frequency_description']
        })
      }
      else {
        this.Select_on_demand[element['report_frequency_values']] = []
        this.Select_on_demand[element['report_frequency_values']].push({ "select_frequency_values": element['select_frequency_values'], "ddm_rmp_lookup_select_frequency_id": element['ddm_rmp_lookup_select_frequency_id'], "select_frequency_description": element['select_frequency_description'] })
      }
    })

    this.obj_keys_on_demand = Object.keys(this.Select_on_demand)
    this.freq_val_on_demand = Object.values(this.Select_on_demand)

    if (localStorage.getItem('report_id')) {
      this.reportCriteriaCheckbox(localStorage.getItem('report_id'));
    }
    else {
      Utils.hideSpinner()
    }
  }

  specialIdenEnabler() {
    let i = 0;
    if (this.divisionselectedItems_report.length == 0) {
      this.specialIden = true
    }
    else {
      this.divisionselectedItems_report.map(element => {
        if (element.ddm_rmp_lookup_division_id == 3 || element.ddm_rmp_lookup_division_id == 4 || element.ddm_rmp_lookup_division_id == 8 || element.ddm_rmp_lookup_division_id == 9) {
          i += 1;
        }
      })
      if (i > 0) {
        this.specialIden = false
      } else {
        this.specialIden = true
      }
    }
  }

  onDivisionSelect(item) {
    this.specialIdenEnabler()
  }

  onDivisionDeSelect(item) {
    this.specialIdenEnabler()
  }

  onDivisionSelectAll(item) {
    this.specialIdenEnabler()
  }

  onDivisionDeSelectAll(item) {
    this.specialIdenEnabler()
  }

  selectAll(index) {
    var target = ".market_sel_group" + index.toString();
    $(target).prop("checked", "true");
  }

  enableDropdown(group, index) {
    var target_dropdown = "#dropdown" + group.toString() + index.toString();
    var target_dropdown_2 = ".dropdownMenu" + group.toString() + index.toString();
  }

  toggle_freq(dropdown_id, subelement) {
    this.onDemandSchedulingValue = null;

    if (dropdown_id == "frequency0") {
      $(".sub").prop("disabled", false)
    }
    else if (dropdown_id == "frequency1") {
      $(".sub").prop("disabled", true)
      $(".sub").prop("checked", false)
    }
    else if (dropdown_id == "frequency2") {
      $(".sub").prop("disabled", true)
      $(".sub").prop("checked", false)
    }
    else if (dropdown_id == "frequency3") {
      $(".sub").prop("disabled", true)
      $(".sub").prop("checked", false)
    }

    if ($('#frequency1').is(':checked')) {
      this.jsonfinal['frequency'] = "One Time"
      this.jsonUpdate['frequency'] = "One Time"
      var frequencyData = { "ddm_rmp_lookup_select_frequency_id": 39, "description": "" };
      this.jsonfinal.select_frequency.push(frequencyData);
      this.jsonUpdate['select_frequency'].push(frequencyData);

    }
    else if ($('#frequency0').is(':checked')) {
      this.jsonfinal['frequency'] = "Recurring"
      this.jsonUpdate['frequency'] = "Recurring"
    }
  }
  onItemSelect(item: any) {
    this.selectedItems_report.map(element => {
      if (!(this.marketindex.includes(element["ddm_rmp_lookup_market_id"]))) {
        this.marketindex.push(element["ddm_rmp_lookup_market_id"])
      }
    })
    this.MarketDependencies(this.marketindex)
    this.specialIdenEnabler();
  }

  onItemDeSelect(item: any) {
    this.marketindex.splice(this.marketindex.indexOf(item.ddm_rmp_lookup_market_id), 1)
    this.MarketDependencies(this.marketindex)
    this.MarketDependenciesDeselect(this.marketindex)
    this.specialIdenEnabler();
  }

  MarketDependenciesDeselect(marketindex: any) {
    this.regionselectedItems_report = this.regionselectedItems_report.filter(element => {
      return this.marketindex.includes(element["ddm_rmp_lookup_market"])
    })
    this.regionindex = []
    if (this.regionselectedItems_report) {
      this.regionselectedItems_report.map(element => {
        if (!(this.regionindex.includes(element["ddm_rmp_lookup_country_region_id"]))) {
          this.regionindex.push(element["ddm_rmp_lookup_country_region_id"])
        }
      })
    }
    this.regionDeselection(this.regionindex)
    this.regionSelection(this.regionindex)

    this.zoneindex = []
    if (this.zoneselectedItems_report) {
      this.zoneselectedItems_report.map(element => {
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
    }
    this.zoneDeSelection(this.zoneindex)
    this.zoneSelection(this.zoneindex)

    this.gmmaselectedItems_report = this.gmmaselectedItems_report.filter(element => {
      return this.marketindex.includes(element["ddm_rmp_lookup_market"])
    })
    this.divisionselectedItems_report = this.divisionselectedItems_report.filter(element => {
      return this.marketindex.includes(element["ddm_rmp_lookup_market"])
    })
    this.lmaselectedItems_report = this.lmaselectedItems_report.filter(element => {
      return this.marketindex.includes(element["ddm_rmp_lookup_market"])
    })


  }

  MarketDependencies(marketindex: any) {
    this.regiondropdownListfinal_report = this.regiondropdownList_report.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.gmmadropdownListfinal_report = this.gmmadropdownList_report.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.divisiondropdownListfinal_report = this.divisiondropdownList_report.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.lmadropdownListfinal_report = this.lmadropdownList_report.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })

  }

  onSelectAll(items: any) {
    for (let index = 1; index <= items.length; index++) {
      if (!(this.marketindex.includes(index))) {
        this.marketindex.push(index)
      }
    }
    this.MarketDependencies(this.marketindex)
    this.specialIdenEnabler();
  }

  onDeSelectAll(items: any) {
    this.marketindex = []
    this.MarketDependencies(this.marketindex)
    this.MarketDependenciesDeselect(this.marketindex)
    this.regiononItemDeSelectAll(this.regionselectedItems_report)
    this.zoneonDeSelectAll(this.zoneselectedItems_report)
    this.bacselectedItems_report = []
    this.fanselectedItems_report = []
    this.specialIdenEnabler();
  }

  regiononItemSelect(item: any) {
    this.regionselectedItems_report.map(element => {
      if (!(this.regionindex.includes(element["ddm_rmp_lookup_country_region_id"]))) {
        this.regionindex.push(element['ddm_rmp_lookup_country_region_id'])
      }
    })
    this.regionSelection(this.regionindex)
  }

  regiononItemDeSelect(item: any) {
    this.regionindex.splice(this.regionindex.indexOf(item.ddm_rmp_lookup_country_region_id), 1)
    this.regionSelection(this.regionindex)
    this.regionDeselection(this.regionindex)
    this.zoneindex = []
    if (this.zoneselectedItems_report) {
      this.zoneselectedItems_report.map(element => {
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
    }
    this.zoneSelection(this.zoneindex)
    this.zoneDeSelection(this.zoneindex)
  }

  regiononSelectAll(items: any) {
    for (let index = 1; index <= items.length; index++) {
      if (!(this.regionindex.includes(index))) {
        this.regionindex.push(index)
      }
    }
    this.regionSelection(this.regionindex)
  }

  regiononItemDeSelectAll(items: any) {
    this.regionindex = []
    this.regionSelection(this.regionindex)
    this.regionDeselection(this.regionindex)
    this.zoneonDeSelectAll(this.zoneselectedItems_report)
  }

  regionSelection(regionindex: any) {
    this.zonedropdownListfinal_report = this.zonedropdownList_report.filter(element => {
      return this.regionindex.includes(element['ddm_rmp_lookup_country_region'])
    })
  }

  regionDeselection(regionindex: any) {
    this.zoneselectedItems_report = this.zoneselectedItems_report.filter(element => {
      return this.regionindex.includes(element["ddm_rmp_lookup_country_region"])
    })
  }

  zoneonItemSelect(item: any) {
    this.zoneselectedItems_report.map(element => {
      if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
        this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
      }
    })
    this.zoneSelection(this.zoneindex)
  }

  zoneonItemDeSelect(item: any) {
    this.zoneindex.splice(this.zoneindex.indexOf(item.ddm_rmp_lookup_region_zone_id), 1)
    this.zoneSelection(this.zoneindex)
    this.zoneDeSelection(this.zoneindex)
  }
  zoneonSelectAll(items: any) {
    for (let index = 1; index <= items.length; index++) {
      if (!(this.zoneindex.includes(index))) {
        this.zoneindex.push(index)
      }
    }
    this.zoneSelection(this.zoneindex)
  }
  zoneonDeSelectAll(items: any) {
    this.zoneindex = []
    this.zoneSelection(this.zoneindex)
    this.zoneDeSelection(this.zoneDeSelection)
  }
  zoneSelection(zoneindex: any) {
    this.areadropdownListfinal_report = this.areadropdownList_report.filter(element => {
      return this.zoneindex.includes(element['ddm_rmp_lookup_region_zone'])
    })
  }
  zoneDeSelection(zoneindex: any) {
    this.areaselectedItems_report = this.areaselectedItems_report.filter(element => {
      return this.zoneindex.includes(element["ddm_rmp_lookup_region_zone"])
    })
  }

  clearClick() {
    this.selectedItems_report = []
    this.marketindex = []
    this.MarketDependencies(this.marketindex)
    this.MarketDependenciesDeselect(this.marketindex)
    this.bacselectedItems_report = []
    this.fanselectedItems_report = []
  }

  frequencySelected(val, event) {
    if (event.target.checked) {
      this.frequencyData = { "ddm_rmp_lookup_select_frequency_id": val.ddm_rmp_lookup_select_frequency_id, "description": val.select_frequency_values };
      this.jsonfinal.select_frequency.push(this.frequencyData);
      this.jsonUpdate['select_frequency'].push(this.frequencyData);
    }
    else {
      for (var i = 0; i < this.jsonfinal.select_frequency.length; i++) {
        if (this.jsonfinal.select_frequency[i].ddm_rmp_lookup_select_frequency_id == val.ddm_rmp_lookup_select_frequency_id) {
          var index = this.jsonfinal.select_frequency.indexOf(this.jsonfinal.select_frequency[i]);
          this.jsonfinal.select_frequency.splice(index, 1);
          var indexs = this.jsonUpdate['select_frequency'].indexOf(this.jsonUpdate.select_frequency[i]);
          this.jsonUpdate['select_frequency'].splice(indexs, 1);
        }
      }
    }
  }

  frequencySelectedDropdown(val, event) {
    if (event.target.checked) {
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_select_frequency_id.toString()))).disabled = false;

      this.frequencyData = { "ddm_rmp_lookup_select_frequency_id": val.ddm_rmp_lookup_select_frequency_id, "description": "" };
      this.jsonfinal.select_frequency.push(this.frequencyData);
    }
    else {
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_select_frequency_id.toString()))).disabled = true;
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_select_frequency_id.toString()))).value = "";
      for (var i = 0; i < this.jsonfinal.select_frequency.length; i++) {
        if (this.jsonfinal.select_frequency[i].id == val.ddm_rmp_lookup_ots_checkbox_values_id) {
          var index = this.jsonfinal.select_frequency.indexOf(this.jsonfinal.select_frequency[i]);
          this.jsonfinal.select_frequency.splice(index, 1);
        }
      }
    }
  }

  getSpecifyContent(val, event) {
    for (var i = 0; i < this.jsonfinal.select_frequency.length; i++) {
      if (this.jsonfinal.select_frequency[i].ddm_rmp_lookup_select_frequency_id == val) {
        this.jsonfinal.select_frequency[i].description = event.target.value
      }
    }
  }

  checkSelections() {
    this.report_id_service.behalf_of_name.subscribe(element => {
      this.behalf = element
    })
    if (this.selectedItems_report.length < 1) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select at least one market to proceed forward</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if ($('.check:radio[name="select-freq"]:checked').length < 1) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select Report Frequency</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if (this.contacts.length < 1) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Add at least one email in Distribution List to proceed forward</h5>";
      document.getElementById("errorTrigger").click()
    }
    else {
      if ($('#frequency0').prop("checked") && $('.sub:checkbox:checked').length < 1) {
        document.getElementById("errorModalMessage").innerHTML = "<h5>Select Frequency for Ongoing Routine Reports</h5>";
        document.getElementById("errorTrigger").click()
      }
      else {
        Utils.showSpinner()
        this.jsonfinal["market_selection"] = this.selectedItems_report
        this.jsonfinal["division_selection"] = this.divisionselectedItems_report
        this.jsonfinal["country_region_selection"] = this.regionselectedItems_report
        this.jsonfinal["region_zone_selection"] = this.zoneselectedItems_report
        this.jsonfinal["zone_area_selection"] = this.areaselectedItems_report
        this.jsonfinal["bac_selection"] = this.bacselectedItems_report
        this.jsonfinal["gmma_selection"] = this.gmmaselectedItems_report
        this.jsonfinal["lma_selection"] = this.lmaselectedItems_report
        this.jsonfinal["fan_selection"] = this.fanselectedItems_report
        this.jsonfinal["report_id"] = null;
        this.jsonfinal["dl_list"] = this.contacts

        if (localStorage.getItem('report_id')) {
          this.setSpecialIdentifiers();
          this.setFrequency();
        }

        $('#save').click(function () {
          $('.updateButton').toggle("slide");
        });

        this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
        this.jsonfinal["report_detail"] = { "requestor": this.user_name, "status": "Incomplete", "status_date": this.date, "report_type": "", "title": "", "additional_req": "", "created_on": this.date, "on_behalf_of": this.behalf, "assigned_to": "", "link_to_results": "", "query_criteria": "", "link_title": "" }

        this.select_report_selection = this.jsonfinal
        if (!this.select_report_selection["fan_selection"]) {
          this.select_report_selection["fan_selection"] = []
        }

        if (this.jsonfinal['frequency'] == "One Time") {
          var frequencyDatas = { "ddm_rmp_lookup_select_frequency_id": 39, "description": "" };
          this.jsonfinal.select_frequency.push(frequencyDatas);
          this.jsonUpdate['select_frequency'].push(frequencyDatas);
        }

        this.django.ddm_rmp_report_market_selection(this.select_report_selection).subscribe(response => {
          if (response["message"] == "success") {
            this.report_id_service.changeUpdate(true)
            this.report_id_service.changeSavedChanges(true);
            this.report_id = response["report_data"].ddm_rmp_post_report_id
            localStorage.setItem('report_id', response["report_data"].ddm_rmp_post_report_id)
            this.report_id_service.changeSelection(response["report_data"].ddm_rmp_post_report_id)
          }

          this.generated_report_id = +(response["report_data"]['ddm_rmp_post_report_id'])
          localStorage.setItem('report_id', "" + this.generated_report_id)
          this.report_id_service.changeSelection(this.generated_report_id)
          this.report_id_service.changeDivisionSelected(this.divisionselectedItems_report)
          this.generated_report_status = response["report_data"]['status']
          this.report_id_service.changeStatus(this.generated_report_status)
          this.message = "Report " + " #" + localStorage.getItem('report_id') + " generated."
          this.proceed_instruction = "Please proceed to 'Dealer Allocation' or 'Vehicle Line Status' from sidebar to complete the Request"
          this.report_id_service.changeMessage(this.message)
          Utils.hideSpinner();
          this.toastr.success("Request created successfully with Request ID : #" + this.generated_report_id)
        }, err => {
          Utils.showSpinner();
          this.toastr.error("Server problem encountered")
        })
      }
    }
  }

  setSpecialIdentifiers() {
    var temp = this.jsonfinal;
    var temp2 = this.jsonUpdate;
    temp.special_identifiers = [];
    temp2.special_identifiers = [];
    $.each($("input[class='special-checkbox']:checked"), function () {
      this.identifierData = { "ddm_rmp_lookup_special_identifiers": $(this).val() };
      temp.special_identifiers.push(this.identifierData);
      temp2.special_identifiers.push(this.identifierData);
    });

    this.jsonfinal = temp;
    this.jsonUpdate = temp2;
  }

  setFrequency() {
    var temp = this.jsonfinal;
    var temp2 = this.jsonUpdate;
    temp.select_frequency = [];
    temp2.select_frequency = [];

    $.each($("input[class='sub']:checked"), function () {
      var id = $(this).val();
      if ((<HTMLTextAreaElement>(document.getElementById("drop" + id.toString()))) != null && (<HTMLTextAreaElement>(document.getElementById("drop" + id.toString()))).value != undefined) {
        this.identifierData = {
          "ddm_rmp_lookup_select_frequency_id": $(this).val(), "description": (<HTMLTextAreaElement>(document.getElementById("drop" + id.toString()))).value
        };
      } else {
        this.identifierData = { "ddm_rmp_lookup_select_frequency_id": $(this).val(), "description": "" };
      }

      temp.select_frequency.push(this.identifierData);
      temp2.select_frequency.push(this.identifierData);
    });

    this.jsonfinal = temp;
    this.jsonUpdate = temp2;
  }
  specialIdentifierSelected(val, event) {
    if (event.target.checked) {
      this.identifierData = { "ddm_rmp_lookup_special_identifiers": val.ddm_rmp_lookup_special_identifiers };
      this.jsonfinal.special_identifiers.push(this.identifierData);
    }
    else {
      for (var i = 0; i < this.jsonfinal.special_identifiers.length; i++) {
        if (this.jsonfinal.special_identifiers[i].ddm_rmp_lookup_special_identifiers == val.ddm_rmp_lookup_special_identifiers) {
          var index = this.jsonfinal.special_identifiers.indexOf(this.jsonfinal.special_identifiers[i]);
          this.jsonfinal.special_identifiers.splice(index, 1);
        }
      }
    }

  }

  reportCriteriaCheckbox(report_id) {
    if (report_id = localStorage.getItem('report_id') != null) {
      report_id = localStorage.getItem('report_id')
    }
    Utils.showSpinner()
    this.django.get_report_description(report_id).subscribe(element => {
      if (element['status'] == "Incomplete" || element['status'] == "Active" ||
        element['status'] == "Pending" || element['status'] == "Cancelled") {
        this.report_id_service.changeUpdate(true)
      }
      else if (element['status'] == 'Completed') {
        if (element['frequency_data'].length > 1) {
          this.report_id_service.changeUpdate(true)
        }
        else {
          this.report_id_service.changeUpdate(false)
        }
      }

      this.report_status = element['report_data']['status']
      this.report_create = element['report_data']['created_on']
      this.report_user = element['report_data']['requestor']
      this.assigned_to = element['report_data']['assigned_to']
      this.report_on_behalf = element['report_data']['on_behalf_of']
      this.report_title = element['report_data']['title']
      this.report_req = element['report_data']['additional_req']
      this.report_type = element['report_data']['report_type']

      this.onBehalf = element['report_data']['on_behalf_of']
      if (this.onBehalf != '' || this.onBehalf != null) {
        this.behalf = this.onBehalf;
      }
      else {
        this.behalf = ""
      }
      if (element["dl_list"].length != 0) {
        if (element["dl_list"] == []) {
          this.contacts = []
        } else {
          element["dl_list"].map(element => {
            this.contacts.push(element.distribution_list)
          })
        }
      }

      this.message = "Report " + "#" + report_id + " generated."
      this.report_id_service.changeSelection(report_id)
      this.proceed_instruction = "Please proceed to 'Dealer Allocation' or 'Vehicle Event Status' from sidebar to complete the Request"
      this.selectedItems_report = [];
      this.dropdownList_report.forEach(element1 => {
        element["market_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_market_id'] == element2.ddm_rmp_lookup_market) {
            this.selectedItems_report.push(element1)
          }
        })
      })
      this.marketindex = []
      this.selectedItems_report.map(element => {
        if (!(this.marketindex.includes(element["ddm_rmp_lookup_market_id"]))) {
          this.marketindex.push(element["ddm_rmp_lookup_market_id"])
        }
      })
      this.MarketDependencies(this.marketindex)

      this.regionselectedItems_report = [];
      this.regiondropdownList_report.forEach(element1 => {
        element["country_region_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_country_region_id'] == element2.ddm_rmp_lookup_country_region) {
            this.regionselectedItems_report.push(element1)
          }
        })
      })
      this.regionindex = []
      this.regionselectedItems_report.map(element => {
        if (!(this.regionindex.includes(element["ddm_rmp_lookup_country_region_id"]))) {
          this.regionindex.push(element["ddm_rmp_lookup_country_region_id"])
        }
      })
      this.regionSelection(this.regionindex)

      this.zoneselectedItems_report = [];
      this.zonedropdownList_report.forEach(element1 => {
        element["region_zone_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_region_zone_id'] == element2.ddm_rmp_lookup_region_zone) {
            this.zoneselectedItems_report.push(element1)
          }
        })
      })
      this.zoneindex = []
      this.zoneselectedItems_report.map(element => {
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
      this.zoneSelection(this.zoneindex)

      this.divisionselectedItems_report = [];
      this.divisiondropdownList_report.forEach(element1 => {
        if (this.reportId == 0) {
          if (element["division_data"] != null) {
            element["division_data"].map(element2 => {
              if (element1['ddm_rmp_lookup_division_id'] == element2.ddm_rmp_lookup_division) {
                this.divisionselectedItems_report.push(element1)
              }
            })
          }
          else {
            element["division_dropdown"].map(element2 => {
              if (element1['ddm_rmp_lookup_division_id'] == element2.ddm_rmp_lookup_division) {
                this.divisionselectedItems_report.push(element1)
              }
            })
          }
        }
        else if (localStorage.getItem('report_id')) {
          element["division_dropdown"].map(element2 => {
            if (element1['ddm_rmp_lookup_division_id'] == element2.ddm_rmp_lookup_division) {
              this.divisionselectedItems_report.push(element1)
            }
          })
        }

      })
      this.report_id_service.changeDivisionSelected(this.divisionselectedItems_report)

      this.gmmaselectedItems_report = [];
      this.gmmadropdownList_report.forEach(element1 => {
        element["gmma_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_gmma_id'] == element2.ddm_rmp_lookup_gmma) {
            this.gmmaselectedItems_report.push(element1)
          }
        })
      })

      this.lmaselectedItems_report = [];
      this.lmadropdownList_report.forEach(element1 => {
        element["lma_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_lma_id'] == element2.ddm_rmp_lookup_lma) {
            this.lmaselectedItems_report.push(element1)
          }
        })
      })

      if (element["bac_data"].length == 0) {
        this.bacselectedItems_report = []
      } else {
        this.bacselectedItems_report = element["bac_data"][0]['bac_desc'];
      }

      if (element["fan_data"].length == 0) {
        this.fanselectedItems_report = []
      } else {
        this.fanselectedItems_report = element["fan_data"][0]['fan_data'];
      }

      if (element["frequency_data"][0]['select_frequency_values'] == 'On Demand Configurable' || element["frequency_data"][0]['select_frequency_values'] == 'On Demand'
        || element['frequency_data'][0]['select_frequency_values'] == 'One Time') {
        if (element["frequency_data"][0]['select_frequency_values'] == 'On Demand') {
          $("#odCheckbox37").prop("checked", true);
        }
        if (element["frequency_data"][0]['select_frequency_values'] == 'On Demand Configurable') {
          $("#odCheckbox38").prop("checked", true);
        }
        $("#frequency1").prop("checked", true);
        this.toggle_freq("frequency1", "");
        var subData = element["frequency_data"];
        try {
          for (var x = 0; x <= subData.length - 1; x++) {
            $('.sub').each(function (i, obj) {
              if (subData[x]['select_frequency_description'] == false) {
                if (subData[x]['ddm_rmp_lookup_select_frequency_id'] == obj.value) {
                  obj.checked = true;
                }
              } else if (subData[x]['select_frequency_description'] == true) {
                if (subData[x]['ddm_rmp_lookup_select_frequency_id'] == obj.value) {
                  obj.checked = true;
                  (<HTMLTextAreaElement>(document.getElementById("drop" + subData[x].ddm_rmp_lookup_select_frequency_id.toString()))).value = subData[x]['description'];
                  (<HTMLTextAreaElement>(document.getElementById("drop" + subData[x].ddm_rmp_lookup_select_frequency_id.toString()))).removeAttribute("disabled")
                }
              }
            })
          }
        }
        catch (err) {
        }
      } else {
        this.toggle_freq("frequency0", "");
        $("#frequency0").prop("checked", true);
        var subData = element["frequency_data"];
        try {
          for (var x = 0; x <= subData.length - 1; x++) {
            $('.sub').each(function (i, obj) {
              if (subData[x]['select_frequency_description'] == false) {
                if (subData[x]['ddm_rmp_lookup_select_frequency_id'] == obj.value) {
                  obj.checked = true;
                }
              } else if (subData[x]['select_frequency_description'] == true) {
                if (subData[x]['ddm_rmp_lookup_select_frequency_id'] == obj.value) {
                  obj.checked = true;
                  (<HTMLTextAreaElement>(document.getElementById("drop" + subData[x].ddm_rmp_lookup_select_frequency_id.toString()))).value = subData[x]['description'];
                  (<HTMLTextAreaElement>(document.getElementById("drop" + subData[x].ddm_rmp_lookup_select_frequency_id.toString()))).removeAttribute("disabled")
                }
              }
            })
          }
        }
        catch (err) {
        }
      }
      var spCheckData = element["special_identifier_data"];
      try {
        for (var x = 0; x <= spCheckData.length; x++) {
          $('.special-checkbox').each(function (index, obj) {
            if (spCheckData[x].ddm_rmp_lookup_special_identifiers == obj.value) {
              obj.checked = true;
            }
          });
        }
      }
      catch (err) {
      }
      Utils.hideSpinner()
    });
  }

  private startsWithAt(control: FormControl) {
    var rpoRegEx = /^([a-zA-Z0-9]){6}$/;
    var rpoRegEx2 = /^([a-zA-Z0-9]){11}$/;
    if (control.value.match(rpoRegEx) || control.value.match(rpoRegEx2)) {
      return null
    }
    else {
      return {
        'startsWithAt': true
      }
    }
  }

  public setOdcFrequency(subelement, event) {
    let frequencyType = subelement.select_frequency_values;
    if ($('#frequency1').is(':checked')) {
      if (frequencyType.length && frequencyType === 'On Demand') {
        this.jsonfinal['frequency'] = "On Demand"
        this.jsonUpdate['frequency'] = "On Demand"
        this.jsonfinal['select_frequency'] = [];
        this.jsonUpdate['select_frequency'] = [];
        var frequencyData = { "ddm_rmp_lookup_select_frequency_id": subelement.ddm_rmp_lookup_select_frequency_id, "description": "" };
        this.jsonfinal.select_frequency.push(frequencyData);
        this.jsonUpdate['select_frequency'].push(frequencyData);

      }
      else if (frequencyType.length && frequencyType === 'On Demand Configurable') {
        this.jsonfinal['frequency'] = "On Demand Configurable"
        this.jsonUpdate['frequency'] = "On Demand Configurable"
        this.jsonfinal['select_frequency'] = [];
        this.jsonUpdate['select_frequency'] = [];
        var frequency_Data = { "ddm_rmp_lookup_select_frequency_id": subelement.ddm_rmp_lookup_select_frequency_id, "description": "" };
        this.jsonfinal.select_frequency.push(frequency_Data);
        this.jsonUpdate['select_frequency'].push(frequency_Data);
      }
      else {
        this.jsonfinal['frequency'] = "One Time"
        this.jsonUpdate['frequency'] = "One Time"
        this.jsonfinal['select_frequency'] = [];
        this.jsonUpdate['select_frequency'] = [];
        var frequencyDatas = { "ddm_rmp_lookup_select_frequency_id": 39, "description": "" };
        this.jsonfinal.select_frequency.push(frequencyDatas);
        this.jsonUpdate['select_frequency'].push(frequencyDatas);
      }

    }
    else if ($('#frequency0').is(':checked')) {
      if (frequencyType.length && frequencyType === 'On Demand') {
        this.jsonfinal['frequency'] = "On Demand"
        this.jsonUpdate['frequency'] = "On Demand"
        let dat = this.jsonUpdate.select_frequency.filter(item => item.ddm_rmp_lookup_select_frequency_id == subelement.ddm_rmp_lookup_select_frequency_id)
        if (dat.length == 0) {
          var frequencyData = { "ddm_rmp_lookup_select_frequency_id": subelement.ddm_rmp_lookup_select_frequency_id, "description": "" };
          this.jsonfinal.select_frequency.push(frequencyData);
          this.jsonUpdate['select_frequency'].push(frequencyData);
        }

      }
      else if (frequencyType.length && frequencyType === 'On Demand Configurable') {
        this.jsonfinal['frequency'] = "On Demand Configurable"
        this.jsonUpdate['frequency'] = "On Demand Configurable"
        let dat = this.jsonUpdate.select_frequency.filter(item => item.ddm_rmp_lookup_select_frequency_id == subelement.ddm_rmp_lookup_select_frequency_id)
        if (dat.length == 0) {
          var frequency_Data = { "ddm_rmp_lookup_select_frequency_id": subelement.ddm_rmp_lookup_select_frequency_id, "description": "" };
          this.jsonfinal.select_frequency.push(frequency_Data);
          this.jsonUpdate['select_frequency'].push(frequency_Data);
        }
      }
      else {
        this.jsonfinal['frequency'] = "Recurring"
        this.jsonUpdate['frequency'] = "Recurring"
      }
    }
  }

  ngOnDestroy() {
  }
}