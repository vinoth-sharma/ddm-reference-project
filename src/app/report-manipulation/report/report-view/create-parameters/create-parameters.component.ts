import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ReportViewService } from '../report-view.service';
import { FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-create-parameters',
  templateUrl: './create-parameters.component.html',
  styleUrls: ['./create-parameters.component.css']
})
export class CreateParametersComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<CreateParametersComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public reportService: ReportViewService) { }

    parameterName = new FormControl('',[Validators.required])  
    columnName = new FormControl('',[Validators.required]) 
    enableCreateBtn:boolean = false; 

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    fruits: Fruit[] = [
      {name: 'Lemon'},
      {name: 'Lime'},
      {name: 'Apple'},
    ];
  
    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
  
      // Add our fruit
      if ((value || '').trim()) {
        this.fruits.push({name: value.trim()});
      }
  
      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
  
    remove(fruit: Fruit): void {
      const index = this.fruits.indexOf(fruit);
  
      if (index >= 0) {
        this.fruits.splice(index, 1);
      }
    }

  ngOnInit() {
    console.log(this.data);
    
  }

  createParameter(){

  }

  closeDailog():void{
    this.dialogRef.close();
  }
}
