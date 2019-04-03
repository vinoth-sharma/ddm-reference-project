import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { FormControl, Validators } from "@angular/forms";
import Utils from "../../../utils";
import { sqlFunctions } from "../../../constants";

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
  public aggregationData = { columnToAggregate: "", aggregationLevels:[], aggregationLevelColumns:[], aggregationFunction: "", aggregations: [], columns: [] };
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
  // public createCalculatedQuery :string;
  // public createCalculatedQuery2 :string;
  public createCalculatedQuery :any = [];
  public createCalculatedQuery2 :any= [];
  public result: any = [];
  public tempTables:any =[];
  public responseData:any=[];
  public columnsResult:any=[];

  public dataValues:any=[];
  public datatypes:any = [];
  public filteredData:any=[];
  public selectedTables:any=[];
  public tables:any=[];
  oldValue:any;
  results: any[] = [];
  current;
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

    // this.tempTables = this.sharedDataService.getSelectedTables();
    // console.log('tempTables', this.tempTables);
    this.sharedDataService.selectedTables.subscribe(tables => this.selectedTables = tables)
    console.log("TEMP RESULT",this.selectedTables)
  }

  tempColumns = [];

  onTableSelect(selected:any){
    console.log(selected);
    
    console.log("VALUE SELECTED---",selected['table']['mapped_table_name'])
    let data = {
      table_id: selected['table']['sl_tables_id'],
      table_type: 'mapped_table'
    }
    console.log("DATA PROCURED:",data);
    Utils.showSpinner();
    this.selectTablesService.getColumns(data).subscribe(response => {
      this.responseData = response;
      console.log("INCOMING RESPONSE",this.responseData);
      this.populateColumns(this.responseData['data']);
      Utils.hideSpinner();
    }, error => {
        console.log("ERROR OCCURING", error);
    })
    
  }

  
  public populateColumns(data:any){
    console.log("DATA",data);
    this.wholeResponse = data
    // this.columns = data;
    let temp = data.filter(element => {
      if(element.data_type === 'DATE')
        return element;
      
    });
    this.filteredData = temp;

    this.columns2= data;

    this.columns2.forEach((element,index) => {
      this.columns[index]= element.mapped_column;
    });

    console.log(temp,'temp',this.filteredData);
    console.log("COLUMNS DISPLAYED",this.columns);
    // console.log("COLUMNS2 as COLUMNS",this.columns);
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
    this.calculateFormula1();
    if (this.aggregationData.aggregationFunction != "Individual functions" && this.aggregationData.aggregationFunction.length != 0) {
      console.log("ENTERING CALCULATE FORMULA IF PART");
      this.formula = this.aggregationData.aggregationFunction;
      this.formulaArray = this.aggregationData.aggregationFunction;
    }
    else {
      // if (this.aggregationData.aggregations[index] && this.aggregationData.columns[index]) {
        // let formulaString = `${this.aggregationData.aggregations[index]}(${this.aggregationData.columns[index]})`;
        let formulaString = `${this.aggregationData.aggregations}(${this.aggregationData.columns})`;
        this.formulaArray.splice(index, 1, formulaString);
        // if (this.formula.includes(formulaString)) {
        //   this.toasterService.error("Please enter unique set of aggregation and column values");
        //   this.aggregationData.aggregations.splice(-1);
        //   this.aggregationData.columns.splice(-1);
        //   this.aggregationsList.splice(-1);
        //   this.formulaArray.splice(index, 1);
        // }
        console.log("FORMULA BEFORE JOINING(FORMULA_ARRAY):",this.formulaArray)
        this.formula = this.formulaArray.join(',');
      // }
    }
    this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.aggregationData.columnToAggregate + "," + this.formula1;
  }

  public calculateFormula1(index?:number){  
    
      if (this.aggregationData.aggregationLevels[index] && this.aggregationData.aggregationLevelColumns[index]) {
        let formulaString = `${this.aggregationData.aggregationLevels[index]}(${this.aggregationData.aggregationLevelColumns[index]})`;
        console.log("formulaString contents(temp):",formulaString)
        this.formulaArray1.splice(index, 1, formulaString);
        // this.formulaArray1 = formulaString;
        console.log("formulaArray1 contents:",this.formulaArray1)
        if (this.formula1.includes(formulaString)) {
          this.toasterService.error("Please enter unique set of aggregation and column values");
          this.aggregationData.aggregationLevels.splice(-1);
          this.aggregationData.aggregationLevelColumns.splice(-1);
          this.aggregationsLevelList.splice(-1);
          this.formulaArray1.splice(index, 1);
        }
        // else{
        this.formula1 = this.formulaArray1.join(',');
        // this.formula1 = this.formulaArray1;
        console.log("formula1 contents:",this.formula1);
        this.formula = "";

        if(this.aggregationData.aggregationFunction){
          this.formula = this.aggregationData.aggregationFunction;
        }
        else{
          this.formula = `${this.aggregationData.aggregations[index]}(${this.aggregationData.columns[index]})`;
        }
        this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.aggregationData.columnToAggregate + "," + this.formula1;
        // }
      }
  }

  public addRow(value? : number) {
    if(value == 1)  this.aggregationsLevelList.push({});
    else  this.aggregationsList.push({});
  }

  public deleteRow(value:number,index: number) {
      if(value == 1){
        this.aggregationData.aggregationLevels.splice(index, 1);
        this.aggregationData.aggregationLevelColumns.splice(index, 1);
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
      if (this.aggregationData.columnToAggregate.length && this.aggregationData.aggregationFunction.length && (this.aggregationData.aggregationLevels.length && this.aggregationData.aggregationLevelColumns.length)) {
      // if (this.aggregationData.aggregationFunction !== "Individual functions" || (this.aggregationData.aggregations.length
      //   && this.aggregationData.columns.length && 
      //   (this.aggregationData.aggregations.length == this.aggregationData.columns.length))) {
        if (this.aggregationData.aggregationFunction !== "Individual functions" || (this.aggregationData.aggregations.length)){
          // let lastestQuery = this.sharedDataService.getFormula();
          // let fromPos = lastestQuery.search('FROM');
          // let createCalculatedQuery = ','+this.formula;
          if(this.aggregationData.aggregationFunction){
            // this.createCalculatedQuery = ','+this.formula1+','+this.aggregationData.aggregationFunction+' ';
            // this.createCalculatedQuery = this.formula1+','+this.aggregationData.aggregationFunction+' ';
            this.createCalculatedQuery[0] = this.formula1;
            this.createCalculatedQuery[1] = this.aggregationData.aggregationFunction;
          }
          else{
            // this.createCalculatedQuery = ','+this.formula1+','+this.formulaArray1+' ';
            this.createCalculatedQuery = this.formula1+','+this.formulaArray1+' ';
          }
          // var output = [lastestQuery.slice(0, fromPos), this.createCalculatedQuery, lastestQuery.slice(fromPos)].join('');
          console.log('output in apply', this.createCalculatedQuery);
          this.sharedDataService.setFormula(['select','aggregations'],this.createCalculatedQuery);
          // this.createCalculatedQuery2 = this.aggregationData.columnToAggregate + "," + this.formula1;
          this.createCalculatedQuery2[0]= this.aggregationData.columnToAggregate;
          this.createCalculatedQuery2[1]= this.formula1
          console.log('output2 in apply', this.createCalculatedQuery2);

          this.sharedDataService.setFormula(['groupBy'],this.createCalculatedQuery2);
          // this.sharedDataService.setFormula('aggregations',output+" ");
          // let lastestQuery2 = this.sharedDataService.getFormula();
          // let fromPos2 = lastestQuery2.length;
          // lastestQuery2 = lastestQuery2 + " GROUP BY " + this.aggregationData.columnToAggregate + "," + this.formula1;
          // var output = [lastestQuery.slice(0, fromPos2), groupByFormula, lastestQuery.slice(fromPos2)].join('');
          // this.sharedDataService.setFormula('aggregations-groupBy',lastestQuery2);
          this.toasterService.success("Aggregation successful");
      }
      else {
        this.toasterService.error("Please enter valid input values");
      }
    }
    else {
      this.toasterService.error("Please enter valid input values");
    }
  }

  public filterAgrCol(level:any){
    console.log("FILATERAGR VALUE",level)

  }

  public inputValue(value,i){
    console.log("inputVal called and value IS ",value)
    this.aggregationData.aggregations = value;
    console.log("this.aggregationData.aggregations VALUE:",this.aggregationData.aggregations)
    if((value || '').trim()){
    this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
    this.oldValue.forEach(element => {
      element + ' ';
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
    columnList = this.columns.filter(element => {
      return element.toLowerCase().includes(value.toLowerCase())
    });
    return [{ groupName:'Functions',values:functionArr},{groupName: 'Columns',values:columnList} ];
  }

  public onSelectionChanged(event,i) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }
    // let oldValue = this.queryTextarea["value"].split(/(\s+)/).filter(e => e.trim().length > 0);
    let index = this.oldValue.length > 0?this.oldValue.length-1:0;
    // this.oldValue[index] = event.option.value;
    // this.setTextareaValue(
    
    
    // this.oldValue[this.oldValue['length']-1] = event.option.value;
    // this.setTextareaValue(event.option.value + " ");
    this.oldValue[index] = event.option.value + '  ';
    
    this.setTextareaValue(this.oldValue.join(' ').split(',').map(f => f)[0]);
    

    if(event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if(event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);

      this.hasError();
      // this.checkDuplicateFormula(this.oldValue.join(' ').split(',').map(f => f.trim())[0]);
      this.checkDuplicate(this.oldValue.join(' ').split(',').map(f => f.trim())[0],'formula');
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
  }

  public hasError = () => {
    if (this.queryTextarea.value) {
      // let splitWord = this.queryTextarea.value
      //   .split(/(\s+)/)
      //   .filter(e => e.trim().length > 0);
      // let functionArr = {};
      // splitWord.forEach((element, index) => {
      //   functionArr[index] = [];
      //   for (let key in this.functions) {
      //     functionArr[index].push(
      //       ...this.functions[key].filter(
      //         option =>
      //           // option.toLowerCase().includes(element)
      //           option.toLowerCase() === element.toLowerCase()
      //       )
      //     );
      //   }
      // });
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
          // if (key != index)
            // return value === (type === 'column'?element['name']:element['calculated_field_formula']);
            if(type === 'column'){
              return value.toLowerCase() === element['name'].toLowerCase();
            }else{
              return value.toLowerCase() === element['formula'].toLowerCase();
            }
        });
        let existingList = this.existingList.filter(element => {
          // return value === (type === 'column'?element['calculated_field_name']:element['calculated_field_formula']);
          if(type === 'column'){
            return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
          }else{
            return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
          }
        });
    
        if (currentList.length > 0 || existingList.length > 0) {
          type === 'column'?this.columnName.setErrors({'incorrect': false}):this.queryTextarea.setErrors({'incorrect': false});
          // return true;
        } else {
          type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
          // return false;
          // this.getCreateCalculatedQuery();
        }
    
      }else
    
      type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
      this.isNew = true;
    
      }


      public populateAggregations(columnValue:string){
        console.log("populateAggregations called")
        console.log("WHOLE RESPONSE",this.wholeResponse);
        let temp = this.wholeResponse.filter(element => {
          if(element.mapped_column === columnValue){
            // return element;
            this.checkVar=element.data_type;
          }
        }
        )
        console.log("required object",this.checkVar);
        // this.checkVar = temp;
        // if(this.checkVar.data_type === "DATE"){
          if(this.checkVar === "DATE"){
          this.aggregationLevelsFiltered = this.aggregation.levels;
          console.log("DATE TYPE VALUES SHOWeD")
        }
        else{
          this.aggregationLevelsFiltered = aggregations.aggregationIndividual;
          console.log("OTHER VALUES SHOWeD")
        }

      }


}