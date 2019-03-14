import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { SharedDataService } from "../shared-data.service";

@Component({
  selector: 'app-apply-aggregations',
  templateUrl: './apply-aggregations.component.html',
  styleUrls: ['./apply-aggregations.component.css']
})

export class ApplyAggregationsComponent implements OnInit {

  //temporary data
  public groupByAndLevels = ["Return date", "COUNT for all", "AVG for all", "MIN for all", "MAX for all", "Individual functions"]
  public aggregationFunctions = ["SUM for all", "COUNT for all", "AVG for all", "MIN for all", "MAX for all", "Individual functions"]
  public aggregations = ["SUM", "COUNT", "AVG", "MIN", "MAX","VAR","COVAR_POP","COVAR_SAMP","CUNE_DIST","DENSE_RANK","FIRST","GROUP_ID","GROUPING","GROUPING_ID","LAST","MEDIAN","PERCENT_RANK","PERCENTILE_CONT","PERCENTILE_CONT_DISC","RANK","STDDEV","STDDEV_POP","STDDEV_SAMP","VAR_POP","VAR_SAMP","VARIANCE"]
  public columns = ["Invoice cost", "Number of returns", "Dynamic data1", "Dynamic data2"]

  public aggregationsList = [{}];
  public aggregation = { columnToAggregate: "", aggregationLevel: "", aggregationFunction: "", aggregations: [], columns: [] };
  public hide: boolean;
  public formula: string;
  public formulaArray: any = [];

  /////////
  public gData : any = [];
  public colDisplay : any = []

  constructor(private toasterService: ToastrService,private sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.hide = true;
    this.gettingdata();
  }

  public setHide() {
    this.hide = !this.aggregation.aggregationFunction.includes("Individual functions");
    this.reset();
  }

  public reset() {
    this.formulaArray = [];
    if (!this.hide) {
      this.aggregation.aggregations = [];
      this.aggregation.columns = [];
      this.aggregationsList = [{}];
      this.formula = "";
    }
  }

  public calculateFormula(index?: number) {
    if (this.aggregation.aggregationFunction != "Individual functions") {
      console.log("Entering the non param part");
      this.formula = this.aggregation.aggregationFunction;
      this.formulaArray = this.aggregation.aggregationFunction;
      return;
    }
    else {
      if (this.aggregation.aggregations[index] && this.aggregation.columns[index]) {
        let formulaString = `${this.aggregation.aggregations[index]}(${this.aggregation.columns[index]})`;
        this.formulaArray.splice(index, 1, formulaString);
        if (this.formula.includes(formulaString)) {
          this.toasterService.error("Please enter unique set of Aggregation and Column values");
          this.aggregation.aggregations.splice(-1);
          this.aggregation.columns.splice(-1);
          this.aggregationsList.splice(-1);
          this.formulaArray.splice(index, 1);
        }
        this.formula = this.formulaArray.join(',');
        console.log(this.formula);
      }
    }
  }

  public addRow() {
    this.aggregationsList.push({});
  }

  public apply() {
    if (this.aggregation.columnToAggregate && this.aggregation.aggregationLevel && this.aggregation.aggregationFunction) {
      if (this.aggregation.aggregationFunction !== "Individual functions" || (this.aggregation.aggregations.length
        && this.aggregation.columns.length && (this.aggregation.aggregations.length == this.aggregation.columns.length))) {
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


  ///////dynamic data work to be done after getting the table name
  public gettingdata(){
    this.gData = this.sharedDataService.getSelectedTables();
    this.colDisplay = this.gData[0].columns;
    console.log(this.gData);
    console.log(this.colDisplay);
  }

}