import { Component, OnInit, EventEmitter, Output, Input,SimpleChanges } from '@angular/core';
import { OndemandService } from '../ondemand.service';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-ondemand-reports',
  templateUrl: './ondemand-reports.component.html',
  styleUrls: ['./ondemand-reports.component.css']
})



export class OndemandReportsComponent implements OnInit {

  public onDemandScheduleId:any;
  public odcReportId:any;
  public odcRequestNumber:any = '';
  public odInfoObject:any;
  public isLoading=true;


  @Input() requestNumber:any;
  @Input() reportId:any; 

  @Output() odScheduleConfirmation = new EventEmitter();

  constructor(private onDemandService:OndemandService,
              private toasterService: ToastrService) { }

  ngOnChanges(changes: SimpleChanges){
    console.log("CHANGES SEEN IN OD:",changes)
    // using the below service to get the schedule id
    // if('reque')
    // this.odcReportId = this.reportId;
    if('requestNumber' in changes || 'reportId' in changes)
    this.onDemandService.getOnDemandConfigDetails(changes.reportId.currentValue,changes.requestNumber.currentValue).subscribe(res=>{
      console.log("NEW getOnDemandConfigDetails RESULTS",res); 
      this.onDemandScheduleId = res["data"][1]['schedule_id'][0]
      this.isLoading=false;
      if(!this.onDemandScheduleId){
        this.toasterService.error('Please ask the admin to configure scheduling parameters!');
        return;
      }
    })


  }

  ngOnInit() {
    console.log("OD called only");

  }

  public startOnDemandSchedule(){
    if(this.onDemandScheduleId){
      this.odInfoObject = {confirmation:true,type:'On Demand Configurable',scheduleId:this.onDemandScheduleId,status:true}
    }
    else{
      this.odInfoObject = {confirmation:true,type:'On Demand Configurable',scheduleId:this.onDemandScheduleId,status:false}
    }
    this.odScheduleConfirmation.emit(this.odInfoObject);
    
  }

}
