import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { RepotCriteriaDataService } from "../../services/report-criteria-data.service";
import "../../../../assets/debug.js";
declare var jsPDF: any;
declare var $: any;

import { ToastrService } from "ngx-toastr";
// declare var jsPDF: any;
import * as Rx from "rxjs";
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';  //CKEDITOR CHANGE 
import { AuthenticationService } from "src/app/authentication.service";

@Component({
  selector: 'app-dealer-allocation',
  templateUrl: './dealer-allocation.component.html',
  styleUrls: ['./dealer-allocation.component.css']
})
export class DealerAllocationComponent implements OnInit, AfterViewInit {


  generated_report_status: string;
  division_index = [];
  dealer_allocation_selection: object;
  user_settings: object;
  allocationGroup: any;
  modelYear: any;
  consensusData: any;
  dropdownLookup: any;
  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  year = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

  title = 'Stand-Alone';

  flag = true
  summary_flag = true
  my_flag = false
  ag_flag = false
  date_flag = false
  consensus_flag = false
  modal_validation_flag = false
  date_validation_flag = true

  concencusDataCheckbox = {};
  startMonth: any;
  endMonth: any;
  startValue: any;
  endValue: any;
  startYear: any;
  endYear: any;
  startCycle: any;
  endCycle: any;
  file = null;

  finalData = {
    "concensus_time_date": {},
    'concensus_data': [],
  };

  newDropdownData = {
    "Model_Year": [],
    "Allocation_Group": []
  }

  Report = {
    "Title": "",
    "Requirements": ""
  }

  selectedItemsDivision = {};
  dropdownSettingsDivision = {};

  selectedItemsModelYear = {};
  dropdownSettingsModelYear = {};

  selectedItems = {};
  dropdownSettings = {};

  Report_title: String;
  Report_Req: String;

  generated_report_id: number;
  display = 'none'

  displaySummary: any;
  cycle: any;
  dropdown: any;
  drop = {};


  dropD: any;
  allocationGroupDrop: any;
  modelYearDrop: any;
  division: any;
  selectedItemsAllocation: any[];
  dropdownSettingsAllocation: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  modelYearSelectedItems: any;
  allocationGroupselecteditems: any;
  divisionRadioSelection: any;
  modelRadio: any;
  alloRadio: any;
  divData: Array<object>;

  date: string;
  report_message: string;
  summary: Object;
  lookup;
  divDataSelected = []
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
  allocation_g = []
  restorepage: any;
  printcontent: any;
  userdivdata;
  allo: any;
  divSel: any;
  reportId = 0;
  pdfGenerationProgress: number;
  frequency_flag : boolean;
  contact_flag : boolean;


  contents;
  enable_edits = false
  editModes = false;
  original_content;
  namings: any;
  public Editor = ClassicEditor;
  editorHelp: any;

  market_description: any;
  zone_description: any;
  area_description: any;
  region_description: any;
  lma_description: any;
  gmma_description: any;
  report_frequency: any;
  special_identifier: any;
  allocation_group: any;
  model_year: any;
  concensus_data: any;
  division_dropdown: any;

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
    description_text = {
      "ddm_rmp_desc_text_id": 11,
      "module_name": "Help_DealerAllocation",
      "description": ""
    }
  user_role : string;
  user_name: string;
  bac_description: any;
  fan_desc: any;
  text_notification: any;

