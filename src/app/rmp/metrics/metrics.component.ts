import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { DatePipe } from '@angular/common';
import * as Rx from "rxjs";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { AuthenticationService } from "src/app/authentication.service";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import Utils from '../../../utils';
@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {

  public namings: any;
  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_texts = {
    "ddm_rmp_desc_text_id": 24,
    "module_name": "Help_Metrics",
    "description": ""
  };
  public editModes = false;
  public dataLoad: boolean = false;
  public searchText;
  public editing;
  public p;
  public model1;
  public model2;
  public summary: Object;
  public report_id: number
  public reports: any;
  public metrics: any;
  public generated_id_service: any;
  public order: any;
  public reverse: boolean;
  public user_role: string;
  public param: any;
  public orderType: any;
  public textChange = false
  public cancelledReports ;
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
        let temps = refs.find(element => element["ddm_rmp_desc_text_id"] == 24);
        if (temps)  this.original_contents = temps.description;
        else this.original_contents = "" 
        this.namings = this.original_contents;
      }
    });

    this.Status_List = [      
      { 'status_id': 1, 'status': 'Completed' },
      { 'status_id': 2, 'status': 'Cancelled' }
    ]
  }

  public notify() {
    this.enable_edits = !this.enable_edits;
    this.parentsSubject.next(this.enable_edits);
    this.editModes = true;
    $('#edit_button').hide();
  }

  public ngOnInit() {
    this.generated_report_service.changeButtonStatus(false);

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

    // Utils.showSpinner();
    this.django.get_report_matrix().subscribe(list => {
      if (list) {
        this.reports = list['data'];
        this.dataLoad = true;

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
          reportRow['ddm_rmp_status_date'] = this.DatePipe.transform(reportRow['ddm_rmp_status_date'], 'dd-MMM-yyyy');
          reportRow['created_on'] = this.DatePipe.transform(reportRow['created_on'], 'dd-MMM-yyyy');
          if (reportRow['frequency_data']) {
            reportRow['frequency_data'].forEach(weekDate => {
              reportRow[this.weekDayDict[weekDate] + 'Frequency'] = 'Y';
            });
          }
        });

        for (var i = 0; i < this.reports.length; i++) {
          if (this.reports[i]['frequency_data']) {
            let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Other'];
            this.reports[i]['frequency_data_filtered'] = 
            this.reports[i]['frequency_data'].filter(element => !days.includes(element));
          }
        }
      }
      // Utils.hideSpinner();
    })
  }

  public filterData() {
    if (this.statusFilter.length)
      this.filters.status = this.statusFilter[0] ? this.statusFilter[0].status : '';
    else  this.filters.status = '';
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }

  public textChanged(event) {
    this.textChange = true;
    if(!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

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
          if (element['ddm_rmp_desc_text_id'] == 23) {
            temp_desc_text[index] = this.description_texts
          }
        })
        this.content['data']['desc_text'] = temp_desc_text;
        this.dataProvider.changelookUpTableData(this.content);
        this.editModes = false;
        this.ngOnInit();
        this.original_contents = this.namings;
        this.toastr.success("Updated Successfully");
        Utils.hideSpinner();
      }, err => {
        Utils.hideSpinner();
        this.toastr.error("Data not Updated")
      })
    } else {
      this.toastr.error("please enter the data");
    }
  }

  public edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_contents;
  }

  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_contents;
  }

  public sort(typeVal) {
    this.param = typeVal.toLowerCase().replace(/\s/g, "_");
    this.param = typeVal;
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
  }

  public xlsxJson() {
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

  public getMetricsData() {
    if (this.selectedItems.length > 0) {
    let arrayOfIds = [];
      this.selectedItems.forEach(item => arrayOfIds.push(item.users_table_id));
      this.obj = { 
                    'start_date': this.metrics_start_date, 
                    'end_date': this.metrics_end_date, 
                    'users_table_id': arrayOfIds.join(), 
                    'role_id':this.selectedItems[0].role_id 
                 };   
    } else {
      this.obj = { 
                    'start_date': this.metrics_start_date, 
                    'end_date': this.metrics_end_date, 
                    'users_table_id': '', 'role_id':'' 
                 }; 
    }

    Utils.showSpinner();
    this.django.metrics_aggregate(this.obj).subscribe(list => {
      this.metrics = list;
      this.totalReports = this.metrics['data']['report_count'];
      //this.averageByDay = this.metrics['avg_by_days']
      this.reportByDay = this.metrics['data']['report_by_weekday'];
      this.reportByMonth = this.metrics['data']['report_by_month'];
      this.reportByOrg = this.metrics['data']['report_by_organization'];
      this.reportByQuarter = this.metrics['data']['report_by_quarter'];
      this.cancelledReports = this.metrics['data']['cancelled_reports'];
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
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
  
  public columnSearch(event, obj) {
    this.searchObj = {
      [obj]: event.target.value
    }
  }

  
  // filterData() {
  //   //console.log('Filters: ', this.filters);
  //   this.searchObj = JSON.parse(JSON.stringify(this.filters));
  // }
}
