import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service'
import { MarketselectionService } from 'src/app/rmp/marketselection.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { ToastrService } from "ngx-toastr";
import * as $ from "jquery";
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';  //CKEDITOR CHANGE 
import { elementAt } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit,AfterViewInit {
  
  editorHelp: any;
  public editorConfig = {            //CKEDITOR CHANGE 
    fontFamily : {
      options : [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Times New Roman, Times, serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    removePlugins : ['ImageUpload','ImageButton','Link','MediaEmbed','Iframe','Save'],
    fontSize : {
      options : [
        9,11,13,'default',17,19,21,23,24
      ]
    }
    // extraPlugins: [this.MyUploadAdapterPlugin]
  };
  // countryCode: any;
  full_contact: any;
  text_notification: any;
  countryCode_notification: any;
  notiNumber: boolean;
  text_number: any;
  code: any;
  te_number: any;
  codeCountry: any;

  editorData(arg0: string, editorData: any): any {
    throw new Error("Method not implemented.");
  }

  selectedValue = {
    'US': {},
    'Canada': {},
    'Export': {}
  };

  market_selection: object;
  user_settings: object;
  public validators = [this.startsWithAt]
  public errorMessages = {
    'startsWithAt' : "Your items should be strictly Alphanumericals and between 3-10 characters"
  }
  market: Array<object>
  division: Array<object>
  region: Array<object>
  zone: Array<object>
  area: Array<object>
  gmma: Array<object>
  lma: Array<object>
  // bac: Array<object>
  changed_settings: boolean;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  regiondropdownList = [];
  regionselectedItems = [];
  regiondropdownSettings = {};
  marketindex = []
  regiondropdownListfinal = []

  zonedropdownList = [];
  zoneselectedItems = [];
  zonedropdownSettings = {};
  regionindex = []
  zonedropdownListfinal = []

  areadropdownList = [];
  areaselectedItems = [];
  areadropdownSettings = {};
  zoneindex = []
  areadropdownListfinal = []

  gmmadropdownList = [];
  gmmaselectedItems = [];
  gmmadropdownSettings = {};
  gmmadropdownListfinal = []

  lmadropdownList = [];
  lmaselectedItems = [];
  lmadropdownSettings = {};
  lmadropdownListfinal = []

  // bacdropdownList = [];
  bacselectedItems = [];
  // bacdropdownSettings = {};

  // fandropdownList = [];
  fanselectedItems = [];
  // fandropdownSettings = {};

  divisiondropdownList = [];
  divisionselectedItems = [];
  divisiondropdownSettings = {};
  divisiondropdownListfinal = []

  dealernamedropdownList = [];
  dealernameselectedItems = [];
  dealernamedropdownSettings = {};
  dealernamedropdownListfinal = []

  citydropdownList = [];
  cityselectedItems = [];
  citydropdownSettings = {};
  citydropdownListfinal = []

  statedropdownList = [];
  stateselectedItems = [];
  statedropdownSettings = {};
  statedropdownListfinal = []

  zipdropdownList = [];
  zipselectedItems = [];
  zipdropdownSettings = {};
  zipdropdownListfinal = []

  countrydropdownList = [];
  countryselectedItems = [];
  countrydropdownSettings = {};
  countrydropdownListfinal = [];

  jsonNotification = {
    "alternate_number": "",
    "carrier": ""
  }


  message: string;
  check: boolean;
  check_saved_status: boolean;

  market_data: any;
  cellPhone: any;
  date: any;
  lookup;
  marketselections;
  contact_flag = true;
  content;
  enable_edits = false
  editModes = false;
  original_content;
  naming: string = "Loading";
  public Editor = ClassicEditor;
  user_info: any;
  user_name: string;
  user_designation: any;
  user_department: any;
  user_email: any;
  user_contact: any;
  carrier_selected = "";
  user_office_address: any;
  user_role : string;
  // carriers = ["Alltel", "AT&T","Boost Mobile","Cricket Wireless","Project Fi","Sprint", "T-Mobile",
  //             "U.S. Cellular", "Verizon", "Virgin Mobile", "Repunlic Wireless", "Page Plus", "C-Spire",
  //           "Consumer Cellular", "Ting", "Metro PCS", "XFinity Mobile"]
    
  carriers_pair = [
    {"carrierName":"Alltel","carrierValue" : "alltel"}, 
    {"carrierName":"AT&T","carrierValue" :"at&t"},
    {"carrierName":"Boost Mobile","carrierValue" :"boost_mobile"},
    {"carrierName":"Cricket Wireless","carrierValue" :"cricket_wireless"},
    {"carrierName":"Project Fi" ,"carrierValue" : "project_fi"},
    {"carrierName":"Sprint","carrierValue" :"sprint"},
    {"carrierName":"T-Mobile","carrierValue" :"t-mobile"},
    {"carrierName":"U.S. Cellular" ,"carrierValue" : "u.s_Cellular"}, 
    {"carrierName":"Verizon" ,"carrierValue" :"verizon"}, 
    {"carrierName":"Virgin Mobile" ,"carrierValue" :"virgin_mobile"}, 
    {"carrierName":"Republic Wireless" ,"carrierValue" : "republic_wireless"},
    {"carrierName":"Page Plus","carrierValue" :"page_plus"}, 
    {"carrierName":"C-Spire","carrierValue" :"c-spire"},
    {"carrierName":"Consumer Cellular" ,"carrierValue" : "consumer_cellular"}, 
    {"carrierName":"Ting","carrierValue" :"ting"}, 
    {"carrierName":"Metro PCS","carrierValue" :"metro_pcs"}, 
    {"carrierName":"XFinity Mobile","carrierValue" :"xfinity_mobile"}
  ]
  keys: () => IterableIterator<number>;

  
  carriers = [];
  user_disc_ack: any;

  constructor(private django: DjangoService, private marketService: MarketselectionService,
    private DatePipe: DatePipe,private auth_service:AuthenticationService, private spinner: NgxSpinnerService, private dataProvider: DataProviderService,
    private toastr: ToastrService, private report_id_service: GeneratedReportService) {

    // this.lookup = this.dataProvider.getLookupData()
    // this.content = dataProvider.getLookupTableData()
    this.auth_service.myMethod$.subscribe(role =>{
      if (role) {
        this.user_role = role["role"]
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

  ngAfterViewInit(): void {
    ClassicEditor.create(document.querySelector('#ckEditorHelp'), this.editorConfig).then(editor => {
      this.editorHelp = editor;
      //console.log('Data: ', this.editorData);
      this.editorHelp.setData(this.naming);
      this.editorHelp.isReadOnly = true;
      // ClassicEditor.builtinPlugins.map(plugin => //console.log(plugin.pluginName))
    })
      .catch(error => {
        //console.log('Error: ', error);
      });
  }

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  description_text = {
    "ddm_rmp_desc_text_id": 6,
    "module_name": "Help_UserProfile",
    "description": ""
  }

  notify() {
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
        this.codeCountry = this.te_number[0];
      }
      else{
        this.text_number = ""
        this.codeCountry = ""
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


    let ref = this.content['data']['desc_text']
    let temp = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 6;
    })
    
    this.original_content = temp.description;
    this.naming = this.original_content;
  }

  content_edits() {
    this.spinner.show()
    this.editModes = false;
    this.editorHelp.isReadOnly = true;
    this.description_text['description'] = this.editorHelp.getData();
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {

      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 6) {
          temp_desc_text[index] = this.description_text
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)
      // //console.log("changed")
      this.editModes = false;
      this.ngOnInit()
      // //console.log("inside the service")
      // //console.log(response);
      this.original_content = this.naming;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {
    if (this.editModes) {
      this.editorHelp.isReadOnly = true
    } else {
      this.editorHelp.isReadOnly = false
    }
    this.editModes = !this.editModes;
    this.naming = this.original_content;
    this.editorHelp.setData(this.naming)
    $('#edit_button').show()
  }

  // desc(element) {
  //   this.cellPhone = element
  // }

  // descs(element){
  //   this.countryCode = element
  // }
  

  carrier(value) {
        this.carrier_selected = value
  }

  enableNotificationBox() {
    this.changed_settings = true;
    $("#notification_yes").prop("checked","true")
    $("#phone").removeAttr("disabled");
    $("#countryCode").removeAttr("disabled");
    $("#carrier").removeAttr("disabled");
   // console.log(this.marketselections)
    if (this.marketselections["user_text_notification_data"]["alternate_number"] != null && this.marketselections["user_text_notification_data"]["alternate_number"] != "") {
      // this.full_contact = this.countryCode + "-" + this.cellPhone;
      let cellPhoneHolder = this.marketselections["user_text_notification_data"]['alternate_number'];
    
      this.te_number = cellPhoneHolder.split(/[-]/);
      this.text_number = this.te_number[1];
      this.codeCountry = this.te_number[0];
  
      ((<HTMLInputElement>document.getElementById("phone")).value) = this.text_number;
      ((<HTMLInputElement>document.getElementById("countryCode")).value) = this.codeCountry;
      let selectedCellular = this.marketselections["user_text_notification_data"]["carrier"]
      this.carrier_selected = selectedCellular
      $("#carrier option:eq(0)").prop("selected","true")
      let singleQuote ="'"
      this.carriers_pair.map(element => {
        if (element.carrierValue == selectedCellular) {
          $("#carrier option[value ="+singleQuote + selectedCellular +singleQuote+"]").prop("selected","true")
         // console.log(selectedCellular)
         // console.log("executed")
        }
      })
    }
    else{
      // console.log("Empty")
      $("#notification_yes").prop("checked","true")
        $("#phone").removeAttr("disabled");
        $("#countryCode").removeAttr("disabled");
        $("#carrier").removeAttr("disabled");
      ((<HTMLInputElement>document.getElementById("phone")).value) = "";
      ((<HTMLInputElement>document.getElementById("countryCode")).value) = "";
      $("#carrier option[value = '']").prop("selected","true")
    }

   
  }

  disableNotificationBox() {
    (<HTMLTextAreaElement>(document.getElementById("phone"))).value = "";
    (<HTMLTextAreaElement>(document.getElementById("countryCode"))).value = "";
    $("#carrier option[value = '']").prop("selected","true")
    this.carrier_selected = ""
    $("#notification_no").prop("checked","true")
    $("#phone").prop("disabled", "disabled");
    $("#countryCode").prop("disabled", "disabled");
    $("#carrier").prop("disabled", "disabled");
  }

  getUserMarketInfo() {
    this.spinner.show()

    //console.log(this.lookup)
    this.dropdownList = this.lookup['market_data']
    this.dealernamedropdownList = this.lookup['dealer_name_data']
    this.citydropdownList = this.lookup['city_data']
    this.statedropdownList = this.lookup['state_data']
    this.zipdropdownList = this.lookup['zip_data']
    this.countrydropdownList = this.lookup['country_data']
    this.divisiondropdownList = this.lookup['division_data']
    this.regiondropdownList = this.lookup['region_data']
    this.zonedropdownList = this.lookup['zones_data']
    this.areadropdownList = this.lookup['area_data']
    this.gmmadropdownList = this.lookup['gmma_data']
    this.lmadropdownList = this.lookup['lma_data']


    this.dropdownSettings = {
      text: "Market",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market_id',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "user_profile_multiselect"
      // enableCheckAll : true,
      // //itemsShowLimit: 3,
      // //allowSearchFilter: true
    };
    this.regiondropdownSettings = {
      text: "Region",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_country_region_id',
      labelKey: 'region_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      // //itemsShowLimit: 3,
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
      //itemsShowLimit: 3,
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
      //itemsShowLimit: 3,
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
      //itemsShowLimit: 3,
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
      //itemsShowLimit: 3,
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
      //itemsShowLimit: 3,
      enableSearchFilter: true,
      classes: "user_profile_multiselect"
    };
    this.spinner.hide()
  }

  UserMarketSelections() {
    // //console.log(this.marketselections)
    this.changed_settings = false
    if (this.marketselections['has_previous_selections']) {
      this.market_selection = this.marketselections
      this.selectedItems = this.market_selection["market_data"]
      this.divisionselectedItems = this.market_selection["division_data"]
      this.regionselectedItems = this.market_selection["country_region_data"]
      this.zoneselectedItems = this.market_selection["region_zone_data"]
      this.areaselectedItems = this.market_selection["zone_area_data"]
      this.gmmaselectedItems = this.market_selection["gmma_data"]
      this.lmaselectedItems = this.market_selection["lma_data"]
      if (this.market_selection["bac_data"].length != 0) {
        this.bacselectedItems = this.market_selection["bac_data"][0]['bac_desc']
      }
      else{
        this.bacselectedItems = []
      }
      if (this.market_selection['fan_data'].length != 0) {
        this.fanselectedItems = this.market_selection["fan_data"][0]['fan_data'] 
      } else {
        this.fanselectedItems = []
      }

      this.selectedItems.map(element => {
        if (!(this.marketindex.includes(element["ddm_rmp_lookup_market_id"]))) {
          this.marketindex.push(element["ddm_rmp_lookup_market_id"])
        }
      })
      this.MarketDependencies(this.marketindex)

      this.regionselectedItems.map(element => {
        if (!(this.regionindex.includes(element["ddm_rmp_lookup_country_region_id"]))) {
          this.regionindex.push(element["ddm_rmp_lookup_country_region_id"])
        }
      })
      this.regionSelection(this.regionindex)

      this.zoneselectedItems.map(element => {
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
      this.zoneSelection(this.zoneindex)

    }
  }


  showPassword() {
    if ((<HTMLInputElement>document.getElementById("phone")).type == "text" && (<HTMLInputElement>document.getElementById("countryCode")).type == "text") {
      (<HTMLInputElement>document.getElementById("phone")).type = "password";
      (<HTMLInputElement>document.getElementById("countryCode")).type = "password";
    } else {
      (<HTMLInputElement>document.getElementById("phone")).type = "text";
      (<HTMLInputElement>document.getElementById("countryCode")).type = "test";
    }
  }
  getSelectedMarkets() {
    this.report_id_service.changeSaved(true);

    if (this.selectedItems.length < 1 || this.divisionselectedItems.length < 1) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select atleast one market and division to proceed forward</h5>";
      document.getElementById("errorTrigger").click()
      this.spinner.hide();
    }
    else {
      this.spinner.show()
      let jsonfinal = {}
      this.date = "";

      jsonfinal["market_selection"] = this.selectedItems
      jsonfinal["division_selection"] = this.divisionselectedItems
      jsonfinal["country_region_selection"] = this.regionselectedItems
      jsonfinal["region_zone_selection"] = this.zoneselectedItems
      jsonfinal["zone_area_selection"] = this.areaselectedItems
      jsonfinal["bac_selection"] = this.bacselectedItems
      jsonfinal["gmma_selection"] = this.gmmaselectedItems
      jsonfinal["lma_selection"] = this.lmaselectedItems
      jsonfinal["fan_selection"] = this.fanselectedItems

      this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
      let jsontime = {}
      jsonfinal["saved_setting"] = this.date
      jsontime["saved_setting"] = this.date
      this.market_selection = jsonfinal
      this.user_settings = jsontime

      this.django.ddm_rmp_user_market_selections_post_data(this.market_selection).subscribe(response => {
        // //console.log(response)
        this.toastr.success("Selection saved successfully")
        this.django.user_info_save_setting(this.user_settings).subscribe(response => {
          this.changed_settings = false
          this.spinner.hide()
        }, err => {
          this.spinner.hide()
        })
      }, err => {
        this.spinner.hide()
        this.toastr.error("Server problem encountered", "Error:")
      })
      // this.spinner.show()

      // //console.log(this.jsonNotification)
    }

  }

  onItemSelect(item: any) {
    this.changed_settings = true
    this.selectedItems.map(element => {
      if (!(this.marketindex.includes(element.ddm_rmp_lookup_market_id))) {
        this.marketindex.push(element.ddm_rmp_lookup_market_id)
      }
    })
    this.MarketDependencies(this.marketindex)
  }

  onItemDeSelect(item: any) {
    this.changed_settings = true
    this.marketindex.splice(this.marketindex.indexOf(item.ddm_rmp_lookup_market_id), 1)
    this.MarketDependencies(this.marketindex)
    this.MarketDependenciesDeselect(this.marketindex)
    if (this.selectedItems.length == 0) {
      this.bacselectedItems = []
    }
  }

  MarketDependenciesDeselect(marketindex: any) {
    this.regionselectedItems = this.regionselectedItems.filter(element => {
      return this.marketindex.includes(element.ddm_rmp_lookup_market)
    })
    this.regionindex = []
    if (this.regionselectedItems) {
      this.regionselectedItems.map(element => {
        // this.regionindex.push(element.ddm_rmp_lookup_country_region_id)
        if (!(this.regionindex.includes(element["ddm_rmp_lookup_country_region_id"]))) {
          this.regionindex.push(element["ddm_rmp_lookup_country_region_id"])
        }
      })
    }
    this.regionDeselection(this.regionindex)
    this.regionSelection(this.regionindex)

    this.zoneindex = []
    if (this.zoneselectedItems) {
      this.zoneselectedItems.map(element => {
        //   this.zone.push(element.ddm_rmp_lookup_region_zone_id)
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
    }
    this.zoneDeSelection(this.zoneindex)
    this.zoneSelection(this.zoneindex)

    this.gmmaselectedItems = this.gmmaselectedItems.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.divisionselectedItems = this.divisionselectedItems.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.lmaselectedItems = this.lmaselectedItems.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })


  }

  MarketDependencies(marketindex: any) {
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

  }

  onSelectAll(items: any) {
    this.changed_settings = true
    for (let index = 1; index <= items.length; index++) {
      if (!(this.marketindex.includes(index))) {
        this.marketindex.push(index)
      }
    }
    this.MarketDependencies(this.marketindex)
  }

  onDeSelectAll(items: any) {
    this.changed_settings = true
    this.marketindex = []
    this.MarketDependencies(this.marketindex)
    this.MarketDependenciesDeselect(this.marketindex)
    this.regiononItemDeSelectAll(this.regionselectedItems)
    this.zoneonDeSelectAll(this.zoneselectedItems)
    this.bacselectedItems = []
  }

  regiononItemSelect(item: any) {
    this.changed_settings = true
    this.regionselectedItems.map(element => {
      if (!(this.regionindex.includes(element.ddm_rmp_lookup_country_region_id))) {
        this.regionindex.push(element.ddm_rmp_lookup_country_region_id)
      }
    })
    this.regionSelection(this.regionindex)
  }

  regiononItemDeSelect(item: any) {
    this.changed_settings = true
    this.regionindex.splice(this.regionindex.indexOf(item.ddm_rmp_lookup_country_region_id), 1)
    this.regionSelection(this.regionindex)
    this.regionDeselection(this.regionindex)
    this.zoneindex = []
    if (this.zoneselectedItems) {
      this.zoneselectedItems.map(element => {
        //   this.zone.push(element.ddm_rmp_lookup_region_zone_id)
        if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
          this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
        }
      })
    }
    this.zoneSelection(this.zoneindex)
    this.zoneDeSelection(this.zoneindex)
  }

  regiononSelectAll(items: any) {
    this.changed_settings = true
    for (let index = 1; index <= items.length; index++) {
      if (!(this.regionindex.includes(index))) {
        this.regionindex.push(index)
      }
    }
    this.regionSelection(this.regionindex)
  }

  regiononItemDeSelectAll(items: any) {
    this.changed_settings = true
    this.regionindex = []
    this.regionSelection(this.regionindex)
    this.regionDeselection(this.regionindex)
    this.zoneonDeSelectAll(this.zoneselectedItems)
  }

  regionSelection(regionindex: any) {
    this.zonedropdownListfinal = this.zonedropdownList.filter(element => {
      return this.regionindex.includes(element.ddm_rmp_lookup_country_region)
    })
  }

  regionDeselection(regionindex: any) {
    this.zoneselectedItems = this.zoneselectedItems.filter(element => {
      return this.regionindex.includes(element.ddm_rmp_lookup_country_region)
    })
  }

  zoneonItemSelect(item: any) {
    this.changed_settings = true
    this.zoneselectedItems.map(element => {
      if (!(this.zoneindex.includes(element.ddm_rmp_lookup_region_zone_id))) {
        this.zoneindex.push(element.ddm_rmp_lookup_region_zone_id)
      }
    })
    this.zoneSelection(this.zoneindex)
  }

  zoneonItemDeSelect(item: any) {
    this.changed_settings = true
    this.zoneindex.splice(this.zoneindex.indexOf(item.ddm_rmp_lookup_region_zone_id), 1)
    this.zoneSelection(this.zoneindex)
    this.zoneDeSelection(this.zoneindex)
  }
  zoneonSelectAll(items: any) {
    this.changed_settings = true
    for (let index = 1; index <= items.length; index++) {
      if (!(this.zoneindex.includes(index))) {
        this.zoneindex.push(index)
      }
    }
    this.zoneSelection(this.zoneindex)
  }
  zoneonDeSelectAll(items: any) {
    this.changed_settings = true
    this.zoneindex = []
    this.zoneSelection(this.zoneindex)
    this.zoneDeSelection(this.zoneDeSelection)
  }
  zoneSelection(zoneindex: any) {
    this.areadropdownListfinal = this.areadropdownList.filter(element => {
      return this.zoneindex.includes(element.ddm_rmp_lookup_region_zone)
    })
  }
  zoneDeSelection(zoneindex: any) {
    this.areaselectedItems = this.areaselectedItems.filter(element => {
      return this.zoneindex.includes(element.ddm_rmp_lookup_region_zone)
    })
  }
  saveTriggeronItemSelect(items: any) {
    this.changed_settings = true
  }
  saveTriggeronItemDeSelect(items: any) {
    this.changed_settings = true
  }
  saveTriggeronSelectAll(items: any) {
    this.changed_settings = true
  }
  saveTriggeronDeSelectAll(items: any) {
    this.changed_settings = true
  }

  getNotificationInformation(){
    var phoneno = /^(\d+-?)+\d+$/;
    this.cellPhone = (<HTMLInputElement>document.getElementById("countryCode")).value +"-"+ (<HTMLInputElement>document.getElementById("phone")).value;
    this.codeCountry = (<HTMLInputElement>document.getElementById("countryCode")).value
    this.text_number = (<HTMLInputElement>document.getElementById("phone")).value;
    this.carrier_selected = (<HTMLSelectElement>document.getElementById("carrier")).value;
    console.log(this.cellPhone);
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

    else if (this.text_number == "" && this.codeCountry == "" && this.carrier_selected == ""){
      document.getElementById("errorModalMessage").innerHTML = "<h5>Please enter a valid number and select a carrier</h5>";
      document.getElementById("errorTrigger").click()
      return
    }
    else if (this.text_number == "") {
      // alert("Please enter valid 10 digit number & select a carrier")
      document.getElementById("errorModalMessage").innerHTML = "<h5>Number field cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
      return
    }
    else if (this.codeCountry == ""){
      document.getElementById("errorModalMessage").innerHTML = "<h5>Country code cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
      return
    }
    else if (this.carrier_selected == ""){
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
}

