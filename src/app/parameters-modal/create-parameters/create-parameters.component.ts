import { Component, OnInit, Inject, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';


@Component({
  selector: 'app-create-parameters',
  templateUrl: './create-parameters.component.html',
  styleUrls: ['./create-parameters.component.css']
})
export class CreateParametersComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateParametersComponent>,
    private _formBuilder: FormBuilder) {}

    parameterName = new FormControl('', [Validators.required])
    parameterValue = new FormControl('', [Validators.required])
    
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
  
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    
  validForm:boolean = false;

    obj = {
      parameterName : '',
      desc : '',
      parameterValues : []
    }
  
    ngOnInit() {
  }

  createParameter(){

  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    // Add our value
    if ((value || '') && !this.obj.parameterValues.some(val => val === value.trim())) {
      //when user gives numbers (1,22..) as input, we are converting it to number
      this.obj.parameterValues.push(isNaN(+value)?value.trim():+value);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    // const index = this.fruits.indexOf(fruit);
    const i = this.obj.parameterValues.indexOf(tag);

    if (i >= 0) {
      this.obj.parameterValues.splice(i, 1);
    }
  }

  validateForm(){
    // console.log(this.obj);
    if (this.obj.parameterName != ''
      && this.obj.parameterValues.length > 0)
      return true
    else
      return false
  }

  closeDialog(): void {
    this.dialogRef.close();
}
}
