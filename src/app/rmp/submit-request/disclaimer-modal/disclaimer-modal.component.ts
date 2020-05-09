import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer-modal',
  templateUrl: './disclaimer-modal.component.html',
  styleUrls: ['./disclaimer-modal.component.css']
})
export class DisclaimerModalComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<DisclaimerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // console.log(this.data);
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

}