  constructor(private router: Router, private django: DjangoService, private report_id_service: GeneratedReportService,
    private DatePipe: DatePipe,private auth_service:AuthenticationService, 
    private spinner: NgxSpinnerService, private dataProvider: DataProviderService, private toastr: ToastrService,
    private reportDataService: RepotCriteriaDataService) {
      //console.log('local id ' + localStorage.getItem('report_id'))
    // this.lookup = dataProvider.getLookupTableData()
    this.auth_service.myMethod$.subscribe(role =>{
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"]
        this.user_role = role["role"]
      }
    })
    dataProvider.currentlookUpTableData.subscribe(element=>{
      if (element) {
        this.lookup = element
        this.allo = this.lookup.data.allocation_grp_da
        let ref = this.lookup['data']['desc_text']
    let temps = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 11;
    })
    // //console.log(temp);
    if(temps){
      this.original_content = temps.description;
    }
    else{
      this.original_content = ""
    }
    this.namings = this.original_content;

    this.reportDataService.getReportID().subscribe(ele => {
      this.reportId = ele;
    });

    if (this.reportId != 0) {
      // this.django.get_report_details(this.reportId).subscribe(element => {
      //   // this.setDADefaults(element);
      // })
    }

    this.report_id_service.currentSelections.subscribe(report_id => {
      this.generated_report_id = report_id
      // //console.log("Received Report Id : "+this.generated_report_id)
    })
    this.report_id_service.currentstatus.subscribe(status => {
      this.generated_report_status = status
      // //console.log("Received Report Id : "+ this.generated_report_status)
    })

    this.report_id_service.currentDivisionSelected.subscribe(divisions => {
      if (divisions != null) {
        this.divDataSelected = divisions
        // //console.log("these are divisions")
        //console.log(this.divDataSelected)
      }
      else {
        this.divDataSelected = []
      }
    })


    // this.divDataSelected.map(element =>{
    //   this.divSel.push(element["division_desc"])
    // })
    // //console.log("this is it");
    // //console.log(this.divSel);


    if (this.generated_report_id == 0) {
      this.report_message = "";
    }
    else {
      this.report_message = "Request #" + this.generated_report_id + " " + this.generated_report_status
    }
    // this.spinner.show()




    this.divDataSelected.map(element => {
      if (!(this.division_index.includes(element.ddm_rmp_lookup_division_id))) {
        this.division_index.push(element.ddm_rmp_lookup_division_id);
      }

      this.allocationGroupselecteditems = this.allo.filter(element => {
        return this.division_index.includes(element.ddm_rmp_lookup_division)
      })
      // //console.log(this.allocationGroupselecteditems);
    })

    // //console.log(this.allo)


    this.Report_Req = "";
    this.Report_title = "";

    this.selectedItemsDivision = [];
    this.selectedItemsModelYear = [];
    // this.selectedItemsAllocation = [];

    this.dropdownSettingsDivision = {
      singleSelection: false,
      idField: 'ddm_rmp_lookup_division_id',
      textField: 'division_desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettingsModelYear = {
      singleSelection: false,
      idField: 'ddm_rmp_lookup_dropdown_model_year_id',
      textField: 'model_year',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettingsAllocation = {
      singleSelection: false,
      idField: 'ddm_rmp_lookup_dropdown_allocation_group_da_id',
      textField: 'allocation_group',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getDealerAllocatonInfo();
      }
    })
  }

  notify(){
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
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


  ngOnInit() {

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
        if(element['ddm_rmp_desc_text_id']=11){
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

  getDealerData() {
    this.django.getNewData().subscribe((lookup: any) => {
      this.allo = lookup.allocation_grp_da
    })
  }

  check;
  getDealerAllocatonInfo() {
    this.check = { "value": 1, "id": 2 };

    // //console.log(this.division_index);
    this.modelYearSelectedItems = this.lookup.data.model_year;

    this.dropdownLookup = this.lookup.data.drop_downs_da;
    this.consensusData = this.lookup.data.concensus_data_da;
    this.displaySummary = this.lookup.data.display_summary;
    this.cycle = this.lookup.data.cycle_data_da;
    this.cycle = Array.of(this.cycle)
    this.displaySummary = Array.of(this.displaySummary)
    this.consensusData = Array.of(this.consensusData)
    // this.spinner.hide();
    $("#AGDisplay").prop("checked", true);


  }


  startM(val) {
    this.startMonth = val;
    this.startValue = this.month.indexOf(val) + 1;
  }
  startY(val) {
    this.startYear = val;
  }
  endM(val) {
    this.endMonth = val;
    this.endValue = this.month.indexOf(val) + 1;
  }
  endY(val) {
    this.endYear = val;
  }


  concensusData(val, event) {
    if (event.target.checked) {
      this.concencusDataCheckbox = { "value": val.cd_values, "id": val.ddm_rmp_lookup_da_consensus_data_id };
      this.finalData.concensus_data.push(this.concencusDataCheckbox);
    }
    else {
      for (var i = 0; i < this.finalData.concensus_data.length; i++) {
        if (this.finalData.concensus_data[i].id == val.ddm_rmp_lookup_da_consensus_data_id) {
          var index = this.finalData.concensus_data.indexOf(this.finalData.concensus_data[i]);
          this.finalData.concensus_data.splice(index, 1);
        }
      }
    }
    //console.log(this.finalData.concensus_data)
  }


  back() {
    this.router.navigate(["user/submit-request/select-report-criteria"]);
  }

  onItemSelect(item: any) {
    // //console.log(item);
  }

  onSelectAll(items: any) {
    // //console.log(items);
  }

  //file upload functionality
  files() {
    this.file = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    var formData = new FormData();
    formData.append('file_upload', this.file);
    // formData.append("ddm_rmp_post_report_id", this.generated_report_id.toString());
    // formData.append("ddm_rmp_user_info_id", "1");

    this.spinner.show();
    this.django.ddm_rmp_file_data(formData).subscribe(response => {
      // //console.log("success");
      this.spinner.hide()
    },err=>{
      this.spinner.hide();
      console.log(err)
      alert(err);
    });
  }

  dateRangeData() {
    this.date_validation_flag = true
    if (this.startYear > this.endYear) {
      this.flag = false;
      this.date_validation_flag = false;
      document.getElementById("errorModalMessage").innerHTML = "<h5>Please check selected years.</h5>";
      document.getElementById("errorTrigger").click()
      // alert("Please check selected years.");
    }
    else if (this.startYear == this.endYear && this.startValue > this.endValue) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Please check the selected months.</h5>";
      document.getElementById("errorTrigger").click()
      // alert("Please check the selected months.");
      this.flag = false;
      this.date_validation_flag = false;
    }
    else if (this.startYear == this.endYear && this.startValue == this.endValue) {
      if ($("input[name='scycle']:checked").val() == "Cycle2" && $("input[name='ecycle']:checked").val() == "Cycle1") {
        document.getElementById("errorModalMessage").innerHTML = "<h5>Please select appropriate cycle.</h5>";
        document.getElementById("errorTrigger").click()
        // alert("Please select appropriate cycle.");
        this.flag = false;
        this.date_validation_flag = false
      }
    } else {
      this.finalData['concensus_time_date'] = { "startM": this.startMonth, "startY": this.startYear, "endM": this.endMonth, "endY": this.endYear, "startCycle": $("input[name='scycle']:checked").val(), "endCycle": $("input[name='ecycle']:checked").val() };
    }
    // this.dropdownSave()
    // //console.log("Data :"+JSON.stringify(this.finalData));

  }



  validateInput() {

    this.dateRangeData();
    //console.log(this.startYear === undefined)
    //console.log(this.startMonth)
    //console.log(this.endYear)
    //console.log(this.endMonth)
    //console.log(this.finalData.concensus_data)
    //console.log(this.selectedItemsModelYear)
    //console.log(this.selectedItemsAllocation)


    if (this.startYear === undefined || this.startMonth === undefined || this.endYear === undefined || this.endMonth === undefined) {
      // alert("Please make date time range selections")
      this.flag = false;
      this.date_flag = true;
    }

    else {
      this.date_flag = false;
    }

    if (Object.keys(this.finalData.concensus_data).length == 0) {
      // alert("Please make consensus data selections")
      this.flag = false;
      this.consensus_flag = true;

    }

    else {
      this.consensus_flag = false;
    }

    if (this.selectedItemsModelYear === undefined || Object.keys(this.selectedItemsModelYear).length == 0) {
      // alert("Please select model year(s)")
      this.flag = false;
      this.my_flag = true;
    }

    else {
      this.my_flag = false;
    }

    if (this.selectedItemsAllocation === undefined || Object.keys(this.selectedItemsAllocation).length == 0) {
      // alert("Please select allocation group(s)")
      this.flag = false;
      this.ag_flag = true;
    }

    else {
      this.ag_flag = false;
    }

    if (this.date_flag == false && this.consensus_flag == false && this.my_flag == false && this.ag_flag == false && this.date_validation_flag == true) {
      this.flag = true
    }
    //console.log(this.flag)

  }


  dropdownSave() {
    if (this.Report_title == "" || this.Report_Req == "") {
      this.modal_validation_flag = true;
      this.summary_flag = false;
    }

    else {
      this.summary_flag = true;
      $("#review_close:button").click()
      this.modal_validation_flag = false;
      this.spinner.show();
      this.finalData["model_year"] = { "dropdown": this.selectedItemsModelYear, "radio_button": $("input[name=modelradio]:checked").val() }
      this.finalData["allocation_group"] = { "dropdown": this.selectedItemsAllocation, "radio_button": $("input[name=alloradio]:checked").val() }
      this.finalData["division_selected"] = { "radio_button": $("input[name=divradio]:checked").val() }
      this.finalData["report_id"] = this.generated_report_id;
      if (this.reportId != 0) {
        this.getDADefaultSelection();
      }
      this.date = "";
      this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
      this.finalData["report_detail"] = { "title": this.Report_title, "additional_req": this.Report_Req, "created_on": "", "report_type": "da", "status": "Pending", "status_date": this.date, "on_behalf_of": "", "assigned_to": "", "link_to_results": "", "query_criteria": "", "link_title": "", "requestor": this.user_name }
      //console.log(this.finalData)
      // //console.log("CData :: "+JSON.stringify(this.finalData));
      this.dealer_allocation_selection = this.finalData
      this.django.ddm_rmp_dealer_allocation_post(this.dealer_allocation_selection).subscribe(response => {
        // this.spinner.hide()
        this.getReportSummery();

        if ((<HTMLInputElement>document.getElementById("attach-file1")).files[0] != null) {
          this.files();
        }
        localStorage.removeItem("report_id")
        this.report_id_service.changeUpdate(false)
        this.toastr.success("Report Selections successfully saved for Report Id : #" + this.generated_report_id, "Success:");
        //this.router.navigate(["rmp/request-status"]);
        // this.spinner.hide()
      }, err => {
        this.spinner.hide()
        this.toastr.error("Selections are incomplete", "Error:")
      }
      )
      this.report_id_service.changeSavedChanges(false)
    }
  }

  getReportSummery() {
    this.spinner.show();
    this.django.get_report_description(this.generated_report_id).subscribe(Response => {
      this.summary = Response
      let tempArray = []
      if(this.summary["market_data"].length != 0){
        if(this.summary["market_data"] == []) {
          this.market_description = []
        } else {
          this.summary["market_data"].map(element => {
            tempArray.push(element.market)
          })
        }
        this.market_description = tempArray.join(", ");
        console.log("Market Description");
        console.log(this.market_description);
      }
      tempArray = []
      if(this.summary["country_region_data"].length != 0){
        if(this.summary["country_region_data"] == []) {
          this.region_description = []
        } else {
          this.summary["country_region_data"].map(element => {
            tempArray.push(element.region_desc)
          })
        }
        this.region_description = tempArray.join(", ");
        console.log("Region Description");
        console.log(this.region_description);
      }
      tempArray = []
      if(this.summary["region_zone_data"].length != 0){
        if(this.summary["region_zone_data"] == []) {
          this.zone_description = []
        } else {
          this.summary["region_zone_data"].map(element => {
            tempArray.push(element.zone_desc)
          })
        }
        this.zone_description = tempArray.join(", ");
      }
      tempArray = []
      if(this.summary["zone_area_data"].length != 0){
        if(this.summary["zone_area_data"] == []) {
          this.area_description = []
        } else {
          this.summary["zone_area_data"].map(element => {
            tempArray.push(element.area_desc)
          })
        }
        this.area_description = tempArray.join(", ");
      }
      tempArray = []
      if(this.summary["lma_data"].length != 0){
        if(this.summary["lma_data"] == []) {
          this.lma_description = []
        } else {
          this.summary["lma_data"].map(element => {
            tempArray.push(element.lmg_desc)
          })
        }
        this.lma_description = tempArray.join(", ");
      }
      tempArray = []
      if(this.summary["gmma_data"].length != 0){
        if(this.summary["gmma_data"] == []) {
          this.gmma_description = []
        } else {
          this.summary["gmma_data"].map(element => {
            tempArray.push(element.gmma_desc)
          })
        }
        this.gmma_description = tempArray.join(", ");
      }
      tempArray = []
      if(this.summary["frequency_data"].length != 0){
        if(this.summary["frequency_data"] == []) {
          this.report_frequency = []
        } else {
          this.summary["frequency_data"].map(element => {
              if(element.description!='')
              {
              tempArray.push(element.select_frequency_values+"-"+element.description)
              console.log("Check null" + element.description)
              }
              else {
              tempArray.push(element.select_frequency_values)
              }
          })
        }
        this.report_frequency = tempArray.join(", ");
      }
      tempArray = []
      if(this.summary["special_identifier_data"].length != 0){
        if(this.summary["special_identifier_data"] == []) {
          this.special_identifier = []
        } else {
          this.summary["special_identifier_data"].map(element => {
            tempArray.push(element.spl_desc)
          })
        }
        this.special_identifier = tempArray.join(", ");
      }
      tempArray = []
      if(this.summary["division_dropdown"].length != 0){
        if(this.summary["division_dropdown"] == []) {
          this.division_dropdown = []
        } else {
          this.summary["division_dropdown"].map(element => {
            tempArray.push(element.division_desc)
          })
        }
        this.division_dropdown = tempArray.join(", ");
      }
      tempArray = []
      if(this.summary["da_data"]["allocation_grp"].length != 0){
        if(this.summary["da_data"]["allocation_grp"] == []) {
          this.allocation_group = []
        } else {
          this.summary["da_data"]["allocation_grp"].map(element => {
            tempArray.push(element.allocation_group)
          })
        }
        this.allocation_group = tempArray.join(", ");
        console.log("Allocation Group");
        console.log(this.allocation_group);
      }
      tempArray = []
      if(this.summary["da_data"]["model_year"].length != 0){
        if(this.summary["da_data"]["model_year"] == []) {
          this.model_year = []
        } else {
          this.summary["da_data"]["model_year"].map(element => {
            tempArray.push(element.model_year)
          })
        }
        this.model_year = tempArray.join(", ");
      }
      tempArray = []
      if(this.summary["da_data"]["concensus_data"].length != 0){
        if(this.summary["da_data"]["concensus_data"] == []) {
          this.concensus_data = []
        } else {
          this.summary["da_data"]["concensus_data"].map(element => {
            tempArray.push(element.cd_values)
          })
        }
        this.concensus_data = tempArray.join(", ");
      }
      if(this.summary["bac_data"].length != 0){
        if(this.summary["bac_data"][0]["bac_desc"] == null) {
          this.bac_description = []
        } else {
          this.bac_description = (this.summary["bac_data"][0].bac_desc).join(", ");
        }
      }
      else{
        this.bac_description = []
      }

      if(this.summary["fan_data"].length != 0){
        if (this.summary["fan_data"][0]["fan_data"] == null) {
          this.fan_desc = []
        } else {
          this.fan_desc = this.summary["fan_data"][0].fan_data.join(", ");
        }
      }
      else{
        this.fan_desc = []
      }
      this.text_notification = this.summary["user_data"][0]['alternate_number'];
      console.log(this.text_notification);
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
    })
  }

  changeReportMessage() {
    this.report_message = "";
    this.report_id_service.changeMessage("");
    this.router.navigate(["user/request-status"]);
    this.report_id_service.changeButtonStatus(true)
  }

  printDiv() {
    this.restorepage = document.body.innerHTML;
    this.printcontent = document.getElementById('editable').innerHTML;
    document.body.innerHTML = this.printcontent;
    window.print();
    document.body.innerHTML = this.restorepage;
    location.reload(true);
  }


  //Set default details for Dealer Allocation

  setDADefaults(ele) {
    var spCheckData = ele.da_data.concensus_data;
    try {
      // //console.log("inside check data");
      for (var x = 0; x <= spCheckData.length; x++) {
        $('.events').each(function (index, obj) {
          if (spCheckData[index].ddm_rmp_lookup_da_consensus_data == obj.value) {
            obj.checked = true;
          }
        });
      }
    }
    catch (err) {
      // //console.log("Error Occ");
    }
    var dateData = ele.da_data.concensus_time_date[0];
    $('#Smonth').val(dateData.ddm_rmp_start_month);
    $('#Syear').val(dateData.ddm_rmp_start_year);
    $('#Emonth').val(dateData.ddm_rmp_end_month);
    $('#Eyear').val(dateData.ddm_rmp_start_year);

    if (dateData.ddm_rmp_start_cycle == 'Cycle1') {
      $("#SCycle1").prop("checked", true);
    } else {
      $("#SCycle2").prop("checked", true);
    }

    if (dateData.ddm_rmp_end_cycle == 'Cycle1') {
      $("#ECycle1").prop("checked", true);
    } else {
      $("#ECycle2").prop("checked", true);
    }


  }


  getDADefaultSelection() {
    // //console.log("fetch Selections");
    var temp = this.finalData;
    $.each($("input[class='events']:checked"), function () {
      this.concencusDataCheckbox = { "id": $(this).val(), "value": $(this).val() };
      temp.concensus_data.push(this.concencusDataCheckbox);
    });

    this.finalData = temp;

    var SMonth = $('#Smonth').val();
    var EMonth = $('#Emonth').val();
    var SYear = $('#Syear').val();
    var EYear = $('#Eyear').val();
    var SCycle = $("input:radio[name=scycle]:checked").val();
    var ECycle = $("input:radio[name=ecycle]:checked").val();

    this.finalData['concensus_time_date'] = { "startM": SMonth, "startY": SYear, "endM": EMonth, "endY": EYear, "startCycle": SCycle, "endCycle": ECycle };

    // //console.log("DDATA :: "+JSON.stringify(this.finalData));
  }

  //============================================Pdf function=====================================//
  // captureScreen() {
  //   var data = document.getElementById('dealer-summary-export');
  //   html2canvas(data).then(canvas => {
  //     var imageWidth = 208;
  //     var pageHeight = 295;
  //     var imageHeight = canvas.height * imageWidth / canvas.width;
  //     var heightLeft = imageHeight;
  //     this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
  //     const contentDataURL = canvas.toDataURL('image/png');
  //     //console.log('Canvas', contentDataURL);
  //     let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
  //     var position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
  //     heightLeft -= pageHeight;
  //     while (heightLeft >= 0) {
  //       pdf.addPage();
  //       //  //console.log('Adding page');
  //       pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
  //       this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
  //       heightLeft -= pageHeight;
  //     }
  //     PdfUtility.saveBlob(pdf.output('blob'), 'Request #' + this.generated_report_id + '.pdf');
  //    // pdf.save('Request #' + this.generated_report_id + '.pdf');
  //   }).catch(error => {
  //     //console.log(error);
  //   });
  // }
      // captureScreen() {
        
      //   var pdfsize = 'a4';
      //       var pdf = new jsPDF('landscape', 'pt', pdfsize);
      //       // source=$('#editable')[0];
      //       pdf.setFontType("bold");
      //       pdf.setFontSize(12); // we support special element handlers. Register them with jQuery-style 
      //       // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
      //       // There is no support for any other type of selectors 
      //       // (class, of compound) at this time.
      //       // this.debug.specialElementHandlers = {
      //       //     // element with id of "bypass" - jQuery style selector
      //       //     '#bypassme': function(element, renderer) {
      //       //         // true = "handled elsewhere, bypass text extraction"
      //       //         return true
      //       //     }
      //       // };
      //       let margins = {
      //           top: 20,
      //           bottom: 20,
      //           left: 60,
      //           right:10,
      //           width:1000,
      //       };
            
            
            
      //       // all coords and widths are in jsPDF instance's declared units
      //       // 'inches' in this case
            
      //       pdf.fromHTML(
      //       		document.body,
      //              // HTML string or DOM elem ref.
      //               margins.left, // x coord
      //               margins.top, {// y coord
      //                   'width': margins.width // max width of content on PDF
      //                   // 'elementHandlers': this.debug.specialElementHandlers
      //               },
             
      //       function(dispose) {
      //           // dispose: object with X, Y of the last line add to the PDF 
      //           //          this allow the insertion of new lines after html
      //           pdf.save('RMP.pdf');
      //       }
      //       , margins);

      // }

      captureScreen() {
        var specialElementHandlers = {
          '#editor': function (element,renderer) {
              return true;
          }
      };
      var doc = new jsPDF();
      doc.setFont("arial");
      doc.lineHeightProportion = 2;
          doc.fromHTML(
              $('#print').html(), 15, 15, 
              { 'width': 170, 'elementHandlers': specialElementHandlers }, 
              function(){ doc.save('sample-file.pdf');}
        
          )
      }
    }