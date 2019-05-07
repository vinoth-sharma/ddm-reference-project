import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { FormControl, Validators } from "@angular/forms";
import Utils from "../../../utils";

import { SharedDataService } from "../shared-data.service";
import { aggregations } from '../../../constants';
import { SelectTablesService } from '../select-tables/select-tables.service';

@Component({
  selector: 'app-apply-aggregations',
  templateUrl: './apply-aggregations.component.html',
  styleUrls: ['./apply-aggregations.component.css']
})

export class ApplyAggregationsComponent implements OnInit {
  public groupByData: groupByRow[] = this.getInitialState();
  public aggregatedColumnsToken = '';
  public aggregatedConditions = '';
  public formula: string;
  public havingCondition: string;
  public formula1: string = "";
  public formulaArray1: any = [];
  public existingCondition: any;
  public columns: any = [];
  public responseData: any = [];
  chosenTable; chosenId;
  public selectedTables: any = [];
  public tables: any = [];
  oldValue: any;
  results: any[] = [];
  current;
  columnWithTable: any = [];
  bracketStack: any = {
    'open': [],
    'close': []
  };
  isError: boolean;
  // private isNew: boolean = true;
  public chips = [];
  existingList: any[] = [];
  wholeResponse: any;
  queryTextarea: FormControl = new FormControl();
  queryConditions: FormControl = new FormControl();
  columnName: FormControl = new FormControl();
  keyChips = [];

  private functions = aggregations;

  constructor(private toasterService: ToastrService,
    private sharedDataService: SharedDataService,
    private selectTablesService: SelectTablesService) { }

  ngOnInit() {
    this.sharedDataService.selectedTables.subscribe(tables => {
      this.selectedTables = tables;
      this.columnWithTable = this.getColumns();
      let data = this.sharedDataService.getAggregationData().data;
      this.aggregatedColumnsToken = this.sharedDataService.getAggregationData().aggregation;
      this.aggregatedConditions = this.sharedDataService.getHavingData();
      this.getData(data);
      this.populateSendingData(this.selectedTables);
      // this.equivalenceCheck(selectedTables,groupByData);
    })
    // this.aggregatedColumnsToken = " ";
    // After changing the tables,we have to change the update the respective changed values but in auto suggest part,it is difficult to
    // handle the formula
  }

  private getData(data){
    this.groupByData = [];
    for(let d in data){
        this.groupByData.push(...data[d]);
      }
      
  }

  public getColumns() {
    let columnData = [];
    if (this.selectedTables.length) {
      columnData = this.selectedTables.reduce((res, item) => (res.concat(item.columns.map(column => `${item['select_table_alias']}.${column}`))), []);
    }
    return columnData;
  }

  onTableSelect(tableId: number, index: number) {
    const selected = this.selectedTables.filter(table => table.table.select_table_id === tableId)[0];
      this.groupByData[index]['columns'] = selected['table']['column_properties'].filter(col => col['column'] && selected['columns'].includes(col['column']));
  }

  public calculateFormula(index?: number) {
    // console.log("ENTERING THE SELECT calculation code!");
    if (this.groupByData[index].table == null) {
      this.calculateFormula1(index);
    }
    let formulaString = `${this.aggregatedColumnsToken}`;
    this.formula = formulaString;
    // console.log("temp SELECT formula obtained:",this.formula);
    this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.formula1;
    
  }

