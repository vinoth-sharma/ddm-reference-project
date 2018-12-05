import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { SemdetailsService } from '../semdetails.service';
import { AuthenticationService } from '../authentication.service';
import { SemanticLayerMainService } from './semantic-layer-main.service';



@Component({
  selector: 'app-semantic-layer-main',
  templateUrl: './semantic-layer-main.component.html',
  styleUrls: ['./semantic-layer-main.component.css']
})
export class SemanticLayerMainComponent implements OnInit {
  sidebarFlag: number;
  columns;
  view;
  slChoice;
  button;
  isShow = false;
  public semantic_name;
  public isCollapsed = true;
  public model: any;
  reports = {};
  selectedTable;

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private semanticLayerMainService: SemanticLayerMainService, private semanticService: SemdetailsService) {

    this.semanticService.myMethod$.subscribe((columns) => {
      console.log('columns', columns)
      this.columns = columns
    });
    this.sidebarFlag = 1;
  }

  ngOnInit() {
    this.columns = [];
    this.semantic_name = this.activatedRoute.snapshot.data['semantic']
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });
  }

  widthSetting() {
    if (this.sidebarFlag == 1) {
      document.getElementById('main').style.width = "100%";
      this.sidebarFlag = 0;
    }
    else {
      document.getElementById('main').style.width = "80%";
      this.sidebarFlag = 1;
    }
  }

  show(i) {
    this.button = i;
    this.isShow = !this.isShow;
  }

  public toggle(type) {
    $('#sidebar').toggleClass('active');
  }

  formatter = (result: string) => result.toUpperCase();

  public saveTable(obj, type) {
    let options = {};
    options['table_id'] = obj.table_id;
    options['sl_id'] = this.activatedRoute.snapshot.data['semantic_id'];
    if (type == "column") {
      options['old_column_name'] = obj.old_val;
      options['new_column_name'] = obj.table_name;
      this.semanticLayerMainService.saveColumnName(options).subscribe(res => console.log(res));
    } else {
      options['table_name'] = obj.table_name;
      this.semanticLayerMainService.saveTableName(options).subscribe(res => console.log(res));
    }
  }

  public getDependentReports(tableId) {
    this.selectedTable = tableId;
    this.semanticLayerMainService.getReports(tableId).subscribe((response) => {
      this.reports = response['dependent_reports'][0];
    })
  }

  public cancelModal() {
    this.reports = {};
  }

  public deleteTable() {
    this.semanticLayerMainService.deleteTable(this.selectedTable).subscribe((response) => {
      this.getTables();
      this.reports = {};
    });
  }

  public getTables() {
    let semantic_id = this.activatedRoute.snapshot.data['semantic_id'];
    this.semanticService.fetchsem(semantic_id).subscribe(response => {
      this.columns = response['sl_table'];
    })
  }
}
