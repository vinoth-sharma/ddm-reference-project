import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { RepotCriteriaDataService } from "../../services/report-criteria-data.service";
// import $ from 'jquery';
declare var $: any;
import { ToastrService } from "ngx-toastr";
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dealer-allocation',
  templateUrl: './dealer-allocation.component.html',
  styleUrls: ['./dealer-allocation.component.css']
})
export class DealerAllocationComponent implements OnInit {


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
    "user_info_id": "1",
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

  allocation_g = []
  restorepage: any;
  printcontent: any;
  userdivdata;
  allo: any;
  divSel: any;
  reportId = 0;
  pdfGenerationProgress: number;


  constructor(private router: Router, private django: DjangoService, private report_id_service: GeneratedReportService,
    private DatePipe: DatePipe, private spinner: NgxSpinnerService, private dataProvider: DataProviderService, private toastr: ToastrService,
    private reportDataService: RepotCriteriaDataService) {
    this.lookup = dataProvider.getLookupTableData()
    this.allo = this.lookup.data.allocation_grp_da
  }

  ngOnInit() {
    this.reportDataService.getReportID().subscribe(ele => {
      this.reportId = ele;
    });

    if (this.reportId != 0) {
      this.django.get_report_details(1, this.reportId).subscribe(element => {
        this.setDADefaults(element);
      })
    }

    this.report_id_service.currentSelections.subscribe(report_id => {
      this.generated_report_id = report_id
      // console.log("Received Report Id : "+this.generated_report_id)
    })
    this.report_id_service.currentstatus.subscribe(status => {
      this.generated_report_status = status
      // console.log("Received Report Id : "+ this.generated_report_status)
    })

    this.report_id_service.currentDivisionSelected.subscribe(divisions => {
      if (divisions != null) {
        this.divDataSelected = divisions
        // console.log(this.divDataSelected)
      }
      else {
        this.divDataSelected = []
      }
    })


    // this.divDataSelected.map(element =>{
    //   this.divSel.push(element["division_desc"])
    // })
    // console.log("this is it");
    // console.log(this.divSel);


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
      // console.log(this.allocationGroupselecteditems);
    })

    // console.log(this.allo)


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

  getDealerData() {
    this.django.getNewData().subscribe((lookup: any) => {
      this.allo = lookup.allocation_grp_da
    })
  }

  check;
  getDealerAllocatonInfo() {
    this.check = { "value": 1, "id": 2 };

    // console.log(this.division_index);
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
    console.log(this.finalData.concensus_data)
  }


  back() {
    this.router.navigate(["user/submit-request/select-report-criteria"]);
  }

  onItemSelect(item: any) {
    // console.log(item);
  }

  onSelectAll(items: any) {
    // console.log(items);
  }

  //file upload functionality
  files() {
    this.file = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    var formData = new FormData();
    formData.append('display_file', this.file);
    formData.append("ddm_rmp_post_report_id", this.generated_report_id.toString());
    formData.append("ddm_rmp_user_info_id", "1");

    this.spinner.show();
    this.django.ddm_rmp_file_data(formData).subscribe(response => {
      // console.log("success");
      this.spinner.hide()
    });
  }

  dateRangeData() {
    this.date_validation_flag = true
    if (this.startYear > this.endYear) {
      this.flag = false;
      this.date_validation_flag = false
      alert("Please check selected years.");
    }
    else if (this.startYear == this.endYear && this.startValue > this.endValue) {
      alert("Please check the selected months.");
      this.flag = false;
      this.date_validation_flag = false
    }
    else if (this.startYear == this.endYear && this.startValue == this.endValue) {
      if ($("input[name='scycle']:checked").val() == "Cycle2" && $("input[name='ecycle']:checked").val() == "Cycle1") {
        alert("Please select appropriate cycle.");
        this.flag = false;
        this.date_validation_flag = false
      }
    } else {
      this.finalData['concensus_time_date'] = { "startM": this.startMonth, "startY": this.startYear, "endM": this.endMonth, "endY": this.endYear, "startCycle": $("input[name='scycle']:checked").val(), "endCycle": $("input[name='ecycle']:checked").val() };
    }
    // this.dropdownSave()
    // console.log("Data :"+JSON.stringify(this.finalData));

  }



  validateInput() {

    this.dateRangeData();
    console.log(this.startYear === undefined)
    console.log(this.startMonth)
    console.log(this.endYear)
    console.log(this.endMonth)
    console.log(this.finalData.concensus_data)
    console.log(this.selectedItemsModelYear)
    console.log(this.selectedItemsAllocation)


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
    console.log(this.flag)

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
      this.finalData["report_detail"] = { "title": this.Report_title, "additional_req": this.Report_Req, "created_on": "", "report_type": "da", "status": "Pending", "status_date": this.date, "on_behalf_of": "", "assigned_to": "", "link_to_results": "", "query_criteria": "", "link_title": "" }
      console.log(this.finalData)
      // console.log("CData :: "+JSON.stringify(this.finalData));
      this.dealer_allocation_selection = this.finalData
      this.django.ddm_rmp_dealer_allocation_post(this.dealer_allocation_selection).subscribe(response => {
        // this.spinner.hide()
        this.getReportSummery();

        if ((<HTMLInputElement>document.getElementById("attach-file1")).files[0] != null) {
          this.files();
        }
        localStorage.removeItem("report_id")
        this.toastr.success("Report Selections successfully saved for Report Id : #" + this.generated_report_id, "Success:");
        //this.router.navigate(["rmp/request-status"]);
        this.spinner.hide()
      }, err => {
        this.spinner.hide()
        this.toastr.error("Selections are incomplete", "Error:")
      }
      )
      this.report_id_service.changeSavedChanges(false)
    }
  }

  getReportSummery() {

    this.django.get_report_description(this.generated_report_id, 1).subscribe(Response => {
      this.summary = Response
      this.spinner.hide();
      console.log(this.summary)
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
      // console.log("inside check data");
      for (var x = 0; x <= spCheckData.length; x++) {
        $('.events').each(function (index, obj) {
          if (spCheckData[index].ddm_rmp_lookup_da_consensus_data == obj.value) {
            obj.checked = true;
          }
        });
      }
    }
    catch (err) {
      // console.log("Error Occ");
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
    // console.log("fetch Selections");
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

    // console.log("DDATA :: "+JSON.stringify(this.finalData));
  }

  //============================================Pdf function=====================================//
  captureScreen() {
    var data = document.getElementById('dealer-summary-export');
    html2canvas(data).then(canvas => {
      var imageWidth = 208;
      var pageHeight = 295;
      var imageHeight = canvas.height * imageWidth / canvas.width;
      var heightLeft = imageHeight;
      this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
      const contentDataURL = canvas.toDataURL('image/png');
      console.log('Canvas', contentDataURL);
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        pdf.addPage();
        //  console.log('Adding page');
        pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
        this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('Request #' + this.generated_report_id + '.pdf');
    });
  }
}