  public calculateFormula1(index?: number) {  // calculates the group by part of the apply-aggregations  CHECK ERROR HERE,cant add more than two dd of same columns
    // console.log("ENTERING THE GROUPBY calculation code!");
    let validVal = this.selectedTables.filter(o1 => this.groupByData.some(o2 => o1['table']['select_table_id'] === o2['tableId'] ))
    // console.log("VALID VALUES",validVal);
    // if (validVal[index]['table']['select_table_name'] && this.groupByData[index]['selectedColumn']['column']) {
      if (validVal[index] && validVal[index]['table']['select_table_name'] && this.groupByData[index]['selectedColumn']) {
      if (this.groupByData[index].selectedFunction) {
        let formulaString = `${this.groupByData[index].selectedFunction}(${validVal[index]['select_table_alias']}.${this.groupByData[index]['selectedColumn']})`;
        // let formulaString = `${this.groupByData[index].selectedFunction}(${validVal[index]['select_table_alias']}.${this.groupByData[index]['selectedColumn']['column']})`;
        this.formulaArray1.splice(index, 1, formulaString);
      }
      else {
        let formulaString = `${validVal[index]['select_table_alias']}.${this.groupByData[index]['selectedColumn']}`;
        // let formulaString = `${validVal[index]['select_table_alias']}.${this.groupByData[index]['selectedColumn']['column']}`;
        this.formulaArray1.splice(index, 1, formulaString);
      }
      this.formula1 = this.formulaArray1.join(',');
      // console.log("temp GROUP BY formula obtained:",this.formula1);
    }
  }

  public addRow() {
      this.groupByData.push({
        tableId: null,
        table: null,
        columns: [],
        selectedColumn: null,
        functions: [],
        selectedFunction: null,
      });
  }

  public deleteRow(index: number) {
    if ((this.groupByData.length - 1) == 0) {
      this.groupByData = this.getInitialState();
      this.sharedDataService.setFormula(['orderBy'], '');
    }else{
      this.groupByData.splice(index, 1);
      this.formulaArray1.splice(index, 1);
      this.formula1 = this.formulaArray1.join(',');
      this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.formula1;
    }
  }

