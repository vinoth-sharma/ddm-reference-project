import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-clone-worksheet',
  templateUrl: './clone-worksheet.component.html',
  styleUrls: ['./clone-worksheet.component.css']
})
export class CloneWorksheetComponent implements OnInit {

  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato', 'Pepperoni', 'Sausage', 'Tomato'];
  
  constructor(public dialogRef: MatDialogRef<CloneWorksheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
  }
 
  closeDailog():void{
    this.dialogRef.close();
  }

}
