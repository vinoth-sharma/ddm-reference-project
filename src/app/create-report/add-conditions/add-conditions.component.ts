import { Component, OnInit } from '@angular/core';
import { AddConditionsService } from './add-conditions.service';
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate.min.js';
import { ToastrService } from "ngx-toastr";
import Utils from "../../../utils";
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-add-conditions',
  templateUrl: './add-conditions.component.html',
  styleUrls: ['./add-conditions.component.css']
})
export class AddConditionsComponent implements OnInit {

  public conditions = [];
  public isLoading: boolean = true;
  public selected;
  public selectedObj: any;
  public cachedConditions = [];
  public selectedId;
  public searchValue: string;
  public addedCondition = [];
  public close: boolean = false;
  public selectedName;
  public sendFormula = [];
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private addConditions: AddConditionsService,
    private sharedDataService: SharedDataService,
    private toasterService: ToastrService) { }

  public getConditions(callback = null) {
    this.addConditions.fetchCondition().subscribe(res => {
      this.conditions = res['data'];
      this.cachedConditions = this.conditions.slice();
      this.isLoading = false;
      if (callback) {
        callback();
      }
    })
  }

  ngOnInit() {
    this.getConditions();
  }

  onSelect(conditionVal, conditionId) {
    this.selectedId = conditionId;
    this.selectedName = conditionVal;
    this.selectedObj = this.conditions.find(x =>
      x.condition_name.trim().toLowerCase() == conditionVal.trim().toLowerCase()
    ).condition_formula;
  }
  public uploadFile(event: any) {
    let filesData = event.target.files[0];
    XlsxPopulate.fromDataAsync(filesData)
      .then(workbook => {
        let value = workbook.sheet(0).cell("A1").value();
        console.log("the values are ", workbook);
      })
  }

  public deleteCondition() {
    this.searchValue = '';
    Utils.showSpinner();
    this.addConditions.delCondition(this.selectedId).subscribe(response => {
      this.getConditions(() => {
        Utils.hideSpinner();
        this.toasterService.success("Condition deleted Successfully");
      });
      this.selectedObj = '';
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    });
  }

  public conditionAdded() {
    // this.close = true;
    // this.sendFormula = [];
    // if (!this.addedCondition.includes(this.selectedName)) {
    //   this.addedCondition.push(this.selectedName);
    //   this.sendFormula.push(this.selectedObj);
    // }
    // let lastestQuery = this.sharedDataService.getFormula('tables');
    // let formula = `${lastestQuery.trim()} WHERE ${this.sendFormula[0].trim()}`;
    // this.sharedDataService.setFormula('conditions', formula);
  }

  public discardCondition(i) {
    let index = this.addedCondition.indexOf(i);
    this.addedCondition.splice(index, 1);
  }

  public filterList(searchText: string) {
    this.selectedObj = '';
    this.searchValue = searchText;
    this.conditions = this.cachedConditions;
    if (searchText) {
      this.conditions = this.conditions.filter(condition => {
        if (condition['condition_name']
          && (condition['condition_name'].toLowerCase().indexOf(searchText.toLowerCase())) > -1) {
          return condition;
        }
      });
    }
  }
}