  public apply() {
  //   if (this.groupByData[0]['tableId'] != null || this.aggregatedColumnsToken.length != 0) {
  //   if (this.groupByData[0]['tableId'] != null && this.aggregatedColumnsToken.length != 0) {
  //     let temp = [];
  //     temp.push(this.formula1, this.aggregatedColumnsToken)
  //     this.sharedDataService.setFormula(['select', 'aggregations'], temp);
  //     this.sharedDataService.setFormula(['select', 'tables'], []);
  //     this.sharedDataService.setFormula(['groupBy'], this.formula1);
  //   }
  //   else if (this.groupByData['tableId'] == null && this.aggregatedColumnsToken.length != 0) {
  //     let temp = [];
  //     temp.push(this.aggregatedColumnsToken)
  //     this.sharedDataService.setFormula(['select', 'aggregations'], temp);
  //     this.sharedDataService.setFormula(['groupBy'], this.formula1);
  //   }
  //   else if (this.aggregatedColumnsToken.length === 0) {
  //     let temp = [];
  //     temp.push(this.formula1)
  //     this.sharedDataService.setFormula(['select', 'tables'], []);
  //     this.sharedDataService.setFormula(['select', 'aggregations'], temp);
  //     this.sharedDataService.setFormula(['groupBy'], temp);
  //   }
  // }


  if(this.groupByData[0]['tableId'] == null && !this.aggregatedColumnsToken){
    this.sharedDataService.setFormula(['select', 'tables'], this.columnWithTable);
    this.sharedDataService.setFormula(['select', 'aggregations'], []);
    this.sharedDataService.setFormula(['groupBy'], '');
  }else{
      if(this.groupByData[0]['tableId'] != null && this.aggregatedColumnsToken){
        let temp = [];
        temp.push(this.formula1, this.aggregatedColumnsToken)
        this.sharedDataService.setFormula(['select', 'aggregations'], temp);
        this.sharedDataService.setFormula(['select', 'tables'], []);
        this.sharedDataService.setFormula(['groupBy'], this.formula1);
      }else if(this.groupByData[0]['tableId'] == null && this.aggregatedColumnsToken ){
        let temp = [];
        temp.push(this.aggregatedColumnsToken)
        this.sharedDataService.setFormula(['select', 'aggregations'], temp);
        this.sharedDataService.setFormula(['groupBy'], this.formula1);
      }else if(this.groupByData[0]['tableId'] != null && !this.aggregatedColumnsToken){
        let temp = [];
        temp.push(this.formula1)
        this.sharedDataService.setFormula(['select', 'tables'], []);
        this.sharedDataService.setFormula(['select', 'aggregations'], temp);
        this.sharedDataService.setFormula(['groupBy'], temp);
      }
  }
  let cD = this.getKeyWise();
  
}
  public inputValue(value, i) {
    this.aggregatedColumnsToken = value;
    if ((value || '').trim()) {
      this.oldValue = value.split(/[ .]/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + '';
      });
      this.current = this.oldValue[this.oldValue.length - 1];
      this.results = this.getSearchedInput(this.oldValue[this.oldValue.length - 1]);
    } else {
      this.results = [{ groupName: 'Functions', values: [] }, { groupName: 'Columns', values: [] }];
    }
    this.calculateFormula(i);
  }

  private getSearchedInput(value: any) {
    let functionArr = [], columnList = [];
    for (let key in this.functions) {
      functionArr.push(
        ...this.functions[key].filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    this.columnWithTable.forEach(columns => {
      columnList = columnList.concat(columns);
    });
    columnList = columnList.filter(item => {
      return item.toLowerCase().includes(value.toLowerCase())
    });
    return [{ 
      groupName: 'Functions', 
      values: functionArr 
    }, { 
      groupName: 'Columns', 
      values: columnList 
    }
    // { groupName: 'Tables', 
    // values: [...new Set(this.selectedTables.map(item => item.select_table_alias))].filter((table: string) => {
    //   return table.toLowerCase().includes(value.toLowerCase())
    // }) 
    // }
  ];
  }

  public onSelectionChanged(event, i) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }
    let index = this.oldValue.length > 0 ? this.oldValue.length - 1 : 0;
    this.oldValue[index] = event.option.value + '  ';
    this.setTextareaValue(this.oldValue.join(' '));

    if (event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if (event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);
    this.hasError();
    this.checkDuplicate(this.oldValue.join(' ').split(',').map(f => f.trim())[0], 'formula');
  }

  private setTextareaValue(value) {
    this.queryTextarea.setValue(value);
  }

  public hasError = () => {
    if (this.queryTextarea.value) {
      if (this.bracketStack['open'].length === this.bracketStack['close'].length) {
        this.isError = false;
      }
      else {
        this.isError = true;
      }
    }
  };

  public checkDuplicate(value, type) {
    if ((value || '').trim()) {
      let currentList = this.chips.filter((element, key) => {
        if (type === 'column') {
          return value.toLowerCase() === element['name'].toLowerCase();
        } else {
          return value.toLowerCase() === element['formula'].toLowerCase();
        }
      });
      let existingList = this.existingList.filter(element => {
        if (type === 'column') {
          return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
        } else {
          return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
        }
      });

      if (currentList.length > 0 || existingList.length > 0) {
        type === 'column' ? this.columnName.setErrors({ 'incorrect': false }) : this.queryTextarea.setErrors({ 'incorrect': false });
      } else {
        type === 'column' ? this.columnName.setErrors(null) : this.queryTextarea.setErrors(null);
      }

    } 
    else{
      type === 'column' ? this.columnName.setErrors(null) : this.queryTextarea.setErrors(null);
      // this.isNew = true;
    }
  }

  public populateAggregations(columnValue: string, index) {
    // if (this.groupByData[index]['columns'][index]['data_type'] === 'DATE') {\
    // if (columnValue['data_type'] === 'DATE') {
      if (columnValue.includes('DATE') || columnValue.includes('TIMESTAMP')) {
        this.groupByData[index].functions = aggregations.levels;
      } else {
        this.groupByData[index].functions = aggregations.aggregationIndividual;
  }
}

  public populateSendingData(selectedTables) {
    let validVal = this.groupByData.filter(o1 => selectedTables.some(o2 => o1['tableId'] === o2['table']['select_table_id'] ))
    if(validVal.length){
      this.groupByData = validVal;
    }
    else if (validVal.length == 0 || selectedTables.table.mapped_column.length === 0){
        this.groupByData = this.getInitialState();
    }

    // this.sharedDataService.setAggregationData(this.getKeyWise());
    this.sharedDataService.setAggregationData(this.groupByData,this.aggregatedColumnsToken);
  }

  private getKeyWise(){
     return this.groupByData.reduce(function(rv, x){
       (rv[x['tableId']] = rv[x['tableId']] || []).push(x);
       return rv;

     }, {});
     
  };

  private getInitialState() {
   return [{
      tableId: null,
      table: null,
      selectedColumn: null,
      columns: [],
      functions: [],
      selectedFunction: null,
    }];
  }

// HAVING 

public calculateCondition() {
  let formulaString = `${this.aggregatedConditions}`;
  this.havingCondition = formulaString;
}

public inputHavingValue(value, i){
  this.aggregatedConditions = value;
  if ((value || '').trim()) {
    this.existingCondition = value.split(/[ .]/).filter(e => e.trim().length > 0);
    this.existingCondition.forEach(element => {
      element + '';
    });
    this.current = this.existingCondition[this.existingCondition.length - 1];
    this.results = this.getSearchedInput(this.existingCondition[this.existingCondition.length - 1]);
  } else {
    this.results = [{ groupName: 'Functions', values: [] }, { groupName: 'Columns', values: [] }];
  }
  this.calculateCondition();
}

private setAreaValue(value) {
  this.queryConditions.setValue(value);
}

public onChanges(event) {
  if (this.queryConditions["value"] === null) {
    this.setAreaValue("");
  }
  let index = this.existingCondition.length > 0 ? this.existingCondition.length - 1 : 0;
  this.existingCondition[index] = event.option.value + '  ';
  this.setAreaValue(this.existingCondition.join(' '));

  if (event.option.value === '(')
    this.bracketStack['open'].push(event.option.value);
  else if (event.option.value === ')')
    this.bracketStack['close'].push(event.option.value);
  this.checkError();
  this.findDuplicate(this.existingCondition.join(' ').split(',').map(f => f.trim())[0], 'formula');
}

public checkError = () => {
  if (this.queryConditions.value) {
    if (this.bracketStack['open'].length === this.bracketStack['close'].length) {
      this.isError = false;
    }
    else {
      this.isError = true;
    }
  }
}

public findDuplicate(value, type) {
  if ((value || '').trim()) {
    let currentList = this.chips.filter((element, key) => {
      if (type === 'column') {
        return value.toLowerCase() === element['name'].toLowerCase();
      } else {
        return value.toLowerCase() === element['formula'].toLowerCase();
      }
    });
    let existingList = this.existingList.filter(element => {
      if (type === 'column') {
        return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
      } else {
        return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
      }
    });

    if (currentList.length > 0 || existingList.length > 0) {
      type === 'column' ? this.columnName.setErrors({ 'incorrect': false }) : this.queryConditions.setErrors({ 'incorrect': false });
    } else {
      type === 'column' ? this.columnName.setErrors(null) : this.queryConditions.setErrors(null);
    }

  } 
  else{
    type === 'column' ? this.columnName.setErrors(null) : this.queryConditions.setErrors(null);
    // this.isNew = true;
  }
}

public submitConditions() {
      // let temp = [];
      // temp.push(this.aggregatedConditions);
      this.sharedDataService.setFormula(['having'], this.aggregatedConditions);
      this.sharedDataService.setHavingData(this.aggregatedConditions);
}

public getArrayInformation() {

  

}


}


  export interface groupByRow{
  tableId: number;
  table: any;
  columns: string[];
  selectedColumn: string;
  functions: string[];
  selectedFunction: string;
}