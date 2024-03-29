import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SubmitRequestService } from '../submit-request.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { DjangoService } from '../../django.service';
import Utils from 'src/utils';
import { ConfirmationDialogComponent } from 'src/app/custom-directives/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from 'src/app/authentication.service';
declare var jsPDF: any;

@Component({
  selector: 'app-disclaimer-modal',
  templateUrl: './disclaimer-modal.component.html',
  styleUrls: ['./disclaimer-modal.component.css']
})
export class DisclaimerModalComponent implements OnInit {

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

  l_lookupTableData: any = {};
  public showEditOption: boolean = true;
  public submitReqDisclaimerObj = {
    ddm_rmp_desc_text_id: 15,
    module_name: "Disclaimer",
    description: ""
  }
  public disclaimerAckObj = {
    disclaimer_ack: undefined
  }
  public user_role = "";
  public enableCloseButton = true;

  constructor(public dialogRef: MatDialogRef<DisclaimerModalComponent>,
    public subReqService: SubmitRequestService,
    private toaster: NgToasterComponent,
    private auth_service: AuthenticationService,
    private django: DjangoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.enableCloseButton = this.data.enableButton

    Utils.showSpinner();
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"];
      }
    })

    this.subReqService.getHttpLookUpTableData().subscribe(res => {
      this.l_lookupTableData = res.data;
      this.l_lookupTableData.desc_text.forEach(element => {
        if (element.ddm_rmp_desc_text_id === 15)
          this.submitReqDisclaimerObj.description = element.description
      });
      Utils.hideSpinner()
    });
  }

  public acknowledgeDisclaimer() {
    this.disclaimerAckObj.disclaimer_ack = new Date();
    Utils.showSpinner();
    this.django.user_info_disclaimer(this.disclaimerAckObj).subscribe(response => {
      this.dialogRef.close(new Date());
      Utils.hideSpinner()
      this.toaster.success("Acknowledged Disclaimers successfully");
    }, err => {
      Utils.hideSpinner()
      this.toaster.success("server error");
    })
  }

  public confirmDisclaimerSubmit() {
    let obj = {
      confirmation: false,
      modalTitle: 'Confirmation for changes in Disclaimer',
      modalBody: 'Are you sure you want to change the disclaimer as it affects numerous users?',
      modalBtn: 'Yes'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: obj, disableClose: true
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation)
        this.submitReqDisclaimerDesc();
    });
  }

  public submitReqDisclaimerDesc() {
    Utils.showSpinner();
    this.django.ddm_rmp_landing_page_desc_text_put(this.submitReqDisclaimerObj).subscribe((response: any) => {
      this.showEditOption = true;
      Utils.hideSpinner();
      this.toaster.success(response.message);
      this.closeDailog();
    }, err => {
      Utils.hideSpinner()
      this.toaster.error("Server Error");
    })
  }

  public downloadDisclaimer() {
    var specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    var doc = new jsPDF();
    let margins = {
      top: 15,
      bottom: 0,
      left: 18,
      width: 170
    };
    doc.lineHeightProportion = 2;
    doc.fromHTML(
      this.submitReqDisclaimerObj.description, margins.left, margins.top,
      { 'width': 170, 'elementHandlers': specialElementHandlers, 'top_margin': 15 },
      function () { doc.save('DDM Disclaimers.pdf'); }, margins
    )
  }

  public closeDailog(): void {
    this.dialogRef.close();
  }
}