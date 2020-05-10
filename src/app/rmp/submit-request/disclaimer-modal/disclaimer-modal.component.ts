import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SubmitRequestService } from '../submit-request.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { DjangoService } from '../../django.service';
import Utils from 'src/utils';
import { ConfirmationDialogComponent } from 'src/app/custom-directives/confirmation-dialog/confirmation-dialog.component';
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

  l_lookupTableData:any = {};
  public showEditOption:boolean = true;

  public submitReqDisclaimerObj = {
    ddm_rmp_desc_text_id : 15,
    module_name : "Disclaimer",
    description : ""
  }

  constructor(public dialogRef: MatDialogRef<DisclaimerModalComponent>,
    public subReqService: SubmitRequestService,
    private toaster: NgToasterComponent,
    private django: DjangoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // console.log(this.data);
    this.l_lookupTableData = this.subReqService.getLookUpTableData();
    this.l_lookupTableData.desc_text.forEach(element => {
     if(element.ddm_rmp_desc_text_id === 15)
      this.submitReqDisclaimerObj.description = element.description
   });
  }

  confirmDisclaimerSubmit(){
    let obj = {
      confirmation: false,
      modalTitle: 'Confirmation for changes in Disclaimer',
      modalBody: 'Are you sure you want to change the disclaimer as it affects numerous users?',
      modalBtn: 'Yes'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data : obj
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result.confirmation)
        this.submitReqDisclaimerDesc();
    });
  }

  submitReqDisclaimerDesc(){
    Utils.showSpinner();
    this.django.ddm_rmp_landing_page_desc_text_put(this.submitReqDisclaimerObj).subscribe((response:any) => {
      Utils.hideSpinner()
      this.toaster.success(response.message);
    }, err => {
      Utils.hideSpinner()
      this.toaster.error("Server Error");
    })
  }

  downloadDisclaimer(){
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

  textChanged(event){
    // console.log(event);
  }
  
  closeDailog(): void {
    this.dialogRef.close();
  }

}
