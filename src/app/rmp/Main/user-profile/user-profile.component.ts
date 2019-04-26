import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service'
import { MarketselectionService } from 'src/app/rmp/marketselection.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { ToastrService } from "ngx-toastr";
import * as $ from "jquery";


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  selectedValue = {
    'US': {},
    'Canada': {},
    'Export': {}
  };

  market_selection: object;
  user_settings: object;
  //
  market: Array<object>
  division: Array<object>
  region: Array<object>
  zone: Array<object>
  area: Array<object>
  gmma: Array<object>
  lma: Array<object>
  bac: Array<object>


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

  bacdropdownList = [];
  bacselectedItems = [];
  bacdropdownSettings = {};

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
    "contact_no": "",
    "ddm_rmp_user_info_id": 1,
  }


  //

  message: string;
  check: boolean;
  user_info: any;

  market_data: any;
  cellPhone: any;
  date: any;
  lookup;
  marketselections;
  contact_flag = true;
  constructor(private django : DjangoService, private marketService : MarketselectionService,
    private DatePipe : DatePipe, private spinner : NgxSpinnerService,private dataProvider : DataProviderService,
    private toastr: ToastrService){

      this.lookup = this.dataProvider.getLookupData()
      this.getUserMarketInfo();
      // this.dataProvider.userSelectionData.subscribe(response =>{
      //   this.marketselections = response;
      //   console.log(response)
      // });
    }
    
    ngOnInit() {
      //debugger;
      this.spinner.show()
      this.django.division_selected(1).subscribe(response=>{
        this.marketselections = response
        this.UserMarketSelections()
        this.spinner.hide()
      },err=>{
        this.spinner.hide()
      })

  }

  desc(element) {
    this.cellPhone = element
  }

  enableNotificationBox() {
    $("#phone").removeAttr("disabled");
  }

  disableNotificationBox() {
    (<HTMLTextAreaElement>(document.getElementById("phone"))).value = ""
    $("#phone").prop("disabled", "disabled");
    
  }


  getUserMarketInfo() {
    this.spinner.show()

    // console.log(this.lookup)
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
    this.bacdropdownList = this.lookup['bac_data'];
    // console.log(this.bacdropdownList)


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

    this.bacdropdownSettings = {
      text: "BAC",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_bac_id',
      labelKey: 'bac_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll: true,
      enableSearchFilter: true,
      lazyLoading: true
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

    this.dealernamedropdownSettings = {
      text: "DealerName",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "user_profile_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.citydropdownSettings = {
      text: "City",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "user_profile_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.statedropdownSettings = {
      text: "State/Province",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "user_profile_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.zipdropdownSettings = {
      text: "Zip",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "user_profile_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
    };

    this.countrydropdownSettings = {
      text: "Country",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      classes: "user_profile_multiselect"
      //itemsShowLimit: 3,
      //allowSearchFilter: true
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
    // console.log(this.marketselections)
    if (this.marketselections['has_previous_selections']) {
      this.market_selection = this.marketselections
      this.selectedItems = this.market_selection["market_data"]
      this.divisionselectedItems = this.market_selection["division_data"]
      this.regionselectedItems = this.market_selection["country_region_data"]
      this.zoneselectedItems = this.market_selection["region_zone_data"]
      this.areaselectedItems = this.market_selection["zone_area_data"]
      this.bacselectedItems = this.market_selection["bac_data"]
      this.gmmaselectedItems = this.market_selection["gmma_data"]
      this.lmaselectedItems = this.market_selection["lma_data"]
      this.dealernameselectedItems = this.market_selection["dealer_data"]
      this.cityselectedItems = this.market_selection["city_data"]
      this.stateselectedItems = this.market_selection["state_data"]
      this.zipselectedItems = this.market_selection["zip_data"]
      this.countryselectedItems = this.market_selection["country_data"]
      // console.log("User's Previous Selections")
      // console.log(this.dealernameselectedItems)

      this.selectedItems.map(element => {
        if (!(this.marketindex.includes(element["ddm_rmp_lookup_market_id"]))) {
          this.marketindex.push(element["ddm_rmp_lookup_market_id"])
        }
      })
      this.MarketDependencies(this.marketindex)

        this.zoneselectedItems.map(element =>{
          if(!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))){
            this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
          }
        })
        this.zoneSelection(this.zoneindex)
      }
    }
 

