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
  public aggregationData = { columnToAggregate: "", aggregationLevel: "", aggregationFunction: "", aggregations: [], columns: [] };
  public hide: boolean;
  public formula: string;
  public formulaArray: any = [];
  public aggregationColumns: any = [];
  public columns: any = []
  public aggregation = aggregations;

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

  public calculateFormula(index?: number) {
    if (this.aggregationData.aggregationFunction != "Individual functions") {
      console.log("Entering the non param part");
      this.formula = this.aggregationData.aggregationFunction;
      this.formulaArray = this.aggregationData.aggregationFunction;
      return;
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
  }

  public addRow() {
    this.aggregationsList.push({});
  }

  public apply() {
    if (this.aggregationData.columnToAggregate && this.aggregationData.aggregationLevel && this.aggregationData.aggregationFunction) {
      if (this.aggregationData.aggregationFunction !== "Individual functions" || (this.aggregationData.aggregations.length
        && this.aggregationData.columns.length && (this.aggregationData.aggregations.length == this.aggregationData.columns.length))) {
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

  public fetchData() {
    this.aggregationColumns = this.sharedDataService.getSelectedTables();
    this.aggregationColumns.forEach(element => {
      this.columns.push(...element['columns']);
      console.log(this.columns);
    });
  }

}