import { Component, OnInit } from '@angular/core';
//import $ from 'jquery';
declare var $: any;
import { Contact } from './contact';
import { DjangoService } from 'src/app/rmp/django.service'
import { DatePipe } from '@angular/common'
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { ToastrService } from "ngx-toastr";
import { RepotCriteriaDataService } from "../../services/report-criteria-data.service";
import { generate } from 'rxjs';

@Component({
  selector: 'app-select-report-criteria',
  templateUrl: './select-report-criteria.component.html',
  styleUrls: ['./select-report-criteria.component.css']
})
export class SelectReportCriteriaComponent implements OnInit {

  //@Output() messageEvent = new EventEmitter<string>();
  showReportId: String;
  update: boolean;

  market_selection: object;
  dealer_allocation_selection: object;
  market: Array<object>
  division: Array<object>
  region: Array<object>
  zone: Array<object>
  area: Array<object>
  gmma: Array<object>
  lma: Array<object>
  bac: Array<object>
  generated_report_id: number;
  generated_report_status: string;

  select_report_selection: object;
  frequencyData: {};
  identifierData: {};
  jsonfinal = {
    'select_frequency': [],
    'special_identifiers': [],
    'user_info_id': 1
  };


  dropdownList_report = [];
  selectedItems_report = [];
  dropdownSettings_report = {};

  regiondropdownList_report = [];
  regionselectedItems_report = [];
  regiondropdownSettings_report = {};
  marketindex = []
  regiondropdownListfinal_report = []

  zonedropdownList_report = [];
  zoneselectedItems_report = [];
  zonedropdownSettings_report = {};
  regionindex = []
  zonedropdownListfinal_report = []

  areadropdownList_report = [];
  areaselectedItems_report = [];
  areadropdownSettings_report = {};
  zoneindex = []
  areadropdownListfinal_report = []

  gmmadropdownList_report = [];
  gmmaselectedItems_report = [];
  gmmadropdownSettings_report = {};
  gmmadropdownListfinal_report = []

  lmadropdownList_report = [];
  lmaselectedItems_report = [];
  lmadropdownSettings_report = {};
  lmadropdownListfinal_report = []

  bacdropdownList_report = [];
  bacselectedItems_report = [];
  bacdropdownSettings_report = {};

  divisiondropdownList_report = [];
  divisionselectedItems_report = [];
  divisiondropdownSettings_report = {};
  divisiondropdownListfinal_report = []

  dealernamedropdownList_report = [];
  dealernameselectedItems_report = [];
  dealernamedropdownSettings_report = {};
  dealernamedropdownListfinal_report = []

  citydropdownList_report = [];
  cityselectedItems_report = [];
  citydropdownSettings_report = {};
  citydropdownListfinal_report = []

  statedropdownList_report = [];
  stateselectedItems_report = [];
  statedropdownSettings_report = {};
  statedropdownListfinal_report = []

  zipdropdownList_report = [];
  zipselectedItems_report = [];
  zipdropdownSettings_report = {};
  zipdropdownListfinal_report = []

  countrydropdownList_report = [];
  countryselectedItems_report = [];
  countrydropdownSettings_report = {};
  countrydropdownListfinal_report = []




  special_identifier: any;
  frequency: any;
  contacts: Array<string>;
  checkedList = [];

  checked = false;
  disabled = false;
  market_data: any;
  select_frequency: any;
  Select = {};
  Sel = {};
  obj_keys: Array<string>
  freq_val: {}[];
  date: string;

  lookup;
  lookup_data;
  userMarketSelections;
  reportId = 0;
  message: string;
  report_id: any;
  jsonUpdate = {
    'select_frequency': [],
    'special_identifiers': [],
    'user_info_id': 1
  };
  dl_flag =  false;

  constructor(private django: DjangoService, private DatePipe: DatePipe,
    private dataProvider: DataProviderService,
    private report_id_service: GeneratedReportService,
    private spinner: NgxSpinnerService, private toastr: ToastrService,
    private reportDataService: RepotCriteriaDataService) {

    this.lookup = dataProvider.getLookupTableData();
    this.lookup_data = dataProvider.getLookupData();
    this.getUserMarketInfo();

    this.report_id_service.saveUpdate.subscribe(element => {
      this.update = element
    })


    this.contacts = []
    this.contacts.push("akash.abhinav@gmail.com")
  }

