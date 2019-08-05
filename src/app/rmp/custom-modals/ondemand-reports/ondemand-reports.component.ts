import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
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


  @Input() requestNumber:any;
  @Input() reportId:any; 

  @Output() odScheduleConfirmation = new EventEmitter();

  constructor(private onDemandService:OndemandService,
              private toasterService: ToastrService) { }

  ngOnInit() {
    // using the below service to get the schedule id
    this.onDemandService.getOnDemandConfigDetails(this.odcReportId,this.odcRequestNumber).subscribe(res=>{
      console.log("NEW getOnDemandConfigDetails RESULTS",res); 
      this.onDemandScheduleId = res["data"][1]['schedule_id'][0]
      if(!this.onDemandScheduleId){
        this.toasterService.error('Please ask the admin to configure scheduling parameters!');
        return;
      }
    })
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
