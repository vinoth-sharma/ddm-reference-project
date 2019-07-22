import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { OnInit, Component, Inject } from '@angular/core';

@Component({
  selector: 'app-pivots',
  templateUrl: './pivots.component.html',
  styleUrls: ['./pivots.component.css']
})
export class PivotsComponent implements OnInit {

  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato', 'Pepperoni', 'Sausage', 'Tomato'];
  
  constructor(public dialogRef: MatDialogRef<PivotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
  }
 
  closeDailog():void{
    this.dialogRef.close();
  }
}
