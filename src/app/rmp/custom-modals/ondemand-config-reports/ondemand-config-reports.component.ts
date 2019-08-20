import { Component, OnInit,Input,SimpleChanges,Output,EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from "../../../create-report/shared-data.service";
import { CreateReportLayoutService } from '../../../create-report/create-report-layout/create-report-layout.service'
import { Router } from '@angular/router';
import Utils from "../../../../utils";
import { ScheduleService } from '../../../schedule/schedule.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { OndemandService } from '../ondemand.service';
import { ToastrService } from "ngx-toastr";

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
  public isLoading:boolean = true;
  public onDemandScheduleId:any;
  public odcInfoObject:any;


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
              private toasterService: ToastrService,
              private onDemandService:OndemandService) { }

  ngOnInit() {
    // console.log("ODC called only!")
    // console.log("INPUT details",this.details);
    this.isLoading = true;
  }

  ngOnChanges(changes:SimpleChanges){
    this.isLoading = true;
    // console.log("CHANGES IN ODC",changes);

    this.odcRequestNumber = this.requestNumber;
    this.odcTitle = this.title;
    this.odcName = this.name;
    this.odcReportId = this.reportId ;
    // console.log("requestNumber in changes",this.odcRequestNumber);
    // console.log("requestTitle in changes",this.odcTitle);
    // console.log("requestName in changes",this.odcName);
    // console.log("reportNumber in changes",this.odcReportId);
    
    this.onDemandService.getOnDemandConfigDetails(this.odcReportId,this.odcRequestNumber).subscribe(res=>{
      // console.log("NEW getOnDemandConfigDetails RESULTS",res); 
      this.odcRecievedDetails = res;
      this.sheetNames = this.odcRecievedDetails['data'].map(i=>i.sheet_name);
      this.onDemandScheduleId = this.odcRecievedDetails['data'].splice(-1).map(i=>i.schedule_id)
      if(!this.onDemandScheduleId){
        this.toasterService.error('Please ask the admin to configure scheduling parameters!');
        return;
      }
      this.sheetNames.unshift('');
      this.sheetNames.splice(-1);
      this.isLoading = false;   ///use the mat-spinner
    })
  }

  public setSheetValues(event:any){
    let sheetName = event.currentTarget.value;
    if(sheetName){
    // console.log(sheetName,"called successfully!");

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
      // console.log("setSheetValues is not called!");
    }
  }

  public updateOnDemandConfigurable(){
    // console.log("updateOnDemandConfigurable called successfully");
    // console.log("capturing the inputs");

    let odcValues = document.getElementsByClassName("odcValues");
    console.log("INPUT VALUES",odcValues);

    let odcValuesArray = [].slice.call(odcValues)
    let odcValuesFinal= odcValuesArray.map(i=> i.firstChild.value)
    // console.log("FINAL submitting values",odcValuesFinal);

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
    

    // console.log("Submitting the odcData",this.odcData);

    this.onDemandService.postOnDemandConfigDetails(this.odcData).subscribe(res=>{
      // console.log("this.odcData submitted successfully",res);
      if(this.onDemandScheduleId){
        this.odcInfoObject = {confirmation:true,type:'On Demand Configurable',scheduleId:this.onDemandScheduleId,status:true}
      }
      else{
        this.odcInfoObject = {confirmation:true,type:'On Demand Configurable',scheduleId:this.onDemandScheduleId,status:false}
      }
      this.odcScheduleConfirmation.emit(this.odcInfoObject);
    },error =>{
      //error message
    });


    
  }

}
