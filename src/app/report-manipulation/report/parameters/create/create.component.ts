import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Utils from '../../../../../utils';
import { ToastrService } from 'ngx-toastr';
import { ParametersService } from '../parameters.service';
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate.min.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-create-parameter',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  @Input() id:number;
  @Input() columns:any[];
  @Input() parmaData:any[];
  @Input() parameters:any[];
  @Output() save = new EventEmitter();

  isView:boolean;
  selectedColumn;

  parameterForm  = new FormGroup({
    column: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required]),
    values: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    default: new FormControl('',[Validators.required])
  });

  constructor(private toastrService:ToastrService           
  ) { }

  ngOnInit() {}

  ngOnChanges() {
    if(this.parmaData.hasOwnProperty('column_used')) {
      this.selectedColumn = this.parmaData['column_used'];
      this.parameterForm.get('column').setValue(this.parmaData['column_used']);
      // this.parameterForm.controls.column.setValue(this.parmaData['column_used']);
      this.parameterForm.controls.name.setValue(this.parmaData['parameter_name']);
      this.parameterForm.controls.values.setValue(this.parmaData['parameter_formula']);
      this.parameterForm.controls.description.setValue(this.parmaData['description']);
      this.parameterForm.controls.default.setValue(this.parmaData['default_value_parameter']);
      this.isView = true;
    }else{
      this.isView = false;
      this.reset();
    }
  }

  public create(){
    Utils.showSpinner();

    let data = {
      'column_used': this.parameterForm.controls.column.value['column'],
      'parameter_name': this.parameterForm.controls.name.value,
      'parameter_formula': `${this.parameterForm.controls.column.value['column']} IN ${this.parameterForm.controls.values.value}`,
      'description': this.parameterForm.controls.description.value,
      'default_value_parameter': this.parameterForm.controls.default.value.replace(/['"]+/g, ''),
      'report_list_id': this.id,
      'table_used': this.parameterForm.controls.column.value['table'],
      'hierarchy': 0
    };

    this.save.emit(data);
  };

  public reset(){
    if(!this.isView)
    this.parameterForm.reset();
  };

  public triggerFileBtn() {
    document.getElementById("fileUpload").click();
  };

  public uploadFile(event: any) {  // function to upload excel
    let filesData = event.target.files[0];
    XlsxPopulate.fromDataAsync(filesData)
      .then(workbook => {
        let value = workbook.sheet(0).range("A1:A100").value();

        let valueList = [];
        
        value.forEach(element => {
          if(!(element.length === 1 && element[0] === undefined))
            valueList.push(...element);
        });
        if (typeof valueList[0] === "number") {
          this.parameterForm.controls.values.setValue( `( ${valueList} )`);

        } else if (typeof (valueList[0]) === "string") {
          this.parameterForm.controls.values.setValue( `( ${valueList.map(t => '"' + t + '"')} )`);
        } 
            // else if(typeof (valueList[0]) === "date") {
            // this.uploadData = list.map(t => ' + t + ');
            // this.valueString = `( ${ this.uploadData} )`; 
            // } 
          event.target.value = '';
      })
      .catch(err => {
        event.target.value = '';
        this.toastrService.error(err)
      })
     
  };

  public checkDuplicate(value){
    let list = this.parameters;
    
    if(list.indexOf(value) > -1){
      this.parameterForm['controls']['name'].setErrors({'incorrect': false})
    }else{
      this.parameterForm['controls']['name'].setErrors(null);
    }
  };

  public checkBracket(value){

    if(value[value.length - 1] === ')' && value[0] === '('){
      this.parameterForm['controls']['values'].setErrors(null);
    }else{
      this.parameterForm['controls']['values'].setErrors({'incorrect': false})
    }
  }

}