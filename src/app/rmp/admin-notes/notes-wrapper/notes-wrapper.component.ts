import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notes-wrapper',
  templateUrl: './notes-wrapper.component.html',
  styleUrls: ['./notes-wrapper.component.css']
})
export class NotesWrapperComponent implements OnInit {

  selected = new FormControl(0);

  constructor(public dialogRef: MatDialogRef<NotesWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // console.log(this.data);
  }

  closeDailog(): void {
    this.dialogRef.close();
  }




}
