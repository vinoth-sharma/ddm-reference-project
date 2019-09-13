import { Component, OnInit, Inject, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() cloneParameter:any;
  @Output() exitEditParameter = new EventEmitter();

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
      //when user gives numbers (1,22..) as input, we are converting it to number
      this.selected.parameterValues.push(isNaN(+value)?value.trim():+value);
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
    if(Object.keys(this.cloneParameter).length){
      this.selected.columnName = this.cloneParameter.column_used;
      this.selected.defaultParamValue = this.cloneParameter.default_value_parameter[0];
      this.selected.desc = this.cloneParameter.description;
      this.selected.parameterName = this.cloneParameter.parameter_name;
      this.selected.parameterValues = this.cloneParameter.parameter_formula;
    }
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
    this.paraterNameExists = this.tableData.parameter_list?this.tableData.parameter_list.some(element => {
      if (element.parameter_name === this.selected.parameterName)
        return true
      else
        return false
    }):false;
    return this.paraterNameExists
  }
  
  creatingWip:boolean = false;

  createParameter() {
    // console.log(this.selected);
    if (!this.checkParameterNameExists()){
      this.creatingWip = true;
      this.reportService.createParameter(this.selected, this.data).subscribe(res => {
        // console.log(res);
      this.creatingWip = false;
      this.exitEditParameter.emit('updated')
      })
    }
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
