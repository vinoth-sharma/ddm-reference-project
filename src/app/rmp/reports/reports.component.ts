// Migrated by bharath
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import '../../../assets/debug2.js';

import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { AuthenticationService } from "src/app/authentication.service";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import Utils from "../../../utils"
declare var jsPDF: any;
declare var $: any;
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
    'ddm_rmp_desc_text_id': 16,
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
  public attached_file_names: any;
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
  public confirmationValue: any;
  public selectedRequestId: any;
  public reportContainer: any;
  public searchObj: any;
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
    frequency_data_filtered: ''
  };
  public quillToolBarDisplay = [
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
  ];
  private reportsOriginal = [];
  public frequencyLength: any;
  public changeInFreq: boolean;
  public readOnlyContentHelper = true;
  public config = {
    toolbar: null
  };
  // paginator params
  public paginatorpageSize = 10;
  public paginatorOptions: number[] = [5, 10, 25, 100]
  public paginatorLowerValue = 0;
  public paginatorHigherValue = 10;
  public linkUrlId: number;
  public addUrlTitle: String = '';
  public linkToUrlFlag = true;
  public frequencySelections = [{ name: 'One Time', value: "One Time" }, { name: "Freq Chg", value: 'Freq Chg' }]
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
  public ddmReportname: String
  public previousFreqSelection = "";
  public user_name = "";

  constructor(private generated_id_service: GeneratedReportService,
    private auth_service: AuthenticationService,
    private django: DjangoService,
    private spinner: NgLoaderService,
    private dataProvider: DataProviderService,
    private DatePipe: DatePipe,
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
  public changeReportName(event: any, reportObject) {
    const changedReport = {};
    if (!reportObject.report_name || !reportObject.report_name.length) {
      this.toasterService.error('Cannot save empty name');
    } else {
      changedReport['request_id'] = reportObject.ddm_rmp_post_report_id;
      changedReport['report_name'] = reportObject.report_name;
      this.django.update_rmpReports_DDMName(changedReport)
        .subscribe(
          resp => {
            reportObject.clicked = false;
            reportObject.report_name = changedReport['report_name'];
            this.toasterService.success('Successfuly Changed');
          }

        );
    }
  }

  /**
   * @function to toggle the input field on DDM Name 
   * @param element the report element which is being clicked
   */
  public toggleShowInput(element) {
    this.ddmReportname = element.report_name
    this.reports.forEach(ele => {
      if (ele.ddm_rmp_post_report_id != element.ddm_rmp_post_report_id) {
        ele.clicked = false;
      } else {
        ele.clicked = !ele.clicked;
      }
    });
  }

  public cancelNameEdit(element) {
    element.report_name = this.ddmReportname
    element.clicked = false
  }

  // read user role from an observable
  public readUserRole() {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role['role'];
        this.user_name = role["first_name"] + " " + role["last_name"];
        if (this.user_role == "Admin") this.config.toolbar = this.quillToolBarDisplay;
        else this.config.toolbar = false;
      }
    });
  }

  //  get lookup table data from the server
  public getLookUptableData() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.content = element;
        this.frequency_selections = this.content['data']['report_frequency']
        const refs = this.content['data']['desc_text'];
        const temps = refs.find(function (element) {
          return element['ddm_rmp_desc_text_id'] == 16;
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
  public getValues(obj: Object) {
    return Object.values(obj);
  }

  public ngOnInit() {
    this.getSemanticLayerID()
    Utils.showSpinner();
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    this.getReportList();
  }

  // set semanticlayer id
  public getSemanticLayerID() {
    this.changeInFreq = true;
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticLayerId = element.data["semantic_id"];
      }
    });
  }

  // get reports list from server
  public getReportList() {
    Utils.showSpinner();
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
                if (ele != 'Monday' && ele != 'Tuesday' && ele != 'Wednesday' && ele != 'Thursday' && ele != 'Friday') {
                  if (ele != 'Other' && !this.reportContainer[i]['frequency_data_filtered'].includes(ele)) {
                    this.reportContainer[i]['frequency_data_filtered'].push(ele)
                    this.reportContainer[i]['description'] = this.reportContainer[i]['frequency_data_filtered'];
                  }
                }
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
          ele['report_name_old'] = ele['report_name'];
          ele['clicked'] = false;
        })
        this.reportContainer.sort((a, b) => {
          if (b['favorites'] == a['favorites']) {
            return a['report_name'] > b['report_name'] ? 1 : -1
          }
          return b['favorites'] > a['favorites'] ? 1 : -1
        })
        this.reports = this.reportContainer;
        this.reportsOriginal = this.reportContainer.slice();
        Utils.hideSpinner();
      }
    }, err => {
    })

  }

  // to mark a report as favourites
  public checked(id, event) {
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
  public sort(typeVal) {
    this.param = typeVal;
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
  }

  // formating date 
  public dateFormat(str: any) {
    const date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("");
  }

  // generates excel report
  public xlsxJson() {
    let fileName = "Reports_" + this.dateFormat(new Date());  // changes done by Ganesh
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
            fileName + EXCEL_EXTENSION
          );
        }
        else {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = fileName + EXCEL_EXTENSION;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a)
        }
      })
    }).catch(error => {
    });
  }

  // creating a body to generate excel report
  public createNewBodyForExcel() {
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
  public setOrder(value: any) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  // used to set a few properties when content get changed in quill editor
  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  // save changes made to help
  public content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      this.spinner.show()
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_texts["description"] = this.namings;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {
        let temp_desc_text = this.content['data']['desc_text']
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 16) {
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
        $('.btn-secondary').click()
      }, err => {
        this.spinner.hide()
        this.toasterService.error("Data not Updated")
      })
    } else {
      this.toasterService.error("please enter the data");
    }
  }

  // used to set a few properties of component
  public edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_contents;
  }

  // used to set a few properties of component
  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_contents;
  }

  /*-------------------Freq Selections------------------------------------- */
  public frequencySelection() {
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
  public setFrequency() {
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
  public updateFreq(request_id) {
    this.spinner.show();
    this.jsonfinal['report_id'] = request_id;
    this.jsonfinal['status'] = "Freq Chg"
    this.jsonfinal['frequency'] = this.selectedNewFrequency;
    this.setFrequency();
    let comment = "Frequency has changed from : " + this.getPreviousFreqData(this.frequencyLength) + "\n" + " To :" + "\n" + this.getCurrentFreqData(this.jsonfinal);
    this.django.ddm_rmp_frequency_update(this.jsonfinal).subscribe(element => {
      this.reports = this.reports.filter(report => report.ddm_rmp_post_report_id != request_id)
      this.spinner.hide();
      this.toasterService.success("Updated Successfully");
      this.jsonfinal['report_id'] = "";
      this.jsonfinal['status'] = ""
      this.jsonfinal['frequency'] = "";
      this.jsonfinal['select_frequency'] = [];
      this.changeInFreq = true;
      $('#change-Frequency').modal('hide');
      this.getReportList();
      this.postComment(request_id, comment)
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
    this.frequencySelection()
    this.django.get_report_description(requestId).subscribe(element => {
      if (element["frequency_data"].length !== 0 && element["frequency_data"][0]['select_frequency_values'] !== 'One Time') {
        this.frequencyLength = element['frequency_data']
        this.previousFreqSelection = this.getPreviousFreqData(element['frequency_data'])
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
      else if ((this.selectedNewFrequency === 'Recurring') && element["frequency_data"].length >= 1) {
        this.isRecurringFrequencyHidden = false;
      }
    }, err => {
      this.spinner.hide();
    });
    this.showChangeFrequencyModal()
  }

  // open change-frequency modal
  public showChangeFrequencyModal() {
    $('#change-Frequency').modal({ backdrop: "static", keyboard: true, show: true });
  }

  //-------------------------frequency update--------------------------------------------
  public frequencySelected(val, event) {
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
  public frequencySelectedInput(val, event) {
    this.changeInFreq = false;
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

  // parsing filters into obj
  public filterData() {
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }

  /*--------------Query Criteria repeated--------------*/
  public query_criteria_report(query_report_id) {
    this.spinner.show();
    this.summary = [];
    this.django.get_report_description(query_report_id).subscribe(response => {
      this.spinner.hide();
      let tempArray = []
      if (response["market_data"].length != 0) {
        if (response["market_data"] == []) {
          this.market_description = []
        } else {
          response["market_data"].map(element => {
            tempArray.push(element.market)
          })
        }
        this.market_description = tempArray.join(", ");
      }
      tempArray = []
      if (response["country_region_data"].length != 0) {
        if (response["country_region_data"] == []) {
          this.region_description = []
        } else {
          response["country_region_data"].map(element => {
            tempArray.push(element.region_desc)
          })
        }
        this.region_description = tempArray.join(", ");
      }

      tempArray = []
      if (response["region_zone_data"].length != 0) {
        if (response["region_zone_data"] == []) {
          this.zone_description = []
        } else {
          response["region_zone_data"].map(element => {
            tempArray.push(element.zone_desc)
          })
        }
        this.zone_description = tempArray.join(", ");
      }
      tempArray = []
      if (response["zone_area_data"].length != 0) {
        if (response["zone_area_data"] == []) {
          this.area_description = []
        } else {
          response["zone_area_data"].map(element => {
            tempArray.push(element.area_desc)
          })
        }
        this.area_description = tempArray.join(", ");
      }
      tempArray = []
      if (response["lma_data"].length != 0) {
        if (response["lma_data"] == []) {
          this.lma_description = []
        } else {
          response["lma_data"].map(element => {
            tempArray.push(element.lmg_desc)
          })
        }
        this.lma_description = tempArray.join(", ");
      }
      tempArray = []
      if (response["gmma_data"].length != 0) {
        if (response["gmma_data"] == []) {
          this.gmma_description = []
        } else {
          response["gmma_data"].map(element => {
            tempArray.push(element.gmma_desc)
          })
        }
        this.gmma_description = tempArray.join(", ");
      }
      tempArray = []
      if (response["frequency_data"].length != 0) {
        if (response["frequency_data"] == []) {
          this.report_frequency = []
        } else {
          response["frequency_data"].map(element => {
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
      if (response["division_dropdown"].length != 0) {
        if (response["division_dropdown"] == []) {
          this.division_dropdown = []
        } else {
          response["division_dropdown"].map(element => {
            tempArray.push(element.division_desc)
          })
        }
        this.division_dropdown = tempArray.join(", ");
      }
      tempArray = []
      if (response["special_identifier_data"].length != 0) {
        if (response["special_identifier_data"] == []) {
          this.special_identifier = []
        } else {
          response["special_identifier_data"].map(element => {
            tempArray.push(element.spl_desc)
          })
        }
        this.special_identifier = tempArray.join(", ");
      }
      if (response["ost_data"] != undefined) {

        tempArray = []
        if (response["ost_data"]["allocation_group"].length != 0) {
          if (response["ost_data"]["allocation_group"] == []) {
            this.allocation_group = []
          } else {
            response["ost_data"]["allocation_group"].map(element => {
              tempArray.push(element.allocation_group)
            })
          }
          this.allocation_group = tempArray.join(", ");
        }
        tempArray = []
        if (response["ost_data"]["model_year"].length != 0) {
          if (response["ost_data"]["model_year"] == []) {
            this.model_year = []
          } else {
            response["ost_data"]["model_year"].map(element => {
              tempArray.push(element.model_year)
            })
          }
          this.model_year = tempArray.join(", ");
        }
        tempArray = []
        if (response["ost_data"]["vehicle_line"].length != 0) {
          if (response["ost_data"]["vehicle_line"] == []) {
            this.vehicle_line_brand = []
          } else {
            response["ost_data"]["vehicle_line"].map(element => {
              tempArray.push(element.vehicle_line_brand)
            })
          }
          this.vehicle_line_brand = tempArray.join(", ");
        }
        tempArray = []
        if (response["ost_data"]["merchandizing_model"].length != 0) {
          if (response["ost_data"]["merchandizing_model"] == []) {
            this.merchandising_model = []
          } else {
            response["ost_data"]["merchandizing_model"].map(element => {
              tempArray.push(element.merchandising_model)
            })
          }
          this.merchandising_model = tempArray.join(", ");
        }
        tempArray = []
        if (response["ost_data"]["order_event"].length != 0) {
          if (response["ost_data"]["order_event"] == []) {
            this.order_event = []
          } else {
            response["ost_data"]["order_event"].map(element => {
              tempArray.push(element.order_event)
            })
          }
          this.order_event = tempArray.join(", ");
        }
        tempArray = []
        if (response["ost_data"]["order_type"].length != 0) {
          if (response["ost_data"]["order_type"] == []) {
            this.order_type = []
          } else {
            response["ost_data"]["order_type"].map(element => {
              tempArray.push(element.order_type)
            })
          }
          this.order_type = tempArray.join(", ");
        }
        tempArray = []
        if (response["ost_data"]["checkbox_data"].length != 0) {
          if (response["ost_data"]["checkbox_data"] == []) {
            this.checkbox_data = []
          } else {
            response["ost_data"]["checkbox_data"].map(element => {
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
      if (response["da_data"] != undefined) {
        tempArray = []
        if (response["da_data"]["allocation_grp"].length != 0) {
          if (response["da_data"]["allocation_grp"] == []) {
            this.allocation_group = []
          } else {
            response["da_data"]["allocation_grp"].map(element => {
              tempArray.push(element.allocation_group)
            })
          }
          this.allocation_group = tempArray.join(", ");
        }
        tempArray = []
        if (response["da_data"]["model_year"].length != 0) {
          if (response["da_data"]["model_year"] == []) {
            this.model_year = []
          } else {
            response["da_data"]["model_year"].map(element => {
              tempArray.push(element.model_year)
            })
          }
          this.model_year = tempArray.join(", ");
        }
        tempArray = []
        if (response["da_data"]["concensus_data"].length != 0) {
          if (response["da_data"]["concensus_data"] == []) {
            this.concensus_data = []
          } else {
            response["da_data"]["concensus_data"].map(element => {
              tempArray.push(element.cd_values)
            })
          }
          this.concensus_data = tempArray.join(", ");
        }
      }

      if (response["bac_data"].length != 0) {
        if (response["bac_data"][0]["bac_desc"] == null) {
          this.bac_description = []
        } else {
          this.bac_description = (response["bac_data"][0].bac_desc).join(", ");
        }
      }
      else {
        this.bac_description = []
      }

      if (response["fan_data"].length != 0) {
        if (response["fan_data"][0]["fan_data"] == null) {
          this.fan_desc = []
        } else {
          this.fan_desc = response["fan_data"][0].fan_data.join(", ");
        }
      }
      else {
        this.fan_desc = []
      }

      if (response['is_attachment'] && response['attached_files_details'].length) {
        let fileObjects = response['attached_files_details'];
        this.attached_file_names = fileObjects.map(f => f.file_name).join(",")
      }
      else if (response['is_attachment'] == false) {
        this.attached_file_names = ""
      }

      this.text_notification = response["user_data"][0]['alternate_number'];
      this.summary = response;

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
  public onPaginationChange(event) {
    this.paginatorLowerValue = event.pageIndex * event.pageSize;
    this.paginatorHigherValue = event.pageIndex * event.pageSize + event.pageSize;
  }

  // setting report id to edit link to url and also change the title of modal to edit or create respectively
  public addLinkUrl(element, type) {
    this.linkUrlId = element.ddm_rmp_post_report_id;
    if (type == "create") {
      this.addUrlTitle = "Add URL"
      document.querySelector("#add-url-input")["value"] = "";
    } else {
      this.addUrlTitle = "Edit URL"
      document.querySelector("#add-url-input")["value"] = element.link_to_results;
      this.validateLinkToUrl(element.link_to_results)
    }
  }

  // save link to url
  public saveLinkURL() {
    let link = document.querySelector("#add-url-input")["value"]
    let data = { request_id: this.linkUrlId, link_to_results: link }
    Utils.showSpinner();
    this.django.add_link_to_url(data).subscribe(response => {
      if (response['message'] == "updated successfully") {
        document.querySelector("#add-url-input")["value"] = "";
        $('#close_url_modal').click()
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
  public openNewWindow(url) {
    window.open(url)
  }

  // close modal
  public closeTBD_Assigned() {
    $('#close_url_modal').click();
  }

  // used to validate weather input is empty or not
  public validateLinkToUrl(data) {
    if (data == "") this.linkToUrlFlag = true
    else this.linkToUrlFlag = false;
  }

  // to get previous frequency in the form of string
  public getPreviousFreqData(freqArr) {
    let tempArr = []
    if (this.changeFrequency != "One Time") {
      freqArr.map(item => {
        if (item.select_frequency_values == "Other") {
          tempArr.push("Others - " + item.description)
        } else {
          tempArr.push(item.select_frequency_values)
        }
      })
      return tempArr.join()
    } else {
      return "One Time"
    }
  }

  // to get current frequency in the form of string
  public getCurrentFreqData(freqData) {
    let freqList = []
    let finalSelection = []

    if (this.selectedNewFrequency == "One Time") {
      return "One Time"
    } else {
      freqList.push(...this.Select_ots["Daily/Weekly (Monday to Friday) only"], ...this.Select_ots["Monthly or Bi-monthly (select timing)"], ...this.Select_ots["Quarterly (select timing)"], ...this.Select_da["Other"])
      freqData.select_frequency.forEach(item => {
        finalSelection.push(this.getFreqName(item, freqList))
        item.rmp_lookup_select_frequency_id
      })
      return finalSelection.join()
    }

  }

  // get frequency keys from array
  public getFreqName(id, arr) {
    let obj = arr.find(item => item.ddm_rmp_lookup_select_frequency_id == id.ddm_rmp_lookup_select_frequency_id)
    return (obj.select_frequency_values == "Other" || obj.select_frequency_values == "Specific Consensus Period:") ? obj.select_frequency_values + " - " + id.description : obj.select_frequency_values
  }

  // post a comment when frequency is changed
  public postComment(id, text) {
    let report_comment = {
      'ddm_rmp_post_report': id,
      "comment": text,
      "comment_read_flag": false,
      "audience": "",
      "commentor": this.user_name
    };
    this.django.post_report_comments(report_comment).subscribe(response => {
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
    })
  }

}