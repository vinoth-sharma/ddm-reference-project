import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerModalComponent } from '../disclaimer-modal/disclaimer-modal.component';
import { DisclaimerHelpModalComponent } from '../disclaimer-help-modal/disclaimer-help-modal.component';
import Utils from '../../../../utils';
import { NgToasterComponent } from "../../../custom-directives/ng-toaster/ng-toaster.component";
import { DjangoService } from '../../django.service';
import { SubmitRequestService } from "../submit-request.service";

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
  public showEditOption:boolean = true;

  public submitReqDescObj = {
    ddm_rmp_desc_text_id : 3,
    module_name : "Submit Request",
    description : ""
  };
  public l_lookupTableData:any = {};

  constructor( private toaster: NgToasterComponent,
    private django: DjangoService,
    private subReqService: SubmitRequestService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    Utils.showSpinner();
    this.subReqService.getHttpLookUpTableData().subscribe(res=>{
      this.l_lookupTableData = res.data;
      this.l_lookupTableData.desc_text.forEach(element => {
        if(element.ddm_rmp_desc_text_id === 3)
         this.submitReqDescObj.description = element.description
      });

      Utils.hideSpinner();
    },err=>{
      Utils.hideSpinner();
    })
  }

  openDisclaimerModal(){
    this.dialog.open(DisclaimerModalComponent, {
      data: ""
    })
  }

  openDisclaimerHelpModal(){
    this.dialog.open(DisclaimerHelpModalComponent, {
      data: ""
    })
  }

  saveSubmitReqDesc(){

    this.django.ddm_rmp_landing_page_desc_text_put(this.submitReqDescObj).subscribe(response => {
      Utils.hideSpinner()
      this.toaster.success("Updated Successfully");
    }, err => {
      Utils.hideSpinner()
      this.toaster.error("Server Error");
    })
  }
  

  textChanged(){

  }
}
