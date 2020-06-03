import { Component, OnInit } from '@angular/core';
import { DjangoService } from '../../django.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/authentication.service';
import { DataProviderService } from '../../data-provider.service';
import { GeneratedReportService } from '../../generated-report.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { SubmitRequestService } from '../submit-request.service';
import Utils from 'src/utils';
import { Subscription } from 'rxjs';

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

  subjectSubscription: Subscription;
  refreshWrapper: boolean = true;
  clearAll: boolean = false;

  constructor(private django: DjangoService, private DatePipe: DatePipe,
    private dataProvider: DataProviderService,
    private auth_service: AuthenticationService,
    private report_id_service: GeneratedReportService,
    private submitReqService: SubmitRequestService,
    public toastr: NgToasterComponent) {



    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_details.name = role["first_name"] + " " + role["last_name"]
        this.user_details.role = role["role"]
        this.user_details.self_email = role["email"]
      }
    })
  }

  ngOnInit() {
    this.subjectSubscription = this.submitReqService.loadingStatus.subscribe((status: any) => {
      if (status.comp === "da" && status.status) {
        let requestId = localStorage.getItem("report_id")
        if (requestId) {
          Utils.showSpinner();
          this.submitReqService.getReportDescription(requestId).subscribe(res => {
            this.submitReqService.updateRequestStatus({ type: "srw", data: res });
            Utils.hideSpinner();
          }, err => {
            Utils.hideSpinner();
          })
        }
        else if (!this.clearAll) {
          Utils.showSpinner();
          this.submitReqService.getUserSelectedData().subscribe(res => {
            this.submitReqService.updateRequestStatus({ type: "user_selection", data: res })
            Utils.hideSpinner();
          }, err => {
            Utils.hideSpinner();
          })
        }
      }
    })
  }

  refreshWrapperFunc(event): void {
    Utils.showSpinner();
    this.refreshWrapper = false;
    if (event === "clear")
      this.clearAll = true;
    else
      this.clearAll = false;

    setTimeout(() => {
      this.submitReqService.setSubmitOnBehalf("", "");
      localStorage.removeItem('report_id');
      this.refreshWrapper = true;
      Utils.hideSpinner();
    }, 0);
  }

  ngOnDestroy() {
    this.submitReqService.setSubmitOnBehalf("", "");
    localStorage.removeItem('report_id');
    this.subjectSubscription.unsubscribe()
  }
}
