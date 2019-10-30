import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { FormControl } from "@angular/forms";
import Utils from "../../../utils";

import { SharedDataService } from "../shared-data.service";
// import { SelectTablesService } from '../select-tables/select-tables.service';
import { ConstantService } from '../../constant.service';

@Component({
  selector: 'app-apply-aggregations',
  templateUrl: './apply-aggregations.component.html',
  styleUrls: ['./apply-aggregations.component.css']
})

export class ApplyAggregationsComponent implements OnInit {

  public groupByData: groupByRow[] = this.getInitialState();
  public aggregatedColumnsToken = '';
  public aggregatedColumnsTokenCompulsory = '';
  public aggregatedConditions = '';
  // public formula: string;
  public havingCondition: string;
  public formula1: string = "";
  public formulaArray1: any = [];
  public existingCondition: any;
  public columns: any = [];
  // public responseData: any = [];
  // chosenTable; chosenId;
  public selectedTables: any = [];
  public tables: any = [];
  oldValue: any;
  oldValueCompulsory:any;
  results: any[] = [];
  current;
  public formulaString: string = "";
  // public formulaString2: string = "";
  columnWithTable: any = [];
  bracketStack: any = {
    'open': [],
    'close': []
  };
  isError: boolean;
  public chips = [];
  existingList: any[] = [];
  // wholeResponse: any;
  queryTextarea: FormControl = new FormControl();
  queryTextareaCompulsory: FormControl = new FormControl();
  queryConditions: FormControl = new FormControl();
  columnName: FormControl = new FormControl();
  // keyChips = [];
  showlevelAggSearchResult:boolean = false;
  // showlevelAggColSearchResult:boolean = false;
  private functions:any;
  private functionsCopy:any;
  public previousDatObj:any;
  public previousDatObjCopy:any;
  public fieldsPristine: boolean = true;
  public showSpacesError : boolean = false
  public showSpacesErrorHaving : boolean = false;
  lastWord = '';

  @Output() public previousValues = new EventEmitter();

  constructor(private toasterService: ToastrService,
    private sharedDataService: SharedDataService,
    // private selectTablesService: SelectTablesService,
    private constantService:ConstantService) { 
      this.functions = this.constantService.getSqlFunctions('aggregations');
    }

  ngOnInit() {

    this.sharedDataService.selectedTables.subscribe(tables => {
      this.selectedTables = tables;
      console.log("SELECTED TABLES values : ",this.selectedTables);
      
      this.columnWithTable = this.getColumns();
      console.log("this.columnWithTable values : ",this.columnWithTable);
      // let data = this.sharedDataService.getAggregationData().data;
      this.aggregatedColumnsTokenCompulsory = this.sharedDataService.getAggregationData().data;
      // let temp = this.sharedDataService.getAggregationData().data;
      // this.aggregatedColumnsTokenCompulsory = temp;
      console.log("this.aggregatedColumnsTokenCompulsory values : ",this.aggregatedColumnsTokenCompulsory)
      this.aggregatedColumnsToken = this.sharedDataService.getAggregationData().aggregation;
      this.aggregatedConditions = this.sharedDataService.getHavingData();
      let data = this.sharedDataService.getAggregationData().data;
      this.getData(data);
      this.populateSendingData(this.selectedTables);
      this.previousDatObj = this.sharedDataService.getFormulaObject()
      console.log("RECIEVED OBJECT in ngOnInit() ,change this to ngOnChanges or specific event maybe before every 'Add to formula' click :",this.previousDatObj);
      this.aggregatedColumnsTokenCompulsory = this.aggregatedColumnsTokenCompulsory;
      // })
    });

    this.sharedDataService.resetQuerySeleted.subscribe(ele=>{
      this.aggregatedColumnsTokenCompulsory = '';
      this.aggregatedColumnsToken = '';
      this.aggregatedConditions = '';
    })
    
    this.sharedDataService.selectedTables.subscribe(tables => {
        this.aggregatedConditions  = '';
        this.sharedDataService.setFormula(['having'], '');
        this.sharedDataService.setHavingData('');
        this.selectedTables = tables;
        this.aggregatedColumnsToken = '';
        this.aggregatedColumnsTokenCompulsory = '';
        this.sharedDataService.setFormula(['select', 'aggregations'], []);
        this.sharedDataService.setFormula(['groupBy'], '');
        this.columnWithTable = this.getColumns();
        let data = this.sharedDataService.getAggregationData().data;
        this.aggregatedColumnsToken = this.sharedDataService.getAggregationData().aggregation;
        this.aggregatedConditions = this.sharedDataService.getHavingData();
        this.getData(data);
        this.populateSendingData(this.selectedTables);
  });

} 

