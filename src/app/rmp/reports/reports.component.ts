// Migrated by bharath
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common';
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { AuthenticationService } from "src/app/authentication.service";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { Router } from '@angular/router';
import Utils from "../../../utils"
import '../../../assets/debug2.js';
declare var jsPDF: any;
declare var $: any;
import { ScheduleService } from '../../schedule/schedule.service';
import { NgLoaderService } from 'src/app/custom-directives/ng-loader/ng-loader.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {

  public namings: any;
  public enableUpdateData = false;
  public description_texts = {
    'ddm_rmp_desc_text_id': 23,
    'module_name': 'Help_Reports',
    'description': ''
  };
  public frequencyData: {};
  public jsonfinal = {
    'select_frequency': []
  };
  public editModes = false;
  public textChange = false;
  public searchText;
  public p;
  public ddm_rmp_post_report_id;
  public ddm_rmp_status_date;
  public title;
  public report_name;
  public metricsOtherList = [];
  public weekDayDict = {
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'Th',
    Friday: 'F'
  };
  public weekDays = ['M',
    'T',
    'W',
    'Th',
    'F'];
  public order: string = 'info.name';
  public reverse: boolean = false;
  public report: any;
  public sortedCollection: any[];
  public column: any[];
  public reports: any;
  public favourite: any = [];
  public user_role: string;
  public param: any;
  public frequency_selections: any;
  public lookup;
  public showInput = false;
  /*----------Query Criteria params---------------*/
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
  public concensus_data: any;
  public division_dropdown: any;
  public summary: any;
  public bac_description: any;
  public fan_desc: any;
  public text_notification: any;

  /*--------------------------------------*/

  public select_frequency_ots: any;
  public select_frequency_da: any;
  public on_demand_freq: any;
  public Select_ots = {};
  public Select_da = {};
  public Select_on_demand = {};
  public obj_keys: Array<string>;
  public obj_keys_da: Array<string>;
  public obj_keys_on_demand: Array<string>;
  public freq_val: {}[];
  public freq_val_da: {}[];
  public freq_val_on_demand: {}[];
  public selectedReportName = "";
  public orderType: any;
  public content: object;
  public original_contents: any;
  public userId: any = {};
  public todaysDate: string;
  public semanticLayerId: any;
  public reportDataSource: any;
  public onDemandScheduleData: any = {};
  public confirmationValue: any;
  public selectedRequestId: any;
  public reportContainer: any;

  public reportTitle: any;
  public reportName: any;
  public reportRequestNumber: any;
  public reportId: any;
  public reportNameOD: any;
  public reportRequestNumberOD: any;
  public reportIdOD: any;
  public changeFreqId: '';
  public changeFreqTitle: '';
  public changeFreqDate: '';
  public changeFrequency: any;
  public filters = {
    global: '',
    ddm_rmp_post_report_id: '',
    ddm_rmp_status_date: '',
    report_name: '',
    title: '',
    frequency: '',
    frequency_data_filtered: '',
  };
  private reportsOriginal = [];
  public frequencyLength: any;
  public changeInFreq: boolean;
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
  // paginator params
  public paginatorlength = 100;
  public paginatorpageSize = 10;
  public paginatorOptions: number[] = [5, 10, 25, 100]
  public paginatorLowerValue = 0;
  public paginatorHigherValue = 10;
  public linkUrlId: number;
  public addUrlTitle: String = '';
  public linkToUrlFlag = true;
  public frequencySelections = ['One Time', 'Recurring', 'On Demand', 'On Demand Configurable']
  public selectedNewFrequency: string = "";
  public isRecurringFrequencyHidden: boolean = false;

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

  constructor(private generated_id_service: GeneratedReportService,
    private auth_service: AuthenticationService,
    private django: DjangoService,
    private spinner: NgLoaderService,
    private dataProvider: DataProviderService,
    private DatePipe: DatePipe,
    public scheduleService: ScheduleService,
    public router: Router,
    private toasterService: NgToasterComponent
  ) {
    this.readUserRole();
    this.getLookUptableData();
    this.editModes = false;

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

  /**
   * @function to change the DDM name report name in the reports table 
   * @param event event catched on change of the input value
   * @param reportObject the current report object being edited
   */
  changeReportName(event: any, reportObject) {

    const changedReport = {};
    changedReport['request_id'] = reportObject.ddm_rmp_post_report_id;
    changedReport['report_name'] = reportObject.report_name;
    this.django.update_rmpReports_DDMName(changedReport)
      .subscribe(
        resp => {
          reportObject.clicked = false;
          reportObject.report_name = changedReport['report_name'];
        }
        ,
        () => {
        },
    );
  }

  /**
   * @function to toggle the input field on DDM Name 
   * @param element the report element which is being clicked
   */
  toggleShowInput(element) {

    this.reports.forEach(ele => {
      if (ele.report_name != element.report_name) {
        ele.clicked = false;
      } else {
        ele.clicked = !ele.clicked;
      }
    });
  }

  // read user role from an observable
  readUserRole() {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role['role'];
      }
    });
  }

  //  get lookup table data from the server
  getLookUptableData() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.content = element;
        this.frequency_selections = this.content['data']['report_frequency']
        const refs = this.content['data']['desc_text'];
        const temps = refs.find(function (element) {
          return element['ddm_rmp_desc_text_id'] == 23;
        });

        if (temps) {
          this.original_contents = temps.description;
        }
        else { this.original_contents = '' }
        this.namings = this.original_contents;
      }
    });
  }

  // get valuse from obj
  getValues(obj: Object) {
    return Object.values(obj);
  }

  ngOnInit() {
    this.getSemanticLayerID()
    Utils.showSpinner();
    this.getScheduledReports()
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    this.getReportList();
  }

  // set semanticlayer id
  getSemanticLayerID() {
    this.changeInFreq = true;
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticLayerId = element.data["semantic_id"];
      }
    });
  }

  // get scheduled reports from server
  public getScheduledReports() {
    if (this.semanticLayerId != undefined && this.semanticLayerId != null) {
      this.scheduleService.getScheduledReports(this.semanticLayerId).subscribe(res => {
        this.reportDataSource = res['data'];
        Utils.hideSpinner();
      }, error => {
        Utils.hideSpinner();
      }
      );
    }
  }

  // get reports list from server
  getReportList() {
    this.django.get_report_list().subscribe(list => {
      if (list) {
        this.reportContainer = list['data'];
        this.reportContainer.map(reportRow => {
          reportRow['ddm_rmp_status_date'] = this.DatePipe.transform(reportRow['ddm_rmp_status_date'], 'dd-MMM-yyyy')
          if (reportRow['frequency_data']) {
            reportRow['frequency_data'].forEach(weekDate => {
              reportRow[this.weekDayDict[weekDate] + 'Frequency'] = 'Y';
            });
          }
        });
        for (var i = 0; i < this.reportContainer.length; i++) {
          if (this.reportContainer[i]['frequency_data'] != null) {
            this.reportContainer[i]['frequency_data_filtered'] = this.reportContainer[i]['frequency_data'].filter(element => (element != 'Monday' && element != 'Tuesday' && element != 'Wednesday' && element != 'Thursday' && element != 'Friday'))
            if (this.reportContainer[i]['description'] != null) {
              this.reportContainer[i]['description'].forEach(ele => {
                this.reportContainer[i]['frequency_data_filtered'].push(ele)
              })
            }
          }
          else if (this.reportContainer[i]['frequency_data'] == null) {
            this.reportContainer[i]['frequency_data_filtered'] = [];
          }
        }

        for (var i = 0; i < this.reportContainer.length; i++) {
          if (this.reportContainer[i]['frequency'] == 'Recurring') {
            this.reportContainer[i]['changeFreqReq'] = true;
          }
          else if (this.reportContainer[i]['frequency'] == 'On Demand' || this.reportContainer[i]['frequency'] == 'On Demand Configurable') {
            if (this.reportContainer[i]['frequency_data'].length > 1) {
              this.reportContainer[i]['changeFreqReq'] = true;
            }
            else if (this.reportContainer[i]['frequency_data'].length == 1) {
              if (this.reportContainer[i]['frequency_data'][0] != 'Monday' || this.reportContainer[i]['frequency_data'][0] != 'Tuesday' || this.reportContainer[i]['frequency_data'][0] != 'Wednesday' || this.reportContainer[i]['frequency_data'][0] != 'Thursday' || this.reportContainer[i]['frequency_data'][0] != 'Friday') {
                this.reportContainer[i]['changeFreqReq'] = false;
              }
              else {
                this.reportContainer[i]['changeFreqReq'] = true;
              }
            }
          }
          else {
            this.reportContainer[i]['changeFreqReq'] = false;
          }
        }


        this.reportContainer.forEach(ele => {
          if (ele['frequency_data_filtered']) {
            ele['frequency_data_filtered'] = ele['frequency_data_filtered'].join(", ");
          }
          ele['clicked'] = false;

        })

        this.reportContainer.sort((a, b) => {
          if (b['favorites'] == a['favorites']) {
            return a['report_name'] > b['report_name'] ? 1 : -1
          }
          return b['favorites'] > a['favorites'] ? 1 : -1
        })
        this.reports = this.reportContainer;
        this.paginatorlength = this.reports.length
        this.reportsOriginal = this.reportContainer.slice();
        Utils.hideSpinner();
      }
    }, err => {
    })

  }

  // to mark a report as favourites
  checked(id, event) {
    this.spinner.show()
    this.favourite = event.target.checked;
    var finalObj = { 'report_id': id, 'favorite': this.favourite }
    this.django.ddm_rmp_favourite(finalObj).subscribe(response => {

      if (response['message'] == "success") {
        this.spinner.hide()
      }
    }, err => {
      this.spinner.hide()
    })
  }

  // used to set typeval property of reports
  sort(typeVal) {
    this.param = typeVal;
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
  }

  // generates excel report
  xlsxJson() {
    xlsxPopulate.fromBlankAsync().then(workbook => {
      const EXCEL_EXTENSION = '.xlsx';
      const wb = workbook.sheet("Sheet1");
      const headings = ["Request No", "Date", "Title", "DDM Name", "Frequency", "Frequency Details", "Other"]
      const reportBody = this.createNewBodyForExcel()

      headings.forEach((heading, index) => {
        const cell = `${String.fromCharCode(index + 65)}1`;
        wb.cell(cell).value(heading)
      });

      const transformedData = reportBody.map(item => (headings.map(key => item[key] instanceof Array ? item[key].join(",") : item[key])))
      const colA = wb.cell("A2").value(transformedData);

      workbook.outputAsync().then(function (blob) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob,
            "Reports" + new Date().getTime() + EXCEL_EXTENSION
          );
        }
        else {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = "Reports" + new Date().getTime() + EXCEL_EXTENSION;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a)
        }
      })
    }).catch(error => {
    });
  }

  // creating a body to generate excel report
  createNewBodyForExcel() {
    let reportBody = []
    this.reports.forEach(item => {
      let obj = {
        "Request No": item["ddm_rmp_post_report_id"],
        "Date": item["ddm_rmp_status_date"],
        "Title": item["title"],
        "DDM Name": item['report_name'],
        "Frequency": item["frequency"],
        "Frequency Details": item["frequency_data"] ? item["frequency_data"].join(',') : "",
        "Other": item["description"] ? item["description"].join(',') : ""
      }
      reportBody.push(obj)
    })
    return reportBody
  }

  // used ti toggle reverse property
  setOrder(value: any) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  // used to set a few properties when content get changed in quill editor
  textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  // save changes made to help
  content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      this.spinner.show()
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_texts["description"] = this.namings;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {

        let temp_desc_text = this.content['data']['desc_text']
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 23) {
            temp_desc_text[index] = this.description_texts
          }
        })
        this.content['data']['desc_text'] = temp_desc_text
        this.dataProvider.changelookUpTableData(this.content)
        this.editModes = false;
        this.ngOnInit()
        this.original_contents = this.namings;
        this.toasterService.success("Updated Successfully");
        this.spinner.hide()
        $('#helpModal').modal('hide');
      }, err => {
        this.spinner.hide()
        this.toasterService.error("Data not Updated")
      })
    } else {
      this.toasterService.error("please enter the data");
    }
  }

  // used to set a few properties of component
  edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_contents;
  }

  // used to set a few properties of component

  editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_contents;
  }

  // used to update schedule report data
  public startOnDemandScheduling(data) {
    let dateDetails = new Date();
    let todaysDate = (dateDetails.getMonth() + 1) + '/' + (dateDetails.getDate()) + '/' + (dateDetails.getFullYear())

    let hours = dateDetails.getHours();
    let minutes = (dateDetails.getMinutes() + 10);
    let scheduleTime = hours + ':' + minutes
    if (hours >= 24) {
      hours = hours % 24;
      if (minutes >= 50) {
        minutes = minutes % 50;
      }
    }
    if (minutes >= 50) {
      minutes = minutes % 50;
      hours = hours + 1;
      if (hours >= 24) {
        hours = hours % 24;
        if (minutes >= 50) {
          minutes = minutes % 50;
        }
      }
    }
    scheduleTime = hours + ':' + minutes

    this.auth_service.errorMethod$.subscribe(userId => this.userId = userId);
    //obtaining the report id of the od report from RMP reports
    this.selectedRequestId = this.reports.filter(i => i['report_name'] === this.reportName).map(i => i.ddm_rmp_post_report_id)

    // SCHEDULE REPORT ID WAY from DDM report
    let scheduleReportId;
    if (data.scheduleId) {
      scheduleReportId = data.scheduleId;
    }
    else if (data.scheduleId.length >= 1) {
      scheduleReportId = data.scheduleId[0];
    }

    if (data.scheduleId.length === 0 || scheduleReportId === undefined || scheduleReportId === []) {
      this.toasterService.error('Scheduling error!');
      this.toasterService.error('Please ask the admin to configure scheduling parameters!');
      Utils.hideSpinner();
      return;
    }

    this.scheduleService.getScheduleReportData(scheduleReportId).subscribe(res => {
      if (res) {
        let originalScheduleData = res['data']

        this.onDemandScheduleData = originalScheduleData;
        this.onDemandScheduleData.schedule_for_date = todaysDate,
          this.onDemandScheduleData.schedule_for_time = scheduleTime,
          this.onDemandScheduleData.request_id = this.selectedRequestId[0];
        this.onDemandScheduleData.created_by = this.userId;
        this.onDemandScheduleData.modified_by = this.userId;

        if (data.confirmation === true && (data.type === 'On Demand' || data.type === 'On Demand Configurable')) {
          Utils.showSpinner();
          this.scheduleService.updateScheduleData(this.onDemandScheduleData).subscribe(res => {
            if (res) {
              this.toasterService.success("Your " + data['type'] + " schedule process triggered successfully");
              this.toasterService.success('Your report will be delivered shortly');
              Utils.hideSpinner();
              Utils.closeModals();
            }
          }, error => {
            Utils.hideSpinner();
            this.toasterService.error('Report schedule failed');
          });
        }
      }
    });
  }



  /*-------------------Freq Selections------------------------------------- */
  FrequencySelection() {
    this.select_frequency_ots = this.frequency_selections.filter(element => element.ddm_rmp_lookup_report_frequency_id < 4)
    this.select_frequency_da = this.frequency_selections.filter(element => element.ddm_rmp_lookup_report_frequency_id == 4)
    this.on_demand_freq = this.frequency_selections.filter(element => element.ddm_rmp_lookup_report_frequency_id > 4)

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
    this.freq_val_on_demand = Object.values(this.Select_on_demand);

  }

  // when the user changes the frequency dropdown values
  public setSelectedFrequency(choice: string) {
    this.selectedNewFrequency = choice;
    this.changeInFreq = false;
    if (this.selectedNewFrequency == 'One Time') {
      this.isRecurringFrequencyHidden = true;
    }
    else {
      this.isRecurringFrequencyHidden = false;
    }
  }

  // setting final json value based on the selection made in check boxes
  setFrequency() {
    var temp = this.jsonfinal;
    temp.select_frequency = [];

    if (this.jsonfinal['frequency'] != 'One Time') {
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
      });

      this.jsonfinal = temp;
    }
    else {
      this.jsonfinal['select_frequency'] = [{ "ddm_rmp_lookup_select_frequency_id": 39, "description": "" }];
    }

    if (this.jsonfinal['frequency'] === 'On Demand' && this.jsonfinal['select_frequency'].length == 0) {
      this.jsonfinal['select_frequency'] = [{ "ddm_rmp_lookup_select_frequency_id": 37, "description": "" }];
    }
    else if (this.jsonfinal['frequency'] === 'On Demand Configurable' && this.jsonfinal['select_frequency'].length == 0) {
      this.jsonfinal['select_frequency'] = [{ "ddm_rmp_lookup_select_frequency_id": 38, "description": "" }];
    }
  }

  // update frequency to the server
  updateFreq(request_id) {
    this.spinner.show();
    this.jsonfinal['report_id'] = request_id;
    this.jsonfinal['status'] = "Recurring"
    this.jsonfinal['frequency'] = this.selectedNewFrequency;
    this.setFrequency();
    this.django.ddm_rmp_frequency_update(this.jsonfinal).subscribe(element => {
      this.spinner.hide();
      this.toasterService.success("Updated Successfully");
      this.jsonfinal['report_id'] = "";
      this.jsonfinal['status'] = ""
      this.jsonfinal['frequency'] = "";
      this.jsonfinal['select_frequency'] = [];
      this.changeInFreq = true;
      $('#change-Frequency').modal('hide');
    }, err => {
      this.spinner.hide();
      this.toasterService.error("Server Error");
    })
  }

  // clears the set values while closing the modal
  public clearFreq() {
    this.jsonfinal['report_id'] = "";
    this.jsonfinal['status'] = ""
    this.jsonfinal['frequency'] = "";
    this.jsonfinal['select_frequency'] = [];
    this.selectedNewFrequency = '';
    this.changeInFreq = true;
  }


  /*---------------------------Change Frequency----------------------*/

  public changeFreq(requestId, title, date, frequency) {
    this.spinner.show()
    this.changeFrequency = frequency
    this.changeFreqId = requestId;
    this.changeFreqTitle = title;
    this.changeFreqDate = date;
    this.FrequencySelection()
    this.django.get_report_description(requestId).subscribe(element => {
      if (element["frequency_data"].length !== 0 && element["frequency_data"][0]['select_frequency_values'] !== 'One Time') {
        this.frequencyLength = element['frequency_data']
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
      } else { }
      this.spinner.hide();
      this.selectedNewFrequency = element['frequency_of_report'];
      if (this.selectedNewFrequency === 'One Time') {
        this.isRecurringFrequencyHidden = true;
      }
      else {
        if ((this.selectedNewFrequency === 'On Demand' || 'On Demand Configurable') && element["frequency_data"].length == 1) {
          this.isRecurringFrequencyHidden = true;
        }
        else {
          this.isRecurringFrequencyHidden = false;
        }
      }
    }, err => {
      this.spinner.hide();
    });
    this.showChangeFrequencyModal()
  }

  // open change-frequency modal
  showChangeFrequencyModal() {
    $('#change-Frequency').modal('show');
  }

  //-------------------------frequency update--------------------------------------------

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
    this.setFrequency();


    if (this.jsonfinal['select_frequency'].length > 0) {
      this.jsonfinal['select_frequency'].forEach((obj) => {
        var existNotification = this.frequencyLength.find(({ ddm_rmp_lookup_select_frequency_id }) => obj.ddm_rmp_lookup_select_frequency_id === ddm_rmp_lookup_select_frequency_id);
        if (!existNotification) {
          this.changeInFreq = false;
        }
        else {
          this.changeInFreq = true;
        }
      });
    }

  }

  // freuency selected through checkbox
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

  searchObj;

  // parsing filters into obj
  filterData() {
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }


  /*--------------Query Criteria repeated--------------*/
  query_criteria_report(query_report_id) {
    this.spinner.show();
    this.summary = [];
    this.django.get_report_description(query_report_id).subscribe(response => {
      this.summary = response;
      this.spinner.hide();

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
      if (this.summary["ost_data"] != undefined) {

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
      }

      // //-----DA-----//
      if (this.summary["da_data"] != undefined) {
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

    }, err => {
      this.spinner.hide()
    })
  }

  // download browser data in pdf file
  public captureScreen() {
    let fileName = `${this.summary.ddm_rmp_post_report_id}_Report_Summary.pdf`;
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
      function () { doc.save(fileName); }, margins
    );
  }


  // filter data based on pagination data
  onPaginationChange(event) {
    this.paginatorLowerValue = event.pageIndex * event.pageSize;
    this.paginatorHigherValue = event.pageIndex * event.pageSize + event.pageSize;
  }

  // setting report id to edit link to url and also change the title of modal to edit or create respectively
  addLinkUrl(element, type) {
    this.linkUrlId = element.ddm_rmp_post_report_id;
    if (type == "create") {
      this.addUrlTitle = "ADD URL"
      document.querySelector("#add-url-input")["value"] = "";
    } else {
      this.addUrlTitle = "EDIT URL"
      document.querySelector("#add-url-input")["value"] = element.link_to_results;
      this.validateLinkToUrl(element.link_to_results)
    }
  }

  // save link to url
  saveLinkURL() {
    let link = document.querySelector("#add-url-input")["value"]
    let data = { request_id: this.linkUrlId, link_to_results: link }
    Utils.showSpinner();
    this.django.add_link_to_url(data).subscribe(response => {
      if (response['message'] == "updated successfully") {
        document.querySelector("#add-url-input")["value"] = "";
        $('#addUrl').modal('hide');
        this.toasterService.success("URL Updated Successfully !")
        Utils.hideSpinner()
        this.reports.map(item => {
          if (item.ddm_rmp_post_report_id == this.linkUrlId) {
            item.link_to_results = link
          }
        })
      }
    }, error => {
      this.toasterService.error(error.error.error.link_to_results.join())
      Utils.hideSpinner()
    })

  }

  // open links in an new window
  openNewWindow(url) {
    window.open(url)
  }

  // close modal
  closeTBD_Assigned() {
    $('#addUrl').modal('hide');
  }

  // used to validate weather input is empty or not
  validateLinkToUrl(data) {
    if (data == "") this.linkToUrlFlag = true
    else this.linkToUrlFlag = false;
  }
}