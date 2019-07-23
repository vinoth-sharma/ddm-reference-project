import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-ondemand-reports',
  templateUrl: './ondemand-reports.component.html',
  styleUrls: ['./ondemand-reports.component.css']
})



export class OndemandReportsComponent implements OnInit {

  @Output() odScheduleConfirmation = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public startOnDemandSchedule(){
    this.odScheduleConfirmation.emit(true);
    
  }

}