  // obtraining the aggregations functions list 
  private getData(data){
    this.groupByData = [];
    for(let d in data){
        this.groupByData.push(...data[d]);
      }
  }

  public getColumns() {
    let columnData = [];
    if (this.selectedTables.length) {
      columnData = this.selectedTables.map(element => {
        return element['table']['mapped_column_name'].map(column => {
          return `${element['select_table_alias']}.${column}`
        });
      });
    }
    return columnData;
  }

  // onTableSelect(tableId: number, index: number) {
  //   // check here for error of not selecting more than two tables for aggregations
  //   const selected = this.selectedTables.filter(table => table.table.select_table_id === tableId)[0];
  //   this.groupByData[index]['columns'] = selected['table']['column_properties'].filter(col => col['column']);
  // }

  public calculateFormula(index?: number) {
    this.formulaString = `${this.aggregatedColumnsToken}`; // this is the optional part
    // this.formulaString2 = `${this.aggregatedColumnsTokenCompulsory}`; //this is the compulsory part
  }


  public apply() {
    $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")

  if(this.aggregatedColumnsTokenCompulsory.length === 0 && this.aggregatedColumnsToken.length === 0){ //empty condition
    // this.sharedDataService.setFormula(['select', 'tables'], this.previousDatObj.select.tables);
    // this.previousDatObj = this.sharedDataService.getFormulaObject();
    this.sharedDataService.setFormula(['select', 'tables'], this.previousDatObjCopy.select.tables);
    this.sharedDataService.setFormula(['select', 'aggregations'], []);
    this.sharedDataService.setFormula(['groupBy'], '');
    this.fieldsPristine = true;
    // console.log("this.fieldsPristine set in apply() : ", this.fieldsPristine);    
  }
  else{
      if(this.aggregatedColumnsTokenCompulsory.length && this.aggregatedColumnsToken.length){ // both are there
        let temp = [];
        temp.push(this.aggregatedColumnsTokenCompulsory, this.aggregatedColumnsToken)
        this.sharedDataService.setFormula(['select', 'aggregations'], temp);
        this.previousDatObj = this.sharedDataService.getFormulaObject();
        this.previousDatObjCopy = JSON.parse(JSON.stringify(this.previousDatObj))
        this.sharedDataService.setFormula(['select', 'tables'], []);
        this.sharedDataService.setFormula(['groupBy'], this.aggregatedColumnsTokenCompulsory);
      }
      else if(this.aggregatedColumnsTokenCompulsory.length === 0 && this.aggregatedColumnsToken ){ // only optional part
        let temp = [];
        temp.push(this.aggregatedColumnsToken)
        this.sharedDataService.setFormula(['select', 'aggregations'], temp);
        this.sharedDataService.setFormula(['groupBy'], this.aggregatedColumnsTokenCompulsory);
      }
      else if(this.aggregatedColumnsTokenCompulsory.length && this.aggregatedColumnsToken.length === 0){ // only compulsory part
        let temp = [];
        temp.push(this.aggregatedColumnsTokenCompulsory)
        this.previousDatObj = this.sharedDataService.getFormulaObject();
        this.previousDatObjCopy = JSON.parse(JSON.stringify(this.previousDatObj))
        this.sharedDataService.setFormula(['select', 'tables'], []);
        this.sharedDataService.setFormula(['select', 'aggregations'], temp);
        this.sharedDataService.setFormula(['groupBy'], temp);
      }
  }
  let cD = this.getKeyWise();
  
}

// getTableAlias(tableName: string, index?: number) {
//   return `A_${tableName.substring(0, 3)}_${index}`;
// }

