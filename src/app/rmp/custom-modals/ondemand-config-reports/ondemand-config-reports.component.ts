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
  public requestDetails:any;
  public semanticLayerId:any;
  public reportDataSource:any;
  public rmpReports:any;
  public odcColumns:any;


  @Input() requestNumber:any;
  @Input() title:any;
  @Input() name:any;
  @Input() details:any={};
  @Input() reportId:any;

  // @Output() odScheduleShow = new EventEmitter();

  public dupeBody = {  
    "data" : [
      {
        "sheet_id":45,
        "column_properties" : [
          {
            "mapped_column": "A",
            "column_data_type": "B",
            "original_column": "C"
          },
          {
            "mapped_column": "D",
            "column_data_type": "E",
            "original_column": "F"
          },
          {
            "mapped_column": "G",
            "column_data_type": "H",
            "original_column": "I"
          }
        ],
        "sheet_name":"Sheet 1"
      },
      {
        "sheet_id":46,
        "column_properties" : [
          {
            "mapped_column": "J",
            "column_data_type": "K",
            "original_column": "L"
          },
          {
            "mapped_column": "M",
            "column_data_type": "N",
            "original_column": "O"
          },
          {
            "mapped_column": "P",
            "column_data_type": "Q",
            "original_column": "R"
          }
        ],
        "sheet_name":"Sheet 2"
      },
      {
        "sheet_id":47,
        "column_properties" : [
          {
            "mapped_column": "S",
            "column_data_type": "T",
            "original_column": "U"
          },
          {
            "mapped_column": "V",
            "column_data_type": "W",
            "original_column": "X"
          },
          {
            "mapped_column": "Y",
            "column_data_type": "Z",
            "original_column": "A"
          }
        ],
        "sheet_name":"Sheet 3"
      },
    ]

  }

  public sheetNames = ["Sheet 1","Sheet 2","Sheet 3"]


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

    this.odcRequestNumber = this.requestNumber;
    this.odcTitle = this.title;
    this.odcName = this.name;
    this.odcReportId = this.reportId;
    console.log("requestNumber in changes",this.odcRequestNumber);
    console.log("requestTitle in changes",this.odcTitle);
    console.log("requestName in changes",this.odcName);
    console.log("reportNumber in changes",this.odcReportId);

    // ORIGINAL CALL
    // this.onDemandService.getOnDemandConfigDetails(this.odcRequestNumber,this.odcReportId).subscribe(res=>{
    //   console.log("NEW getOnDemandConfigDetails RESULTS",res);
    // })
    
 


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

    /// fetch respective details from the dupebody/dynamic data
    let columnProperties;
    this.dupeBody['data'].map(i=>{
      if(i.sheet_name === sheetName){ 
        columnProperties =  i.column_properties;
      }})
    this.odcColumns = columnProperties.map(i=>i.mapped_column);
    }
    else{
      console.log("setSheetValues is not called!");
    }
  }
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
    
  }

}
