import { Component, OnInit } from '@angular/core';
import { DjangoService } from '../../django.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/authentication.service';
import { DataProviderService } from '../../data-provider.service';
import { GeneratedReportService } from '../../generated-report.service';
import { ReportCriteriaDataService } from '../../services/report-criteria-data.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { SubmitRequestService } from '../submit-request.service';
import Utils from 'src/utils';

@Component({
  selector: 'app-submit-request-wrapper',
  templateUrl: './submit-request-wrapper.component.html',
  styleUrls: ['./submit-request-wrapper.component.css']
})
export class SubmitRequestWrapperComponent implements OnInit {

  user_details = {
    name: "",
    role: "",
    self_email: ""
  }

  // lookupMasterData = {};
  // lookupTableMasterData = {};


  request_details: any = {};

  selectedReportData = null;

  constructor(private django: DjangoService, private DatePipe: DatePipe,
    private dataProvider: DataProviderService,
    private auth_service: AuthenticationService,
    private report_id_service: GeneratedReportService,
    private submitReqService: SubmitRequestService,
    public toastr: NgToasterComponent) {

    submitReqService.loadingStatus.subscribe((status: any) => {
      if (status.comp === "da" && status.status) {
        let requestId = localStorage.getItem("report_id")
        if (requestId){
          Utils.showSpinner();
          submitReqService.getReportDescription(requestId).subscribe(res => {
            // console.log(res);
            this.selectedReportData = res;
            Utils.hideSpinner();
          }, err => {
            Utils.hideSpinner();
          })

        }

      }
    })


    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_details.name = role["first_name"] + " " + role["last_name"]
        this.user_details.role = role["role"]
        this.user_details.self_email = role["email"]
      }
    })

    // dataProvider.currentlookupData.subscribe(element => {
    //   console.log(element);
    //   this.lookupMasterData = element;
    // })

    // dataProvider.currentlookUpTableData.subscribe((tableDate: any) => {
    //   console.log(tableDate);
    //   this.lookupTableMasterData = tableDate ? tableDate.data : {};
    // })
  }

  ngOnInit() { }

  requestCreated(event) {
    this.request_details = event;
  }

  ngOnDestroy(){
    localStorage.removeItem('report_id');
  }
}
