import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { ConditionsService } from "../conditions.service";
import { MatDialogRef } from '@angular/material';

// export interface StateGroup {
//   letter: string;
//   names: string[];
// }

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-create-condition',
  templateUrl: './create-condition.component.html',
  styleUrls: ['./create-condition.component.css']
})
export class CreateConditionComponent implements OnInit {
  @Input() data;
  @Input() editData:any;
  @Output() editDone = new EventEmitter()
  @Input() isEdit;
  stateForm: FormGroup = this._formBuilder.group({
    stateGroup: '',
  });


  stateGroups = [{
    letter: 'A',
    names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
  }, {
    letter: 'C',
    names: ['California', 'Colorado', 'Connecticut']
  }, {
    letter: 'D',
    names: ['Delaware']
  }, {
    letter: 'F',
    names: ['Florida']
  }];

  stateGroupOptions: Observable<any>;
  constructor(private dialogRef: MatDialogRef<CreateConditionComponent>,
              private _formBuilder: FormBuilder,
              private conditionService :ConditionsService) {}

  conditionList = [];
  operators:String[] = ['AND','OR']
  aggregationList:any;
  
  itemsValuesGroup = [];
  createFormula = [];
  
  obj = {
    condition_name : '',
    table_list : [ ],
    column_used : [],
    condition_formula : "",
    mandatory_flag : true,
    condition_json : this.createFormula
  }
  
  isVerified:boolean = false;
  validCondition:boolean = false;
  // validCondition:boolean = false;


  ngOnInit(){
    // console.log(this.data);
  
     this.aggregationList = this.conditionService.getAggregationList();
     this.conditionList = this.conditionService.getConditionList();

     this.itemsValuesGroup.push({
       groupName : 'Functions',
       names : [ ...this.aggregationList.Analytic , ...this.aggregationList.Group ,
                 ...this.aggregationList.Numeric , ...this.aggregationList.Others , ...this.aggregationList.String ]
     })

     this.itemsValuesGroup.push({
       groupName : 'Columns',
       names : [ ...this.data.data.mapped_column_name ]
     })


     this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
     .pipe(
       startWith(''),
       map(value => this._filterGroup(value))
     );

     this.resetForm();
    //  console.log(this.itemsValuesGroup);
     
    //  console.log(this.aggregationList);
    //  console.log(this.conditionList);
     this.checkEdit();
     
     
    }

    ngOnChanges(){
      // console.log(this.editData);

    }

    checkEdit(){
      if(this.isEdit){
          this.obj.column_used = this.editData.column_used;
          this.obj.condition_formula = this.editData.condition_formula;
          // this.obj.condition_json = 
          this.obj.condition_name = this.editData.condition_name
          this.obj.mandatory_flag = this.editData.mandatory_flag
          this.obj.table_list = this.editData.table_list
          this.obj['condition_id'] = this.editData.condition_id
          this.createFormula = this.editData.condition_json;
        }
    }

    addRow(row,i){
    this.createFormula.push({
      values: "", condition: "", attribute: "", operator: "",
       tableId: [ this.data.data.sl_tables_id ], conditionId: ''
    });
    // console.log(this.createFormula);
    
  } 

  removeRow(row,i){
    this.createFormula.splice(i,1);
  }


  public onSelectionChanged(event, con, type) {
    let column = event.option.value.slice(event.option.value.indexOf(".") + 1);
    // console.log(column);
    // console.log(event);
    if(this.isColumn(column))
      if(this.obj.column_used.some(col=>col === column))
         return 0
      else
        this.obj.column_used.push(column) 
  }

  isColumn(val){
    let flag = false;
    this.itemsValuesGroup.forEach(ele=>{
      if(ele.groupName)
        flag = ele.names.some(element=>val === element)
    })
    return flag
  }

  createCondition(){
    this.obj.table_list = [ this.data.data.sl_tables_id ]
    // console.log(this.obj);
    this.obj.condition_json = this.createFormula;
    if(this.obj.condition_name){
      if(this.isEdit)
        this.conditionService.updateConditionForTable(this.obj).subscribe(res=>{
          console.log(res);
          this.resetForm();   
          this.editDone.emit(true);     
        })
      else
        this.conditionService.createConditionForTable(this.obj).subscribe(res=>{
          console.log(res);
          this.resetForm();        
        })
      }

  }

  validateRow(row){
    // console.log(row);
    if(row.attribute && row.condition && row.operator && row.values)     
      return true
    else
      return false
  }

  validateCondition(){

    let obj = {
      sl_id : this.data.semanticId,
      table_name : this.data.data.mapped_table_name,
      condition_str : ''
    }

    let str = '';
    // console.log(this.createFormula);
     
    let arrLength = this.createFormula.length;
     this.createFormula.forEach((row,i)=>{
      let l_operator =  arrLength === i+1?"":" " +  row.operator + " ";
      str += row.attribute + " " + row.condition + " " + 
              replaceDoubletoSingleQuote(row.values) + l_operator;
     })
    //  console.log(str);
     obj.condition_str = str;
     this.conditionService.validateConditions(obj).subscribe(res=>{
       console.log(res);
       this.validCondition = true;
       this.obj.condition_formula = obj.condition_str;
     })

    }

    resetForm(){
      this.validCondition = false;
      this.createFormula = [];
      this.createFormula.push({
        values: "", condition: "", attribute: "", operator: "",
        tableId: [ this.data.data.sl_tables_id ] , conditionId: ''
      });

      this.obj = {
        condition_name : '',
        table_list : [ ],
        column_used : [],
        condition_formula : "",
        mandatory_flag : true,
        condition_json : this.createFormula
      }
    }


  closeDialog(): void {
    this.dialogRef.close();
  }

  private _filterGroup(value: string){
    if(value) {
      return this.itemsValuesGroup
        .map(group => ({ groupName : group.groupName, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.itemsValuesGroup;
  }
}

function replaceDoubletoSingleQuote(str){
  return str.replace(/"/g,"'")
}