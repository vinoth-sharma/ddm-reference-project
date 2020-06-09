import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerModalComponent } from '../disclaimer-modal/disclaimer-modal.component';
import { DisclaimerHelpModalComponent } from '../disclaimer-help-modal/disclaimer-help-modal.component';
import Utils from '../../../../utils';
import { NgToasterComponent } from "../../../custom-directives/ng-toaster/ng-toaster.component";
import { DjangoService } from '../../django.service';
import { SubmitRequestService } from "../submit-request.service";
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-disclaimer-wrapper',
  templateUrl: './disclaimer-wrapper.component.html',
  styleUrls: ['./disclaimer-wrapper.component.css']
})
export class DisclaimerWrapperComponent implements OnInit {

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
  public showEditOption: boolean = true;

  public submitReqDescObj = {
    ddm_rmp_desc_text_id: 3,
    module_name: "Submit Request",
    description: ""
  };
  public l_lookupTableData: any = {};
  user_role = "";

  constructor(private toaster: NgToasterComponent,
    private django: DjangoService,
    private subReqService: SubmitRequestService,
    private auth_service: AuthenticationService,
    private dialog: MatDialog) { }

  public userData;

  ngOnInit(): void {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"];
      }
    })

    this.updateSubmitRequestDesc();

  }

  public updateSubmitRequestDesc(): void {
    Utils.showSpinner();
    this.subReqService.getHttpLookUpTableData().subscribe(res => {
      this.l_lookupTableData = res.data;
      this.l_lookupTableData.desc_text.forEach(element => {
        if (element.ddm_rmp_desc_text_id === 3)
          this.submitReqDescObj.description = element.description
      });
      this.userData = this.l_lookupTableData['users_list'].find(item => item.users_table_id === this.l_lookupTableData.user);
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
    })
  }

  ngAfterViewInit() {
    if (this.user_role != "Admin" && !this.userData.disclaimer_ack) {
      this.openDisclaimerModal(false)
    }
  }

  // open disclaimer modal
  public openDisclaimerModal(enableCloseButton?) {
    let enableButtonData = { enableButton: (enableCloseButton == false) ? enableCloseButton : true }
    let dialogRef = this.dialog.open(DisclaimerModalComponent, {
      data: enableButtonData, disableClose: true
    })
    dialogRef.afterClosed().subscribe(result => {
      this.userData.disclaimer_ack = result
    })
  }

  // open disclaimer help modal
  public openDisclaimerHelpModal() {
    this.dialog.open(DisclaimerHelpModalComponent, {
      data: "", disableClose: true
    })
  }

  // save description
  public saveSubmitReqDesc() {
    this.django.ddm_rmp_landing_page_desc_text_put(this.submitReqDescObj).subscribe(response => {
      Utils.hideSpinner()
      this.toaster.success("Updated Successfully");
    }, err => {
      Utils.hideSpinner()
      this.toaster.error("Server Error");
    })
  }

}
