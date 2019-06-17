import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';  //CKEDITOR CHANGE 
import { AuthenticationService } from "src/app/authentication.service";
import { DataProviderService } from "src/app/rmp/data-provider.service";

import Utils from "../../../../utils"
declare var $: any;
import { ToastrService } from "ngx-toastr";

import { ScheduleService } from '../../../schedule/schedule.service';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit,AfterViewInit {
  namings: any;
  public Editor = ClassicEditor;
  public editorConfig = {            //CKEDITOR CHANGE 
    removePlugins : ['ImageUpload','ImageButton','MediaEmbed','Iframe','Blockquote','Strike','Save'],
    fontSize : {
      options : [
        9,11,13,'default',17,19,21,23,24
      ]
    }
    // extraPlugins: [this.MyUploadAdapterPlugin]
  };
  description_texts = {
    "ddm_rmp_desc_text_id": 23,
    "module_name": "Help_Reports",
    "description": ""
  }
  editorHelp: any;
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
  order: string = 'info.name';
  reverse: boolean = false;
  report: any;
  sortedCollection: any[];
  column: any[];
  reports: any;
  report_id: any;
  favourite: any = [];
  user_role : string;
  param: any;
  orderType: any;
  content: object;
  original_contents: any;

  constructor(private generated_id_service: GeneratedReportService,
    private auth_service :AuthenticationService, 
    private django: DjangoService, 
    private spinner: NgxSpinnerService,
    private dataProvider : DataProviderService,
    public scheduleService: ScheduleService,
    private toasterService: ToastrService,) {
      this.auth_service.myMethod$.subscribe(role =>{
        if (role) {
          this.user_role = role["role"]
        }
      })
      this.editModes = false;
      dataProvider.currentlookUpTableData.subscribe(element=>{
        if (element) {
          this.content = element
          let refs = this.content['data']['desc_text']
        let temps = refs.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 23;
        })
        this.original_contents = temps.description;
        this.namings = this.original_contents;
        // this.ngAfterViewInit()
        }
      })
  }

  getValues(obj: Object) {
    return Object.values(obj);
  }

  ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    // this.spinner.show()
    this.django.get_report_list().subscribe(list => {
      if(list){
        this.reports = list['data'];
        //console.log('This Is A check')
        console.log(this.reports);
        this.reports.map(reportRow => {
          if (reportRow['frequency_data']) {
            reportRow['frequency_data'].forEach(weekDate => {
              reportRow[this.weekDayDict[weekDate] + 'Frequency'] = 'Y' ;
            });
          }
        });
        console.log(this.reports)
        //console.log(this.reports);
        for (var i=0; i<this.reports.length; i++) {
          if (this.reports[i]['frequency_data']) {
            this.reports[i]['frequency_data_filtered'] = this.reports[i]['frequency_data'].filter(element => (element != 'Monday' && element != 'Tuesday' && element != 'Wednesday' && element != 'Thursday' && element != 'Friday' && element != 'Other') )
          }
        }
        this.reports.sort((a,b)=>(b['favorites'] > a['favorites'])? 1 : ((a['favorites'] > b['favorites'])? -1 : 0));
        // this.reports_freq_desc = this.reports.filter(element.frequency_data)
        //console.log(this.reports)
      }
      // this.spinner.hide()
    }, err => {
      // this.spinner.hide()
    })
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

  checked(id, event) {
    this.spinner.show()
    //console.log(event.target.checked);
    this.favourite = event.target.checked;
    var finalObj = {'report_id' : id, 'favorite' : this.favourite}
    this.django.ddm_rmp_favourite(finalObj).subscribe(response=>{
      
      if(response['message'] == "success"){
        this.spinner.hide()
        //console.log(response)
      }
      },err=>{
        this.spinner.hide()
      })
    }
  

  // push_check(id: number) {
    
  // }

  sort(typeVal) {
    //console.log('Sorting by ', typeVal);
    // this.param = typeVal.toLowerCase().replace(/\s/g, "_");
    this.param = typeVal;
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
    //console.log(this.reports);
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

  setOrder(value: any) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
    // //console.log('setOrder', value, this.order)
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
      //console.log("changed")    
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

  public goToReports(reportName:string,reportFrequency:string){
    // Utils.showSpinner();
    // let tempData =this.dataSource['data'];
    // console.log("tempData VALUE:",tempData)
    // this.scheduleReportId = tempData.filter(i => i['index_number'] === reportName).map(i => i['report_schedule_id'])[0]
    // console.log("this.scheduleReportId VALUE:",this.scheduleReportId)
    // for reteieving the data of a specific report
    // this.scheduleService.getScheduleReportData(this.scheduleReportId).subscribe(res=>{
    //   console.log("INCOMING RESULTANT DATA OF REPORT",res['data'])
    //   this.scheduleService.scheduleReportIdFlag = res['data']['report_schedule_id'] || null;
    //   this.scheduleDataToBeSent = res['data'];
    //   Utils.hideSpinner();
    //   $('#scheduleModal').modal('show');
      
    // }, error => {
    //   Utils.hideSpinner();
    //   this.toasterService.error('Scheduled report loading failed');
    // });

    console.log("SELECTED ddm-report:",reportName);
    console.log("SELECTED ddm-frequency:",reportFrequency);

  }
}