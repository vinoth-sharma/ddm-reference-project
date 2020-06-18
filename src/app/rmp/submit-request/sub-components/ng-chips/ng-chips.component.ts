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
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    let pastedChips = getChips(pastedText);
    if (pastedChips){
      this.chipsEntered = [...new Set([...this.chipsEntered, ...pastedChips])];
      this.inputModelChange.emit(this.chipsEntered);
      event.preventDefault();
    }
  }
}

//validate chips
function getChips(text) {
  return text.match(/([0-9]{6,})/gi);
}