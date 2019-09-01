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
  public saveSettingsData:any;
  public miniSpinner:boolean = false;
  // public saveSettingsFieldsObject:any;


  @Input() requestNumber:any;
  @Input() title:any;
  @Input() name:any;
  @Input() details:any={};
  @Input() reportId:any; 

  @Output() odcScheduleConfirmation = new EventEmitter(); // send schedule-id and status also


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
    // Utils.showSpinner();
    this.isLoading = true;
    // console.log("CHANGES IN ODC",changes);

    this.odcRequestNumber = this.requestNumber;
    this.odcTitle = this.title;
    this.odcName = this.name;
    this.odcReportId = this.reportId ;
    // console.log("requestNumber in changes :",this.odcRequestNumber);
    // console.log("requestTitle in changes :",this.odcTitle);
    // console.log("requestName in changes :",this.odcName);
    // console.log("reportNumber in changes :",this.odcReportId);
    
    // recieve the schedule id also!!!!!!!!!!!!!!
    this.onDemandService.getOnDemandConfigDetails(this.odcReportId,this.odcRequestNumber).subscribe(res=>{
      // console.log("NEW getOnDemandConfigDetails RESULTS",res); 
      this.odcRecievedDetails = res;
      this.sheetNames = this.odcRecievedDetails['data'].map(i=>i.sheet_name);
      /// CHECK THE BELOW STEP HERE SCHEDULEID WAS COMING BEFORE AND NOW IT IS NOT COMING
      this.onDemandScheduleId = this.odcRecievedDetails['data'].splice(-1).map(i=>i.schedule_id)
      this.onDemandScheduleId = this.onDemandScheduleId[0][0]
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
    this.miniSpinner = true;
    let sheetName = event.currentTarget.value;
    if(sheetName){
    // console.log(sheetName,"called successfully!");

    // getting the sheetId for final submission
    this.odcRecievedDetails['data'].map(i=>{if(i.sheet_name == sheetName){this.odcSheetId = i.sheet_id}});

    this.onDemandService.getSaveSettingsValues(this.odcSheetId,this.odcRequestNumber).subscribe(res=>{
      console.log("result values of saveSettings",res);
      let resultData = res['data'].splice(-1);
      this.saveSettingsData = resultData.map(i=>i.fields);
      // console.log("Latest stored savesettings values",this.saveSettingsData);
      // if(t2.length > 0){
      //   /// try adding the spinner before this check is completed in the UI side and show o/p only when this loop is done

      // }
      this.miniSpinner = false;
    })
    /// fetch respective details from the dupebody/dynamic data
    let columnProperties;
    this.odcRecievedDetails['data'].map(i=>{
      if(i.sheet_name === sheetName){ 
        columnProperties =  i.column_properties;
      }
    })
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
    // console.log("INPUT VALUES",odcValues);

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
      if(res){
        this.onDemandService.refreshSaveSettingsValues(this.odcData.sheet_id,this.odcData.request_id).subscribe(res=>{
          // console.log("REFRESHED THE SAVE SETTING VALUES SUCCESSFULLY!,CHECK THE GET() and verify again")
        })
      }
    },error =>{
      //error message
    });
  }

  public updateSaveSettings(){
    // console.log("update Save Settings");

    let saveSettingsValues = document.getElementsByClassName("odcValues");
    console.log("INPUT VALUES",saveSettingsValues);

    let saveSettingsValuesArray = [].slice.call(saveSettingsValues)
    // let saveSettingsValuesFinal= saveSettingsValuesArray.map(i=> i.firstChild.value)
    let saveSettingsValuesFinal= saveSettingsValuesArray.map(i=> i.children[0].value)
    console.log("FINAL submitting values",saveSettingsValuesFinal);
    


    // getting the parameterJson
    // let saveSettingsParameterJson = saveSettingsValuesFinal.map((d, i) => {
    //   let saveSettingsFieldsObject = {};
    //   saveSettingsFieldsObject[this.odcColumns[i]] = d;
    //   return saveSettingsFieldsObject; 
    // })

    // this.odcSheetId is the required sheetId,this.odcRequestNumber is required requestId
    // console.log("saveSettingsParameterJson parameter values",saveSettingsValuesFinal)

    let saveSettingsrequestBody = {
      request_id: this.odcRequestNumber,
      sheet_id: this.odcSheetId,
      fields: saveSettingsValuesFinal
    }

    console.log("saveSettingsrequestBody parameter values",saveSettingsrequestBody)

    // separating the posta and put calls now
    if(JSON.stringify(this.saveSettingsData[0]) === JSON.stringify(saveSettingsValuesFinal)){
      this.onDemandService.postSaveSettings(saveSettingsrequestBody).subscribe(res=>{
        // console.log("CALLING THE POST() of saveSettings");
        Utils.showSpinner();
        if(res){
          this.toasterService.success("Your settings are saved successfully!")
          Utils.hideSpinner();
        }
      },error=>{
        // error message
        this.toasterService.error("Your settings are not saved successfully!")
      })
    }
    else{
      this.onDemandService.putSaveSettings(saveSettingsrequestBody).subscribe(res=>{
        // console.log("CALLING THE PUT() of saveSettings");
        Utils.showSpinner();
        if(res){
          this.toasterService.success("Your settings are saved successfully!")
          Utils.hideSpinner();
        }
      },error=>{
        // error message
        this.toasterService.error("Your settings are not saved successfully!")
      })
    }


    // ORIGINAL CODE BELOW
    // console.log("saveSettingsrequestBody parameter values",saveSettingsrequestBody)
    
    // this.onDemandService.postSaveSettings(saveSettingsrequestBody).subscribe(res=>{
    //   console.log("CALLING THE POST() of saveSettings");
    //   Utils.showSpinner();
    //   if(res){
    //     this.toasterService.success("Your settings are saved successfully!")
    //     Utils.hideSpinner();
    //   }
    // },error=>{
    //   // error message
    //   this.toasterService.error("Your settings are not saved successfully!")
    // })

  }

}