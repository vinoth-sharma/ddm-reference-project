import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { ReportCriteriaDataService } from "../../services/report-criteria-data.service";
import "../../../../assets/debug.js";
declare var jsPDF: any;
declare var $: any;
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import Utils from 'src/utils';

@Component({
  selector: 'app-dealer-allocation',
  templateUrl: './dealer-allocation.component.html',
  styleUrls: ['./dealer-allocation.component.css']
})
export class DealerAllocationComponent implements OnInit, AfterViewInit {
  // @ViewChild("consensusDataRef") consensusCheckBox : HTMLElement;
  public generated_report_status: string;
  public division_index = [];
  public dealer_allocation_selection: object;
  public user_settings: object;
  public allocationGroup: any;
  public modelYear: any;
  public consensusData: any;
  public dropdownLookup: any;
  public month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  public year = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

  public title = 'Stand-Alone';
  public flag: boolean = true;
  public summary_flag: boolean = true;
  public my_flag: boolean = false;
  public ag_flag: boolean = false;
  public date_flag: boolean = false;
  public consensus_flag: boolean = false;
  public modal_validation_flag: boolean = false;
  public date_validation_flag: boolean = true;
  public concencusDataCheckbox = {};
  public startMonth: "--Select Month--";
  public endMonth: "--Select Month--";
  public startValue: any;
  public endValue: any;
  public startYear: "--Select Year--";
  public endYear: "--Select Year--";
  public dealerobj = {
    "startCycle": "Cycle1",
    "endCycle": "Cycle2",
    "dealerRadio": "Display",
    "modelRadio": "Display",
    "alloRadio": "Display"
  }
  public file = null;

  public finalData = {
    "concensus_time_date": {},
    'concensus_data': [],
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
  };

  public newDropdownData = {
    "Model_Year": [],
    "Allocation_Group": []
  }

  public Report = {
    "Title": "",
    "Requirements": ""
  }
  public textChange = false;

  public selectedItemsDivision = {};
  public dropdownSettingsDivision = {};
  public selectedItemsModelYear = [];
  public dropdownSettingsModelYear = {};
  public selectedItems = {};
  public dropdownSettings = {};
  public Report_title: string;
  public Report_Req: string;
  public generated_report_id: number;
  public display = 'none'
  public displaySummary: any;
  public cycle: any;
  public dropdown: any;
  public drop = {};
  public dropD: any;
  public allocationGroupDrop: any;
  public modelYearDrop: any;
  public division: any;
  public selectedItemsAllocation: any[];
  public dropdownSettingsAllocation: { singleSelection: boolean; primaryKey: string; labelKey: string; selectAllText: string; unSelectAllText: string; badgeShowLimit: number; allowSearchFilter: boolean; };
  public modelYearSelectedItems: any;
  public allocationGroupselecteditems: any;
  public divisionRadioSelection: any;
  public modelRadio: any;
  public alloRadio: any;
  public divData: Array<object>;

  public date: string = '';
  public report_message: string = '';
  public summary: Object;
  public lookup;
  public divDataSelected = [];
  public allocation_g = []
  public restorepage: any;
  public printcontent: any;
  public userdivdata;
  public allo: any;
  public divSel: any;
  public reportId = 0;
  public pdfGenerationProgress: number;
  public frequency_flag: boolean;
  public contact_flag: boolean;

  public contents;
  public enable_edits: boolean = false
  public editModes: boolean = false;
  public original_content;
  public namings: any;

  public market_description: any;
  public zone_description: any;
  public area_description: any;
  public region_description: any;
  public lma_description: any;
  public gmma_description: any;
  public report_frequency: any;
  public special_identifier: any;
  public allocation_group: any;
  public model_year: any;
  public concensus_data: any;
  public division_dropdown: any;
  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_text = {
    "ddm_rmp_desc_text_id": 11,
    "module_name": "Help_DealerAllocation",
    "description": ""
  }

