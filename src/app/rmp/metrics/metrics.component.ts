import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as Rx from 'rxjs';
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
declare var $: any;

import { DjangoService } from 'src/app/rmp/django.service';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { AuthenticationService } from 'src/app/authentication.service';
import { DataProviderService } from 'src/app/rmp/data-provider.service';
import Utils from '../../../utils';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit, AfterViewInit {

  public namings: any;
  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_texts = {
    'ddm_rmp_desc_text_id': 17,
    'module_name': 'Help_Metrics',
    'description': ''
  };
  public editModes = false;
  public dataLoad = false;
  public searchText: any;
  public editing: any;
  public p: any;
  public model1: any;
  public model2: any;
  public summary: Object;
  public report_id: number;
  public reports: any;
  public metrics: any;
  public generated_id_service: any;
  public order: any;
  public reverse: boolean;
  public user_role: string;
  public param: any;
  public orderType: any;
  public textChange = false;
  public cancelledReports: any;
  public filters = {
    ddm_rmp_post_report_id: '',
    ddm_rmp_status_date: '',
    created_on: '',
    status: '',
    assigned_to: '',
    requestor: '',
    organization: '',
    recipients_count: '',
    report_count: '',
    freq: '',
    description: '',
    frequency_data_filtered: ''
  }
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
  public metrics_start_date: any;
  public content: object;
  public Status_List: { 'status_id': number; 'status': string; }[];
  public statusFilter = [];
  public original_contents: any;
  public metrics_end_date: any;
  public monday_average: any;
  public averageByDay = [];
  public reportByDay = [];
  public totalReports = [];
  public reportByMonth = [];
  public reportByOrg = [];
  public reportByQuarter = [];
  public tbddropdownListfinal_report = [];
  public selectedItems = [];
  public admin_selection = {};
  public admin_dropdown = []
  public enable_edits = false
  public full_name: string;
  public obj: any
  public StatusSelectedItem = [];
  public StatusDropdownSettings = {};
  public StatusDropdownList = [];
  public readOnlyContentHelper = true;
  public enableUpdateData = false;
  public searchObj: any;
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

  // paginator params
  public paginatorpageSize = 10;
  public paginatorOptions: number[] = [5, 10, 25, 100]
  public paginatorLowerValue = 0;
  public paginatorHigherValue = 10;

  constructor(public django: DjangoService,
    public auth_service: AuthenticationService,
    private generated_report_service: GeneratedReportService,
    private DatePipe: DatePipe,
    private toastr: NgToasterComponent,
    public dataProvider: DataProviderService) {
    auth_service.myMethod$.subscribe(role => {
      if (role)
        this.user_role = role["role"];
    });

    dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.content = element;
        let refs = this.content['data']['desc_text'];
        let temps = refs.find(element => element["ddm_rmp_desc_text_id"] == 17);
        if (temps) this.original_contents = temps.description;
        else this.original_contents = ""
        this.namings = this.original_contents;
      }
    });

    this.Status_List = [
      { 'status_id': 1, 'status': 'Completed' },
      { 'status_id': 2, 'status': 'Cancelled' }
    ]
  }

  // initialization of application
  public ngOnInit() {
    this.generated_report_service.changeButtonStatus(false);
    // get all admin details
    Utils.showSpinner();
    this.django.getAllAdmins().subscribe(element => {
      if (element) {
        element['admin_list'].forEach(ele => {
          this.full_name = ele['first_name'] + " " + ele['last_name'];
          this.admin_dropdown.push({ 'full_name': this.full_name, 'users_table_id': ele.users_table_id, 'role_id': 1 });
        });
        this.admin_dropdown.push({ 'full_name': 'Non-Admin', 'users_table_id': '', 'role_id': 2 });
      }
    })
    this.StatusDropdownSettings = {
      text: "Status",
      singleSelection: true,
      primaryKey: 'status_id',
      labelKey: 'status',
    };

    this.admin_selection = {
      text: "Administrator",
      singleSelection: false,
      primaryKey: 'users_table_id',
      labelKey: 'full_name',
      enableSearchFilter: true,
      badgeShowLimit: 1,
      maxHeight: '200'
    };

    this.django.get_report_matrix().subscribe(list => {
      if (list) {
        this.reports = list['data'];
        this.dataLoad = true;
        this.reports.map(reportRow => {
          reportRow['ddm_rmp_status_date'] = this.DatePipe.transform(reportRow['ddm_rmp_status_date'], 'dd-MMM-yyyy');
          reportRow['created_on'] = this.DatePipe.transform(reportRow['created_on'], 'dd-MMM-yyyy');
          if (reportRow['frequency_data']) {
            reportRow['frequency_data'].forEach(weekDate => {
              reportRow[this.weekDayDict[weekDate] + 'Frequency'] = 'Y';
            });
          }
        });
        for (var i = 0; i < this.reports.length; i++) {
          if (this.reports[i]['frequency_data'] != null) {
            this.reports[i]['frequency_data_filtered'] = this.reports[i]['frequency_data'].filter(element => (element != 'Monday' && element != 'Tuesday' && element != 'Wednesday' && element != 'Thursday' && element != 'Friday'))
            if (this.reports[i]['description'] != null) {
              this.reports[i]['description'].forEach(ele => {
                if (ele != 'Monday' && ele != 'Tuesday' && ele != 'Wednesday' && ele != 'Thursday' && ele != 'Friday') {
                  if (ele != 'Other' && !this.reports[i]['frequency_data_filtered'].includes(ele)) {
                    this.reports[i]['frequency_data_filtered'].push(ele)
                    this.reports[i]['description'] = this.reports[i]['frequency_data_filtered'];
                  }
                }
              })
            }
          }
          else if (this.reports[i]['frequency_data_filtered'] == null) {
            this.reports[i]['frequency_data_filtered'] = [];
          }
        }
        for (var i = 0; i < this.reports.length; i++) {
          if (this.reports[i]['frequency_data_filtered'] != null)
            this.reports[i]['frequency_data_filtered'] = this.reports[i]['frequency_data_filtered'].filter(Boolean);
        }

        this.reports.forEach(ele => {
          if (ele['frequency_data_filtered']) {
            ele['frequency_data_filtered'] = ele['frequency_data_filtered'].join(", ");
          }
          ele['report_name_old'] = ele['report_name'];
          ele['clicked'] = false;
        })
        Utils.hideSpinner();
      }
    });
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

  // filter for global search
  public filterData() {
    if (this.statusFilter.length) {
      this.filters.status = this.statusFilter[0] ? this.statusFilter[0].status : '';
    } else {
      this.filters.status = '';
    }
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }

  // detect changes in quill editor
  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) {
      this.enableUpdateData = false;
    } else {
      this.enableUpdateData = true;
    }
  }

  // saving edited content of help
  public content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner();
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_texts["description"] = this.namings;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {

        let temp_desc_text = this.content['data']['desc_text'];
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 17) {
            temp_desc_text[index] = this.description_texts
          }
        })
        this.content['data']['desc_text'] = temp_desc_text;
        this.dataProvider.changelookUpTableData(this.content);
        this.editModes = false;
        this.ngOnInit();
        this.original_contents = this.namings;
        this.toastr.success('Updated Successfully');
        Utils.hideSpinner();
        $('#helpModal').modal('hide');
      }, err => {
        Utils.hideSpinner();
        this.toastr.error('Data not Updated')
      })
    } else {
      this.toastr.error('please enter the data');
    }
  }

  // reset help parameters
  public resetHelp() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_contents;
  }

  // enable help edit parametrs
  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_contents;
  }

  // set the order type and parametrs
  public sort(typeVal) {
    this.param = typeVal.toLowerCase().replace(/\s/g, '_');
    this.param = typeVal;
    this.reports[typeVal] = !this.reports[typeVal] ? 'reverse' : '';
    this.orderType = this.reports[typeVal];
  }

  // formating date 
  public dateFormat(str: any) {
    const date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("");
  }

  // convert json to excel sheet
  public xlsxJson() {
    let fileName = "Metrics_" + this.dateFormat(new Date()); // changes done by Ganesh
    xlsxPopulate.fromBlankAsync().then(workbook => {
      const EXCEL_EXTENSION = '.xlsx';
      const wb = workbook.sheet('Sheet1');
      const headings = ['Request No', 'Number Of Reports', 'Requestor', 'Recipients', 'Orginization', 'Start Date', 'End Date', 'Administrator', 'Status', 'Frequency', 'Frequency Details', 'Other']
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
    const reportBody = [];
    this.reports.forEach(item => {
      const obj = {
        'Request No': item['ddm_rmp_post_report_id'],
        'Number Of Reports': item['report_count'],
        'Requestor': item['requestor'],
        'Recipients': item['recipients_count'],
        'Orginization': item['organization'],
        'Start Date': item['created_on'],
        'End Date': item['ddm_rmp_status_date'],
        'Administrator': item['assigned_to'],
        'Status': item['status'],
        'Frequency': item['freq'],
        'Frequency Details': item['frequency_data'] ? item['frequency_data'].join() : '',
        'Other': item['description'] ? item['description'] : '',
      }
      reportBody.push(obj);
    });
    return reportBody;
  }

  public columnSearch(event, obj) {
    this.searchObj = {
      [obj]: event.target.value
    };
  }

  // updating pagination page number
  public onPaginationChange(event) {
    this.paginatorLowerValue = event.pageIndex * event.pageSize;
    this.paginatorHigherValue = event.pageIndex * event.pageSize + event.pageSize;
  }
}