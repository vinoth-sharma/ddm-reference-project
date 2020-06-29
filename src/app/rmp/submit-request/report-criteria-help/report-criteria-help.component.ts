import { Component, OnInit, Inject } from '@angular/core';
import { SubmitRequestService } from '../submit-request.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { DjangoService } from '../../django.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Utils from 'src/utils';

// Angular component developed by Bharath S
@Component({
  selector: 'app-report-criteria-help',
  templateUrl: './report-criteria-help.component.html',
  styleUrls: ['./report-criteria-help.component.css']
})
export class ReportCriteriaHelpComponent implements OnInit {
  public config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['image']
    ]
  };

  public l_lookupTableData: any = {};
  public showEditOption: boolean = true;
  public submitReqHelpDescObj = {
    ddm_rmp_desc_text_id: 10,
    module_name: "Help_SelectReportCriteria",
    description: ""
  }
  public user_role = "";

  constructor(public dialogRef: MatDialogRef<ReportCriteriaHelpComponent>,
    public subReqService: SubmitRequestService,
    private toaster: NgToasterComponent,
    private django: DjangoService,
    private auth_service: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    Utils.showSpinner();
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
      }
    })

    this.subReqService.getHttpLookUpTableData().subscribe(res => {
      this.l_lookupTableData = res.data;
      this.l_lookupTableData.desc_text.forEach(element => {
        if (element.ddm_rmp_desc_text_id === 10)
          this.submitReqHelpDescObj.description = element.description
      });
      Utils.hideSpinner()
    });
  }

  // save help section data
  public submitReqHelpDesc() {
    Utils.showSpinner();
    this.django.ddm_rmp_landing_page_desc_text_put(this.submitReqHelpDescObj).subscribe((response: any) => {
      Utils.hideSpinner();
      this.toaster.success("Disclaimer help description updated successfully");
      this.closeDailog();
    }, err => {
      Utils.hideSpinner()
      this.toaster.error("Server Error");
    })
  }

  public closeDailog(): void {
    this.dialogRef.close();
  }
}
