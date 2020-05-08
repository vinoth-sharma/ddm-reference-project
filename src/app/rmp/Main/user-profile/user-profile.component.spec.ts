// Author : Bharath S
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { MaterialModule } from 'src/app/material.module';
import { AngularMultiSelectModule } from 'angular4-multiselect-dropdown/dist/multiselect.component';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { DataProviderService } from '../../data-provider.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { GeneratedReportService } from '../../generated-report.service';
import { DjangoService } from 'src/app/rmp/django.service'
import { of } from 'rxjs';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userdata = {
    user_text_notification_data: {
      first_name: "firstName",
      last_name: "last_name",
      disclaimer_ack: new Date(),
      designation: "designation",
      department: "department",
      email: "email",
      contact_no: "555",
      alternate_number: "666 - 666",
      office_address: "office_address",
      carrier: "carrier"
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [MaterialModule, AngularMultiSelectModule, BrowserAnimationsModule,
        FormsModule, TagInputModule, QuillModule.forRoot({}), HttpClientTestingModule],
      providers: [DatePipe, QuillEditorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  xit("should read current files from data service", async(() => {
    let dataService = TestBed.inject(DataProviderService)

    let files = { list: [{ key: "key" }], flag: "is_admin" }
    dataService.loadLookUpData();
    expect(component.lookup).toBe(files.list)
  }))

  it("should read lookup table data from data service", async(() => {
    let dataService = TestBed.inject(DataProviderService)

    let lookuptabledata = { list: [{ key: "key" }], flag: "is_admin" }
    dataService.changelookUpTableData(lookuptabledata);
    expect(component.content).toBe(lookuptabledata)
  }))

  it("should read user details from auth service", async(() => {

    let userData = { role: "admin" }
    let authSevice = TestBed.inject(AuthenticationService)
    authSevice.myMethod(userData, null, null);
    expect(component.user_role).toBe(userData.role)
  }))

  it("test for notify(), Should set properties of the comp", async(() => {
    component.enable_edits = true;
    let notifySpy = spyOn(component.parentsSubject, "next")
    component.notify();

    expect(component.enable_edits).toBeFalsy();
    expect(component.editModes).toBeTruthy();
    expect(notifySpy).toHaveBeenCalledWith(false);
  }))

  it("should read current saved status from GeneratedReportService", fakeAsync(() => {
    let reportIDService = TestBed.inject(GeneratedReportService);
    reportIDService.changeSaved(true);
    tick();
    expect(component.check_saved_status).toBeTruthy();
    expect(component.changed_settings).toBeFalsy();
  }))

  it("should read data from DjangoService", () => {
    let djangoService = TestBed.inject(DjangoService);

    let djangoSpy = spyOn(djangoService, "division_selected").and.returnValue(of(userdata));
    let notificationSpy = spyOn(component, "enableNotificationBox");
    let UserMarketSelectionsSpy = spyOn(component, "UserMarketSelections");

    component.getUserInfo()
    expect(djangoSpy).toHaveBeenCalledTimes(1)
    expect(component.user_info).toEqual(userdata.user_text_notification_data);
    expect(component.marketselections).toEqual(userdata);
    expect(component.changed_settings).toBeFalsy();
    expect(component.user_info).toEqual(userdata.user_text_notification_data);
    expect(component.user_name).toEqual(userdata.user_text_notification_data.first_name + " " + userdata.user_text_notification_data.last_name);
    expect(component.user_disc_ack).toEqual(userdata.user_text_notification_data.disclaimer_ack);
    expect(component.user_designation).toEqual(userdata.user_text_notification_data.designation);
    expect(component.user_department).toEqual(userdata.user_text_notification_data.department);
    expect(component.user_email).toEqual(userdata.user_text_notification_data.email);
    expect(component.user_contact).toEqual(userdata.user_text_notification_data.contact_no);
    expect(component.text_notification).toEqual(userdata.user_text_notification_data.alternate_number);
    expect(component.text_number).toEqual(" 666");
    expect(component.user_office_address).toEqual(userdata.user_text_notification_data.office_address);
    expect(notificationSpy).toHaveBeenCalled();
    expect(UserMarketSelectionsSpy).toHaveBeenCalled();
  })

  it("textChanged(), it should set paramaters of component based on event", () => {
    component.textChanged({ text: "it is a plain text" });
    expect(component.textChange).toBeTruthy();
    expect(component.enableUpdateData).toBeTruthy();
  })

  it("numberOnly(), it shuold read only numbers", () => {
    expect(component.numberOnly({ which: 57, keyCode: 57 })).toBeTruthy()
    expect(component.numberOnly({ which: 59, keyCode: 59 })).toBeFalsy()
  })

  it("should push data to to server when clicked on save button and update component properties", () => {
    let element = fixture.debugElement.nativeElement;
    let toastr = TestBed.inject(NgToasterComponent)
    let djangoService = TestBed.inject(DjangoService);
    let dataService = TestBed.inject(DataProviderService)

    spyOn(djangoService, "ddm_rmp_landing_page_desc_text_put").and.returnValue(of("abc"))
    spyOn(component, 'ngOnInit');
    let dataServiceSpy = spyOn(dataService, "changelookUpTableData");
    let toastrSpy = spyOn(toastr, "success")
    component.textChange = false;
    component.content = { data: { desc_text: [{ ddm_rmp_desc_text_id: 6, module_name: "What is DDM", description: "nan" }, { ddm_rmp_desc_text_id: 6, module_name: "Help_DDMAdmin", description: "<p>nan vvvv</p>" }] } }
    component.description_text = { description: "", module_name: "", ddm_rmp_desc_text_id: 6 }
    component.naming = "namings"
    component.content_edits();
    expect(component.editModes).toBeFalsy();
    expect(component.readOnlyContentHelper).toBeTruthy();
    expect(component.description_text.description).toEqual("namings");
    expect(component.content.data.desc_text[1]).toEqual(component.description_text);
    expect(dataServiceSpy).toHaveBeenCalled();
    expect(component.original_content).toEqual("namings");
    expect(toastrSpy).toHaveBeenCalled();
  })

  it("edit_True() , Should set properties of the component", () => {
    component.original_content = "original_content";
    component.edit_True();
    expect(component.editModes).toBeFalsy();
    expect(component.readOnlyContentHelper).toBeTruthy();
    expect(component.naming).toBe("original_content");
  })

  it("edit_Enable() , Should set properties of the component", () => {
    component.original_content = "original_content";
    component.editEnable();
    expect(component.editModes).toBeTruthy();
    expect(component.readOnlyContentHelper).toBeFalsy();
    expect(component.naming).toBe("original_content");
  })

  it("should set carrier_value", () => {
    component.carrier("car");
    expect(component.carrier_selected).toEqual("car")
  })

  it("enableNotificationBox() ", () => {
    let element = fixture.debugElement.nativeElement
    component.marketselections = userdata
    component.enableNotificationBox();
    expect(component.changed_settings).toBeTruthy();
    expect(component.text_number).toEqual(" 666")
    expect(component.carrier_selected).toEqual(userdata.user_text_notification_data.carrier);
    expect(element.querySelector("#phone").value).toEqual(" 666");
    expect(element.querySelector("#notification_yes").checked).toEqual(true);
    expect(element.querySelector("#phone").disabled).toEqual(false);
    expect(element.querySelector("#carrier").disabled).toEqual(false);

  })

  it("disable notification box(), set a few properties of component templete", () => {
    let element = fixture.debugElement.nativeElement
    component.disableNotificationBox();
    expect(component.carrier_selected).toEqual("");
    expect(element.querySelector("#notification_no").checked).toEqual(true);
    expect(element.querySelector("#phone").disabled).toEqual(true);
    expect(element.querySelector("#carrier").disabled).toEqual(true);
  })

  it("getUserMarketInfo() , should set properties of component", () => {

    let data = {
      market_data: [{ market: "a" }, { market: "c" }, { market: "b" }],
      dealer_name_data: ["a", "b", "c"],
      city_data: ["a", "b", "c"],
      state_data: ["a", "b", "c"],
      zip_data: ["a", "b", "c"],
      country_data: ["a", "b", "c"],
      division_data: [{ division_desc: "a" }, { division_desc: "b" }, { division_desc: "c" }],
      region_data: [{ region_desc: "a" }, { region_desc: "b" }, { region_desc: "c" }],
      zones_data: [{ zone_desc: "a" }, { zone_desc: "b" }, { zone_desc: "c" }],
      area_data: [{ area_desc: "a" }, { area_desc: "b" }, { area_desc: "c" }],
      gmma_data: [{ gmma_desc: "a" }, { gmma_desc: "b" }, { gmma_desc: "c" }],
      lma_data: [{ lma_data: "a" }, { lma_data: "b" }, { lma_data: "c" }],
    }
    let dropdownSettings = {
      text: "Market",
      singleSelection: false,
      primaryKey: 'ddm_rmp_lookup_market_id',
      labelKey: 'market',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "user_profile_multiselect"
    };

    let regiondropdownSettings = {
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

    let zonedropdownSettings = {
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

    let areadropdownSettings = {
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

    let gmmadropdownSettings = {
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

    let divisiondropdownSettings = {
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

    let lmadropdownSettings = {
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

    component.lookup = data;
    component.getUserMarketInfo();
    expect(component.dropdownList).toEqual(data.market_data);
    expect(component.dealernamedropdownList).toEqual(data.dealer_name_data);
    expect(component.citydropdownList).toEqual(data.city_data);
    expect(component.statedropdownList).toEqual(data.state_data);
    expect(component.zipdropdownList).toEqual(data.zip_data);
    expect(component.countrydropdownList).toEqual(data.country_data);
    expect(component.divisiondropdownList).toEqual(data.division_data);
    expect(component.regiondropdownList).toEqual(data.region_data);
    expect(component.zonedropdownList).toEqual(data.zones_data);
    expect(component.areadropdownList).toEqual(data.area_data);
    expect(component.gmmadropdownList).toEqual(data.gmma_data);
    expect(component.lmadropdownList).toEqual(data.lma_data);
    expect(component.dropdownSettings).toEqual(dropdownSettings)
    expect(component.regiondropdownSettings).toEqual(regiondropdownSettings)
    expect(component.zonedropdownSettings).toEqual(zonedropdownSettings)
    expect(component.areadropdownSettings).toEqual(areadropdownSettings)
    expect(component.gmmadropdownSettings).toEqual(gmmadropdownSettings)
    expect(component.divisiondropdownSettings).toEqual(divisiondropdownSettings)
    expect(component.lmadropdownSettings).toEqual(lmadropdownSettings)
  })

  it("UserMarketSelections(), should set properties of component", () => {
    component.marketselections = {
      market_data: [{ market: "a" }, { market: "c" }, { market: "b" }],
      dealer_name_data: ["a", "b", "c"],
      country_region_data: ["a", "b", "c"],
      state_data: ["a", "b", "c"],
      bac_data: [{ bac_desc: "bac_data" }, "b", "c"],
      country_data: [{ fan_data: "fan_data" }, "b", "c"],
      division_data: [{ division_desc: "a" }, { division_desc: "b" }, { division_desc: "c" }],
      region_zone_data: [{ region_desc: "a" }, { region_desc: "b" }, { region_desc: "c" }],
      zones_zone_area_datadata: [{ zone_desc: "a" }, { zone_desc: "b" }, { zone_desc: "c" }],
      area_data: [{ area_desc: "a" }, { area_desc: "b" }, { area_desc: "c" }],
      gmma_data: [{ gmma_desc: "a" }, { gmma_desc: "b" }, { gmma_desc: "c" }],
      lma_data: [{ lma_data: "a" }, { lma_data: "b" }, { lma_data: "c" }],
      has_previous_selections: true,
      fan_data: [{ fan_data: "fan_data" }, "b", "c"]
    }
    let marketDependenciesSpy = spyOn(component, "MarketDependencies")
    let regionSelectionSpy = spyOn(component, "regionSelection")
    let zoneSelectionSpy = spyOn(component, "zoneSelection")
    component.UserMarketSelections();
    expect(component.changed_settings).toBeFalsy();
    expect(component.market_selection).toEqual(component.marketselections);
    expect(component.selectedItems).toEqual(component.market_selection['market_data']);
    expect(component.divisionselectedItems).toEqual(component.market_selection['division_data']);
    expect(component.zoneselectedItems).toEqual(component.market_selection['region_zone_data']);
    expect(component.areaselectedItems).toEqual(component.market_selection['zone_area_data']);
    expect(component.gmmaselectedItems).toEqual(component.market_selection['gmma_data']);
    expect(component.lmaselectedItems).toEqual(component.market_selection['lma_data']);
    expect(component.bacselectedItems).toEqual('bac_data');
    expect(marketDependenciesSpy).toHaveBeenCalled();
    expect(regionSelectionSpy).toHaveBeenCalled();
    expect(zoneSelectionSpy).toHaveBeenCalled();
  })

  it('sholud toggle type for input field', () => {
    let element = fixture.debugElement.nativeElement;
    console.log("styles", element.querySelector("#phone").style.webkitTextSecurity)
    component.showPassword();
    expect(element.querySelector("#phone").style.webkitTextSecurity).toEqual("none")
  })



  it("sohuld slice the id from marketindex and call market dependencies", () => {
    component.marketindex = [1, 2, 3];
    let marketDepSpy = spyOn(component, "MarketDependencies")
    let marketDepDeSelectSpy = spyOn(component, "MarketDependenciesDeselect")
    let selectedItem = { ddm_rmp_lookup_market_id: 2 }
    component.onItemDeSelect(selectedItem);
    expect(component.changed_settings).toBeTruthy()
    expect(marketDepSpy).toHaveBeenCalledWith([1, 3])
    expect(marketDepDeSelectSpy).toHaveBeenCalledWith([1, 3])

  })


  it("Should set marketindex and call market dependencies", () => {
    component.selectedItems = [{ ddm_rmp_lookup_market_id: 1 }, { ddm_rmp_lookup_market_id: 2 }, { ddm_rmp_lookup_market_id: 3 }]
    let marketDepSpy = spyOn(component, "MarketDependencies")
    component.onItemSelect({});
    expect(component.changed_settings).toBeTruthy()
    expect(marketDepSpy).toHaveBeenCalledWith([1, 2, 3])
  })


  it("market dependencies deselect(), it should set a few properties and call regionDeselection() and regionSelection()",
    () => {
      let dataSet = [{ ddm_rmp_lookup_market: 1 }, { id: 1 }]
      let filterddata = [{ ddm_rmp_lookup_market: 1 }]

      let data = [{ ddm_rmp_lookup_market: 1, ddm_rmp_lookup_country_region_id: 1, ddm_rmp_lookup_region_zone_id: 1 }, { ddm_rmp_lookup_market: 2, ddm_rmp_lookup_country_region_id: 2, ddm_rmp_lookup_region_zone_id: 2 }, { ddm_rmp_lookup_market: 3, ddm_rmp_lookup_country_region_id: 3, ddm_rmp_lookup_region_zone_id: 3 }];
      component.regionselectedItems = data;
      component.marketindex = [1, 2, 3]

      component.zoneselectedItems = data;
      component.gmmaselectedItems = dataSet
      component.divisionselectedItems = dataSet
      component.lmaselectedItems = dataSet
      let marketDepSpy = spyOn(component, "regionDeselection")
      let marketDepDeSelectSpy = spyOn(component, "regionSelection")
      let zonedetectSpy = spyOn(component, "zoneDeSelection")
      let zoneSelectionSpy = spyOn(component, "zoneSelection")
      component.MarketDependenciesDeselect({});
      expect(marketDepSpy).toHaveBeenCalledWith([1, 2, 3]);
      expect(marketDepDeSelectSpy).toHaveBeenCalledWith([1, 2, 3])
      expect(zonedetectSpy).toHaveBeenCalledWith([1, 2, 3]);
      expect(zoneSelectionSpy).toHaveBeenCalledWith([1, 2, 3]);
      expect(component.gmmaselectedItems).toEqual(filterddata)
      expect(component.divisionselectedItems).toEqual(filterddata)
      expect(component.lmaselectedItems).toEqual(filterddata)

    }
  )

  it("MarketDependencies(), should set properties of comp", () => {
    component.marketindex = [1, 2, 3];
    let filterddata = [{ ddm_rmp_lookup_market: 1 }]
    let dataSet = [{ ddm_rmp_lookup_market: 1 }, { id: 1 }]
    component.regiondropdownList = dataSet;
    component.gmmadropdownList = dataSet;
    component.divisiondropdownList = dataSet;
    component.lmadropdownList = dataSet;
    component.MarketDependencies({})
    expect(component.regiondropdownListfinal).toEqual(filterddata)
    expect(component.gmmadropdownListfinal).toEqual(filterddata)
    expect(component.divisiondropdownListfinal).toEqual(filterddata)
    expect(component.lmadropdownListfinal).toEqual(filterddata)
  })

  it("should set maket index and call market dependencies", () => {
    let spy = spyOn(component, "MarketDependencies")
    component.marketindex = [];
    component.onSelectAll([1, 2, 3]);
    expect(component.changed_settings).toBeTruthy();
    expect(spy).toHaveBeenCalledWith([1, 2, 3])
  })

  it("should set maket index and call market dependencies", () => {
    component.zoneselectedItems = [1, 2];
    component.regionselectedItems = [3, 4]
    let spy = spyOn(component, "MarketDependencies");
    let MarketDependenciesDeselectSpy = spyOn(component, "MarketDependenciesDeselect")
    let regiononItemDeSelectAllSpy = spyOn(component, "regiononItemDeSelectAll")
    let zoneonDeSelectAllSpy = spyOn(component, "zoneonDeSelectAll");
    component.onDeSelectAll({})
    expect(component.changed_settings).toBeTruthy();
    expect(component.bacselectedItems).toEqual([]);
    expect(spy).toHaveBeenCalledWith([])
    expect(regiononItemDeSelectAllSpy).toHaveBeenCalledWith([3, 4])
    expect(zoneonDeSelectAllSpy).toHaveBeenCalledWith([1, 2])
  })

  it("it should set segion index and call region selection()", () => {
    let dataSet = [{ ddm_rmp_lookup_country_region_id: 1 }]
    component.regionselectedItems = dataSet;
    let spy = spyOn(component, "regionSelection")
    component.regiononItemSelect({});
    expect(component.changed_settings).toBeTruthy();
    expect(spy).toHaveBeenCalledWith([1])

  })

  it("it should set segion index and call region selection()", () => {
    let dataSet = [{ ddm_rmp_lookup_region_zone_id: 1 }]
    component.regionindex = [1, 2, 3];
    component.zoneselectedItems = dataSet
    let spy = spyOn(component, "regionSelection");
    let dSpy = spyOn(component, "regionDeselection");
    let zoneSelectionSpy = spyOn(component, "zoneSelection");
    let zoneDeSelectionSpy = spyOn(component, "zoneDeSelection");
    component.regiononItemDeSelect({ ddm_rmp_lookup_country_region_id: 2 })
    expect(component.changed_settings).toBeTruthy();
    expect(spy).toHaveBeenCalledWith([1, 3])
    expect(dSpy).toHaveBeenCalledWith([1, 3])
    expect(zoneDeSelectionSpy).toHaveBeenCalledWith([1])
    expect(zoneSelectionSpy).toHaveBeenCalledWith([1])
  })


  it("should set region index and call regionSelection", () => {
    let spy = spyOn(component, "regionSelection")
    component.marketindex = [];
    component.regiononSelectAll([1, 2, 3]);
    expect(component.changed_settings).toBeTruthy();
    expect(spy).toHaveBeenCalledWith([1, 2, 3])
  })

  it("should set maket index and call market dependencies", () => {
    component.zoneselectedItems = [1, 2];
    let spy = spyOn(component, "regionSelection");
    let regionDeselectionSpy = spyOn(component, "regionDeselection")
    let zoneonDeSelectAllSpy = spyOn(component, "zoneonDeSelectAll")
    component.regiononItemDeSelectAll({})
    expect(component.changed_settings).toBeTruthy();
    expect(spy).toHaveBeenCalledWith([])
    expect(regionDeselectionSpy).toHaveBeenCalledWith([])
    expect(zoneonDeSelectAllSpy).toHaveBeenCalledWith([1, 2])
  })

  it("should filter zonedropdownlist", () => {
    component.zonedropdownList = [{ ddm_rmp_lookup_country_region: 1 }, { ddm_rmp_lookup_country_region: 2 }, { ddm_rmp_lookup_country_region: 3 }]
    component.regionindex = [1, 2]
    component.regionSelection({});
    expect(component.zonedropdownListfinal).toEqual([{ ddm_rmp_lookup_country_region: 1 }, { ddm_rmp_lookup_country_region: 2 }])
  })

  it("should filter zoneselectedItems", () => {
    component.zoneselectedItems = [{ ddm_rmp_lookup_country_region: 1 }, { ddm_rmp_lookup_country_region: 2 }, { ddm_rmp_lookup_country_region: 3 }]
    component.regionindex = [1, 2]
    component.regionDeselection({});
    expect(component.zoneselectedItems).toEqual([{ ddm_rmp_lookup_country_region: 1 }, { ddm_rmp_lookup_country_region: 2 }])
  })

  it("should set zone index and call zone selection ", () => {
    component.zoneselectedItems = [{ ddm_rmp_lookup_region_zone_id: 1 }, { ddm_rmp_lookup_region_zone_id: 2 }, { ddm_rmp_lookup_region_zone_id: 3 }]
    component.regionSelection({});
    let spy = spyOn(component, "zoneSelection");
    component.zoneonItemSelect({})
    expect(component.changed_settings).toBeTruthy();
    expect(spy).toHaveBeenCalledWith([1, 2, 3]);
  })


  it("should set zone index and call zone selection and zone deselection", () => {
    component.zoneindex = [1, 2, 3]
    let spy = spyOn(component, "zoneSelection");
    let dspy = spyOn(component, "zoneDeSelection");
    component.zoneonItemDeSelect({ ddm_rmp_lookup_region_zone_id: 2 });
    expect(component.changed_settings).toBeTruthy();

    expect(spy).toHaveBeenCalledWith([1, 3]);
    expect(dspy).toHaveBeenCalledWith([1, 3]);
  })


  it("should set zoneindex and call zoneselection", () => {
    let spy = spyOn(component, "zoneSelection")
    component.zoneonSelectAll([1, 2, 3]);
    expect(component.changed_settings).toBeTruthy();
    expect(spy).toHaveBeenCalledWith([1, 2, 3])
  })


  it("should reset zoneindex and call zoneSelection and zoneDeSelection", () => {
    let spy = spyOn(component, "zoneSelection")
    let dspy = spyOn(component, "zoneDeSelection")

    component.zoneonDeSelectAll({});
    expect(component.changed_settings).toBeTruthy();
    expect(component.zoneindex).toEqual([])
    expect(spy).toHaveBeenCalled();
    expect(dspy).toHaveBeenCalled();

  })

  it("sholud filter areadropdownListfinal", () => {
    component.areadropdownList = [{ ddm_rmp_lookup_region_zone: 1 }, { ddm_rmp_lookup_region_zone: 2 }, { ddm_rmp_lookup_region_zone: 3 }]
    component.zoneindex = [1, 2];
    component.zoneSelection({});
    expect(component.areadropdownListfinal).toEqual([{ ddm_rmp_lookup_region_zone: 1 }, { ddm_rmp_lookup_region_zone: 2 }])
  })

  it("sholud filter areaselectedItems", () => {
    component.areaselectedItems = [{ ddm_rmp_lookup_region_zone: 1 }, { ddm_rmp_lookup_region_zone: 2 }, { ddm_rmp_lookup_region_zone: 3 }]
    component.zoneindex = [1, 2];
    component.zoneDeSelection({});
    expect(component.areaselectedItems).toEqual([{ ddm_rmp_lookup_region_zone: 1 }, { ddm_rmp_lookup_region_zone: 2 }])
  })

  it("saveTriggeronItemSelect() should set changed_settings to true", () => {
    component.saveTriggeronItemSelect({});
    expect(component.changed_settings).toBeTruthy()
  })

  it("saveTriggeronItemDeSelect() should set changed_settings to true", () => {
    component.saveTriggeronItemDeSelect({});
    expect(component.changed_settings).toBeTruthy()
  })

  it("saveTriggeronSelectAll() should set changed_settings to true", () => {
    component.saveTriggeronSelectAll({});
    expect(component.changed_settings).toBeTruthy()
  })

  it("saveTriggeronDeSelectAll() should set changed_settings to true", () => {
    component.saveTriggeronDeSelectAll({});
    expect(component.changed_settings).toBeTruthy()
  })


  it("getNotificationInformation() should read data from input fields and and call text_notifications_put from django service file", async(() => {
    let element = fixture.debugElement.nativeElement;
    element.querySelector("#phone").value = "420420";
    element.querySelector("#carrier").value = "420420";
    element.querySelector("#notification_no").checked = true;
    let djangoService = TestBed.get(DjangoService);
    let spy = spyOn(djangoService, "text_notifications_put").and.returnValue(of({}))
    component.getNotificationInformation();
    expect(component.cellPhone).toEqual("420420");
    expect(component.text_number).toEqual("420420");
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    })
  }))

  it("test for method getSelectedMarkets()", () => {
    let reportIdService = TestBed.get(GeneratedReportService)
    let djangoService = TestBed.get(DjangoService)
    let userMarketSpy = spyOn(djangoService, "ddm_rmp_user_market_selections_post_data").and.returnValue(of({}))
    let reportIdSpy = spyOn(djangoService, "user_info_save_setting");
    component.selectedItems = [1, 2];
    component.divisionselectedItems = [1, 2]
    let dat = {
      market_selection: ["market_selection"],
      division_selection: ["division_selection"],
      country_region_selection: ["country_region_selection"],
      region_zone_selection: ["region_zone_selection"],
      zone_area_selection: ["zone_area_selection"],
      bac_selection: ["bac_selection"],
      gmma_selection: ["gmma_selection"],
      lma_selection: ["lma_selection"],
      fan_selection: ["fan_selection"],
      saved_setting: component.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS'),
    }
    component.selectedItems = dat.market_selection;
    component.divisionselectedItems = dat.division_selection;
    component.regionselectedItems = dat.country_region_selection;
    component.zoneselectedItems = dat.region_zone_selection;
    component.areaselectedItems = dat.zone_area_selection;
    component.bacselectedItems = dat.bac_selection
    component.gmmaselectedItems = dat.gmma_selection
    component.lmaselectedItems = dat.lma_selection
    component.fanselectedItems = dat.fan_selection
    component.getSelectedMarkets();
    dat.saved_setting = component.date
    expect(component.market_selection).toEqual(dat);
    expect(userMarketSpy).toHaveBeenCalledWith(dat);
    expect(reportIdSpy).toHaveBeenCalledWith({ saved_setting: component.date })
    expect(component.changed_settings).toBeFalsy();
  })
});
