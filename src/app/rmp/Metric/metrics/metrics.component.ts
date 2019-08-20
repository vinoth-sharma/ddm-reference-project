import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from '@angular/common';
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { AuthenticationService } from "src/app/authentication.service";
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';  //CKEDITOR CHANGE
import { DataProviderService } from "src/app/rmp/data-provider.service";

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {

   namings: any;
  public Editor = ClassicEditor;
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
  description_texts = {
    "ddm_rmp_desc_text_id": 24,
    "module_name": "Help_Metrics",
    "description": ""
  }
  editorHelp: any;
  editModes = false;


  dataLoad:boolean = false;
  public searchText;
  public editing;
  public p;
  model1;
  model2;
  summary: Object;
  report_id: number
  reports: any ;
  metrics: any;
  generated_id_service: any;
  order: any;
  reverse: boolean;
  user_role : string;
  param: any;
  orderType: any;

  public weekDayDict = {Monday: 'M',
  Tuesday: 'T',
  Wednesday: 'W',
  Thursday: 'Th',
  Friday: 'F'};
  public weekDays = ['M',
  'T',
  'W',
  'Th',
  'F'];

  metrics_start_date: any;
  content: object;
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
  admin_dropdown= []
  full_name: string;
  obj: any
 

  // admin_dropdown = [
  //                  {"id":1,"adminName":"Jacquelin Cook Beiter"},
  //                  {"id":2,"adminName":"Aubrey Dubberke"},
  //                  {"id":3,"adminName":"Kenn Griesel"},
  //                  {"id":4, "adminName":"Others"}
  //                  ]
  constructor(private django: DjangoService,private auth_service : AuthenticationService, private generated_report_service: GeneratedReportService,
    private spinner: NgxSpinnerService, private DatePipe: DatePipe, private toastr: ToastrService, private dataProvider : DataProviderService) {
      auth_service.myMethod$.subscribe(role =>{
        if (role) {
          this.user_role = role["role"]
        }
      })

        
      dataProvider.currentlookUpTableData.subscribe(element=>{
        if (element) {
          this.content = element
          let refs = this.content['data']['desc_text']
        let temps = refs.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 24;
        })
        if(temps){
          this.original_contents = temps.description;
        }
        else{ this.original_contents = ""}
        this.namings = this.original_contents;
        // this.ngAfterViewInit()
        }
      })
     }

  ngOnInit() {
    setTimeout(() => {
      this.generated_report_service.changeButtonStatus(false)
    })
    // this.spinner.show()


    this.django.getAllAdmins().subscribe(element =>{
      // console.log("Admin List")
      // console.log(element)
      if(element){
        element['admin_list'].forEach(ele => {
          this.full_name = ele['first_name']+" "+ele['last_name'];
          this.admin_dropdown.push({'full_name':this.full_name, 'users_table_id': ele.users_table_id })
        });
      }
    //   if(element){
    //     element["admin_list"].map(ele => {
    //     this.admin_dropdown['full_name'].push(ele.first_name+" "+ele.last_name);
    //     this.admin_dropdown['users_table_id'].push(ele.users_table_id)
    //   })
    // }
      // console.log(this.admin_dropdown)  
     
    })

    this.admin_selection = {
      text: "Administrator",
      singleSelection: false,
      primaryKey: 'users_table_id',
      labelKey: 'full_name',
      enableSearchFilter: false,
      itemsShowLimit: 1,

    };
     
    
    this.spinner.show();
    this.django.get_report_matrix().subscribe(list => {
      if(list){
      this.reports = list['data'];
      // console.log(this.reports);
      this.dataLoad = true;
      this.reports.map(reportRow => {
        reportRow['ddm_rmp_status_date'] =  this.DatePipe.transform(reportRow['ddm_rmp_status_date'],'dd-MMM-yyyy')
        reportRow['created_on'] =  this.DatePipe.transform(reportRow['created_on'],'dd-MMM-yyyy')
        if (reportRow['frequency_data']) {
          reportRow['frequency_data'].forEach(weekDate => {
            reportRow[this.weekDayDict[weekDate] + 'Frequency'] = 'Y' ;
          });
        }
      });

      for (var i=0; i<this.reports.length; i++) {
        if (this.reports[i]['frequency_data']) {
          this.reports[i]['frequency_data_filtered'] = this.reports[i]['frequency_data'].filter(element => (element != 'Monday' && element != 'Tuesday' && element != 'Wednesday' && element != 'Thursday' && element != 'Friday' && element != 'Other') )
        }
      }
      }
      // //console.log(this.reports)
      this.spinner.hide()
    })
  }

  content_edits(){
    this.spinner.show()
    this.editModes = false;
    this.editorHelp.isReadOnly = true;  //CKEDITOR CHANGE
    this.description_texts["description"] = this.editorHelp.getData()
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {

      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element,index)=>{
        if(element['ddm_rmp_desc_text_id']==23){
          temp_desc_text[index] = this.description_texts
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)  
      ////console.log("changed")    
      this.editModes = false;
      this.ngOnInit()
      this.original_contents = this.namings;
      this.editorHelp.setData(this.namings)
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {

    if(this.editModes){
      this.editorHelp.isReadOnly = true; 
    }
    else{
      this.editorHelp.isReadOnly = false;
    }
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
    this.editorHelp.setData(this.namings);
    $('#edit_button').show()
  }


  sort(typeVal) {
    ////console.log('Sorting by ', typeVal);
    this.param = typeVal.toLowerCase().replace(/\s/g, "_");
    this.param = typeVal;
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
      ////console.log(this.reports);
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
      // //console.log() 
      const transformedData = this.reports.map(item => (headings.map(key => item[key] instanceof Array ? item[key].join(",") : item[key])))
      const colA = wb.cell("A2").value(transformedData);

      workbook.outputAsync().then(function (blob) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          //If IE, you must use a diffrent method 
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
      //console.log(error);
    });
  }

  // setOrder(value?: any) {
  //   if (this.order === value) {
  //     this.reverse = !this.reverse;
  //   }
  //   this.order = value;
  //   // //console.log('setOrder', value, this.order)
  // }

  getMetricsData() {
    
    this.metrics_start_date = ((<HTMLInputElement>document.getElementById('metrics_start_date')).value);
    this.metrics_end_date = ((<HTMLInputElement>document.getElementById('metrics_end_date')).value);
    if(this.selectedItems[0]){
      this.obj = {'start_date' : this.metrics_start_date, 'end_date' : this.metrics_end_date, 'users_table_id': this.selectedItems[0].users_table_id}  
    }else{
      this.obj = {'start_date' : this.metrics_start_date, 'end_date' : this.metrics_end_date, 'users_table_id': ""}
    }
    // let obj = {'start_date' : this.metrics_start_date, 'end_date' : this.metrics_end_date, 'users_table_id': this.selectedItems[0].users_table_id}
    this.spinner.show()
    this.django.metrics_aggregate(this.obj).subscribe(list => {
      // console.log(list)
        this.metrics = list
        this.totalReports = this.metrics['total_report_count'];
        this.averageByDay= this.metrics['avg_by_days']
        this.reportByDay = this.metrics['report_by_day']
        this.reportByMonth = this.metrics['report_by_month']
        this.reportByOrg = this.metrics['report_by_organization']
        // console.log(this.reportByOrg);
        this.reportByQuarter = this.metrics['report_by_quater']
      //  console.log(this.monday_average)
      // //console.log(this.reports)
      this.spinner.hide();
    },err =>{
      this.spinner.hide();
      this.toastr.error("Server Error");
    })
    // console.log("Start Date:"+this.metrics_start_date);
    // console.log("End Date:"+this.metrics_end_date);
  }

  /*--------------------Global Search---------------------*/

  public searchGlobalObj = {'ddm_rmp_post_report_id': this.searchText, 'created_on': this.searchText, 
  'ddm_rmp_status_date': this.searchText, 'status':this.searchText, 'assigned_to':this.searchText, 
  'requestor':this.searchText, 'organization' :this.searchText, 'recipients_count': this.searchText, 
  'freq': this.searchText, 'report_count': this.searchText}

  searchObj ;
  globalSearch(event) {
    this.searchText = event.target.value;
    // console.log("Searchtext")
    // console.log(this.searchText)
    // console.log(this.searchGlobalObj)
    this.searchGlobalObj["ddm_rmp_post_report_id"] = event.target.value;
    this.searchGlobalObj["ddm_rmp_status_date"] = event.target.value;
    this.searchGlobalObj["created_on"] = event.target.value;
    this.searchGlobalObj["status"] = event.target.value;
    this.searchGlobalObj["assigned_to"] = event.target.value;
    this.searchGlobalObj["requestor"] = event.target.value;
    this.searchGlobalObj["organization"] = event.target.value;
    this.searchGlobalObj["recipients_count"] = event.target.value;
    this.searchGlobalObj["report_count"] = event.target.value;
    this.searchGlobalObj["freq"] = event.target.value;
    this.searchObj = this.searchGlobalObj;
    // console.log(this.searchGlobalObj)
    setTimeout(() => {
      this.reports = this.reports.slice();
    }, 0);
  }

  columnSearch(event,obj){
    // console.log(event)
    this.searchObj =  {
      [obj] : event.target.value
    }

  }  

  // admin_dropdown = [];
  // admin_selection = {};
  

  
}
