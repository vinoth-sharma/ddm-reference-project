import { Component, OnInit, Inject, SimpleChanges, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ReportViewService } from '../report-view.service';
import { FormControl, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-create-parameters',
  templateUrl: './create-parameters.component.html',
  styleUrls: ['./create-parameters.component.css']
})
export class CreateParametersComponent implements OnInit {
  @Input() paramData: any;

  constructor(public dialogRef: MatDialogRef<CreateParametersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportService: ReportViewService) { }

  parameterName = new FormControl('', [Validators.required])
  columnName = new FormControl('', [Validators.required])
  parameterValue = new FormControl('', [Validators.required])
  defaultValue = new FormControl('', [Validators.required]);

  enableCreateBtn: boolean = false;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  selected = {
    columnName: '',
    parameterValues: [],
    parameterName: '',
    defaultParamValue: '',
    desc: ''
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    // Add our value
    if ((value || '') && !this.selected.parameterValues.some(val => val === value.trim())) {
      this.selected.parameterValues.push(value);
      // this.fruits.push({name: value.trim()});
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    // const index = this.fruits.indexOf(fruit);
    const i = this.selected.parameterValues.indexOf(tag);

    if (i >= 0) {
      this.selected.parameterValues.splice(i, 1);
      //when param values removed, default selected value is removed
      this.selected.parameterValues.length === 0 ? this.selected.defaultParamValue = '' : '';
      if(this.selected.defaultParamValue == tag)
      this.selected.defaultParamValue = ''
    }
  }

  tableData: any = [];
  columnDetails: any = [];
  parameterValues = [];

  paraterNameExists: boolean = false;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    this.tableData = this.paramData.tableData
    this.columnDetails = this.paramData.columnDetails
    // console.log(this.tableData);
  }

  validateForm(){
    // console.log(this.selected);
    if (this.selected.columnName != '' && this.selected.parameterName != ''
      && this.selected.parameterValues.length > 0 && this.selected.defaultParamValue != '')
      return true
    else
      return false
  }

  checkParameterNameExists() {
    // console.log(this.tableData);
    this.paraterNameExists = this.tableData.parameter_list.some(element => {
      if (element.parameter_name === this.selected.parameterName)
        return true
      else
        return false
    });
    return this.paraterNameExists
  }

  createParameter() {
    // console.log(this.selected);
    if (!this.checkParameterNameExists()){
      this.closeDailog();
      this.reportService.createParameter(this.selected, this.data).subscribe(res => {
        // console.log(res);
      })
    }
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