  addContact() {
    let contact = (<HTMLTextAreaElement>(document.getElementById("dltext"))).value

    if (contact == "") {
      this.dl_flag = true
    }
    else {
    this.contacts.push(contact);
    this.dl_flag = false
    }
  console.log(this.contacts)
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
    //debugger;
    console.log('local id ' + localStorage.getItem('report_id'))
    if (this.update) {
      this.reportCriteriaCheckbox(localStorage.getItem('report_id'))
    }
    // this.django.get_report_description(localStorage.getItem('report_id')).subscribe(res=>{
    //   console.log(res)
    // })
    console.log("ngOnInit")
    this.spinner.show()
    this.reportDataService.getReportID().subscribe(ele => {
      this.reportId = ele;
    });
    this.django.division_selected(1).subscribe(element => {
      this.userMarketSelections = element;

      this.userSelectionInitialisation();
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })

  }

  updateSelections() {
    this.spinner.show();

    if (this.selectedItems_report.length < 1) {
      alert("Select atleast one market to proceed forward")
    }
    else if ($('.check:radio[name="select-freq"]:checked').length < 1) {
      alert("Select Report Frequency")
    }
    else if(this.contacts.length < 1){
      alert("Add atleast one email in Distribution List to proceed forward")
    }
    else {
      if ($('#frequency0').prop("checked") && $('.sub:checkbox:checked').length < 1) {
        alert("Select Frequency for Ongoing Routine Reports")
      }
      else {

        this.spinner.show()
        // this.jsonUpdate = this.jsonfinal
        this.jsonUpdate["report_id"] = this.reportId
        this.jsonUpdate["market_selection"] = this.selectedItems_report
        this.jsonUpdate["division_selection"] = this.divisionselectedItems_report
        this.jsonUpdate["country_region_selection"] = this.regionselectedItems_report
        this.jsonUpdate["region_zone_selection"] = this.zoneselectedItems_report
        this.jsonUpdate["zone_area_selection"] = this.areaselectedItems_report
        this.jsonUpdate["bac_selection"] = this.bacselectedItems_report
        this.jsonUpdate["gmma_selection"] = this.gmmaselectedItems_report
        this.jsonUpdate["lma_selection"] = this.lmaselectedItems_report
        this.jsonUpdate["dealer_name_selection"] = this.dealernameselectedItems_report
        this.jsonUpdate["city_selection"] = this.cityselectedItems_report
        this.jsonUpdate["state_selection"] = this.stateselectedItems_report
        this.jsonUpdate["zip_selection"] = this.zipselectedItems_report
        this.jsonUpdate["country_selection"] = this.countryselectedItems_report
        this.jsonUpdate["user_info_id"] = 1;
        this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
        this.jsonUpdate["report_detail"] = { "status": "Pending-Incomplete", "status_date": this.date, "report_type": "", "title": "", "additional_req": "", "created_on": this.date, "on_behalf_of": "", "assigned_to": "", "link_to_results": "", "query_criteria": "", "link_title": "" }
        // this.jsonUpdate["dl_list"] = this.contacts
      }



      if (this.reportId != 0) {
        this.setSpecialIdentifiers();
        this.setFrequency();
      }
      this.report_id_service.changeSavedChanges(true);
    }


    console.log(this.jsonUpdate);
    this.django.ddm_rmp_report_market_selection(this.jsonUpdate).subscribe(response => {
      console.log(response)
      this.report_id_service.changeDivisionSelected(this.divisionselectedItems_report)
      this.spinner.hide();
      this.toastr.success("Report updated successfully")
    }, err => {
      this.spinner.hide();
      this.toastr.error("Connection Problem")
    })
  }

