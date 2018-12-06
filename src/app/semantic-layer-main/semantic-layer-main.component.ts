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
  public reports = [];
  public selectedTable;
  public confirmFn;

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
    this.selectedTable = tableId;
    this.semanticLayerMainService.getReports(tableId).subscribe(response => {
      this.reports = response['dependent_reports'];
      this.isLoading = false;
      this.confirmFn = this.deleteTable;
    }, error => {
      this.toasterService.error(error.message || 'There seems to be an error. Please try again later.');
    })
  }

  public deleteTable() {
    this.semanticLayerMainService.deleteTable(this.selectedTable).subscribe(response => {
      this.getTables();
      this.toasterService.success('Table deleted successfully')
    }, error => {
      this.toasterService.error(error.message || 'There seems to be an error. Please try again later.');
    });
  }

  public getTables() {
    let semantic_id = this.activatedRoute.snapshot.data['semantic_id'];
    this.isLoading = true;
    this.semanticService.fetchsem(semantic_id).subscribe(response => {
      this.columns = response['sl_table'];
      this.isLoading = false;
    }, error => {
      this.toasterService.error(error.message || 'There seems to be an error. Please try again later.');
    })
  }
}