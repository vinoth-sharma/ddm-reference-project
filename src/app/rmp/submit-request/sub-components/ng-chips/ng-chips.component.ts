import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';

export interface Fruit {
  name: string;
}

/**
 * @title Chips with input
 */
@Component({
  selector: 'app-ng-chips',
  templateUrl: './ng-chips.component.html',
  styleUrls: ['./ng-chips.component.css']
})
export class NgChipsComponent {

@Input() custom_placeholder:String = "";
@Input() type:String = "";
@Input() inputModel: Array<String> = [];
@Output() inputModelChange = new EventEmitter();
  public chipsEntered = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  isTextValid:boolean = true;

  ngOnChanges(changes: SimpleChanges){
    this.chipsEntered = this.inputModel;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim() && this.validateTextEntered(value)) {
      this.chipsEntered.push(value.trim())
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.inputModelChange.emit(this.chipsEntered);
  }

  remove(fruit: Fruit): void {
    const index = this.chipsEntered.indexOf(fruit);

    if (index >= 0) {
      this.chipsEntered.splice(index, 1);
    }
    this.inputModelChange.emit(this.chipsEntered);
  }

  textEntered(event){
    if(this.validateTextEntered(event.target.value)){
      this.isTextValid = true;
    }
    else
      this.isTextValid = false;
  }

  private validateTextEntered(control) {
    var rpoRegEx = /^([a-zA-Z0-9]){6}$/;
    var rpoRegEx2 = /^([a-zA-Z0-9]){11}$/;
    if (control.match(rpoRegEx) || control.match(rpoRegEx2)) {
      return true
    }
    else {
      return false
    }
  }
}
