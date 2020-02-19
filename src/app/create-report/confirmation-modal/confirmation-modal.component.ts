import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  
  option:string = "yes";

  ngOnInit() {
    // console.log(this.data);
    
  }

  closeDailog(flag): void {
    this.data['confirmation'] = flag;
    this.data['option'] = this.option;
    this.dialogRef.close();
  }

}
