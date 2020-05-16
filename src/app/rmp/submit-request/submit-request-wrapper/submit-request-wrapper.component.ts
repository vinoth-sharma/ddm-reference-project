import { Component, OnInit } from '@angular/core';
import { DjangoService } from '../../django.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/authentication.service';
import { DataProviderService } from '../../data-provider.service';
import { GeneratedReportService } from '../../generated-report.service';
import { ReportCriteriaDataService } from '../../services/report-criteria-data.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

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

  lookupMasterData = {};
  lookupTableMasterData = {};

  division_data = [{
    ddm_rmp_lookup_division_id: 1,
    ddm_rmp_lookup_market: 1,
    division_desc: "004 - Buick(US)"
  }, {
    ddm_rmp_lookup_division_id: 4,
    ddm_rmp_lookup_market: 1,
    division_desc: "012 - GMC(US)"
  },{
  ddm_rmp_lookup_division_id: 3,
  ddm_rmp_lookup_market: 1,
  division_desc: "001 - Chevrolet(US)"}]

  constructor(private django: DjangoService, private DatePipe: DatePipe,
    private dataProvider: DataProviderService, private auth_service: AuthenticationService,
    private report_id_service: GeneratedReportService,
    public toastr: NgToasterComponent,
    private reportDataService: ReportCriteriaDataService) {
    // this.model = "";
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_details.name = role["first_name"] + " " + role["last_name"]
        this.user_details.role = role["role"]
        this.user_details.self_email = role["email"]
      }
    })

    dataProvider.currentlookupData.subscribe(element => {
      console.log(element);
      this.lookupMasterData = element;
    })

    dataProvider.currentlookUpTableData.subscribe((tableDate: any) => {
      console.log(tableDate);
      this.lookupTableMasterData = tableDate ? tableDate.data : {};
    })
  }

  ngOnInit() { }

}
