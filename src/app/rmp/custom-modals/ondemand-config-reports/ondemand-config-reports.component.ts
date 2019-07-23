import { Component, OnInit,Input,SimpleChanges,Output,EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from "../../../create-report/shared-data.service";
import { CreateReportLayoutService } from '../../../create-report/create-report-layout/create-report-layout.service'
import { Router } from '@angular/router';
import Utils from "../../../../utils";
import { ScheduleService } from '../../../schedule/schedule.service';
import { DjangoService } from 'src/app/rmp/django.service';

@Component({
  selector: 'app-ondemand-config-reports',
  templateUrl: './ondemand-config-reports.component.html',
  styleUrls: ['./ondemand-config-reports.component.css']
})

export class OndemandConfigReportsComponent implements OnInit {

  public odcRequestNumber:any = '';
  public odcTitle:any = '';
  public odcName:any = '';
  public requestDetails:any;
  public semanticLayerId:any;
  public reportDataSource:any;
  public rmpReports:any;


  @Input() requestNumber:any;
  @Input() title:any;
  @Input() name:any;
  @Input() details:any={};
  // @Output() odScheduleShow = new EventEmitter();


  constructor(private activatedRoute: ActivatedRoute,
              public scheduleService: ScheduleService,
              private sharedDataService: SharedDataService,
              private createReportLayoutService: CreateReportLayoutService,
              public router: Router,
              private django: DjangoService) { }

  ngOnInit() {
    console.log("INPUT details",this.details);
  }

  ngOnChanges(changes:SimpleChanges){
    Utils.showSpinner();
    console.log("CHANGES IN ODC",changes);

    this.odcRequestNumber = this.requestNumber;
    this.odcTitle = this.title;
    this.odcName = this.name;
    console.log("requestNumber in changes",this.odcRequestNumber);
    console.log("requestTitle in changes",this.odcTitle);
    console.log("requestName in changes",this.odcName);


    // Utils.showSpinner();
    // this.getRequestDetails();
    let id;
    
    this.django.get_report_list().subscribe(list => {
      if(list){
        this.rmpReports = list['data'];
        console.log("RMP reports",this.rmpReports);} //DDM Name?
    })

    this.rmpReports.map(i=>{
      if(i.report_name === this.odcName && i.title === this.odcTitle) {
        console.log( i.ddm_rmp_post_report_id);
        id=i.ddm_rmp_post_report_id
      }
    });

    this.createReportLayoutService.getRequestDetails(id).subscribe( res =>{
      this.requestDetails = res;
      console.log("this.requestDetails OBJECT",this.requestDetails);
      // this.odScheduleShow.emit(true);
    },error =>{
      this.requestDetails = [];
    });
    Utils.hideSpinner();
  }

  getRequestDetails(){
    let id;
    
    this.django.get_report_list().subscribe(list => {
      if(list){
        this.rmpReports = list['data'];
        console.log("RMP reports",this.rmpReports);} //DDM Name?
    })

    this.rmpReports.map(i=>{
      if(i.report_name === this.odcName && i.title === this.odcTitle) {
        console.log( i.ddm_rmp_post_report_id);
        id=i.ddm_rmp_post_report_id
      }
    });

    this.createReportLayoutService.getRequestDetails(id).subscribe( res =>{
      this.requestDetails = res;
      console.log("this.requestDetails OBJECT",this.requestDetails);
      // this.odScheduleShow.emit(true);
    },error =>{
      this.requestDetails = [];
    });
  }

}
