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

  public aggregationsList = [{}];
  public aggregationsLevelList = [{}];
  public aggregationData = { columnToAggregate: "",availableFunctions: [null], aggregationTable:[null],functions:[null], aggregationLevelColumns:[null], aggregationFunction: "", aggregations: [], columns: [] };
  public hide: boolean;
  public formula: string;
  public formula1: string = "";
  public formulaArray: any = [];
  public formulaArray1: any = [];
  public aggregationColumns: any = [];
  public columns: any = [];
  public columns2: any = [];
  public aggregation = aggregations;
  public tempDisplay :any;
  public createCalculatedQuery :any = [];
  public createCalculatedQuery2 :any= [];
  public result: any = [];
  public tempTables:any =[];
  public responseData:any=[];
  public columnsResult:any=[];

  chosenTable;
  public dataValues:any=[];
  public datatypes:any = [];
  public filteredData:any=[];
  public selectedTables:any=[];
  public tables:any=[];
  oldValue:any;
  results: any[] = [];
  current;
  columnWithTable:any = [];
  bracketStack:any = {
    'open' : [],
    'close' : []
};
isError:boolean;
private isNew:boolean = true;
public chips = [];
existingList:any[] = [];
checkVar:any;
wholeResponse : any;
aggregationLevelsFiltered : any;
  queryField: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl();
  columnName:  FormControl = new FormControl();
  tableControl: FormControl = new FormControl('',[Validators.required]);
  private functions = aggregations;
  constructor(private toasterService: ToastrService, 
              private sharedDataService: SharedDataService,
              private selectTablesService: SelectTablesService) { }

  ngOnInit() {
    this.hide = true;
    this.sharedDataService.selectedTables.subscribe(tables => {
      this.selectedTables = tables;
      this.columnWithTable = this.getColumns();
    })
  }
  public getColumns() {
    let columnData = [];

    let columnWithTable = this.selectedTables.map(element => {
      // columnData.push(element['table]['select_table_name']+ ''+ ...element['columns']);
        return element.columns.map(column => {
          // return `${element['table']['select_table_name']}.${column}`
          return `${element['select_table_alias']}.${column}`
        });
    
      // `(${element.formula}) ${element.name}`
    });
    columnWithTable.forEach(data =>{
      columnData.push(...data);
    });
    
    return columnData;
  }
  tempColumns = [];

  onTableSelect(selected:any, i: number){
    let data = {
      table_id: selected['table']['select_table_id'],
      table_type: 'custom_table_id' in selected['table'] ? 'custom_table' : 'mapped_table'
    }
    this.chosenTable = selected['table']['select_table_name'];
    Utils.showSpinner();
    this.selectTablesService.getColumns(data).subscribe(response => {
      this.responseData = response;
      this.wholeResponse = this.responseData['data'];
      this.aggregationData.columns[i] = this.wholeResponse.map(item => item.mapped_column);
      Utils.hideSpinner();
    }, error => {
        // console.log("ERROR OCCURING", error);
    })
    
  }

  
  public populateColumns(data:any){
    this.wholeResponse = data
    let temp = data.filter(element => {
      if(element.data_type === 'DATE')
        return element;
      
    });
    this.filteredData = temp;
    this.columns2= data;
    this.columns2.forEach((element,index) => {
      this.columns[index]= element.mapped_column;
    });
  }


  public setHide() {
    this.hide = !this.aggregationData.aggregationFunction.includes("Individual functions");
    this.reset();
  }

  public reset() {
    this.formulaArray = [];
    if (!this.hide) {
      this.aggregationData.aggregations = [];
      this.aggregationData.columns = [];
      this.aggregationsList = [{}];
      this.formula = "";
      
    }
  }

  public calculateFormula(index?: number ) {
    if(this.aggregationData.aggregationTable[index] == null){
    this.calculateFormula1(index);
    // console.log("aggregationData.aggregations NGMODEL value",this.aggregationData.aggregations)
    }
   
    if (this.aggregationData.aggregationFunction != "Individual functions" && this.aggregationData.aggregationFunction.length != 0) {
      this.formula = this.aggregationData.aggregationFunction;
      this.formulaArray = this.aggregationData.aggregationFunction;
    }

    else {
        let formulaString = `${this.aggregationData.aggregations}`;
        this.formulaArray.splice(index, 1, formulaString);
        // console.log("FORMULA BEFORE JOINING(FORMULA_ARRAY):",this.formulaArray)
        this.formula = this.formulaArray.join(',');
    }
    this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.formula1;
  }

  public calculateFormula1(index?:number){  // calculates the group by part of the apply-aggregations
        if ( this.aggregationData.aggregationTable[index] && this.aggregationData.aggregationLevelColumns[index]) {
          if(this.aggregationData.functions[index]){
            // let formulaString = `${this.aggregationData.functions[index]}(${this.aggregationData.aggregationTable[index].table.select_table_name}.${this.aggregationData.aggregationLevelColumns[index]})`;
            let formulaString = `${this.aggregationData.functions[index]}(${this.aggregationData.aggregationTable[index].select_table_alias}.${this.aggregationData.aggregationLevelColumns[index]})`;
            // console.log("temp exp formed with functions",formulaString)
            this.formulaArray1.splice(index, 1, formulaString);
            // console.log("formulaArray1 formed with functions",this.formulaArray1)
          }
          else{
            // let formulaString = `${this.aggregationData.aggregationTable[index].table.select_table_name}.${this.aggregationData.aggregationLevelColumns[index]}`;
            let formulaString = `${this.aggregationData.aggregationTable[index].select_table_alias}.${this.aggregationData.aggregationLevelColumns[index]}`;
            // console.log("temp exp formed WITHOUT functions",formulaString)
            this.formulaArray1.splice(index, 1, formulaString);
            // console.log("formulaArray1 formed WITHOUT functions",this.formulaArray1)
          }
          this.formula1 = this.formulaArray1.join(',');
          this.formula = this.formula1 + " GROUP BY " + this.formula1;
        }
  }

  public addRow(value? : number) {
    if(value == 1) {
      this.aggregationsLevelList.push({});
      this.aggregationData.aggregationTable.push(null);
      this.aggregationData.aggregationLevelColumns.push(null);
      this.aggregationData.functions.push(null);
    }
    else {
      this.aggregationsList.push({});
    }
  }

  public deleteRow(value:number,index: number) {
      if(value == 1){
        this.aggregationData.functions.splice(index, 1);
        this.aggregationData.aggregationLevelColumns.splice(index, 1);
        this.aggregationData.aggregationTable.splice(index, 1);
        this.aggregationsLevelList.splice(index, 1);
        this.formulaArray1.splice(index, 1);
        this.formula1 = this.formulaArray1.join(',');
        this.formula = "";
        this.formula = this.formulaArray.join(',');
        this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.aggregationData.columnToAggregate + "," + this.formula1;  

      }
      else{
      this.aggregationData.aggregations.splice(index, 1);
      this.aggregationData.columns.splice(index, 1);
      this.aggregationsList.splice(index, 1);
      this.formulaArray.splice(index, 1);
      this.formula = this.formulaArray.join(',');
      this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.aggregationData.columnToAggregate + "," + this.formula1;  
    if (this.formulaArray.length === 0) {
      this.aggregationData.aggregationFunction = "";
    }
  }
  }

  public apply() {
    if( this.aggregationData.aggregationTable[0] != null ||  this.aggregationData.aggregations.length !=0 ){
      if(this.aggregationData.aggregationTable[0] != null && this.aggregationData.aggregations.length != 0){
        // console.log("this.aggregationData.aggregationTable STATE:",this.aggregationData.aggregationTable)
        let temp = [];
        temp.push(this.formula1, this.aggregationData.aggregations)
        this.sharedDataService.setFormula(['select','aggregations'],temp);
        this.sharedDataService.setFormula(['select','tables'], []);
        this.sharedDataService.setFormula(['groupBy'],this.formula1);
        return;
      }
      else if(this.aggregationData.aggregationTable[0] == null && this.aggregationData.aggregations.length != 0){    
        let temp = [];
        temp.push(this.aggregationData.aggregations)
        this.sharedDataService.setFormula(['select','aggregations'],temp);
        this.sharedDataService.setFormula(['groupBy'],this.formula1);
        return;
      }
      else if(this.aggregationData.aggregations.length === 0){
        // console.log("ENTERING the no-aggregations for numerical columns part")
        let temp = [];
        temp.push(this.formula1)
        this.sharedDataService.setFormula(['select','tables'], []);
        this.sharedDataService.setFormula(['select','aggregations'],temp);
        this.sharedDataService.setFormula(['groupBy'],temp);
      }
    }
  }

  public inputValue(value,i){
    this.aggregationData.aggregations = value;
    if((value || '').trim()){
    this.oldValue = value.split(/[ .]/).filter(e => e.trim().length > 0);
    this.oldValue.forEach(element => {
      element + '';
    });
    this.current = this.oldValue[this.oldValue.length-1];
   this.results =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
  }else{
    this.results = [{ groupName:'Functions',values:[]},{groupName: 'Columns',values:[]} ];
  }
  this.calculateFormula(i);
  }

  private getSearchedInput(value: any) {
    let functionArr = [],columnList = [];
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
    columnList = columnList.filter(item => item.toLowerCase().includes(value.toLowerCase()));
    return [{ groupName:'Functions',values:functionArr},{groupName: 'Columns',values:columnList},
  {groupName: 'Tables', values: [...new Set(this.selectedTables.map(item => item.table.select_table_name))].filter((table: string) => table.toLowerCase().includes(value.toLowerCase()))} ];
  }

  public onSelectionChanged(event,i) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }
    let index = this.oldValue.length > 0?this.oldValue.length-1:0;
    this.oldValue[index] = event.option.value + '  ';
    this.setTextareaValue(this.oldValue.join(' '));
    

    if(event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if(event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);
      this.hasError();
      this.checkDuplicate(this.oldValue.join(' ').split(',').map(f => f.trim())[0],'formula');
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
  }

  public hasError = () => {
    if (this.queryTextarea.value) {
      if(this.bracketStack['open'].length === this.bracketStack['close'].length){
        this.isError = false;
      }
      else{
        this.isError = true;
      }
    }
  };

  public checkDuplicate(value,type) {


    if((value || '').trim() && this.isNew){
        let currentList = this.chips.filter((element, key) => {
            if(type === 'column'){
              return value.toLowerCase() === element['name'].toLowerCase();
            }else{
              return value.toLowerCase() === element['formula'].toLowerCase();
            }
        });
        let existingList = this.existingList.filter(element => {
          if(type === 'column'){
            return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
          }else{
            return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
          }
        });
    
        if (currentList.length > 0 || existingList.length > 0) {
          type === 'column'?this.columnName.setErrors({'incorrect': false}):this.queryTextarea.setErrors({'incorrect': false});
        } else {
          type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
        }
    
      }else
    
      type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
      this.isNew = true;
    
      }


      public populateAggregations(columnValue:string, i){
        const columnData = this.wholeResponse.filter(item => item.mapped_column === columnValue)[0];
        if (columnData.data_type === 'DATE') {
          this.aggregationData.availableFunctions[i] = aggregations.levels;
        } else {
          this.aggregationData.availableFunctions[i] = aggregations.aggregationIndividual;
        }
      }


}