import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common'
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { AuthenticationService } from "src/app/authentication.service";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { Router } from '@angular/router';
import Utils from "../../../utils"
declare var $: any;
import { ToastrService } from "ngx-toastr";
import { CreateReportLayoutService } from '../../create-report/create-report-layout/create-report-layout.service';

import { ScheduleService } from '../../schedule/schedule.service';
import { map } from 'rxjs/operators';
import { element } from '@angular/core/src/render3/instructions';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  namings: any;
  description_texts = {
    "ddm_rmp_desc_text_id": 23,
    "module_name": "Help_Reports",
    "description": ""
  };
  frequencyData: {};
  jsonfinal = {
    'select_frequency': []
  }
  editModes = false;
  public searchText;
  public p;
  public dropdownSettings;
  public dropdownList;
  public selectedItems;
  public ddm_rmp_post_report_id;
  public ddm_rmp_status_date;
  public title;
  public report_name;
  public onItemSelect;
  public onSelectAll;
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
  order: string = 'info.name';
  reverse: boolean = false;
  report: any;
  sortedCollection: any[];
  column: any[];
  reports: any;
  favourite: any = [];
  user_role: string;
  param: any;
  frequency_selections: any;
  lookup;

  /*----------Query Criteria params---------------*/
  market_description: any;
  zone_description: any;
  area_description: any;
  region_description: any;
  lma_description: any;
  gmma_description: any;
  allocation_group: any;
  model_year: any;
  merchandising_model: any;
  vehicle_line_brand: any;
  order_event: any;
  order_type: any;
  checkbox_data: any;
  report_frequency: any;
  special_identifier: any;
  concensus_data: any;
  division_dropdown: any;
  summary: any;
  bac_description: any;
  fan_desc: any;
  text_notification: any;

  /*--------------------------------------*/

  select_frequency_ots: any;
  select_frequency_da: any;
  on_demand_freq: any;
  Select_ots = {};
  Select_da = {};
  Select_on_demand = {};
  obj_keys: Array<string>
  obj_keys_da: Array<string>
  obj_keys_on_demand: Array<string>;
  freq_val: {}[];
  freq_val_da: {}[];
  freq_val_on_demand: {}[];

  orderType: any;
  content: object;
  original_contents: any;
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
  changeFreqId: "";
  changeFreqTitle: "";
  changeFreqDate: "";
  changeFrequency: any;
  public filters = {
    global: '',
    ddm_rmp_post_report_id: '',
    ddm_rmp_status_date: '',
    report_name: '',
    title: '',
    frequency: '',
    frequency_data_filtered: '',
  }
  private reportsOriginal = [];
  frequencyLength: any;
  changeInFreq: boolean;
  readOnlyContentHelper = true;
  config = {
    toolbar: [
      ['bold','italic','underline','strike'],
      ['blockquote'],
      [{'list' : 'ordered'}, {'list' : 'bullet'}],
      [{'script' : 'sub'},{'script' : 'super'}],
      [{'size':['small',false, 'large','huge']}],
      [{'header':[1,2,3,4,5,6,false]}],
      [{'color': []},{'background':[]}],
      [{'font': []}],
      [{'align': []}],
      ['clean'],
      ['image']
    ]
  };


  constructor(private generated_id_service: GeneratedReportService,
    private auth_service: AuthenticationService,
    private django: DjangoService,
    private spinner: NgxSpinnerService,
    private dataProvider: DataProviderService,
    private DatePipe: DatePipe,
    public scheduleService: ScheduleService,
    public router: Router,
    private toasterService: ToastrService,
    private createReportLayoutService: CreateReportLayoutService) {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
      }
    })

    this.editModes = false;
    dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.content = element
        this.frequency_selections = this.content['data']['report_frequency']
        let refs = this.content['data']['desc_text']
        let temps = refs.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 23;
        })
        if (temps) {
          this.original_contents = temps.description;
        }
        else { this.original_contents = "" }
        this.namings = this.original_contents;
      }
    })
  }

  getValues(obj: Object) {
    return Object.values(obj);
  }

  ngOnInit() {
    this.changeInFreq = true;
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticLayerId = element.data["semantic_id"];
      }
    });

    Utils.showSpinner();
    this.scheduleService.getScheduledReports(this.semanticLayerId).subscribe(res => {
      this.reportDataSource = res['data'];
      Utils.hideSpinner();
    }, error => {
      Utils.hideSpinner();
    }
    );

    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })

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
            this.reportContainer[i]['frequency_data_filtered'] = this.reportContainer[i]['frequency_data'].filter(element => (element != 'Monday' && element != 'Tuesday' && element != 'Wednesday' && element != 'Thursday' && element != 'Friday'))//&& element != 'Other'
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
        })
        this.reportContainer.sort((a, b) => {
          if (b['favorites'] == a['favorites']) {
            return a['report_name'] > b['report_name'] ? 1 : -1
          }
          return b['favorites'] > a['favorites'] ? 1 : -1
        })
        this.reports = this.reportContainer;
        this.reportsOriginal = this.reportContainer.slice();
      }
    }, err => {
    })
  }

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

  sort(typeVal) {
    this.param = typeVal;
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
  }

  xlsxJson() {
    xlsxPopulate.fromBlankAsync().then(workbook => {
      const EXCEL_EXTENSION = '.xlsx';
      const wb = workbook.sheet("Sheet1");
      const headings = Object.keys(this.reports[0]);
      headings.forEach((heading, index) => {
        const cell = `${String.fromCharCode(index + 65)}1`;
        wb.cell(cell).value(heading)
      });

      const transformedData = this.reports.map(item => (headings.map(key => item[key] instanceof Array ? item[key].join(",") : item[key])))
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

  setOrder(value: any) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  content_edits() {
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
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
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

  public goToReports(selectedReportName: string, reportTitle: string) {
    Utils.showSpinner();

    let isOnDemandOnly;
    this.reports.filter(i => i['report_name'] === selectedReportName).map(i => {
      if (i['frequency'] != null) {
        if (i['frequency'].includes("On Demand Configurable")) {
          isOnDemandOnly = i.frequency;
        }
        else if (i['frequency'].includes("On Demand")) {
          isOnDemandOnly = i.frequency;
        }
      }
    });

    if (isOnDemandOnly === "On Demand Configurable") {
      let tempReport = this.reports.filter(i => i['report_name'] === selectedReportName && i['title'] === reportTitle)

      this.reportTitle = tempReport.map(i => i['title'])[0];
      this.reportName = tempReport.map(i => i['report_name'])[0];
      this.reportId = tempReport.map(i => i['report_list_id'])[0];

      this.reportContainer.map(i => {
        if (i.report_name === this.reportName && i.title === this.reportTitle) {
          this.reportRequestNumber = i.ddm_rmp_post_report_id;
        }
      });
      $('#onDemandScheduleConfigurableModal').modal('show');
      Utils.hideSpinner();
      return;
    }

    // On Demand reports only
    else if (isOnDemandOnly === "On Demand") {
      Utils.showSpinner();
      let tempReport = this.reports.filter(i => i['report_name'] === selectedReportName && i['title'] === reportTitle)
      this.reportRequestNumberOD = tempReport.map(i => i['ddm_rmp_post_report_id'])[0];
      this.reportIdOD = tempReport.map(i => i['report_list_id'])[0];
      $('#onDemandModal').modal('show');
      Utils.hideSpinner();
    }

    else {
      this.toasterService.error('Please select a report name with On Demand/On Demand Configurable frequency');
      Utils.hideSpinner();
      return;
    }
  }

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
    // console.log("USER ID is",this.userId);

    //obtaining the report id of the od report from RMP reports
    this.selectedRequestId = this.reports.filter(i => i['report_name'] === this.reportName).map(i => i.ddm_rmp_post_report_id)

    // SCHEDULE REPORT ID WAY from DDM report
    let scheduleReportId;

    // OLD method
    // if (data.scheduleId[0].length === 1) {
    //   scheduleReportId = data.scheduleId[0];
    // }
    // else if (data.scheduleId[0].length > 1) {
    //   scheduleReportId = data.scheduleId[0][0];
    // }

    // SIMILAR method
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
            if(res){
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

  public commonScheduler() {

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
    this.freq_val_on_demand = Object.values(this.Select_on_demand)

  }

  setFrequency() {
    var temp = this.jsonfinal;
    temp.select_frequency = [];

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

  updateFreq(request_id) {
    this.spinner.show();
    this.jsonfinal['report_id'] = request_id;
    this.jsonfinal['status'] = "Recurring"
    this.jsonfinal['frequency'] = this.changeFrequency;
    this.setFrequency();
    this.django.ddm_rmp_frequency_update(this.jsonfinal).subscribe(element => {
      this.spinner.hide();
      this.toasterService.success("Updated Successfully");
      this.jsonfinal['report_id'] = "";
      this.jsonfinal['status'] = ""
      this.jsonfinal['frequency'] = "";
      this.jsonfinal['select_frequency'] = [];
      this.changeInFreq = true;
    }, err => {
      this.spinner.hide();
      this.toasterService.error("Server Error");
    })
  }

  clearFreq() {
    this.jsonfinal['report_id'] = "";
    this.jsonfinal['status'] = ""
    this.jsonfinal['frequency'] = "";
    this.jsonfinal['select_frequency'] = [];
    this.changeInFreq = true;
  }


  /*---------------------------Change Freq----------------------*/

  changeFreq(requestId, title, date, frequency) {
    this.spinner.show()
    this.changeFrequency = frequency
    this.changeFreqId = requestId;
    this.changeFreqTitle = title;
    this.changeFreqDate = date;
    this.FrequencySelection()
    this.django.get_report_description(requestId).subscribe(element => {
      if (element["frequency_data"].length !== 0) {
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
    }, err => {
      this.spinner.hide();
    });
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


  filterData() {

    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }


  getLink(index) {
    this.spinner.show();
    this.django.get_report_link(index).subscribe(ele => {
      var url = ele['data']['url']
      window.open(url, '_blank');
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toasterService.error("Server Error");
    })

  }

  /*--------------Query Criteria repeated--------------*/
  query_criteria_report(query_report_id) {
    this.spinner.show()
    this.django.get_report_description(query_report_id).subscribe(response => {
      this.summary = response

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

      //-----DA-----//
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
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

}