  getUserMarketInfo() {
    this.spinner.show()
    this.dropdownList_report = this.lookup_data['market_data']
    this.dealernamedropdownList_report = this.lookup_data['dealer_name_data']
    this.citydropdownList_report = this.lookup_data['city_data']
    this.statedropdownList_report = this.lookup_data['state_data']
    this.zipdropdownList_report = this.lookup_data['zip_data']
    this.countrydropdownList_report = this.lookup_data['country_data']
    this.divisiondropdownList_report = this.lookup_data['division_data']
    this.regiondropdownList_report = this.lookup_data['region_data']
    this.zonedropdownList_report = this.lookup_data['zones_data']
    this.areadropdownList_report = this.lookup_data['area_data']
    this.gmmadropdownList_report = this.lookup_data['gmma_data']
    this.lmadropdownList_report = this.lookup_data['lma_data']
    this.bacdropdownList_report = this.lookup_data['bac_data']

    this.dropdownSettings_report = {
      text: "Market",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market_id',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "select_report_criteria_multiselect"
      // enableCheckAll : true,
      // //itemsShowLimit: 3,
      // //allowSearchFilter: true
    };
    this.regiondropdownSettings_report = {
      text: "Region",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_country_region_id',
      labelKey: 'region_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      // //itemsShowLimit: 3,
      // //allowSearchFilter: true
    };
    this.zonedropdownSettings_report = {
      text: "Zone",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_region_zone_id',
      labelKey: 'zone_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      //itemsShowLimit: 3,
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //allowSearchFilter: true
    };
    this.areadropdownSettings_report = {
      text: "Area",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_zone_area_id',
      labelKey: 'area_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      //itemsShowLimit: 3,
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //allowSearchFilter: true
    };
    this.gmmadropdownSettings_report = {
      text: "GMMA",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_gmma_id',
      labelKey: 'gmma_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      //itemsShowLimit: 3,
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //allowSearchFilter: true
    };

    // this.bacdropdownSettings = {
    //   singleSelection: false,
    //   idField: 'ddm_rmp_lookup_bac_id',
    //   textField: 'bac_desc',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   enableCheckAll : true,
    //   allowSearchFilter: true
    // };

    this.bacdropdownSettings_report = {
      text: "BAC",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_bac_id',
      labelKey: 'bac_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll: true,
      enableSearchFilter: true,
      lazyLoading: true,
      classes: "select_report_criteria_multiselect"
    };

    this.divisiondropdownSettings_report = {
      text: "Division",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_division_id',
      labelKey: 'division_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.dealernamedropdownSettings_report = {
      text: "DealerName",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.citydropdownSettings_report = {
      text: "City",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.statedropdownSettings_report = {
      text: "State/Province",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.zipdropdownSettings_report = {
      text: "Zip",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.countrydropdownSettings_report = {
      text: "Country",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.lmadropdownSettings_report = {
      text: "LMA",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_lma_id',
      labelKey: 'lmg_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "select_report_criteria_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

  }


  userSelectionInitialisation() {
    this.market_selection = this.userMarketSelections
    console.log(this.market_selection)
    this.selectedItems_report = this.market_selection["market_data"]
    this.divisionselectedItems_report = this.market_selection["division_data"]
    this.regionselectedItems_report = this.market_selection["country_region_data"]
    this.zoneselectedItems_report = this.market_selection["region_zone_data"]
    this.areaselectedItems_report = this.market_selection["zone_area_data"]
    this.bacselectedItems_report = this.market_selection["bac_data"]
    this.gmmaselectedItems_report = this.market_selection["gmma_data"]
    this.lmaselectedItems_report = this.market_selection["lma_data"]
    this.dealernameselectedItems_report = this.market_selection["dealer_data"]
    this.cityselectedItems_report = this.market_selection["city_data"]
    this.stateselectedItems_report = this.market_selection["state_data"]
    this.zipselectedItems_report = this.market_selection["zip_data"]
    this.countryselectedItems_report = this.market_selection["country_data"]

    this.selectedItems_report.map(element => {
      if (!(this.marketindex.includes(element["ddm_rmp_lookup_market_id"]))) {
        this.marketindex.push(element["ddm_rmp_lookup_market_id"])
      }
    })
    this.MarketDependencies(this.marketindex)


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

    this.special_identifier = this.lookup.data.special_identifiers
    this.frequency = this.lookup.data.yesNo_frequency
    this.select_frequency = this.lookup.data.report_frequency

    this.select_frequency.map((element) => {
      if (element.report_frequency_values in this.Select) {
        this.Select[element.report_frequency_values].push({
          "select_frequency_values": element.select_frequency_values, "ddm_rmp_lookup_select_frequency_id": element.ddm_rmp_lookup_select_frequency_id
          , "select_frequency_description": element.select_frequency_description
        })
      }
      else {
        this.Select[element.report_frequency_values] = []
        this.Select[element.report_frequency_values].push({ "select_frequency_values": element.select_frequency_values, "ddm_rmp_lookup_select_frequency_id": element.ddm_rmp_lookup_select_frequency_id, "select_frequency_description": element.select_frequency_description })
      }
    })


    this.obj_keys = Object.keys(this.Select)
    this.freq_val = Object.values(this.Select)


    if (this.reportId != 0) {
      this.reportCriteriaCheckbox(this.reportId);
    }
    else {
      this.spinner.hide()
    }

  }



  selectAll(index) {
    var target = ".market_sel_group" + index.toString();
    $(target).prop("checked", "true");
  }

  enableDropdown(group, index) {
    var target_dropdown = "#dropdown" + group.toString() + index.toString();
    var target_dropdown_2 = ".dropdownMenu" + group.toString() + index.toString();

    // $(target_dropdown).on("change",function() {
    // if ($(target_dropdown).prop('checked', true)){
    //         $(target_dropdown_2).removeAttr('disabled');
    //      }
    // else {($(target_dropdown_2).attr('disabled', 'disabled'))}
  }

  toggle_freq(dropdown_id) {
    if (dropdown_id == "frequency0") {
      $(".sub").prop("disabled", false)
    }
    else if (dropdown_id == "frequency1") {
      $(".sub").prop("disabled", true)
      $(".sub").prop("checked", false)
    }

  }


  onItemSelect(item: any) {
    this.selectedItems_report.map(element => {
      if (!(this.marketindex.includes(element["ddm_rmp_lookup_market_id"]))) {
        this.marketindex.push(element["ddm_rmp_lookup_market_id"])
      }
    })
    this.MarketDependencies(this.marketindex)
  }

  onItemDeSelect(item: any) {
    this.marketindex.splice(this.marketindex.indexOf(item.ddm_rmp_lookup_market_id), 1)
    this.MarketDependencies(this.marketindex)
    this.MarketDependenciesDeselect(this.marketindex)
    // if(this.selectedItems_report.length == 0){
    //   this.bacselectedItems_report = []
    // }
  }

  MarketDependenciesDeselect(marketindex: any) {
    this.regionselectedItems_report = this.regionselectedItems_report.filter(element => {
      return this.marketindex.includes(element["ddm_rmp_lookup_market"])
    })
    this.regionindex = []
    if (this.regionselectedItems_report) {
      this.regionselectedItems_report.map(element => {
        // this.regionindex.push(element.ddm_rmp_lookup_country_region_id)
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
        //   this.zone.push(element.ddm_rmp_lookup_region_zone_id)
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
    this.dealernameselectedItems_report = this.dealernameselectedItems_report.filter(element => {
      return this.marketindex.includes(element["ddm_rmp_lookup_market"])
    })
    this.cityselectedItems_report = this.cityselectedItems_report.filter(element => {
      return this.marketindex.includes(element["ddm_rmp_lookup_market"])
    })
    this.stateselectedItems_report = this.stateselectedItems_report.filter(element => {
      return this.marketindex.includes(element["ddm_rmp_lookup_market"])
    })
    this.zipselectedItems_report = this.zipselectedItems_report.filter(element => {
      return this.marketindex.includes(element["ddm_rmp_lookup_market"])
    })
    this.countryselectedItems_report = this.countryselectedItems_report.filter(element => {
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
    this.dealernamedropdownListfinal_report = this.dealernamedropdownList_report.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.citydropdownListfinal_report = this.citydropdownList_report.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.statedropdownListfinal_report = this.statedropdownList_report.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.zipdropdownListfinal_report = this.zipdropdownList_report.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.countrydropdownListfinal_report = this.countrydropdownList_report.filter(element => {
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
  }

  onDeSelectAll(items: any) {
    this.marketindex = []
    this.MarketDependencies(this.marketindex)
    this.MarketDependenciesDeselect(this.marketindex)
    this.regiononItemDeSelectAll(this.regionselectedItems_report)
    this.zoneonDeSelectAll(this.zoneselectedItems_report)
    this.bacselectedItems_report = []
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
  }

  frequencySelected(val, event) {
    if (event.target.checked) {
      this.frequencyData = { "ddm_rmp_lookup_select_frequency_id": val.ddm_rmp_lookup_select_frequency_id, "description": "" };
      this.jsonfinal.select_frequency.push(this.frequencyData);
    }
    else {
      for (var i = 0; i < this.jsonfinal.select_frequency.length; i++) {
        if (this.jsonfinal.select_frequency[i].ddm_rmp_lookup_select_frequency_id == val.ddm_rmp_lookup_select_frequency_id) {
          var index = this.jsonfinal.select_frequency.indexOf(this.jsonfinal.select_frequency[i]);
          this.jsonfinal.select_frequency.splice(index, 1);
        }
      }
    }
  }

  frequencySelectedDropdown(val, event) {
    if (event.target.checked) {
      (<HTMLTextAreaElement>(document.getElementById("drop" + val.ddm_rmp_lookup_select_frequency_id.toString()))).disabled = false
      this.frequencyData = { "id": val.ddm_rmp_lookup_select_frequency_id, "description": "" };
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
      if (this.jsonfinal.select_frequency[i].id == val) {
        this.jsonfinal.select_frequency[i].desc = event.target.value
      }
    }
  }

  checkSelections() {
    console.log('Report service')
    console.log(this.report_id_service)
    console.log(this.contacts)
    if (this.selectedItems_report.length < 1) {
      alert("Select atleast one market to proceed forward")
    }
    else if ($('.check:radio[name="select-freq"]:checked').length < 1) {
      alert("Select Report Frequency")
    }
    else if (this.contacts.length < 1) {
      alert("Add atleast one email in Distribution List to proceed forward")
    }
    else {
      if ($('#frequency0').prop("checked") && $('.sub:checkbox:checked').length < 1) {
        alert("Select Frequency for Ongoing Routine Reports")
      }
      else {
        this.spinner.show()
        this.jsonfinal["market_selection"] = this.selectedItems_report
        this.jsonfinal["division_selection"] = this.divisionselectedItems_report
        this.jsonfinal["country_region_selection"] = this.regionselectedItems_report
        this.jsonfinal["region_zone_selection"] = this.zoneselectedItems_report
        this.jsonfinal["zone_area_selection"] = this.areaselectedItems_report
        this.jsonfinal["bac_selection"] = this.bacselectedItems_report
        this.jsonfinal["gmma_selection"] = this.gmmaselectedItems_report
        this.jsonfinal["lma_selection"] = this.lmaselectedItems_report
        this.jsonfinal["dealer_name_selection"] = this.dealernameselectedItems_report
        this.jsonfinal["city_selection"] = this.cityselectedItems_report
        this.jsonfinal["state_selection"] = this.stateselectedItems_report
        this.jsonfinal["zip_selection"] = this.zipselectedItems_report
        this.jsonfinal["country_selection"] = this.countryselectedItems_report
        this.jsonfinal["user_info_id"] = 1;
        this.jsonfinal["report_id"] = null;
        this.jsonfinal["dl_list"] = this.contacts



        if (this.reportId != 0) {
          this.setSpecialIdentifiers();
          this.setFrequency();
        }



        $('#save').click(function () {
          $('.updateButton').toggle("slide");
        });

        this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
        this.jsonfinal["report_detail"] = { "status": "Pending-Incomplete", "status_date": this.date, "report_type": "", "title": "", "additional_req": "", "created_on": this.date, "on_behalf_of": "", "assigned_to": "", "link_to_results": "", "query_criteria": "", "link_title": "" }

        this.select_report_selection = this.jsonfinal

        this.django.ddm_rmp_report_market_selection(this.select_report_selection).subscribe(response => {
          if (response["message"] == "success") {
            this.report_id_service.changeUpdate(true)
            this.report_id_service.changeSavedChanges(true);
            this.report_id = response["report_data"].ddm_rmp_post_report_id
            localStorage.setItem('request_status_report_id', response["report_data"].ddm_rmp_post_report_id)

          }

          this.generated_report_id = +(response["report_data"]['ddm_rmp_post_report_id'])
          localStorage.setItem('report_id', "" + this.generated_report_id)
          console.log(localStorage.getItem('report_id'))
          this.report_id_service.changeSelection(this.generated_report_id)
          this.report_id_service.changeDivisionSelected(this.divisionselectedItems_report)
          this.generated_report_status = response["report_data"]['status']
          this.report_id_service.changeStatus(this.generated_report_status)
          this.message = "Report " + "#" + localStorage.getItem('report_id')
          //this.messageEvent.emit(this.message)
          this.report_id_service.changeMessage(this.message)
          this.spinner.hide()
          this.toastr.success("Report Created successfully with ReportID : #" + this.generated_report_id, "Success:")
        }, err => {
          this.spinner.hide()
          this.toastr.error("Server problem encountered", "Error:")
        })
      }
      console.log(this.jsonfinal);
    }


  }

  setSpecialIdentifiers() {
    var temp = this.jsonfinal;
    var temp2 = this.jsonUpdate;
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
    $.each($("input[class='sub']:checked"), function () {
      this.identifierData = { "ddm_rmp_lookup_select_frequency_id": $(this).val(), "description": $(this).val() };
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
    if (report_id = localStorage.getItem('request_status_report_id') != null) {
      report_id = localStorage.getItem('request_status_report_id')
    }
    //console.log(repor)
    this.django.get_report_description(report_id, 1).subscribe(element => {
      this.message = "Report " + "#" + report_id
      console.log(element)
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

      this.cityselectedItems_report = [];
      this.citydropdownList_report.forEach(element1 => {
        element["city_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_market'] == element2.ddm_rmp_lookup_market) {
            this.cityselectedItems_report.push(element1)
          }
        })
      })


      this.countryselectedItems_report = [];
      this.countrydropdownList_report.forEach(element1 => {
        element["country_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_market'] == element2.ddm_rmp_lookup_market) {
            this.countryselectedItems_report.push(element1)
          }
        })
      })

      this.zipselectedItems_report = [];
      this.zipdropdownList_report.forEach(element1 => {
        element["zip_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_market'] == element2.ddm_rmp_lookup_market) {
            this.zipselectedItems_report.push(element1)
          }
        })
      })

      this.stateselectedItems_report = [];
      this.statedropdownList_report.forEach(element1 => {
        element["state_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_market'] == element2.ddm_rmp_lookup_market) {
            this.stateselectedItems_report.push(element1)
          }
        })
      })

      this.dealernameselectedItems_report = [];
      this.dealernamedropdownList_report.forEach(element1 => {
        element["dealer_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_market'] == element2.ddm_rmp_lookup_market) {
            this.dealernameselectedItems_report.push(element1)
          }
        })
      })
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
        else if (this.reportId != 0) {
          element["division_dropdown"].map(element2 => {
            if (element1['ddm_rmp_lookup_division_id'] == element2.ddm_rmp_lookup_division) {
              this.divisionselectedItems_report.push(element1)
            }
          })
        }

      })

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

      this.bacselectedItems_report = [];
      this.bacdropdownList_report.forEach(element1 => {
        element["bac_data"].map(element2 => {
          if (element1['ddm_rmp_lookup_bac_id'] == element2.ddm_rmp_lookup_bac) {
            this.bacselectedItems_report.push(element1)
          }
        })
      })



      if (element["frequency_data"].length !== 0) {
        $("#frequency0").prop("checked", true);
        this.toggle_freq("frequency0");
        var subData = element["frequency_data"];
        try {
          for (var x = 0; x <= subData.length - 1; x++) {
            $('.sub').each(function (i, obj) {
              if (subData[x]['ddm_rmp_lookup_select_frequency_id'] == obj.value) {
                obj.checked = true;
              }
            })
          }
        }
        catch (err) {
          // console.log("Error Occ");
        }
      } else {
        this.toggle_freq("frequency1");
        $("#frequency1").prop("checked", true);
      }
      var spCheckData = element["special_identifier_data"];
      try {
        // console.log("Inside");
        for (var x = 0; x <= spCheckData.length; x++) {
          $('.special-checkbox').each(function (index, obj) {
            if (spCheckData[x].ddm_rmp_lookup_special_identifiers == obj.value) {
              obj.checked = true;
            }
          });
        }
      }
      catch (err) {
        //  console.log("Error Occ");
      }
      this.spinner.hide()
    });
  }

}