  public inputValue(value, i) {
    this.fieldsPristine = false;
    // console.log("this.fieldsPristine set in inputValue : ",this.fieldsPristine);
    let valueCheck = value;
    if((valueCheck.trim(valueCheck).length == 0)){
      this.showSpacesError = true;
      this.fieldsPristine = false;
      this.toasterService.error("Please remove unwanted white spaces and continue!")
    }
    else{
      this.showSpacesError = true;
      this.fieldsPristine = true;
    }
    this.aggregatedColumnsToken = value;
    if ((value || '').trim()) {
      const matchedValue = value.match(/(.*)(\.|\s|,)(.*)$/);
      this.oldValue = matchedValue ? matchedValue[1] + matchedValue[2] || '' : '';
      this.current = matchedValue ? matchedValue[3] || '': value;
      this.results = this.getSearchedInput(this.current,1);
    } else {
      this.results = [{ groupName: 'Functions', values: [] }, { groupName: 'Columns', values: [] }];
    }
    this.showlevelAggSearchResult = this.results.some(ele=>ele.values.length > 0);
    this.calculateFormula(i);
  }

  public inputValueCompulsory(value, i) {
    this.fieldsPristine = false;
    // console.log("this.fieldsPristine set in inputValueCompulsory() : ", this.fieldsPristine);
    let valueCheck = value;
    if((valueCheck.trim(valueCheck).length == 0)){
      this.showSpacesError = true;
      // this.fieldsPristine = false;
      this.toasterService.error("Please remove unwanted white spaces and continue!")
    }
    else{
      this.showSpacesError = false;
      this.fieldsPristine = true;
    }
    this.aggregatedColumnsTokenCompulsory = value;

    /**************   Old code ***********************/
    // if ((value || '').trim()) {
    //   const matchedValue = value.match(/(.*)(\.|\s|,)(.*)$/);
    //   this.oldValueCompulsory = matchedValue ? matchedValue[1] + matchedValue[2] || '': '';
    //   this.current = matchedValue ? matchedValue[3] || '' : value;
    //   this.results = this.getSearchedInput(this.current,1);
    // } else {
    //   this.results = [{ groupName: 'Functions', values: [] }, { groupName: 'Columns', values: [] }];
    // }


    let query = <HTMLInputElement>document.getElementById('aggregatedColumnsTokenCompulsoryId');
    let j;
    for(j = query.selectionStart-1; j>=0;j--) {
      if(value[j] === ' ') {
        break;
      }
    }
    j++;
    const word = value.slice(j).split(" ")[0];

    if((word || '').trim()){
      // this.checkIsExisting();
      this.lastWord = value;
      this.oldValue = word.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + ' ';
      });
      // this.current = this.oldValue[this.oldValue.length-1]
      this.results = this.getSearchedInput(this.oldValue[this.oldValue.length-1],1);
    }else{
      this.results = [{ groupName: 'Functions', values: [] }, { groupName: 'Columns', values: [] }];
    }



    this.showlevelAggSearchResult = this.results.some(ele=>ele.values.length > 0);
    this.calculateFormula(i);
  }

  private getSearchedInput(value: any,type:number) {
    if(type === 1){
    let functionArr = [], columnList = [];
    this.functionsCopy = this.functions;
    for (let key in this.functionsCopy) {
      functionArr.push(
        ...this.functionsCopy[key].filter(option =>
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
  ];
  }
  else{ // To filter the numeric values only
      let functionArr = [], columnList = [];
      this.functionsCopy = this.functions;
      delete this.functionsCopy['Analytic']
      delete this.functionsCopy['String']
      
      for (let key in this.functionsCopy) {
        functionArr.push(
          ...this.functionsCopy[key].filter(option =>
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
      
      let temp1 = this.selectedTables;
    let temp2 = temp1.map(t=> t.table.column_properties)
    let temp3 = [].concat.apply([],temp2)
    let temp4 = temp3.filter(t => {if(t['data_type'] == 'NUMBER'){return t['column']}}).map(t=>t.column)
    let temp5 = columnList
    let temp6 = temp5.map( (t,index)=> { if(temp4.includes(t.slice(8)))	return t;});
    let temp7=temp6.filter(Boolean);
    let numericColumnList = temp7;
      return [{ 
        groupName: 'Functions', 
        values: functionArr 
      }, { 
        groupName: 'Columns', 
        values: numericColumnList
      }
    ];
  }
  }

  public onSelectionChanged(event, i) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }
    const currentValueMatched = event.option.value + ' ';
    this.setTextareaValue(this.oldValue + currentValueMatched);

    if (event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if (event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);
    this.hasError();
  }

  public onSelectionChangedCompulsory(event, i) {

    /*********** old code *************/
    // if (this.queryTextareaCompulsory["value"] === null) {
    //   this.setTextareaValueCompulsory("");
    // }
    // const currentValueMatched = event.option.value + ' ';
    // this.setTextareaValueCompulsory(this.oldValueCompulsory + currentValueMatched);

    // if (event.option.value === '(')
    //   this.bracketStack['open'].push(event.option.value);
    // else if (event.option.value === ')')
    //   this.bracketStack['close'].push(event.option.value);
    // this.hasError();


   if (this.queryTextareaCompulsory["value"] === null) {
      this.setTextareaValueCompulsory("");
    }

    // let query = <HTMLInputElement>document.getElementById('aggregatedColumnsTokenCompulsoryId');
    let j;
    let value = this.lastWord.split(" ");
    for ( j = 0;j < value.length;j++) {
      if(value[j] == this.oldValue) {
        value[j] = event.option.value + ' ';
        break;
      }
    }
    
    this.setTextareaValueCompulsory(value.join(' '));

    if (event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if (event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);
    this.hasError();
  }

  private setTextareaValue(value) {
    this.queryTextarea.setValue(value);
  }

  private setTextareaValueCompulsory(value) {
    this.queryTextareaCompulsory.setValue(value);
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


  public populateSendingData(selectedTables) {
    let validVal = this.groupByData.filter(o1 => selectedTables.some(o2 => o1['tableId'] === o2['table']['select_table_id'] ))
    if(validVal.length){
      this.groupByData = validVal;
    }
    else if (validVal.length == 0 || selectedTables.table.mapped_column.length === 0){
        this.groupByData = this.getInitialState();
    }
    this.sharedDataService.setAggregationData(this.aggregatedColumnsTokenCompulsory,this.aggregatedColumnsToken);
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
  this.fieldsPristine = false;
  // console.log("this.fieldsPristine set in inputHavingValue() : ", this.fieldsPristine);
  // sca
  let valueCheck = value;
  if((valueCheck.trim(valueCheck).length == 0)){
    this.showSpacesErrorHaving = true;
    this.fieldsPristine = false;
    this.toasterService.error("Please remove unwanted white spaces and continue!")
  }
  else{
    this.showSpacesErrorHaving = false;
    this.fieldsPristine = true;
  }
  this.aggregatedConditions = value;
  if ((value || '').trim()) {
    this.existingCondition = value.split(/[ .]/).filter(e => e.trim().length > 0);
    this.existingCondition.forEach(element => {
      element + '';
    });
    this.current = this.existingCondition[this.existingCondition.length - 1];
    this.results = this.getSearchedInput(this.existingCondition[this.existingCondition.length - 1],1);
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
  // this.findDuplicate(this.existingCondition.join(' ').split(',').map(f => f.trim())[0], 'formula');
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

  public submitConditions() {
    if ((this.havingCondition && this.havingCondition.trim() == '') || !this.havingCondition) {
      this.aggregatedConditions = '';
      this.sharedDataService.setFormula(['having'], '');
      this.sharedDataService.setHavingData('');
      return
    } else {
      this.sharedDataService.setFormula(['having'], this.aggregatedConditions);
      this.sharedDataService.setHavingData(this.aggregatedConditions);
    }
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