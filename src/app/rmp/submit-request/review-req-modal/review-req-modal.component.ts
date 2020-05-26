import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

@Component({
  selector: 'app-review-req-modal',
  templateUrl: './review-req-modal.component.html',
  styleUrls: ['./review-req-modal.component.css']
})
export class ReviewReqModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReviewReqModalComponent>,
    private toaster: NgToasterComponent,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  reqDate:string = '11-May-2020';
  reqNumber: Number = 3671;
  repTitle: string = 'New Report'

  ngOnInit(): void {
console.log(this.data);

  }

  closeDailog(): void {
    this.dialogRef.close();
  }

}
