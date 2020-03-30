import { Component, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { OndemandService } from '../ondemand.service';
import { NgToasterComponent } from "../../../custom-directives/ng-toaster/ng-toaster.component";
declare var $: any;

@Component({
  selector: 'app-ondemand-reports',
  templateUrl: './ondemand-reports.component.html',
  styleUrls: ['./ondemand-reports.component.css']
})

export class OndemandReportsComponent{

  public onDemandScheduleId: any = '';
  public odInfoObject: any;
  public isLoading = true;

  @Input() requestNumber: any;
  @Input() reportId: any;
  @Output() odScheduleConfirmation = new EventEmitter();

  constructor(private onDemandService: OndemandService, private toasterService: NgToasterComponent) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log("CHANGES SEEN IN OD:", changes);
    if ('requestNumber' in changes || 'reportId' in changes){
      this.onDemandService.getOnDemandConfigDetails(changes.reportId.currentValue, changes.requestNumber.currentValue).subscribe(res => {
        console.log("getOnDemandConfigDetails RESULTS", res);
        if (res["data"][1]['schedule_id'][0] || res["data"][1]['schedule_id'].length) {
          this.onDemandScheduleId = res["data"][1]['schedule_id'][0]
        }
        this.isLoading = false;
        if (!this.onDemandScheduleId) {
          this.toasterService.error('Please ask the admin to configure scheduling parameters!');
          $('#onDemandModal').modal('hide');
          return;
        }
      })
    }
  }

  public startOnDemandSchedule() {
    if (this.onDemandScheduleId) {
      this.odInfoObject = { confirmation: true, type: 'On Demand', scheduleId: this.onDemandScheduleId, status: true }
    }
    else {
      this.odInfoObject = { confirmation: true, type: 'On Demand', scheduleId: this.onDemandScheduleId, status: false }
    }
    this.odScheduleConfirmation.emit(this.odInfoObject);
  }

}
