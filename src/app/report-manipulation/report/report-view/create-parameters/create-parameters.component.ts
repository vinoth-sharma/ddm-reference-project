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

  enableCreateBtn: boolean = false;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  fruits = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];

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

  remove(fruit): void {
    // const index = this.fruits.indexOf(fruit);
    const i = this.selected.parameterValues.indexOf(fruit);

    if (i >= 0) {
      this.selected.parameterValues.splice(i, 1);
      //when param values removed, default selected value is removed
      this.selected.parameterValues.length === 0 ? this.selected.defaultParamValue = '' : '';
    }
  }

  tableData: any = [];
  columnDetails: any = [];
  parameterValues = [];

  paraterNameExists: boolean = false;
  ngOnInit() {
    console.log(this.data);
    // this.reportService.getReportDataFromHttp('','asc',0,5,this.data,0).subscribe(res=>{
    //   // console.log(res);
    //  this.tableData = res;
    // //  console.log(this.tableData);
    //  if(this.tableData.column_properties)
    //  {  
    //     this.columnDetails = this.tableData.column_properties.map(col=>{
    //       return { columnName : col.mapped_column, dataType: col.column_data_type }
    //     })
    //  }
    //  else{
    //     this.columnDetails = this.tableData.data.sql_columns.map(col=>{
    //       return { columnName : col , dataType: '' }
    //     })
    //  }
    // })
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    this.tableData = this.paramData.tableData
    this.columnDetails = this.paramData.columnDetails
    // console.log(this.tableData);
  }

  validateForm() {
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
      if(element.parameter_name === this.selected.parameterName)
        return true
      else
        return false
    });
    return this.paraterNameExists
  }

  createParameter() {
    console.log(this.selected);
    if(!this.checkParameterNameExists()){
      this.reportService.createParameter(this.selected, this.data).subscribe(res => {
        console.log(res);
        this.closeDailog();
      })      
    }
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
