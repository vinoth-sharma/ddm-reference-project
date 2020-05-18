import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

@Component({
  selector: 'app-additional-req-modal',
  templateUrl: './additional-req-modal.component.html',
  styleUrls: ['./additional-req-modal.component.css']
})
export class AdditionalReqModalComponent implements OnInit {


  public report_title = "";
  public additional_req = "";

  // private descIds1 = [5,54];
  // private descIds2 = [8,15];

  l_CB_data = [];
  
  public l_data1 = [];
  public l_data2 = [];
  public responseData:any = {}

  constructor(public dialogRef: MatDialogRef<AdditionalReqModalComponent>,
    private toaster: NgToasterComponent,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
      console.log(this.data);
      this.l_CB_data = this.data.checkboxData;
      // this.l_data1 = this.data.checkboxData.filter(cb=>{
      //   if(this.descIds1.includes(cb.ddm_rmp_lookup_ots_checkbox_values_id))
      //     return cb
      // })
      // this.l_data2 = this.data.checkboxData.filter(cb=>{
      //   if(this.descIds2.includes(cb.ddm_rmp_lookup_ots_checkbox_values_id))
      //     return cb
      // })
    }

    reviewRequest(): void {
      this.responseData = {
        cb : [...this.l_CB_data],
        reportTitle : this.report_title.trim(),
        addReq : this.additional_req.trim()
      }
      let l_data_validation = this.responseData.cb.filter(ele=>{
        if(ele.description && [1,2].includes(ele.ddm_rmp_ots_checkbox_group_id))
        {return ele}
      });
      if(!this.responseData.reportTitle.length){
        this.toaster.error("Report Title is mandatory")
      }
      else if(!this.responseData.addReq.length){
        this.toaster.error("Additional requirement is mandatory")
      }
      else if(!l_data_validation.every(ele=>ele['desc'])){
        this.toaster.error("Please enter the values if others selected")
      }
      else
        this.dialogRef.close( { data: this.responseData });
    }

    closeDialog(){
      this.dialogRef.close();
    }
      

}