getSelectedMarkets(){
  var phoneno = /^\d{10}$/;
    if ($("#notification_no").prop("checked") == true) {
      this.spinner.show()
      this.jsonNotification.contact_no = ""
      this.django.text_notifications_put(this.jsonNotification).subscribe(ele => {
        // this.spinner.hide();
        this.toastr.success("Contact updated successfully")
      }, err => {
        this.spinner.hide();
        this.toastr.error("Connection error");
      })
    }

    else if (this.cellPhone == undefined) {
      alert("Please enter valid 10 digit number")
      this.contact_flag = false;
    }

    else if ((this.cellPhone.match(phoneno))) {
      this.spinner.show()
      this.jsonNotification.contact_no = this.cellPhone
      this.django.text_notifications_put(this.jsonNotification).subscribe(ele => {
        // this.spinner.hide();
        this.toastr.success("Contact updated successfully")
      }, err => {
        this.spinner.hide();
        this.toastr.error("Connection error");
      })
    }
    else {
      alert("Please enter valid 10 digit number")
      this.contact_flag = false
    }
  if (this.contact_flag == false) {
    return
  }

  else if (this.selectedItems.length < 1) {
    alert("Select atleast one market to proceed forward")
  } 
  else {
  this.spinner.show()
  let jsonfinal ={ }
  this.date = "";

  jsonfinal["market_selection"] = this.selectedItems
  jsonfinal["division_selection"] = this.divisionselectedItems
  jsonfinal["country_region_selection"] = this.regionselectedItems
  jsonfinal["region_zone_selection"] = this.zoneselectedItems
  jsonfinal["zone_area_selection"] = this.areaselectedItems
  jsonfinal["bac_selection"] = this.bacselectedItems
  jsonfinal["gmma_selection"] = this.gmmaselectedItems
  jsonfinal["lma_selection"] = this.lmaselectedItems
  jsonfinal["dealer_name_selection"] = this.dealernameselectedItems
  jsonfinal["city_selection"] = this.cityselectedItems
  jsonfinal["state_selection"] = this.stateselectedItems
  jsonfinal["zip_selection"] = this.zipselectedItems
  jsonfinal["country_selection"] = this.countryselectedItems
  jsonfinal["user_info_id"] = 1

  this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
  // console.log(this.date);
  
  let jsontime = {}

  jsonfinal["saved_setting"] = this.date
  jsontime["saved_setting"] =  this.date
  jsontime["ddm_rmp_user_info_id"] = 1

  this.market_selection = jsonfinal
  
  this.user_settings = jsontime

  
  this.django.ddm_rmp_user_market_selections_post_data(this.market_selection).subscribe(response =>{
    // console.log(response)
    this.spinner.hide()
    this.toastr.success("Selection saved successfully")
  },err=>{
    this.spinner.hide()
    this.toastr.error("Server problem encountered","Error:")
  })
  this.spinner.show()
  this.django.user_info_save_setting(this.user_settings).subscribe(response => {
    // console.log("Wanted Response")
    // console.log(response)
    // this.spinner.hide()
  },err=>{
    this.spinner.hide()
  })

    console.log(this.jsonNotification)
    }


      var phoneno = /^\d{10}$/;
      if ($("#notification_no").prop("checked") == true) {
        this.spinner.show()
        this.jsonNotification.contact_no = ""
        this.django.text_notifications_put(this.jsonNotification).subscribe(ele => {
          // this.spinner.hide();
          this.toastr.success("Contact updated successfully")
        }, err => {
          this.spinner.hide();
          this.toastr.error("Connection error");
        })
      }

      else if (this.cellPhone == undefined) {
        alert("Please enter valid 10 digit number")
      }

      else if ((this.cellPhone.match(phoneno))) {
        this.spinner.show()
        this.jsonNotification.contact_no = this.cellPhone
        this.django.text_notifications_put(this.jsonNotification).subscribe(ele => {
          // this.spinner.hide();
          this.toastr.success("Contact updated successfully")
        }, err => {
          this.spinner.hide();
          this.toastr.error("Connection error");
        })
      }
      else {
        alert("Please enter valid 10 digit number")
      }
      console.log(this.jsonNotification)
    
  }

  // updateMarkets(markets){
  //   this.marketService.changeSelection(markets)
  // }


  onItemSelect(item: any) {
    this.selectedItems.map(element => {
      if (!(this.marketindex.includes(element.ddm_rmp_lookup_market_id))) {
        this.marketindex.push(element.ddm_rmp_lookup_market_id)
      }
    })
    this.MarketDependencies(this.marketindex)
  }

  onItemDeSelect(item: any) {
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
    this.dealernameselectedItems = this.dealernameselectedItems.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.cityselectedItems = this.cityselectedItems.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.stateselectedItems = this.stateselectedItems.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.zipselectedItems = this.zipselectedItems.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.countryselectedItems = this.countryselectedItems.filter(element => {
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
    this.dealernamedropdownListfinal = this.dealernamedropdownList.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.citydropdownListfinal = this.citydropdownList.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.statedropdownListfinal = this.statedropdownList.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.zipdropdownListfinal = this.zipdropdownList.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.countrydropdownListfinal = this.countrydropdownList.filter(element => {
      return this.marketindex.includes(element['ddm_rmp_lookup_market'])
    })
    this.lmadropdownListfinal = this.lmadropdownList.filter(element => {
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
    this.regiononItemDeSelectAll(this.regionselectedItems)
    this.zoneonDeSelectAll(this.zoneselectedItems)
    this.bacselectedItems = []
  }

  regiononItemSelect(item: any) {
    this.regionselectedItems.map(element => {
      if (!(this.regionindex.includes(element.ddm_rmp_lookup_country_region_id))) {
        this.regionindex.push(element.ddm_rmp_lookup_country_region_id)
      }
    })
    this.regionSelection(this.regionindex)
  }

  regiononItemDeSelect(item: any) {
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
    // if (this.zoneselectedItems){
    //   if (!(this.zoneindex.includes(element["ddm_rmp_lookup_region_zone_id"]))) {
    //     this.zoneindex.push(element["ddm_rmp_lookup_region_zone_id"])
    //   }
    // }
    // if (this.regionselectedItems){
    //   if (!(this.regionindex.includes(element["ddm_rmp_lookup_country_region_id"]))) {
    //     this.regionindex.push(element["ddm_rmp_lookup_country_region_id"])
    //   }
    // }
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
    this.zoneselectedItems.map(element => {
      if (!(this.zoneindex.includes(element.ddm_rmp_lookup_region_zone_id))) {
        this.zoneindex.push(element.ddm_rmp_lookup_region_zone_id)
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
    this.areadropdownListfinal = this.areadropdownList.filter(element => {
      return this.zoneindex.includes(element.ddm_rmp_lookup_region_zone)
    })
  }
  zoneDeSelection(zoneindex: any) {
    this.areaselectedItems = this.areaselectedItems.filter(element => {
      return this.zoneindex.includes(element.ddm_rmp_lookup_region_zone)
    })
  }

}

