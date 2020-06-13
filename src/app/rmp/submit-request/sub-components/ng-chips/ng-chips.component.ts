import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';


/**
 * @title Chips with input
 */
@Component({
  selector: 'app-ng-chips',
  templateUrl: './ng-chips.component.html',
  styleUrls: ['./ng-chips.component.css']
})
export class NgChipsComponent {

  @Input() custom_placeholder: String = "";
  @Input() type: String = "";
  @Input() inputModel: Array<String> = [];
  @Output() inputModelChange = new EventEmitter();
  public chipsEntered = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  isTextValid: boolean = true;

  ngOnChanges(changes: SimpleChanges) {
    this.chipsEntered = this.inputModel;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();

    if (value && this.validateTextEntered(value)) {
      this.chipsEntered = [...new Set([...this.chipsEntered, value])];
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.inputModelChange.emit(this.chipsEntered);
  }

  remove(chip): void {
    const index = this.chipsEntered.indexOf(chip);

    if (index >= 0) {
      this.chipsEntered.splice(index, 1);
    }
    this.inputModelChange.emit(this.chipsEntered);
  }

  textEntered(event) {
    if (this.validateTextEntered(event.target.value)) {
      this.isTextValid = true;
    }
    else
      this.isTextValid = false;
  }

  private validateTextEntered(control) {
    var rpoRegEx = /^([0-9]){6,}$/gi;
    if (control.match(rpoRegEx)) {
      return true
    }
    else {
      return false
    }
  }

  public onPaste(event: ClipboardEvent) {
    var rpoRegEx = /^([0-9]){6,}$/gi;
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text').trim();
    let l_data = [];
    if (pastedText.match(rpoRegEx)) {
      l_data.push(pastedText)
    }
    else {
      let arr = this.extractString(pastedText);
      l_data = arr.filter(ele => {
        if (ele.match(rpoRegEx))
          return true
        else
          return false
      })
    }

    if (l_data.length) {
      this.chipsEntered = [...new Set([...this.chipsEntered, ...l_data])];
      this.inputModelChange.emit(this.chipsEntered);
      event.preventDefault();
    }
  }

  extractString(str) {
    let delimiters = [";", ",", ":","\n"];
    let l_data = [];
    delimiters.forEach(ele => {
      let arr = str.split(ele);
      if (arr.length > 1) {
        l_data = arr;
      }
    })
    return l_data
  }
}