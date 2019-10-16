import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-show-lov',
  templateUrl: './show-lov.component.html',
  styleUrls: ['./show-lov.component.css']
})
export class ShowLovComponent implements OnInit {

  @Input() createdLov;
  @Input() load: boolean = true;
  
  constructor(private dialog: MatDialog,
    private dialogRef: MatDialogRef<ShowLovComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    // this.data.sort(function (a, b) {
    //   a = a.lov_name.toLowerCase();
    //   b = b.lov_name.toLowerCase();
    //   return (a < b) ? -1 : (a > b) ? 1 : 0;
    // });
  }

  ngOnChanges() {
    console.log("shoLov",this.createdLov);    
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
