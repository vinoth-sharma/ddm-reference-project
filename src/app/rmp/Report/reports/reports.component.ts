import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common'
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';  //CKEDITOR CHANGE 
import { AuthenticationService } from "src/app/authentication.service";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { Router } from '@angular/router';

import Utils from "../../../../utils"
declare var $: any;
import { ToastrService } from "ngx-toastr";
import { CreateReportLayoutService } from '../../../create-report/create-report-layout/create-report-layout.service';

import { ScheduleService } from '../../../schedule/schedule.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit,AfterViewInit {
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
  favourite: any = [];
  user_role : string;
  param: any;
  orderType: any;
  content: object;
  original_contents: any;
  public userId:any ={};
  public todaysDate: string;
  public semanticLayerId:any;
  public reportDataSource:any;
  public onDemandScheduleData:any = {};
  public confirmationValue:any;
  public selectedRequestId:any;
  public reportContainer:any;

  public reportTitle:any;
  public reportName:any;
  public reportRequestNumber:any;
  public reportId: any;
  public reportNameOD:any;
  public reportRequestNumberOD:any;
  public reportIdOD: any;
  

  constructor(private generated_id_service: GeneratedReportService,
    private auth_service :AuthenticationService, 
    private django: DjangoService, 
    private spinner: NgxSpinnerService,
    private dataProvider : DataProviderService,
    private DatePipe: DatePipe,
    public scheduleService: ScheduleService,
    public router: Router,
    private toasterService: ToastrService,
    private createReportLayoutService: CreateReportLayoutService) {
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
        if(temps){
          this.original_contents = temps.description;
        }
        else{ this.original_contents = ""}
        this.namings = this.original_contents;
        // this.ngAfterViewInit()
        }
      })
  }

  getValues(obj: Object) {
    return Object.values(obj);
  }

  ngOnInit() {
        // obtaining the semantic_layer_id
        this.router.config.forEach(element => {
          if (element.path == "semantic") {
            this.semanticLayerId = element.data["semantic_id"];
            // console.log("PROCURED SL_ID",this.semanticLayerId);
          }
        });        
            
        // obtaining the ddm_reports
        Utils.showSpinner();
        this.scheduleService.getScheduledReports(this.semanticLayerId).subscribe    (res =>{
          // console.log("INCOMING RESPONSE",res);
          this.reportDataSource = res['data'];
          // console.log("DDM reports for scheduling",this.reportDataSource);
          Utils.hideSpinner();
        },error => {
            // console.log("Unable to get the tables")
            Utils.hideSpinner();
          }
         );



        // to be removed
        // Utils.showSpinner();
        // this.scheduleService.getScheduledReports(this.semanticLayerId).subscribe    (res =>{
        //   console.log("INCOMING RESPONSE",res);
        //   this.reportDataSource = res['data'];
        //   console.log("DDM reports",this.reportDataSource);
        //   Utils.hideSpinner();
        // },error => {
        //     console.log("Unable to get the tables")
        //     Utils.hideSpinner();
        //   }
        //  );

    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    // this.spinner.show()
    
    this.django.get_report_list().subscribe(list => {
      // console.log(list);
      if(list){
        // this.reportContainer
        this.reportContainer = list['data'];
        // console.log('report container')
        // console.log("REPORT CONTAINER values",this.reportContainer)
        
        
        this.reportContainer.map(reportRow => {
          reportRow['ddm_rmp_status_date'] =  this.DatePipe.transform(reportRow['ddm_rmp_status_date'],'dd-MMM-yyyy')
          if (reportRow['frequency_data']) {
            reportRow['frequency_data'].forEach(weekDate => {
              reportRow[this.weekDayDict[weekDate] + 'Frequency'] = 'Y' ;
            });
          }
       });
        //console.log(this.reportContainer)
        ////console.log(this.reportContainer);
        for (var i=0; i<this.reportContainer.length; i++) {
          if (this.reportContainer[i]['frequency_data']) {
            this.reportContainer[i]['frequency_data_filtered'] = this.reportContainer[i]['frequency_data'].filter(element => (element != 'Monday' && element != 'Tuesday' && element != 'Wednesday' && element != 'Thursday' && element != 'Friday' && element != 'Other') )
          }
        }
        // this.reportContainer.sort((a,b)=>(b['favorites'] > a['favorites'])? 1 : ((a['favorites'] > b['favorites'])? -1 : 0));
        // this.reportContainer = JSON.parse(this.reportContainer)
        this.reportContainer.sort((a,b) => {
          if (b['favorites'] == a['favorites']) {
            return a['report_name'] > b['report_name'] ? 1 : -1
          }
          return b['favorites'] > a['favorites'] ? 1 : -1 
        })
        this.reports = this.reportContainer
        // this.reports_freq_desc = this.reports.filter(element.frequency_data)
        // console.log("THIS IS RMP REPORTS-",this.reports)
      }
      // this.spinner.hide()
    }, err => {
      // this.spinner.hide()
    })
  }

  ngAfterViewInit(){
    ClassicEditor.create(document.querySelector('#ckEditorHelp'), this.editorConfig).then(editor => {
      this.editorHelp = editor;
      // ////console.log('Data: ', this.editorData);
      this.editorHelp.setData(this.namings);
      this.editorHelp.isReadOnly = true;
      // ClassicEditor.builtinPlugins.map(plugin => ////console.log(plugin.pluginName))
    })
      .catch(error => {
        ////console.log('Error: ', error);
      });
  }

  checked(id, event) {
    this.spinner.show()
    ////console.log(event.target.checked);
    this.favourite = event.target.checked;
    var finalObj = {'report_id' : id, 'favorite' : this.favourite}
    this.django.ddm_rmp_favourite(finalObj).subscribe(response=>{
      
      if(response['message'] == "success"){
        this.spinner.hide()
        ////console.log(response)
      }
      },err=>{
        this.spinner.hide()
      })
    }
  

  // push_check(id: number) {
    
  // }

  sort(typeVal) {
    ////console.log('Sorting by ', typeVal);
    // this.param = typeVal.toLowerCase().replace(/\s/g, "_");

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
      ////console.log(error);
    });
  }

  setOrder(value: any) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
    // ////console.log('setOrder', value, this.order)
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

  public goToReports(selectedReportName:string,reportTitle:string){
    Utils.showSpinner();
    // console.log("SELECTED ddm-report:",selectedReportName);
    
    let isOnDemandOnly;
    // console.log("RMP reports check",this.reports)
    // isOnDemandOnly = this.reports.filter(i => i['report_name'] === selectedReportName).map(i=>{if(i['description']!= null) {i['description'].toUpperCase().includes("ON DEMAND")} else return 0;})

    this.reports.filter(i => i['report_name'] === selectedReportName).map(i=>{if(i['frequency']!= null){
      if(i['frequency'].includes("On Demand Configurable")){ 
        isOnDemandOnly = i.frequency;
        // console.log("isOnDemandOnly value procured:",isOnDemandOnly);
      } 
      else if(i['frequency'].includes("On Demand"))
      {
        isOnDemandOnly = i.frequency;
        // console.log("isOnDemandOnly value procured:",isOnDemandOnly);
      }
    }});
    
    // On Demand configurable reports only
    if(isOnDemandOnly === "On Demand Configurable"){
      let tempReport = this.reports.filter(i => i['report_name'] === selectedReportName && i['title'] === reportTitle)
      // console.log("tempReport for checking",tempReport)

      this.reportTitle = tempReport.map(i=>i['title'])[0];
      this.reportName = tempReport.map(i=>i['report_name'])[0];
      this.reportId = tempReport.map(i=>i['report_list_id'])[0];
      
      this.reportContainer.map(i=>{ 
        if(i.report_name === this.reportName && i.title === this.reportTitle){
          this.reportRequestNumber = i.ddm_rmp_post_report_id;
        }
      });
      $('#onDemandScheduleConfigurableModal').modal('show');
      Utils.hideSpinner();
      return;
    }

    // On Demand reports only
    else if(isOnDemandOnly === "On Demand"){
      Utils.showSpinner();
      let tempReport = this.reports.filter(i => i['report_name'] === selectedReportName && i['title'] === reportTitle)
      // this.reportNameOD = tempReport.map(i=>i['report_name'])[0]; /// also triggering the ODC now coz this var is an @INPUT()
      this.reportRequestNumberOD = tempReport.map(i=>i['ddm_rmp_post_report_id'])[0];
      this.reportIdOD = tempReport.map(i=>i['report_list_id'])[0];
      $('#onDemandModal').modal('show');
      Utils.hideSpinner();
      // return;
    }

    // NOT A NECESSARY ELSE CONDITION,REMOVE IF NOT REQUIRED
    else{
      this.toasterService.error('Frequency Error!');
      return;
    }
  }

   public startOnDemandScheduling(data){
    // console.log("onDemandScheduleNow details",data);
    let dateDetails = new Date();
    let todaysDate = (dateDetails.getMonth()+1)+ '/' + (dateDetails.getDate()) + '/' + (dateDetails.getFullYear())
    
    // time setting logic
    let hours = dateDetails.getHours();
    let minutes = (dateDetails.getMinutes()+10);
    let scheduleTime = hours + ':' + minutes
    if(hours >= 24){
      hours = hours%24;
      if(minutes >= 50){
        minutes = minutes%50;
      }
    }
    if(minutes >= 50){
      minutes = minutes%50;
      hours = hours + 1;
      if(hours >= 24){
        hours = hours%24;
        if(minutes >= 50){
          minutes = minutes%50;
        }
      }
    }
    scheduleTime = hours + ':' + minutes

    // Utils.showSpinner();
    this.auth_service.errorMethod$.subscribe(userId => this.userId = userId);
    // console.log("USER ID is",this.userId);
    
    //obtaining the report id of the od report from RMP reports
    this.selectedRequestId = this.reports.filter(i => i['report_name'] === this.reportName).map(i=>i.ddm_rmp_post_report_id)

    // SCHEDULE REPORT ID WAY from DDM report
    let scheduleReportId;
    // OLD approach // scheduleReportId = this.reportDataSource.filter(i => i['report_name'] === this.reportName).map(i => i['report_schedule_id'])[0]
    // this.scheduleService.scheduleReportIdFlag = scheduleReportId;
    // console.log("this.scheduleReportId VALUE:",scheduleReportId)

    if(data.scheduleId[0].length === 1){
      scheduleReportId = data.scheduleId[0];
    }
    else if(data.scheduleId[0].length > 1){
      scheduleReportId = data.scheduleId[0][0];
    }

    if(data.scheduleId.length === 0 || scheduleReportId === undefined || scheduleReportId === []){
      this.toasterService.error('Scheduling error!');
      this.toasterService.error('Please ask the admin to configure scheduling parameters!');
      Utils.hideSpinner();
      return;
    }

    // for retreieving the data of a specific report
    this.scheduleService.getScheduleReportData(scheduleReportId).subscribe(res=>{
      // console.log("INCOMING RESULTANT DATA OF REPORT",res['data']);
     if(res){
      let originalScheduleData = res['data']
      
      // setting the new params ERROR HAPPENNING HERE!!!
      this.onDemandScheduleData = originalScheduleData;
      this.onDemandScheduleData.schedule_for_date = todaysDate,
      this.onDemandScheduleData.schedule_for_time = scheduleTime,
      this.onDemandScheduleData.request_id = this.selectedRequestId[0];
      this.onDemandScheduleData.created_by = this.userId;
      this.onDemandScheduleData.modified_by = this.userId;
      // console.log("The ONDEMAND VALUES ARE:",this.onDemandScheduleData);

      if(data.confirmation === true && (data.type === 'On Demand' || data.type === 'On Demand Configurable') ){
        Utils.showSpinner();
        this.scheduleService.updateScheduleData(this.onDemandScheduleData).subscribe(res => {
          this.toasterService.success("Your "+data['type']+" schedule process triggered successfully");
          this.toasterService.success('Your report will be delivered shortly');
          Utils.hideSpinner();
          Utils.closeModals();
          // this.update.emit('updated');
        }, error => {
          Utils.hideSpinner();
          this.toasterService.error('Report schedule failed');
        });
      }

      // Utils.hideSpinner();
      // $('#onDemandModal').modal('show');
    }
    }); 
  
    // if(data.confirmation === true && (data.type === 'On Demand' || data.type === 'On Demand Configurable') ){
    //   Utils.showSpinner();
    //   this.scheduleService.updateScheduleData(this.onDemandScheduleData).subscribe(res => {
    //     this.toasterService.success("Your "+data['type']+" schedule process triggered successfully");
    //     this.toasterService.success('Your report will be delivered shortly');
    //     Utils.hideSpinner();
    //     Utils.closeModals();
    //     // this.update.emit('updated');
    //   }, error => {
    //     Utils.hideSpinner();
    //     this.toasterService.error('Report schedule failed');
    //   });
    // }
  }

  
  // public onDemandConfigurableScheduleNow(data){
  //   if(data === true){
  //     Utils.showSpinner();
  //     this.scheduleService.updateScheduleData(this.onDemandScheduleData).subscribe(res => {
  //       this.toasterService.success('ON-DEMAND Report schedule process triggered successfully');
  //       this.toasterService.success('Your report will be delivered shortly');
  //       Utils.hideSpinner();
  //       Utils.closeModals();
  //       // this.update.emit('updated');
  //     }, error => {
  //       Utils.hideSpinner();
  //       this.toasterService.error('Report schedule failed');
  //     });
  //   }
  // }

  public commonScheduler(){
    /// shift the whole od only schedule logic here 
    // but look at the event trigger got by the child components also
    // so just set the sending params to odc 
    // in od just cakll common scheduler

  }

  public searchGlobalObj = { 'ddm_rmp_post_report_id': this.searchText,
  'ddm_rmp_status_date': this.searchText, 'report_name': this.searchText, 'title': this.searchText,'frequency': this.searchText}

  searchObj ;
  /*--------------------Global Search---------------------*/
  globalSearch(event) {
    this.searchText = event.target.value;
    // console.log("Searchtext")
    // console.log(this.searchText)
    // console.log(this.searchGlobalObj)
    this.searchGlobalObj["ddm_rmp_post_report_id"] = event.target.value;
    this.searchGlobalObj["ddm_rmp_status_date"] = event.target.value;
    this.searchGlobalObj["report_name"] = event.target.value;
    this.searchGlobalObj["title"] = event.target.value;
    this.searchGlobalObj["frequency"] = event.target.value;
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
}