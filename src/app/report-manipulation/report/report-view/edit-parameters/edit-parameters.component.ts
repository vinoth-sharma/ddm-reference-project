import { Component, OnInit, SimpleChanges, Input, Inject, Output, EventEmitter } from '@angular/core';
import { ReportViewService } from '../report-view.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-edit-parameters',
  templateUrl: './edit-parameters.component.html',
  styleUrls: ['./edit-parameters.component.css']
})
export class EditParametersComponent implements OnInit {
 
  @Input() paramData: any;
  @Input() data:any;
  @Output() exitEditParameter = new EventEmitter();

  tableData: any = [];
  columnDetails: any = [];
  parameterValues = [];

  paraterNameExists: boolean = false;

  selected:any = {
    columnUsed: '',
    parameterValues: [],
    parameterName: '',
    defaultValues: '',
    appliedValues:[],
    desc: '',
    appliedFlag: false,
    sheetId: null,
    parameterId: null
  }

  parameterName = new FormControl('', [Validators.required])
  columnName = new FormControl('', [Validators.required])
  parameterValue = new FormControl('', [Validators.required])
  defaultValue = new FormControl('', [Validators.required])

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  enableUpdateBtn: boolean = true;

  constructor(public dialogRef: MatDialogRef<EditParametersComponent>,
    public reportService: ReportViewService) { }
  
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    this.tableData = this.paramData.tableData
    this.columnDetails = this.paramData.columnDetails
    console.log(this.tableData);
    console.log(this.data);
    this.fillSelectedParamterData(this.data)  
  }

  fillSelectedParamterData(data){
    console.log(data.columnUsed);
    
    this.selected.columnUsed = data.columnUsed;
    this.selected.desc = data.description;
    this.selected.appliedFlag = data.appliedFlag;
    this.selected.sheetId = data.sheetId;
    this.selected.parameterName = data.parameterName;
    this.selected.parameterId = data.parameterId;
    this.selected.defaultValues = data.defaultValues[0];
    this.selected.appliedValues = [...data.appliedValues];
    this.selected.parameterValues = [...data.parameterValues];
    console.log(this.selected);

    
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    // Add our fruit
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
    // const index = this.fruits.indexOf(tag);
    const i = this.selected.parameterValues.indexOf(tag);
    if (i >= 0) {
      this.selected.parameterValues.splice(i, 1);
      //when param values removed, default selected value is removed
      this.selected.parameterValues.length === 0 ? this.selected.defaultValues = '' : '';
      if(this.selected.defaultValues == tag)
        this.selected.defaultValues = ''
    }
  }

  validateForm(){
    // console.log(this.selected);
    if (this.selected.columnUsed != '' && this.selected.parameterName != ''
      && this.selected.parameterValues.length > 0 && this.selected.defaultValues != '')
      return true
    else
      return false
  }

  checkParameterNameExists() {
    // console.log(this.tableData);
    this.paraterNameExists = this.tableData.parameter_list.some(element => {
      if ((element.parameter_name === this.selected.parameterName ) && 
          (element.parameters_id != this.selected.parameterId))
        return true
      else
        return false
    });
    return this.paraterNameExists
  }

  updateParameter(){
    if (!this.checkParameterNameExists()){
      // this.closeDailog();
      this.enableUpdateBtn = false;
      this.selected.defaultValues = this.selected.defaultValues?[this.selected.defaultValues]:[]; 
      this.reportService.updateParameter(this.selected).subscribe(res => {
        // console.log(res);
        this.enableUpdateBtn = true;
        this.closeEdit('updated')
      })
    }
  }

  closeEdit(str){
    this.exitEditParameter.emit(str);
  }
}
