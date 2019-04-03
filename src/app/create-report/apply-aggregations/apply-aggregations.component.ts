import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { SharedDataService } from "../shared-data.service";
import { aggregations } from '../../../constants';

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
  public columns: any = []
  public aggregation = aggregations;
  public tempDisplay :any;
  constructor(private toasterService: ToastrService, private sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.hide = true;
    this.fetchData();
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

    if (this.aggregationData.aggregationFunction != "Individual functions" && this.aggregationData.aggregationFunction.length != 0) {
      console.log("ENTERING CALCULATE FORMULA IF PART");
      this.formula = this.aggregationData.aggregationFunction;
      this.formulaArray = this.aggregationData.aggregationFunction;
    }
    else {
      if (this.aggregationData.aggregations[index] && this.aggregationData.columns[index]) {
        let formulaString = `${this.aggregationData.aggregations[index]}(${this.aggregationData.columns[index]})`;
        this.formulaArray.splice(index, 1, formulaString);
        if (this.formula.includes(formulaString)) {
          this.toasterService.error("Please enter unique set of aggregation and column values");
          this.aggregationData.aggregations.splice(-1);
          this.aggregationData.columns.splice(-1);
          this.aggregationsList.splice(-1);
          this.formulaArray.splice(index, 1);
        }
        this.formula = this.formulaArray.join(',');
      }
    }
    this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.aggregationData.columnToAggregate + "," + this.formula1;
  }

  public calculateFormula1(index?:number){  
      if (this.aggregationData.aggregationLevels[index] && this.aggregationData.aggregationLevelColumns[index]) {
        let formulaString = `${this.aggregationData.aggregationLevels[index]}(${this.aggregationData.aggregationLevelColumns[index]})`;
        // this.formulaArray1.splice(index, 1, formulaString);
        this.formulaArray1.splice(index, 0, formulaString);
        if (this.formula1.includes(formulaString)) {
          this.toasterService.error("Please enter unique set of aggregation and column values");
          this.aggregationData.aggregationLevels.splice(-1);
          this.aggregationData.aggregationLevelColumns.splice(-1);
          this.aggregationsLevelList.splice(-1);
          this.formulaArray1.splice(index, 1);
        }
        else{
        this.formula1 = this.formulaArray1.join(',');
        this.formula = "";

        if(this.aggregationData.aggregationFunction){
          this.formula = this.aggregationData.aggregationFunction;
        }
        else{
          this.formula = `${this.aggregationData.aggregations[index]}(${this.aggregationData.columns[index]})`;
        }
        this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.aggregationData.columnToAggregate + "," + this.formula1;
        }
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
        /////dejoin
        ////then add new formula1
        ////then do formula
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
    //   if (this.aggregationData.columnToAggregate.length && this.aggregationData.aggregationFunction.length && (this.aggregationData.aggregationLevels.length && this.aggregationData.aggregationLevelColumns.length)) {
    //   if (this.aggregationData.aggregationFunction !== "Individual functions" || (this.aggregationData.aggregations.length
    //     && this.aggregationData.columns.length && 
    //     (this.aggregationData.aggregations.length == this.aggregationData.columns.length))) {
    //       let lastestQuery = this.sharedDataService.getFormula();
    //       let fromPos = lastestQuery.search('FROM');
    //       let createCalculatedQuery = ','+this.formula;
    //       var output = [lastestQuery.slice(0, fromPos), createCalculatedQuery, lastestQuery.slice(fromPos)].join('');
    //       console.log(output, 'output in apply');
    //       this.sharedDataService.setFormula('aggregations',output);
    //       this.toasterService.success("Aggregation successful");
    //   }
    //   else {
    //     this.toasterService.error("Please enter valid input values");
    //   }
    // }
    // else {
    //   this.toasterService.error("Please enter valid input values");
    // }
  }

  public fetchData() {
    // this.aggregationColumns = this.sharedDataService.getSelectedTables();
    this.aggregationColumns.forEach(element => {
      this.columns.push(...element['columns']);
    });
  }
 

}