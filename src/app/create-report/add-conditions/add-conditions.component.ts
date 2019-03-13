import { Component, OnInit } from '@angular/core';
import { AddConditionsService } from "./add-conditions.service";

@Component({
  selector: 'app-add-conditions',
  templateUrl: './add-conditions.component.html',
  styleUrls: ['./add-conditions.component.css']
})
export class AddConditionsComponent implements OnInit {

  public existShow: boolean = true;
  public createShow: boolean = false;
  public conditions = [];
  public isLoad: boolean = true;
  public selected;
  public selectedObj;
  cachedConditions = [];

  constructor(private addConditions: AddConditionsService) { }

  public selectCreate() {
    this.existShow = false;
    this.createShow = true;
  }

  public selectExist() {
    this.createShow = false;
    this.existShow = true;
  }

  public getConditions() {
    this.addConditions.fetchCondition().subscribe(res => {
      this.conditions = res['data'];
      this.cachedConditions = this.conditions.slice();
      this.isLoad = false;
    })
  }

  ngOnInit() {
    this.getConditions();
  }

  onSelect(event) {
    this.selected = event.target.id;
    this.selectedObj = this.conditions.find(x =>
      x.condition_name.trim().toLowerCase() == this.selected.trim().toLowerCase()
    ).condition_formula;
  }

  public filterList(searchText: string) {
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
