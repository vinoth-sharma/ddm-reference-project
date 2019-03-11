import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-apply-aggregations',
  templateUrl: './apply-aggregations.component.html',
  styleUrls: ['./apply-aggregations.component.css']
})

export class ApplyAggregationsComponent implements OnInit {

  //temporary data
  public groupByAndLevelValues = ["Return date", "COUNT for all", "AVG for all", "MIN for all", "MAX for all", "Individual functions"]
  public aggregationFunctions = ["SUM for all", "COUNT for all", "AVG for all", "MIN for all", "MAX for all", "Individual functions"]
  public aggregation = ["SUM", "COUNT", "AVG", "MIN", "MAX"]
  public column = ["Invoice cost", "Number of returns", "Dynamic data1", "Dynamic data2"]

  public aggregationsList = [{}];
  public dataObject = { groupByValue: "", levelValue: "", functionValue: "", aggregations: [], columns: [] };
  public hide: boolean;
  public functionValue: string;
  public formulaString: string;
  public formulaArray: any = [];

  constructor(private toasterService: ToastrService) { }

  ngOnInit() {
    this.hide = true;
  }

  public setHide() {
    this.hide = !this.dataObject.functionValue.includes("Individual functions");
    this.reset();
  }

  public reset() {
    if (this.hide) {
      this.formulaArray = [];
    }
    else {
      this.dataObject.aggregations = [];
      this.dataObject.columns = [];
      this.aggregationsList = [{}];
      this.formulaArray = [];
      this.formulaString = "";
    }
  }

  public calculateFormula(index: number) {
    if (this.dataObject.functionValue != "Individual functions") {
      this.formulaString = "";
      this.formulaString = this.dataObject.functionValue;
      this.formulaArray = this.dataObject.functionValue;
      return;
    }
    else {
      if (this.dataObject.aggregations[index] && this.dataObject.columns[index]) {
        let temp = this.dataObject.aggregations[index] + '(' + this.dataObject.columns[index] + ')';
        this.formulaArray.splice(index, 1, temp);
        if (this.formulaString.includes(temp)) {
          this.toasterService.error("Please enter unique set of Aggregation and Column values");
          this.dataObject.aggregations.splice(-1);
          this.dataObject.columns.splice(-1);
          this.aggregationsList.splice(-1);
          this.formulaArray.splice(index, 1);
          this.formulaString = this.formulaArray.join(',');
          return;
        }
        this.formulaString = this.formulaArray.join(',');
      }
    }
  }

  public addRow() {
    this.aggregationsList.push({});
  }

  public apply() {
    if (this.dataObject.groupByValue && this.dataObject.levelValue && this.dataObject.functionValue) {
      if (this.dataObject.functionValue !== "Individual functions" ||
        (this.dataObject.aggregations.length && this.dataObject.columns.length && (this.dataObject.aggregations.length == this.dataObject.columns.length))) {
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

}