import { Component, OnInit, Output, Inject } from '@angular/core';
import { EventEmitter } from 'events';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-sheet',
  templateUrl: './select-sheet.component.html',
  styleUrls: ['./select-sheet.component.css']
})
export class SelectSheetComponent implements OnInit {

  // @Output() selectedSheet = new EventEmitter();
  selectedSheet : number ;
  selectedIndex : string;
  enableEditBtn:boolean = false;

  constructor(public dialogRef: MatDialogRef<SelectSheetComponent>,
  @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }
  onSelectSheet(event) {
    this.selectedSheet = this.data.sheetIds[event.value];
    this.selectedIndex = event.value;
    this.enableEditBtn = true;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onEditClick(): void {
    this.dialogRef.close({'sheetId':this.selectedSheet,'index':this.selectedIndex});
  }

}
