import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";

import { SharedDataService } from "../shared-data.service";
import { FormulaService } from "./formula.service";
import { AuthenticationService } from '../../authentication.service';
import Utils from '../../../utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit {

  @Output() onView = new EventEmitter();

  public formula: string;
  public semanticId: number;
  public userId: string;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private formulaService:FormulaService,
    private authenticationService: AuthenticationService, 
    private toastrService:ToastrService
  ) { }

  ngOnInit() {
    this.sharedDataService.currentFormula.subscribe(formula =>
      this.formula = formula
    )
    this.getUserDetails();
  }

  public goToView(route) {
    this.onView.emit();
    route == 'view'?this.router.navigate(['semantic/sem-reports/create-report/view']):this.router.navigate(['semantic/preview']);
  }

  public getUserDetails() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
    this.authenticationService.errorMethod$.subscribe(
      (userId) =>
        this.userId = userId);
  }


  public getColumns() {
    let columnData = [];
    let selectedTables = this.sharedDataService.getSelectedTables();

    selectedTables.forEach(element => {
      // element['columns'].forEach(columns => {
      //   columnData.push(columns);
      // });
      columnData.push(...element['columns']);
    });
    
    return columnData;
  }

  public getTableIds(){
    let tableIds = [];
    let selectedTables = this.sharedDataService.getSelectedTables();

    selectedTables.forEach(element => {
      tableIds.push(element['table']['sl_tables_id']);
    });

    return tableIds;
  }

  /**
   * saveReport
   */
  public saveReport(data: any) {
    Utils.showSpinner();
    let options = {
      'sl_id' : this.semanticId,
      'report_name': data.name,
      "created_by" : this.userId,
      'modified_by' : this.userId,
      'description' : data.desc,
      'is_dqm' : true,
      'extract_flag' : [1,2],
      'user_id' : [this.userId],
      'dl_list' : ['dl_list_5'],
      'sl_tables_id' : this.getTableIds(),
      'sheet_name' : 'sheet01',
      'is_chart' : true,
      'query_used' : this.sharedDataService.getFormula(),
      'color_hexcode' : 'ffffff',
      'columns_used' : this.getColumns(),
      'condition_flag' : false,
      'condition_data': [],
      'calculate_column_flag' :  this.sharedDataService.isAppliedCaluclated(),
      'calculate_column_data' : [this.sharedDataService.getCalculateData()]

    }
    this.formulaService.generateReport(options).subscribe(
      res => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.toastrService.success(res['message']);
        this.router.navigate(['semantic/sem-reports/home']);
      },
      err => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.toastrService.error(err['message']['error']);
      }
    )
  }


  public getPreview(){
    this.sharedDataService.setToggle(true);
  }
}