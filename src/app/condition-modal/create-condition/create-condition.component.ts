import {Component, OnInit, Input} from '@angular/core';
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
  operators = ['AND','OR']
  aggregationList:any;
  
  itemsValuesGroup = [];
  createFormula = [];



  ngOnInit() {
    console.log(this.data);
    
  
  
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

     this.createFormula.push({
      values: "", condition: "", attribute: "", operator: "",
      tableId: [ this.data.data.sl_tables_id ] , conditionId: ''
    });
     console.log(this.itemsValuesGroup);
     
     console.log(this.aggregationList);
     console.log(this.conditionList);
     
    }

  addRow(row,i){
    this.createFormula.push({
      values: "", condition: "", attribute: "", operator: "",
       tableId: [ this.data.data.sl_tables_id ], conditionId: ''
    });
    console.log(this.createFormula);
    
  } 

  removeRow(row,i){
    this.createFormula.splice(i,1);
  }


  public onSelectionChanged(event, con, type) {
    let column = event.option.value.slice(event.option.value.indexOf(".") + 1);
    console.log(column);
    console.log(event);
    
  }

  createCondition(){
    let obj = {
      condition_name : '',
      table_list : [ this.data.data.sl_tables_id ],
      column_used : [],
      condition_formula : "",
      mandatory_flag : true,
      condition_json : this.createFormula
    }
    console.log(obj);
    
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
