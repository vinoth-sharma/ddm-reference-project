import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ReportViewService } from '../report-view.service';
import { FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

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

    fruits = [
      {name: 'Lemon'},
      {name: 'Lime'},
      {name: 'Apple'},
    ];
  
    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
  
      // Add our fruit
      if ((value || '').trim() && !this.parameterValues.some(val=>val === value.trim())) {
        this.parameterValues.push(value.trim());
        // this.fruits.push({name: value.trim()});
      }
  
      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
  
    remove(fruit): void {
      // const index = this.fruits.indexOf(fruit);
      const i = this.parameterValues.indexOf(fruit);
  
      if (i >= 0) {
        this.fruits.splice(i, 1);
        this.parameterValues.splice(i, 1);
      }
    }

    tableData:any = [];
    columnDetails:any = [];
    parameterValues = [];

  ngOnInit() {
    console.log(this.data);
    this.reportService.getReportDataFromHttp('','asc',0,5,this.data,0).subscribe(res=>{
      console.log(res);
     this.tableData = res;
     console.log(this.tableData);
     if(this.tableData.column_properties)
     {  
        this.columnDetails = this.tableData.column_properties.map(col=>{
          return { columnName : col.mapped_column, dataType: col.column_data_type }
        })
     }
     else{
        this.columnDetails = this.tableData.data.sql_columns.map(col=>{
          return { columnName : col , dataType: '' }
        })
     }
    })
  }

  createParameter(){

  }

  closeDailog():void{
    this.dialogRef.close();
  }
}
