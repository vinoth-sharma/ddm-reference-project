// migration  was done by : Bharath S
import { Component, OnInit, AfterViewInit, Input, EventEmitter } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service'
import { DatePipe } from '@angular/common';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import * as $ from "jquery";
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";
import { FormControl } from '@angular/forms';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { NgLoaderService } from 'src/app/custom-directives/ng-loader/ng-loader.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit, AfterViewInit {

  public full_contact: any;
  public text_notification: any;
  public countryCode_notification: any;
  public notiNumber: boolean;
  public text_number: any = '';
  public code: any;
  public te_number: any;
  public textChange = false;

  public editorData(arg0: string, editorData: any): any {
    throw new Error("Method not implemented.");
  }

  public selectedValue = {
    'US': {},
    'Canada': {},
    'Export': {}
  };

  public market_selection: object;
  public user_settings: object;
  public validators = [this.startsWithAt]
  public errorMessages = {
    'startsWithAt': "Your items should be strictly Alphanumericals and between 3-10 characters"
  }
  public market: Array<object>
  public division: Array<object>
  public region: Array<object>
  public zone: Array<object>
  public area: Array<object>
  public gmma: Array<object>
  public lma: Array<object>
  public changed_settings: boolean;

  public dropdownList = [];
  public marketselectedItems = [];
  public dropdownSettings = {};

  public regiondropdownList = [];
  public regionselectedItems = [];
  public regiondropdownSettings = {};
  public marketindex = []
  public regiondropdownListfinal = []

  public zonedropdownList = [];
  public zoneselectedItems = [];
  public zonedropdownSettings = {};
  public regionindex = []
  public zonedropdownListfinal = []

  public areadropdownList = [];
  public areaselectedItems = [];
  public areadropdownSettings = {};
  public zoneindex = []
  public areadropdownListfinal = []

  public gmmadropdownList = [];
  public gmmaselectedItems = [];
  public gmmadropdownSettings = {};
  public gmmadropdownListfinal = []

  public lmadropdownList = [];
  public lmaselectedItems = [];
  public lmadropdownSettings = {};
  public lmadropdownListfinal = []

  public bacselectedItems = [];

  public fanselectedItems = [];
  public divisiondropdownList = [];
  public divisionselectedItems = [];
  public divisiondropdownSettings = {};
  public divisiondropdownListfinal = []

  public dealernamedropdownList = [];
  public dealernameselectedItems = [];
  public dealernamedropdownSettings = {};
  public dealernamedropdownListfinal = []

  public citydropdownList = [];
  public cityselectedItems = [];
  public citydropdownSettings = {};
  public citydropdownListfinal = []

  public statedropdownList = [];
  public stateselectedItems = [];
  public statedropdownSettings = {};
  public statedropdownListfinal = []

  public zipdropdownList = [];
  public zipselectedItems = [];
  public zipdropdownSettings = {};
  public zipdropdownListfinal = []

  public countrydropdownList = [];
  public countryselectedItems = [];
  public countrydropdownSettings = {};
  public countrydropdownListfinal = [];

  public jsonNotification = {
    "alternate_number": "",
    "carrier": ""
  }

  public message: string;
  public check: boolean;
  public check_saved_status: boolean;

  public market_data: any;
  public cellPhone: any;
  public date: any;
  public lookup;
  public contact_flag = true;
  public content;
  public enable_edits = false
  public editModes = false;
  public original_content;
  public naming: string = "Loading";
  public user_info: any;
  public user_name: string;
  public user_designation: any;
  public user_department: any;
  public user_email: any;
  public user_contact: any;
  public carrier_selected = "";
  public user_office_address: any;
  public user_role: string;
  public readOnlyContentHelper = true;
  public enableUpdateData = false;

  public marketselections: any = {
    bac_data: [],
    fan_data: [],
    country_region_data: [],
    gmma_data: [],
    lma_data: [],
    market_data: [],
    region_zone_data: [],
    zone_area_data: [],
    division_data: [],
    has_previous_selections: false,
    user_text_notification_data: {},
    alternate_number: "5657645765"
  };

  public config = {
    toolbar: null
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
  public carriers_pair = [
    { "carrierName": "Alltel", "carrierValue": "alltel" },
    { "carrierName": "AT&T", "carrierValue": "at&t" },
    { "carrierName": "Boost Mobile", "carrierValue": "boost_mobile" },
    { "carrierName": "Consumer Cellular", "carrierValue": "consumer_cellular" },
    { "carrierName": "Cricket Wireless", "carrierValue": "cricket_wireless" },
    { "carrierName": "C-Spire", "carrierValue": "c-spire" },
    { "carrierName": "Metro PCS", "carrierValue": "metro_pcs" },
    { "carrierName": "Page Plus", "carrierValue": "page_plus" },
    { "carrierName": "Project Fi", "carrierValue": "project_fi" },
    { "carrierName": "Republic Wireless", "carrierValue": "republic_wireless" },
    { "carrierName": "Sprint", "carrierValue": "sprint" },
    { "carrierName": "Ting", "carrierValue": "ting" },
    { "carrierName": "T-Mobile", "carrierValue": "t-mobile" },
    { "carrierName": "U.S. Cellular", "carrierValue": "u.s_Cellular" },
    { "carrierName": "Verizon", "carrierValue": "verizon" },
    { "carrierName": "Virgin Mobile", "carrierValue": "virgin_mobile" },
    { "carrierName": "XFinity Mobile", "carrierValue": "xfinity_mobile" }
  ]
  keys: () => IterableIterator<number>;

  public carriers = [];
  public user_disc_ack: any;

  public marketselectionsTemp = {
    'market': [{ ddm_rmp_lookup_market_id: 2, market: "Canada" },
    { ddm_rmp_lookup_market_id: 3, market: "Export" },
    { ddm_rmp_lookup_market_id: 1, market: "US" }
    ]
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

  public selected = {
    market_data: [],
    division_data: [],
    country_region_data: [],
    region_zone_data: [],
    zone_area_data: [],
    gmma_data: [],
    lma_data: []
  }

  @Input() inputModelChange = new EventEmitter();

  constructor(private django: DjangoService,
    public DatePipe: DatePipe, private auth_service: AuthenticationService, private spinner: NgLoaderService, private dataProvider: DataProviderService,
    private toastr: NgToasterComponent, private report_id_service: GeneratedReportService) {

    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
        if (this.user_role == 'Admin') {
          this.config.toolbar = this.toolbarTooltips;
        }
        else {
          this.config.toolbar = false;
        }
      }
    })
    dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.content = element;
      }
    })
    dataProvider.currentlookupData.subscribe(element => {
      if (element) {
        this.lookup = element;
        this.getUserMarketInfo();
      }
    })
  }

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_text = {
    "ddm_rmp_desc_text_id": 6,
    "module_name": "Help_UserProfile",
    "description": ""
  }

  public notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  private startsWithAt(control: FormControl) {
    var rpoRegEx = /^([a-zA-Z0-9]){3,10}$/;
    if (control.value.match(rpoRegEx)) {
      return null
    }
    else {
      return {
        'startsWithAt': true
      }
    }
  }

  ngOnInit() {
    this.changed_settings = false
    this.spinner.show();
    this.report_id_service.currentSaved.subscribe(saved_status => {
      this.check_saved_status = saved_status
    })

    this.getUserInfo();

    if (this.content ? this.content['data'] : '') {
      let ref = this.content['data']['desc_text']
      let temp = ref.find(function (element) {
        return element["ddm_rmp_desc_text_id"] == 6;
      })
      if (temp) {
        this.original_content = temp.description;
      }
    }

    else { this.original_content = "" }
    this.naming = this.original_content;

    $('#dropdownHolder').find('angular4-multiselect').find('.dropdown-list').css('position', 'relative');
  }

  // get user info from server and set a few properties of component
  public getUserInfo() {
    this.django.division_selected().subscribe(response => {
      this.changed_settings = false
      this.user_info = response['user_text_notification_data']
      this.user_name = this.user_info['first_name'] + " " + this.user_info['last_name']
      this.user_disc_ack = this.user_info['disclaimer_ack']
      this.user_designation = this.user_info['designation']
      this.user_department = this.user_info['department']
      this.user_email = this.user_info['email']
      this.user_contact = this.user_info['contact_no']
      this.text_notification = this.user_info['alternate_number']
      if (this.text_notification != "" && this.text_notification != null) {

        this.te_number = this.text_notification.split(/[-]/);
        this.text_number = this.te_number[1];
      }
      else {
        this.text_number = ""
      }
      this.marketselections = response
      if (this.user_info['carrier'] == "") {
        this.disableNotificationBox()
      } else {
        this.enableNotificationBox()
      }
      this.user_office_address = this.user_info['office_address']
      this.UserMarketSelections()
      this.spinner.hide()
    })
  }

  // change textChange property when changes are made in quill editor
  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  // for number validation
  public numberOnly(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  // save changes made in help modal
  public content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      this.spinner.show()
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_text['description'] = this.naming;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {

        let temp_desc_text = this.content['data']['desc_text'];
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 6) {
            temp_desc_text[index] = this.description_text;
          }
        })
        this.content['data']['desc_text'] = temp_desc_text;
        this.dataProvider.changelookUpTableData(this.content);
        this.editModes = false;
        this.ngOnInit();
        this.original_content = this.naming;
        this.toastr.success("Updated Successfully");
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error("Data not Updated")
      })
    } else {
      this.toastr.error("please enter the data");
    }
  }

  // setting a few properties of component
  public edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.naming = this.original_content;
  }

  // setting a few properties of component
  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.naming = this.original_content;
  }

  // setting a few properties of component
  public carrier(value) {
    this.carrier_selected = value
  }

  // enable  a few input field based on checkbox selection
  public enableNotificationBox() {
    $("#notification_yes").prop("checked", "true")
    $("#phone").removeAttr("disabled");
    $("#carrier").removeAttr("disabled");
    if (this.marketselections["user_text_notification_data"]["alternate_number"] != null && this.marketselections["user_text_notification_data"]["alternate_number"] != "") {
      let cellPhoneHolder = this.marketselections["user_text_notification_data"]['alternate_number'];
      this.te_number = cellPhoneHolder.split(/[-]/);
      this.text_number = this.te_number[1];

      if ((<HTMLInputElement>document.getElementById("phone"))) {
        ((<HTMLInputElement>document.getElementById("phone")).value) = this.text_number;
      }
      let selectedCellular = this.marketselections["user_text_notification_data"]["carrier"]
      this.carrier_selected = selectedCellular
      $("#carrier option:eq(0)").prop("selected", "true")
      let singleQuote = "'"
      this.carriers_pair.map(element => {
        if (element.carrierValue == selectedCellular) {
          $("#carrier option[value =" + singleQuote + selectedCellular + singleQuote + "]").prop("selected", "true")
        }
      })
    }
    else {
      $("#notification_yes").prop("checked", "true")
      $("#phone").removeAttr("disabled");
      $("#carrier").removeAttr("disabled");
      if ((<HTMLInputElement>document.getElementById("phone"))) {
        ((<HTMLInputElement>document.getElementById("phone")).value) = "";
      }
      $("#carrier option[value = '']").prop("selected", "true")
    }
  }

  // disable  a few input field based on checkbox selection
  public disableNotificationBox() {
    (<HTMLTextAreaElement>(document.getElementById("phone"))).value = "";
    $("#carrier option[value = '']").prop("selected", "true")
    this.carrier_selected = ""
    $("#notification_no").prop("checked", "true")
    $("#phone").prop("disabled", "disabled");
    $("#carrier").prop("disabled", "disabled");
  }

  // setting a few properties of component from lookup on load of the page
  public getUserMarketInfo() {
    this.spinner.show()
    this.dropdownList = this.lookup['market_data'].sort((a, b) => a.market > b.market ? 1 : -1);
    this.dealernamedropdownList = this.lookup['dealer_name_data']
    this.citydropdownList = this.lookup['city_data']
    this.statedropdownList = this.lookup['state_data']
    this.zipdropdownList = this.lookup['zip_data']
    this.countrydropdownList = this.lookup['country_data']
    this.divisiondropdownList = this.lookup['division_data'].sort((a, b) => a.division_desc > b.division_desc ? 1 : -1);
    this.regiondropdownList = this.lookup['region_data'].sort((a, b) => a.region_desc > b.region_desc ? 1 : -1);
    this.zonedropdownList = this.lookup['zones_data'].sort((a, b) => a.zone_desc > b.zone_desc ? 1 : -1);
    this.areadropdownList = this.lookup['area_data'].sort((a, b) => a.area_desc > b.area_desc ? 1 : -1);
    this.gmmadropdownList = this.lookup['gmma_data'].sort((a, b) => a.gmma_desc > b.gmma_desc ? 1 : -1);
    this.lmadropdownList = this.lookup['lma_data'].sort((a, b) => a.lmg_desc > b.lmg_desc ? 1 : -1);

    this.dropdownSettings = {
      text: "Market",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market_id',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "user_profile_multiselect"
    };
    this.regiondropdownSettings = {
      text: "Region",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_country_region_id',
      labelKey: 'region_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      enableSearchFilter: true,
      classes: "user_profile_multiselect"
    };
    this.zonedropdownSettings = {
      text: "Zone",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_region_zone_id',
      labelKey: 'zone_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      enableSearchFilter: true,
      classes: "user_profile_multiselect"
    };
    this.areadropdownSettings = {
      text: "Area",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_zone_area_id',
      labelKey: 'area_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      enableSearchFilter: true,
      classes: "user_profile_multiselect"
    };
    this.gmmadropdownSettings = {
      text: "GMMA",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_gmma_id',
      labelKey: 'gmma_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      enableSearchFilter: true,
      classes: "user_profile_multiselect"
    };

    this.divisiondropdownSettings = {
      text: "Division",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_division_id',
      labelKey: 'division_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      enableSearchFilter: true,
      classes: "user_profile_multiselect"
    };

    this.lmadropdownSettings = {
      text: "LMA",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_lma_id',
      labelKey: 'lmg_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      enableSearchFilter: true,
      classes: "user_profile_multiselect"
    };
    this.spinner.hide()
  }

  ngAfterViewInit() {
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

  // setting a few properties of component from market_selection
  public UserMarketSelections() {
    this.changed_settings = false
    if (this.marketselections['has_previous_selections']) {
      this.market_selection = this.marketselections
      this.selected.market_data = this.market_selection["market_data"]
      this.selected.division_data = this.market_selection["division_data"]
      this.selected.country_region_data = this.market_selection["country_region_data"]
      this.selected.region_zone_data = this.market_selection["region_zone_data"]
      this.selected.zone_area_data = this.market_selection["zone_area_data"]
      this.selected.gmma_data = this.market_selection["gmma_data"]
      this.selected.lma_data = this.market_selection["lma_data"]

      if (this.market_selection["bac_data"].length != 0) {
        this.bacselectedItems = this.market_selection["bac_data"][0]['bac_desc']
      }
      else {
        this.bacselectedItems = []
      }
      if (this.market_selection['fan_data'].length != 0) {
        this.fanselectedItems = this.market_selection["fan_data"][0]['fan_data']
      } else {
        this.fanselectedItems = []
      }

      this.selected.market_data.map(element => {
        if (!(this.marketindex.includes(element["ddm_rmp_lookup_market_id"]))) {
          this.marketindex.push(element["ddm_rmp_lookup_market_id"])
        }
      })
      this.MarketDependencies(this.marketindex)

      this.selected.country_region_data.map(element => {
        if (!(this.regionindex.includes(element["ddm_rmp_lookup_country_region_id"]))) {
          this.regionindex.push(element["ddm_rmp_lookup_country_region_id"])
        }
      })
      this.regionSelection(this.regionindex)

      this.selected.region_zone_data.map(element => {
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
      this.zoneSelection(this.zoneindex)
    }
  }

  // toggle hide/view password
  public showPassword() {
    let ele_phone = <HTMLInputElement>document.getElementById("phone");
    if (ele_phone.style['webkitTextSecurity'] === 'disc') {
      ele_phone.style['webkitTextSecurity'] = 'none';
    } else {
      ele_phone.style['webkitTextSecurity'] = 'disc';
    }
  }

  // save marked selections
  public getSelectedMarkets() {
    this.report_id_service.changeSaved(true);

    if (this.selected.market_data.length < 1 || this.selected.division_data.length < 1) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select at least one market and division to proceed forward</h5>";
      document.getElementById("errorTrigger").click()
      this.spinner.hide();
    }
    else {
      this.spinner.show()
      let jsonfinal = {}
      this.date = "";

      jsonfinal["market_selection"] = this.selected.market_data
      jsonfinal["division_selection"] = this.selected.division_data
      jsonfinal["country_region_selection"] = this.selected.country_region_data
      jsonfinal["region_zone_selection"] = this.selected.region_zone_data
      jsonfinal["zone_area_selection"] = this.selected.zone_area_data
      jsonfinal["bac_selection"] = this.bacselectedItems
      jsonfinal["gmma_selection"] = this.selected.gmma_data
      jsonfinal["lma_selection"] = this.selected.lma_data
      jsonfinal["fan_selection"] = this.fanselectedItems

      this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
      let jsontime = {}
      jsonfinal["saved_setting"] = this.date
      jsontime["saved_setting"] = this.date
      this.market_selection = jsonfinal
      this.user_settings = jsontime

      this.django.ddm_rmp_user_market_selections_post_data(this.market_selection).subscribe(response => {
        this.toastr.success("Selection saved successfully")
        this.django.user_info_save_setting(this.user_settings).subscribe(response => {
          this.changed_settings = false
          this.spinner.hide()
        }, err => {
          this.spinner.hide()
        })
      }, err => {
        this.spinner.hide()
        this.toastr.error("Server problem encountered")
      })
    }
  }

  // called when an item is selected/deselected in market-data
  public onMarketItemSelect() {
    this.changed_settings = true
    // marketselections
    this.marketindex = [];
    this.selected.market_data.map(element => {
      if (!(this.marketindex.includes(element.ddm_rmp_lookup_market_id))) {
        this.marketindex.push(element.ddm_rmp_lookup_market_id)
      }
    })
    this.MarketDependencies(this.marketindex)
  }

  // called when an item is selected in multi select dropdown
  public onItemSelect(item: any) {
    this.changed_settings = true
    this.selected.market_data.map(element => {
      if (!(this.marketindex.includes(element.ddm_rmp_lookup_market_id))) {
        this.marketindex.push(element.ddm_rmp_lookup_market_id)
      }
    })
    this.MarketDependencies(this.marketindex)
  }

  // called when an item is deselected in multi select dropdown
  public onItemDeSelect(item: any) {
    this.changed_settings = true
    this.marketindex.splice(this.marketindex.indexOf(item.ddm_rmp_lookup_market_id), 1)
    this.MarketDependencies(this.marketindex)
    this.MarketDependenciesDeselect(this.marketindex)
    if (this.selected.market_data.length == 0) {
      this.bacselectedItems = []
    }
  }

  // deselect all marked dependencies
  public MarketDependenciesDeselect(marketindex: any) {
    this.selected.country_region_data = this.selected.country_region_data.filter(element => {
      return this.marketindex.includes(element.ddm_rmp_lookup_market)
    })
    this.regionindex = []
    if (this.selected.country_region_data) {
      this.selected.country_region_data.map(element => {
        if (!(this.regionindex.includes(element["ddm_rmp_lookup_country_region_id"]))) {
          this.regionindex.push(element["ddm_rmp_lookup_country_region_id"])
        }
      })
    }
    this.regionDeselection(this.regionindex)
    this.regionSelection(this.regionindex)

    this.zoneindex = []
    if (this.selected.region_zone_data) {
      this.selected.region_zone_data.map(element => {
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
    }
    this.zoneDeSelection(this.zoneindex)
    this.zoneSelection(this.zoneindex)

    this.selected.gmma_data = this.selected.gmma_data.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.selected.division_data = this.selected.division_data.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.selected.lma_data = this.selected.lma_data.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
  }

  public MarketDependencies(marketindex: any) {
    this.regiondropdownListfinal = this.regiondropdownList.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.gmmadropdownListfinal = this.gmmadropdownList.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.divisiondropdownListfinal = this.divisiondropdownList.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.lmadropdownListfinal = this.lmadropdownList.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.zonedropdownListfinal = this.zonedropdownList.filter(element => {
      return this.marketindex.includes(element.ddm_rmp_lookup_country_region)
    })
    this.areadropdownListfinal = this.areadropdownList.filter(element => {
      return this.marketindex.includes(element.ddm_rmp_lookup_region_zone)
    })
  }

  // select all marked dependencies
  public onSelectAll(items: any) {
    this.changed_settings = true
    for (let index = 1; index <= items.length; index++) {
      if (!(this.marketindex.includes(index))) {
        this.marketindex.push(index)
      }
    }
    this.MarketDependencies(this.marketindex)
  }

  public onDeSelectAll(items: any) {
    this.changed_settings = true
    this.marketindex = []
    this.MarketDependencies(this.marketindex)
    this.MarketDependenciesDeselect(this.marketindex)
    this.regiononItemDeSelectAll(this.selected.country_region_data)
    this.zoneonDeSelectAll(this.selected.region_zone_data)
    this.bacselectedItems = []
  }

  // called when an item is selected/deselected in region-data
  public onRegionItemSelect() {
    this.changed_settings = true
    this.regionindex = [];
    this.selected.country_region_data.map(element => {
      if (!(this.regionindex.includes(element.ddm_rmp_lookup_country_region_id))) {
        this.regionindex.push(element.ddm_rmp_lookup_country_region_id)
      }
    })
    this.regionSelection(this.regionindex)
  }

  // select region item selected
  public regiononItemSelect(item: any) {
    this.changed_settings = true
    this.selected.country_region_data.map(element => {
      if (!(this.regionindex.includes(element.ddm_rmp_lookup_country_region_id))) {
        this.regionindex.push(element.ddm_rmp_lookup_country_region_id)
      }
    })
    this.regionSelection(this.regionindex)
  }

  // deselect region item selected
  public regiononItemDeSelect(item: any) {
    this.changed_settings = true
    this.regionindex.splice(this.regionindex.indexOf(item.ddm_rmp_lookup_country_region_id), 1)
    this.regionSelection(this.regionindex)
    this.regionDeselection(this.regionindex)
    this.zoneindex = []
    if (this.selected.region_zone_data) {
      this.selected.region_zone_data.map(element => {
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
    }
    this.zoneSelection(this.zoneindex)
    this.zoneDeSelection(this.zoneindex)
  }

  // select all region
  public regiononSelectAll(items: any) {
    this.changed_settings = true
    for (let index = 1; index <= items.length; index++) {
      if (!(this.regionindex.includes(index))) {
        this.regionindex.push(index)
      }
    }
    this.regionSelection(this.regionindex)
  }

  // deselect all region
  public regiononItemDeSelectAll(items: any) {
    this.changed_settings = true
    this.regionindex = []
    this.regionSelection(this.regionindex)
    this.regionDeselection(this.regionindex)
    this.zoneonDeSelectAll(this.selected.region_zone_data)
  }

  // filter zone dropdown
  public regionSelection(regionindex: any) {
    this.zonedropdownListfinal = this.zonedropdownList.filter(element => {
      return this.regionindex.includes(element.ddm_rmp_lookup_country_region)
    })
  }

  // filter zone selection
  public regionDeselection(regionindex: any) {
    this.selected.region_zone_data = this.selected.region_zone_data.filter(element => {
      return this.regionindex.includes(element.ddm_rmp_lookup_country_region)
    })
  }

  //called when an item is selected/deselected in zone
  public onZoneItemSelect() {
    this.changed_settings = true
    this.zoneindex = []
    this.selected.region_zone_data.map(element => {
      if (!(this.zoneindex.includes(element.ddm_rmp_lookup_region_zone_id))) {
        this.zoneindex.push(element.ddm_rmp_lookup_region_zone_id)
      }
    })
    this.zoneSelection(this.zoneindex)
  }

  // add selected zone
  public zoneonItemSelect(item: any) {
    this.changed_settings = true
    this.selected.region_zone_data.map(element => {
      if (!(this.zoneindex.includes(element.ddm_rmp_lookup_region_zone_id))) {
        this.zoneindex.push(element.ddm_rmp_lookup_region_zone_id)
      }
    })
    this.zoneSelection(this.zoneindex)
  }

  // remove selected zone
  public zoneonItemDeSelect(item: any) {
    this.changed_settings = true
    this.zoneindex.splice(this.zoneindex.indexOf(item.ddm_rmp_lookup_region_zone_id), 1)
    this.zoneSelection(this.zoneindex)
    this.zoneDeSelection(this.zoneindex)
  }

  // select all zones
  public zoneonSelectAll(items: any) {
    this.changed_settings = true
    for (let index = 1; index <= items.length; index++) {
      if (!(this.zoneindex.includes(index))) {
        this.zoneindex.push(index)
      }
    }
    this.zoneSelection(this.zoneindex)
  }

  // deselect all zones
  public zoneonDeSelectAll(items: any) {
    this.changed_settings = true
    this.zoneindex = []
    this.zoneSelection(this.zoneindex)
    this.zoneDeSelection(this.zoneDeSelection)
  }

  // filter zones
  public zoneSelection(zoneindex: any) {
    this.areadropdownListfinal = this.areadropdownList.filter(element => {
      return this.zoneindex.includes(element.ddm_rmp_lookup_region_zone)
    })
  }

  // filter zones
  public zoneDeSelection(zoneindex: any) {
    this.selected.zone_area_data = this.selected.zone_area_data.filter(element => {
      return this.zoneindex.includes(element.ddm_rmp_lookup_region_zone)
    })
  }

  // setting a few properties of component
  public saveTriggeronItemSelect(items: any) {
    this.changed_settings = true
  }

  // setting a few properties of component
  public saveTriggeronItemDeSelect(items: any) {
    this.changed_settings = true
  }

  // setting a few properties of component

  public saveTriggeronSelectAll(items: any) {
    this.changed_settings = true
  }

  // setting a few properties of component
  public saveTriggeronDeSelectAll(items: any) {
    this.changed_settings = true
  }

  // get notification info from server
  public getNotificationInformation() {
    var phoneno = /^(\d+-?)+\d+$/;
    this.cellPhone = (<HTMLInputElement>document.getElementById("phone")).value;
    this.text_number = (<HTMLInputElement>document.getElementById("phone")).value;
    this.carrier_selected = (<HTMLSelectElement>document.getElementById("carrier")).value;
    if ($("#notification_no").prop("checked") == true) {
      this.spinner.show()
      this.jsonNotification.alternate_number = ""
      this.jsonNotification.carrier = ""
      this.django.text_notifications_put(this.jsonNotification).subscribe(ele => {
        this.spinner.hide();
        this.toastr.success("Notification details updated successfully")
      }, err => {
        this.spinner.hide();
        this.toastr.error("Connection error");
      })
    }
    else if (this.text_number == "" && this.carrier_selected == "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Please enter a valid number and select a carrier</h5>";
      document.getElementById("errorTrigger").click()
      return
    }
    else if (this.text_number == "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Number field cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
      return
    }
    else if (this.carrier_selected == "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Please select a carrier</h5>";
      document.getElementById("errorTrigger").click()
      return
    }

    else {
      if ((this.cellPhone.match(phoneno))) {
        this.spinner.show()
        this.jsonNotification.alternate_number = this.cellPhone
        this.jsonNotification.carrier = this.carrier_selected
        this.django.text_notifications_put(this.jsonNotification).subscribe(ele => {
          this.toastr.success("Notification details updated successfully")
          this.spinner.hide()
        }, err => {
          this.spinner.hide();
          this.toastr.error("Connection error");
        })
      }
      else {
        document.getElementById("errorModalMessage").innerHTML = "<h5>Please enter valid number(strictly numbers without special characters)</h5>";
        document.getElementById("errorTrigger").click()
        this.spinner.hide();
        return
      }
    }
  }

  public changeSaveSettings() {
    this.changed_settings = true;
  }
}
