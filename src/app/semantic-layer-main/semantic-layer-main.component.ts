import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { SemdetailsService } from '../semdetails.service';
import { AuthenticationService } from '../authentication.service';
import { SemanticLayerMainService } from './semantic-layer-main.service';
import { ToastrService } from 'ngx-toastr';

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
  public isLoading: boolean;
  public dependentReports = [];
  public tables = [];
  public action;
  public selectedTables = [];
  public confirmFn;
  public confirmText: string = '';

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private semanticLayerMainService: SemanticLayerMainService, private semanticService: SemdetailsService, private toasterService: ToastrService) {

    this.semanticService.myMethod$.subscribe((columns) => {
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
    this.isLoading = true;
    this.selectedTables.push(tableId);
    this.confirmFn = this.deleteTables;
    this.confirmText = 'Are you sure you want to delete the tables ?';
    this.semanticLayerMainService.getReports(tableId).subscribe(response => {
      this.dependentReports = response['dependent_reports'];
      this.isLoading = false;
    }, error => {
      this.toasterService.error(error.message || 'There seems to be an error. Please try again later.');
    })
  }

  public setSelectedTables(tables) {
    if (this.action === 'ADD') {
      this.selectedTables = tables.map(t => t['table_name']);
    }
    else if (this.action === 'REMOVE') {
      this.selectedTables = tables.map(t => t['sl_tables_id'])
    }
  }

  public deleteTables() {
    this.semanticLayerMainService.deleteTables(this.selectedTables).subscribe(response => {
      this.getSemanticLayerTables();
      this.toasterService.success(response['message']);
      this.selectedTables = [];
    }, error => {
      this.toasterService.error(error.message || 'There seems to be an error. Please try again later.');
    });
  }

  public addTables() {
    let data = {
      sl_id: this.activatedRoute.snapshot.data['semantic_id'],
      tables: this.selectedTables
    }
    this.semanticLayerMainService.addTables(data).subscribe(response => {
      this.getSemanticLayerTables();
      this.toasterService.success(response['message'])
      this.selectedTables = [];
    }, error => {
      this.toasterService.error(error.message || 'There seems to be an error. Please try again later.');
    });
  }

  public getSemanticLayerTables() {
    let semantic_id = this.activatedRoute.snapshot.data['semantic_id'];
    this.isLoading = true;
    this.selectedTables = [];
    this.semanticService.fetchsem(semantic_id).subscribe(response => {
      this.columns = response['data']['sl_table'];
      this.tables = response['data']['sl_table']
      this.isLoading = false;
    }, error => {
      this.toasterService.error(error.message || 'There seems to be an error. Please try again later.');
    })
  }

  public getAllTables() {
    let semantic_id = this.activatedRoute.snapshot.data['semantic_id'];
    this.isLoading = true;
    this.semanticLayerMainService.getAllTables(semantic_id).subscribe(response => {
      this.tables = response['data'];
      this.isLoading = false;
    }, error => {
      this.toasterService.error(error.message || 'There seems to be an error. Please try again later.');
    })
  }

  public setAction(action) {
    this.action = action;
    this.tables = [];
    this.selectedTables = [];

    if (action === 'REMOVE') {
      this.getSemanticLayerTables();
      this.confirmFn = this.deleteTables;
      this.confirmText = 'Are you sure you want to delete the tables ?';
    } else if (action === 'ADD') {
      this.getAllTables();
      this.confirmFn = this.addTables;
      this.confirmText = 'Are you sure you want to add the tables ?';
    }
  }

}