  public user_role: string;
  public user_name: string;
  public bac_description: any;
  public fan_desc: any;
  public text_notification: any;
  public model_year_id = [];
  public selectedMonth: any;
  public report_status: string;
  public report_create: any;
  public report_on_behalf = "";
  public assigned_to: any;
  public readOnlyContentHelper = true;
  public enableUpdateData: boolean = false;
  public check: any = {};

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
  public styling = {
    maxHeight: '300px',
    height: 'auto'
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

  constructor(private router: Router, private django: DjangoService, private report_id_service: GeneratedReportService,
    private DatePipe: DatePipe, private auth_service: AuthenticationService, private dataProvider: DataProviderService,
    private toastr: NgToasterComponent,
    private reportDataService: ReportCriteriaDataService) {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"]
        this.user_role = role["role"]
      }
    })
    dataProvider.currentlookUpTableData.subscribe(element => {

      if (element) {
        this.lookup = element
        this.allo = this.lookup.data.allocation_grp_da.sort((a, b) => a.allocation_group > b.allocation_group ? 1 : -1);
        let ref = this.lookup['data']['desc_text']
        let temps = ref.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 11;
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

        if (this.reportId != 0) {
        }

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
        if (this.generated_report_id == 0) {
          this.report_message = "";
        }
        else {
          this.report_message = "Request #" + this.generated_report_id + " " + this.generated_report_status
        }

        this.divDataSelected.map(element => {
          if (!(this.division_index.includes(element.ddm_rmp_lookup_division_id))) {
            this.division_index.push(element.ddm_rmp_lookup_division_id);
          }

          this.allocationGroupselecteditems = this.allo.filter(element => {
            return this.division_index.includes(element.ddm_rmp_lookup_division)
          })
        })

        this.Report_Req = "";
        this.Report_title = "";

        this.selectedItemsDivision = [];
        this.selectedItemsModelYear = [];

        this.dropdownSettingsDivision = {
          singleSelection: false,
          primaryKey: 'ddm_rmp_lookup_division_id',
          labelKey: 'division_desc',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          badgeShowLimit: 3,
          allowSearchFilter: true
        };

        this.dropdownSettingsModelYear = {
          singleSelection: false,
          primaryKey: 'ddm_rmp_lookup_dropdown_model_year_id',
          labelKey: 'model_year',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          badgeShowLimit: 3,
          allowSearchFilter: true
        };

        this.dropdownSettingsAllocation = {
          singleSelection: false,
          primaryKey: 'ddm_rmp_lookup_dropdown_allocation_group_da_id',
          labelKey: 'allocation_group',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          badgeShowLimit: 3,
          allowSearchFilter: true
        };
        this.getDealerAllocatonInfo();

        if (localStorage.getItem('report_id')) {
          Utils.showSpinner();
          this.previousSelections(localStorage.getItem('report_id'));
        }
        else {
          Utils.hideSpinner();
        }
      }


    })
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
        this.lookup['data']['desc_text'] = temp_desc_text
        this.dataProvider.changelookUpTableData(this.lookup)
        this.editModes = false;
        this.ngOnInit()
        this.original_content = this.namings;
        Utils.hideSpinner();
      }, err => {
        Utils.hideSpinner();
      })
    } else {
      this.toastr.error("Please enter the data");
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

  ngOnInit() {
    $('#dropdownHolder').find('angular4-multiselect').find('col-sm-12');
  }

  public getDealerData() {
    this.django.getNewData().subscribe((lookup: any) => {
      this.allo = lookup.allocation_grp_da
    })
  }


  public getDealerAllocatonInfo() {
    this.check = { "value": 1, "id": 2 };
    this.modelYearSelectedItems = this.lookup.data.model_year;
    this.dropdownLookup = this.lookup.data.drop_downs_da;
    this.consensusData = this.lookup.data.concensus_data_da;
    this.displaySummary = this.lookup.data.display_summary;
    this.cycle = this.lookup.data.cycle_data_da;
    this.cycle = Array.of(this.cycle)
    this.displaySummary = Array.of(this.displaySummary)
    this.consensusData = Array.of(this.consensusData)
    $("#AGDisplay").prop("checked", true);
  }

  public startM(val) {
    this.startMonth = val;
    this.startValue = this.month.indexOf(val) + 1;
  }
  public startY(val) {
    this.startYear = val;
  }
  public endM(val) {
    this.endMonth = val;
    this.endValue = this.month.indexOf(val) + 1;
  }
  public endY(val) {
    this.endYear = val;
  }

  public concensusData(val, event) {
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
  }

  public back() {
    this.router.navigate(["user/submit-request/select-report-criteria"]);
  }

  public onItemSelect(item: any) { }

  public onSelectAll(items: any) { }

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

  public dateRangeData() {
    this.date_validation_flag = true
    if (this.startYear > this.endYear) {
      this.flag = false;
      this.date_validation_flag = false;
      document.getElementById("errorModalMessage").innerHTML = "<h5>Please check selected years.</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if (this.startYear == this.endYear && this.startValue > this.endValue) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Please check the selected months.</h5>";
      document.getElementById("errorTrigger").click()
      this.flag = false;
      this.date_validation_flag = false;
    }
    else if (this.startYear == this.endYear && this.startValue == this.endValue) {
      if (this.dealerobj.startCycle == "Cycle2" && this.dealerobj.endCycle == "Cycle1") {
        document.getElementById("errorModalMessage").innerHTML = "<h5>Please select appropriate cycle.</h5>";
        document.getElementById("errorTrigger").click()
        this.flag = false;
        this.date_validation_flag = false
      }
    } else {
      this.finalData['concensus_time_date'] = { "startM": this.startMonth, "startY": this.startYear, "endM": this.endMonth, "endY": this.endYear, "startCycle": this.dealerobj.startCycle, "endCycle": this.dealerobj.endCycle };
    }
  }

  public validateInput() {
    this.dateRangeData();

    if (this.startYear === undefined || this.startMonth === undefined || this.endYear === undefined || this.endMonth === undefined) {
      this.flag = false;
      this.date_flag = true;
    }
    else {
      this.date_flag = false;
    }
    if (Object.keys(this.finalData.concensus_data).length == 0) {
      this.flag = false;
      this.consensus_flag = true;
    }
    else {
      this.consensus_flag = false;
    }
    if (this.selectedItemsModelYear === undefined || Object.keys(this.selectedItemsModelYear).length == 0) {
      this.flag = false;
      this.my_flag = true;
    }
    else {
      this.my_flag = false;
    }
    if (this.selectedItemsAllocation === undefined || Object.keys(this.selectedItemsAllocation).length == 0) {
      this.flag = false;
      this.ag_flag = true;
    }
    else {
      this.ag_flag = false;
    }

    if (this.date_flag == false && this.consensus_flag == false && this.my_flag == false && this.ag_flag == false && this.date_validation_flag == true) {
      this.flag = true
    }
  }

  public dropdownSave() {
    if (this.Report_title == "" || this.Report_Req == "") {
      this.modal_validation_flag = true;
      this.summary_flag = false;
    }
    else {
      this.summary_flag = true;
      $("#review_close:button").click()
      this.modal_validation_flag = false;
      Utils.showSpinner();
      this.finalData["model_year"] = { "dropdown": this.selectedItemsModelYear, "radio_button": this.dealerobj.modelRadio }
      this.finalData["allocation_group"] = { "dropdown": this.selectedItemsAllocation, "radio_button": this.dealerobj.alloRadio }
      this.finalData["division_selected"] = { "radio_button": this.dealerobj.dealerRadio }
      this.finalData["report_id"] = this.generated_report_id;
      if (this.reportId != 0) {
        this.getDADefaultSelection();
      }

      if (this.report_create == null || this.report_create == "" || this.report_create == undefined) {
        this.finalData['report_detail']['created_on'] = "";
        this.report_create = "";
      }

      if (this.assigned_to == null || this.assigned_to == "" || this.assigned_to == undefined) {
        this.finalData['report_detail']['assigned_to'] == "";
        this.assigned_to = "";
      }

      if (this.report_status == "" || this.report_status == null || this.report_status == undefined) {
        this.finalData['report_detail']['status'] = "Pending"
        this.report_status = "Pending"
      }


      this.date = "";
      this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
      this.finalData["report_detail"] = {
        "title": this.Report_title,
        "assigned_to": this.assigned_to,
        "additional_req": this.Report_Req,
        "created_on": this.report_create,
        "report_type": "da",
        "status": this.report_status,
        "status_date": this.date,
        "on_behalf_of": this.report_on_behalf,
        "link_to_results": "",
        "query_criteria": "",
        "link_title": "",
        "requestor": this.user_name
      }
      this.dealer_allocation_selection = this.finalData
      this.django.ddm_rmp_dealer_allocation_post(this.dealer_allocation_selection).subscribe(response => {
        this.getReportSummery();
        if ((<HTMLInputElement>document.getElementById("attach-file1")).files[0] != null) {
          this.files();
        }
        localStorage.removeItem("report_id")
        this.report_id_service.changeUpdate(false)
        this.toastr.success("Report Selections successfully saved for Report Id : #" + this.generated_report_id);
      }, err => {
        Utils.hideSpinner();
        this.toastr.error("Selections are incomplete");
      }
      )
      this.report_id_service.changeSavedChanges(false)
    }
  }

  public getReportSummery() {
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
      if (this.summary["da_data"]["allocation_grp"].length != 0) {
        if (this.summary["da_data"]["allocation_grp"] == []) {
          this.allocation_group = []
        } else {
          this.summary["da_data"]["allocation_grp"].map(element => {
            tempArray.push(element.allocation_group)
          })
        }
        this.allocation_group = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["da_data"]["model_year"].length != 0) {
        if (this.summary["da_data"]["model_year"] == []) {
          this.model_year = []
        } else {
          this.summary["da_data"]["model_year"].map(element => {
            tempArray.push(element.model_year)
          })
        }
        this.model_year = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["da_data"]["concensus_data"].length != 0) {
        if (this.summary["da_data"]["concensus_data"] == []) {
          this.concensus_data = []
        } else {
          this.summary["da_data"]["concensus_data"].map(element => {
            tempArray.push(element.cd_values)
          })
        }
        this.concensus_data = tempArray.join(", ");
      }
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
      this.text_notification = this.summary["user_data"][0]['alternate_number'];
      Utils.hideSpinner();


      if (this.summary['frequency_data'].length == 0) {
        this.frequency_flag = false
      }

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

  public changeReportMessage() {
    this.report_message = "";
    this.report_id_service.changeMessage("");
    this.router.navigate(["user/request-status"]);
    this.report_id_service.changeButtonStatus(true)
  }

  public printDiv() {
    this.restorepage = document.body.innerHTML;
    this.printcontent = document.getElementById('editable').innerHTML;
    document.body.innerHTML = this.printcontent;
    window.print();
    document.body.innerHTML = this.restorepage;
    location.reload(true);
  }

  public setDADefaults(ele) {
    var spCheckData = ele.da_data.concensus_data;
    try {
      for (var x = 0; x <= spCheckData.length; x++) {
        $('.events').each(function (index, obj) {
          if (spCheckData[index].ddm_rmp_lookup_da_consensus_data == obj.value) {
            obj.checked = true;
          }
        });
      }
    }
    catch (err) {
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

  public getDADefaultSelection() {

    var temp = this.finalData;
    let ele = document.querySelectorAll("#consensusDataRef input[class='events']:checked");
    ele.forEach((row: any) => {
      temp.concensus_data.push({ id: row.value, value: row.value })
    })
    // $.each($("input[class='events']:checked"), function () {
    //   this.concencusDataCheckbox = { "id": $(this).val(), "value": $(this).val() };
    //   temp.concensus_data.push(this.concencusDataCheckbox);
    // });

    this.finalData = temp;
    var SMonth = $('#Smonth').val();
    var EMonth = $('#Emonth').val();
    var SYear = $('#Syear').val();
    var EYear = $('#Eyear').val();
    var SCycle = this.dealerobj.startCycle;
    var ECycle = this.dealerobj.endCycle;

    this.finalData['concensus_time_date'] = { "startM": SMonth, "startY": SYear, "endM": EMonth, "endY": EYear, "startCycle": SCycle, "endCycle": ECycle };
  }

  public captureScreen() {
    var specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    var doc = new jsPDF();
    doc.setFont("arial");
    doc.lineHeightProportion = 2;
    doc.fromHTML(
      $('#print').html(), 15, 15,
      { 'width': 170, 'elementHandlers': specialElementHandlers },
      function () { doc.save('sample-file.pdf'); }
    )
  }


  public previousSelections(requestId) {
    Utils.showSpinner();
    this.django.get_report_description(requestId).subscribe(element => {
      if (element['da_data']) {
        this.selectedItemsModelYear = []
        element['da_data']['model_year'].forEach(res => {
          this.model_year_id.push(res.ddm_rmp_lookup_dropdown_model_year)
        })
        this.modelYearSelectedItems.forEach(eleMy => {
          if (this.model_year_id.includes(eleMy['ddm_rmp_lookup_dropdown_model_year_id'])) {
            this.selectedItemsModelYear.push(eleMy)
          }
        })

        this.selectedItemsAllocation = []
        this.allocationGroupselecteditems.forEach(eleAllo => {
          element['da_data']['allocation_grp'].forEach(resAllo => {
            if (eleAllo['ddm_rmp_lookup_dropdown_allocation_group_da_id'] == resAllo['ddm_rmp_lookup_dropdown_allocation_group']) {
              this.selectedItemsAllocation.push(eleAllo)
            }
          })
        })

        var subData = element['da_data']['concensus_data']
        var temp = this.finalData;
        temp.concensus_data = [];
        for (var x = 0; x <= subData.length - 1; x++) {
          $('.events').each(function (i, obj) {
            if (subData[x]['ddm_rmp_lookup_da_consensus_data_id'] == obj.value) {
              obj.checked = true;
              this.concencusDataCheckbox = { "value": subData[x].cd_values, "id": subData[x].ddm_rmp_lookup_da_consensus_data_id };
              temp.concensus_data.push(this.concencusDataCheckbox);
            }
          })
        }


        var subDate = element['da_data']['concensus_time_date'][0]
        this.startMonth = subDate.ddm_rmp_start_month
        this.startYear = subDate.ddm_rmp_start_year
        this.endMonth = subDate.ddm_rmp_end_month
        this.endYear = subDate.ddm_rmp_end_year
        this.dealerobj.startCycle = subDate.ddm_rmp_start_cycle
        this.dealerobj.endCycle = subDate.ddm_rmp_end_cycle
        this.dealerobj.alloRadio = element['da_data']['allocation_grp'][0]['display_summary_value']
        this.dealerobj.modelRadio = element['da_data']['model_year'][0]['display_summary_value']
        this.dealerobj.dealerRadio = element['da_data']['division_obj'][0]['display_summary_value']

        var report_data = element['report_data']
        this.Report_title = report_data.title
        this.Report_Req = report_data.additional_req
        if (report_data.status == "Completed") {
          this.report_status = "Pending"
          this.assigned_to = ""
        }
        else if (report_data.status == "Active") {
          this.report_status = "Active"
          this.assigned_to = report_data.assigned_to
        }
        else {
          this.report_status = "Pending"
        }

        this.report_create = report_data.created_on
        this.report_on_behalf = report_data.on_behalf_of

        this.user_name = report_data.requestor

        temp.concensus_time_date = {
          "startM": this.startMonth, "startY": this.startYear, "endM": this.endMonth, "endY": this.endYear,
          "startCycle": this.dealerobj.startCycle, "endCycle": this.dealerobj.endCycle
        };

        this.finalData["model_year"]
        temp['model_year'] = { 'dropdown': this.selectedItemsModelYear, 'radio_button': this.dealerobj.modelRadio }
        temp['allocation_group'] = { 'dropdown': this.selectedItemsAllocation, 'radio_button': this.dealerobj.alloRadio }
        temp['division_selected'] = { 'radio_button': this.dealerobj.dealerRadio }

        this.finalData = temp
      }
    })
    Utils.hideSpinner();
  }
}