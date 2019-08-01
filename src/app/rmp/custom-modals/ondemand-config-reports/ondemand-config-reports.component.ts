import { Component, OnInit,Input,SimpleChanges,Output,EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from "../../../create-report/shared-data.service";
import { CreateReportLayoutService } from '../../../create-report/create-report-layout/create-report-layout.service'
import { Router } from '@angular/router';
import Utils from "../../../../utils";
import { ScheduleService } from '../../../schedule/schedule.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { OndemandService } from '../ondemand.service';

@Component({
  selector: 'app-ondemand-config-reports',
  templateUrl: './ondemand-config-reports.component.html',
  styleUrls: ['./ondemand-config-reports.component.css']
})

export class OndemandConfigReportsComponent implements OnInit {

  public odcRequestNumber:any = '';
  public odcTitle:any = '';
  public odcName:any = '';
  public odcReportId:any;
  public odcSheetId:any;
  public requestDetails:any;
  public semanticLayerId:any;
  public reportDataSource:any;
  public rmpReports:any;
  public odcColumns:any;
  public odcRecievedDetails:any;


  @Input() requestNumber:any;
  @Input() title:any;
  @Input() name:any;
  @Input() details:any={};
  @Input() reportId:any; 

  @Output() odcScheduleConfirmation = new EventEmitter();


  public odcData = {sheet_id:'',
                    request_id:'',
                    report_list_id:'',
                    parameter_json:[]
                   };

  public sheetNames:any


  constructor(private activatedRoute: ActivatedRoute,
              public scheduleService: ScheduleService,
              private sharedDataService: SharedDataService,
              private createReportLayoutService: CreateReportLayoutService,
              public router: Router,
              private django: DjangoService,
              private onDemandService:OndemandService) { }

  ngOnInit() {
    console.log("INPUT details",this.details);
  }

  ngOnChanges(changes:SimpleChanges){
    Utils.showSpinner();
    console.log("CHANGES IN ODC",changes);

    this.odcRequestNumber = this.requestNumber;  ///COORECTED VALUES,LOOK INTO PROBLEM I.EMREQiD AND rEPiD ULTA,i.e while recieving from parent,check it  
    this.odcTitle = this.title;
    this.odcName = this.name;
    this.odcReportId = this.reportId ;
    console.log("requestNumber in changes",this.odcRequestNumber);
    console.log("requestTitle in changes",this.odcTitle);
    console.log("requestName in changes",this.odcName);
    console.log("reportNumber in changes",this.odcReportId);

    // ORIGINAL CALL
    // this.onDemandService.getOnDemandConfigDetails(this.odcRequestNumber,this.odcReportId).subscribe(res=>{
    //   console.log("NEW getOnDemandConfigDetails RESULTS",res); 
    // })
    
    this.onDemandService.getOnDemandConfigDetails(this.odcReportId,this.odcRequestNumber).subscribe(res=>{
      console.log("NEW getOnDemandConfigDetails RESULTS",res); 
      this.odcRecievedDetails = res;
      this.sheetNames = this.odcRecievedDetails['data'].map(i=>i.sheet_name);
      this.sheetNames.unshift('');
    })
 


    // Utils.showSpinner();
    // this.getRequestDetails();

    // getRequestDetails
    // let id;
    // this.django.get_report_list().subscribe(list => {
    //   if(list){
    //     this.rmpReports = list['data'];
    //     console.log("RMP reports",this.rmpReports);} //DDM Name?
    // })

    // this.rmpReports.map(i=>{
    //   if(i.report_name === this.odcName && i.title === this.odcTitle) {
    //     console.log( i.ddm_rmp_post_report_id);
    //     id=i.ddm_rmp_post_report_id
    //   }
    // });

    // this.createReportLayoutService.getRequestDetails(id).subscribe( res =>{
    //   this.requestDetails = res;
    //   console.log("this.requestDetails OBJECT",this.requestDetails);
    //   // this.odScheduleShow.emit(true);
    // },error =>{
    //   this.requestDetails = [];
    // });
    // Utils.hideSpinner();
  }

  public setSheetValues(event:any){
    let sheetName = event.currentTarget.value;
    if(sheetName){
    console.log(sheetName,"called successfully!");

    // getting the sheetId for final submission
    this.odcRecievedDetails['data'].map(i=>{if(i.sheet_name == sheetName){this.odcSheetId = i.sheet_id}});
    
    /// fetch respective details from the dupebody/dynamic data
    let columnProperties;
    this.odcRecievedDetails['data'].map(i=>{
      if(i.sheet_name === sheetName){ 
        columnProperties =  i.column_properties;
      }})

    this.odcColumns = columnProperties.map(i=>i.mapped_column);
    }
    else{
      console.log("setSheetValues is not called!");
    }
  }

  /// CROSS CHECK FOR REPORT ID WITH DDM-POST-REPORT-ID
  // getRequestDetails(){
  //   let id;
    
  //   this.django.get_report_list().subscribe(list => {
  //     if(list){
  //       this.rmpReports = list['data'];
  //       console.log("RMP reports",this.rmpReports);} //DDM Name?
  //   })

  //   this.rmpReports.map(i=>{
  //     if(i.report_name === this.odcName && i.title === this.odcTitle) {
  //       console.log( i.ddm_rmp_post_report_id);
  //       id=i.ddm_rmp_post_report_id
  //     }
  //   });

  //   this.createReportLayoutService.getRequestDetails(id).subscribe( res =>{
  //     this.requestDetails = res;
  //     console.log("this.requestDetails OBJECT",this.requestDetails);
  //     // this.odScheduleShow.emit(true);
  //   },error =>{
  //     this.requestDetails = [];
  //   });
  // }

  public updateOnDemandConfigurable(){
    console.log("updateOnDemandConfigurable called successfully");
    console.log("capturing the inputs");

    let odcValues = document.getElementsByClassName("odcValues");
    console.log("INPUT VALUES",odcValues);

    let odcValuesArray = [].slice.call(odcValues)
    let odcValuesFinal= odcValuesArray.map(i=> i.firstChild.value)
    console.log("FINAL submitting values",odcValuesFinal);

    // // getting the mapped_columns,,got already odc?
    // let mappedColumns = this.

    // getting the parameterJson
    let parameterJson = odcValuesFinal.map((d, i) => {
      var myObj = {};
      myObj[this.odcColumns[i]] = d;
      return myObj; 
    })

    this.odcData= { 
                sheet_id : this.odcSheetId,
                request_id: this.odcRequestNumber,   
                report_list_id: this.odcReportId,
                parameter_json: parameterJson
              };
    

    console.log("Submitting the odcData",this.odcData);

    this.onDemandService.postOnDemandConfigDetails(this.odcData).subscribe(res=>{
      console.log("this.odcData submitted successfully",res);
      let odcInfoObject = {confirmation:true,type:'On Demand Configurable'}
      this.odcScheduleConfirmation.emit(odcInfoObject);
    },error =>{
      //error message
    });


    
  }

}
