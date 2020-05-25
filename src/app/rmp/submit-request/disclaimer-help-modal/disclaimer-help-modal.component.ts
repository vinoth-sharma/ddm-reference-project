import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubmitRequestService } from "../submit-request.service";
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { DjangoService } from '../../django.service';
import Utils from '../../../../utils';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-disclaimer-help-modal',
  templateUrl: './disclaimer-help-modal.component.html',
  styleUrls: ['./disclaimer-help-modal.component.css']
})
export class DisclaimerHelpModalComponent implements OnInit {
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

  l_lookupTableData:any = {};
  public showEditOption:boolean = true;

  public submitReqHelpDescObj = {
    ddm_rmp_desc_text_id : 14,
    module_name : "Help_SubmitRequest",
    description : ""
  }

  user_role = "";
  
  constructor(public dialogRef: MatDialogRef<DisclaimerHelpModalComponent>,
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
    // console.log(this.data);

    this.subReqService.getHttpLookUpTableData().subscribe(res=>{
      this.l_lookupTableData = res.data;
      this.l_lookupTableData.desc_text.forEach(element => {
        if(element.ddm_rmp_desc_text_id === 14)
         this.submitReqHelpDescObj.description = element.description
      });
      Utils.hideSpinner()
    });
  }

  submitReqHelpDesc(){
    Utils.showSpinner();
    this.django.ddm_rmp_landing_page_desc_text_put(this.submitReqHelpDescObj).subscribe((response:any) => {
      Utils.hideSpinner();
      this.toaster.success(response.message);
    }, err => {
      Utils.hideSpinner()
      this.toaster.error("Server Error");
    })
  }

  textChanged(event){
    // console.log(event);
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

}
