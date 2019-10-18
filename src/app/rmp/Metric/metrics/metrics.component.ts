import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from '@angular/common';
import * as Rx from "rxjs";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { AuthenticationService } from "src/app/authentication.service";
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';
import { DataProviderService } from "src/app/rmp/data-provider.service";

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {

  namings: any;
  public Editor = ClassicEditor;
  public editorConfig = {
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Times New Roman, Times, serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    removePlugins: ['ImageUpload', 'ImageButton', 'Link', 'MediaEmbed', 'Iframe', 'Save'],
    fontSize: {
      options: [
        9, 11, 13, 'default', 17, 19, 21, 23, 24
      ]
    }
  };

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  description_texts = {
    "ddm_rmp_desc_text_id": 24,
    "module_name": "Help_Metrics",
    "description": ""
  }
  editorHelp: any;
  editModes = false;


  dataLoad: boolean = false;
  public searchText;
  public editing;
  public p;
  model1;
  model2;
  summary: Object;
  report_id: number
  reports: any;
  metrics: any;
  generated_id_service: any;
  order: any;
  reverse: boolean;
  user_role: string;
  param: any;
  orderType: any;
  public filters = {
    // global: '',
    ddm_rmp_post_report_id: '',
    ddm_rmp_status_date: '',
    created_on:'',
    status:'',
    assigned_to:'',
    requestor:'',
    organization:'',
    recipients_count:'',
    report_count: '',
    freq: '',    
    description: '',
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
  
  metrics_start_date: any;
  content: object;
  Status_List: { 'status_id': number; 'status': string; }[];
  statusFilter = [];
  original_contents: any;
  metrics_end_date: any;
  monday_average: any;
  averageByDay = [];
  reportByDay = [];
  totalReports = [];
  reportByMonth = [];
  reportByOrg = [];
  reportByQuarter = [];
  tbddropdownListfinal_report = [];
  selectedItems = [];
  admin_selection = {};
  admin_dropdown = []
  enable_edits = false
  full_name: string;
  obj: any
  StatusSelectedItem = [];
  StatusDropdownSettings = {};
  StatusDropdownList = [];
  
  constructor(private django: DjangoService, private auth_service: AuthenticationService, private generated_report_service: GeneratedReportService,
    private spinner: NgxSpinnerService, private DatePipe: DatePipe, private toastr: ToastrService, private dataProvider: DataProviderService) {
    auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
      }
    })


    dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.content = element
        let refs = this.content['data']['desc_text']
        let temps = refs.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 24;
        })
        if (temps) {
          this.original_contents = temps.description;
        }
        else { this.original_contents = "" }
        this.namings = this.original_contents;
      }
    })


    this.Status_List = [      
      { 'status_id': 1, 'status': 'Completed' },
      { 'status_id': 2, 'status': 'Cancelled' }
    ]
  }

  notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  ngAfterViewInit() {
    ClassicEditor.create(document.querySelector('#ckEditorHelp'), this.editorConfig).then(editor => {
      this.editorHelp = editor;
      this.editorHelp.setData(this.namings);
      this.editorHelp.isReadOnly = true;
    })
      .catch(error => {
      });
  }

  ngOnInit() {
    setTimeout(() => {
      this.generated_report_service.changeButtonStatus(false)
    })

    this.django.getAllAdmins().subscribe(element => {
      if (element) {
        element['admin_list'].forEach(ele => {
         
          this.full_name = ele['first_name'] + " " + ele['last_name'];
          this.admin_dropdown.push({ 'full_name': this.full_name, 'users_table_id': ele.users_table_id, 'role_id': 1 })
         
        });
        this.admin_dropdown.push({ 'full_name': 'Non-Admin', 'users_table_id': '', 'role_id': 2 })
      }
    })
    console.log("Check");
    console.log(this.admin_dropdown);
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


    this.spinner.show();
    this.django.get_report_matrix().subscribe(list => {
      if (list) {
        this.reports = list['data'];
        this.dataLoad = true;
        console.log(this.reports);

        // this.reports.forEach(element=>{
        //   if(element['status'] == 'Cancelled'){
        //     element['other'] = element.status;
        //   }
        //   else{
        //     if(element['freq'] == 'One time'){
        //       element['other'] = element.status;
        //     }
        //     else if(element['freq'] == 'Recurring'){
        //       element['other'] = 'Active'
        //     }
        //     else if(element['freq'] == 'On Demand' && element['frequency_data'].length > 1){
        //       element['other'] = 'Active'
        //     }
        //     else if(element['freq'] == 'On Demand Configurable' && element['frequency_data'].length > 1){
        //       element['other'] = 'Active'
        //     }
        //     else if(element['freq'] == 'On Demand' && element['frequency_data'].length == 1){
        //       element['other'] = 'Completed'
        //     }
        //     else if(element['freq'] == 'On Demand Configurable' && element['frequency_data'].length == 1){
        //       element['other'] = 'Completed'
        //     }
        //   }
        // })



        this.reports.map(reportRow => {
          reportRow['ddm_rmp_status_date'] = this.DatePipe.transform(reportRow['ddm_rmp_status_date'], 'dd-MMM-yyyy')
          reportRow['created_on'] = this.DatePipe.transform(reportRow['created_on'], 'dd-MMM-yyyy')
          if (reportRow['frequency_data']) {
            reportRow['frequency_data'].forEach(weekDate => {
              reportRow[this.weekDayDict[weekDate] + 'Frequency'] = 'Y';
            });
          }
        });

        for (var i = 0; i < this.reports.length; i++) {
          if (this.reports[i]['frequency_data']) {
            this.reports[i]['frequency_data_filtered'] = this.reports[i]['frequency_data'].filter(element => (element != 'Monday' && element != 'Tuesday' && element != 'Wednesday' && element != 'Thursday' && element != 'Friday' && element != 'Other'))
          }
        }
      }
      this.spinner.hide()
    })
  }

  filterData() {
    console.log("Data", this.statusFilter);
    if (this.statusFilter.length) {
      this.filters.status = this.statusFilter[0] ? this.statusFilter[0].status : '';
      console.log("Data", this.filters);
    } else {
      this.filters.status = '';
    }
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }

  content_edits() {
    this.spinner.show()
    this.editModes = false;
    this.editorHelp.isReadOnly = true;
    this.description_texts["description"] = this.editorHelp.getData()
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
      this.editorHelp.setData(this.namings)
      this.toastr.success("Updated Successfully");
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server Error");
    })
  }

  edit_True() {
    if (this.editModes) {
      this.editorHelp.isReadOnly = true;
    }
    else {
      this.editorHelp.isReadOnly = false;
    }
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
    this.editorHelp.setData(this.namings);
    $('#edit_button').show()
  }


  sort(typeVal) {
    this.param = typeVal.toLowerCase().replace(/\s/g, "_");
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

  getMetricsData() {

    this.metrics_start_date = ((<HTMLInputElement>document.getElementById('metrics_start_date')).value);
    this.metrics_end_date = ((<HTMLInputElement>document.getElementById('metrics_end_date')).value);
    if (this.selectedItems[0]) {
      console.log("One Selection")
      console.log(this.selectedItems[0])
      this.obj = { 'start_date': this.metrics_start_date, 'end_date': this.metrics_end_date, 'users_table_id': this.selectedItems[0].users_table_id, 'role_id':this.selectedItems[0].role_id }
    } else {
      this.obj = { 'start_date': this.metrics_start_date, 'end_date': this.metrics_end_date, 'users_table_id': '', 'role_id':'' }
    }

    this.spinner.show()
    this.django.metrics_aggregate(this.obj).subscribe(list => {

      this.metrics = list
      this.totalReports = this.metrics['data']['report_count'];
      //this.averageByDay = this.metrics['avg_by_days']
      this.reportByDay = this.metrics['data']['report_by_weekday']
      this.reportByMonth = this.metrics['data']['report_by_month']
      this.reportByOrg = this.metrics['data']['report_by_organization']
      this.reportByQuarter = this.metrics['data']['report_by_quarter']
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error("Server Error");
    })
  }

  /*--------------------Global Search---------------------*/

  // public searchGlobalObj = {
  //   'ddm_rmp_post_report_id': this.searchText, 'created_on': this.searchText,
  //   'ddm_rmp_status_date': this.searchText, 'status': this.searchText, 'assigned_to': this.searchText,
  //   'requestor': this.searchText, 'organization': this.searchText, 'recipients_count': this.searchText,
  //   'freq': this.searchText, 'report_count': this.searchText, 'description': this.searchText
  // }

  searchObj;
  
  columnSearch(event, obj) {
    this.searchObj = {
      [obj]: event.target.value
    }
  }

  
  // filterData() {
  //   //console.log('Filters: ', this.filters);
  //   this.searchObj = JSON.parse(JSON.stringify(this.filters));
  // }
}
