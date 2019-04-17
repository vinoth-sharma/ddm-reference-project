import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

import { SharedDataService } from "../shared-data.service";
import { AuthenticationService } from '../../authentication.service';
import { FormulaService } from './formula.service';
import Utils from '../../../utils';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit {

  @Output() onView = new EventEmitter();
  @Input() enablePreview:boolean;

  public formula = {};
  public selectColumns: string;
  public semanticId: number;
  public userId: string;
  public selectedTables = [];

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private formulaService: FormulaService,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.sharedDataService.selectedTables.subscribe(tables => this.selectedTables = tables)

    this.getUserDetails();

    this.sharedDataService.formula.subscribe(formula => {
      this.formula = formula;

      let columns = [];
      for (let key in this.formula['select']) {
        columns.push(...formula['select'][key]);
      }
      this.selectColumns = columns.join(', ');
    })
  }

  public goToView() {
    this.onView.emit();
  }

  public getUserDetails() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });

    this.authenticationService.errorMethod$.subscribe(userId => this.userId = userId);
  }

  public getColumns() {
    let columnData = [];

    this.selectedTables.forEach(element => {
      columnData.push(...element['columns']);
    });

    return columnData;
  }

  public getTableIds() {
    let tableIds = [];

    this.selectedTables.forEach(element => {
      tableIds.push(element['table']['select_table_id']);
    });

    return tableIds;
  }

  private isNewReport(){
      return (this.activateRoute.snapshot.paramMap.get('id') === null);
  }

  private getListId(){
    if(this.activateRoute.snapshot.paramMap.get('id')){
      return this.activateRoute.snapshot.paramMap.get('id')
    }else{
      return 0;
    }
  }

  /**
   * saveReport
   */
  public saveReport(data: any) {
    Utils.showSpinner();
    let options = {
      'sl_id': this.semanticId,
      'report_name': data.name,
      "created_by": this.userId,
      'modified_by': this.userId,
      'description': data.desc,
      'is_dqm': data.isDqm === 'true'?true:false,
      'extract_flag': [1, 2],
      'user_id': [this.userId],
      'dl_list': ['dl_list_5'],
      'sl_tables_id': this.getTableIds(),
      'sheet_name': 'sheet01',
      'is_chart': true,
      'query_used': this.getFormula(),
      'color_hexcode': 'ffffff',
      'columns_used': this.getColumns(),
      'condition_flag': this.sharedDataService.isAppliedCondition(),
      'conditions_data': this.sharedDataService.getConditionData(),
      'calculate_column_flag': this.sharedDataService.isAppliedCaluclated(),
      'calculate_column_data': this.sharedDataService.getCalculateData(),
      'report_json': this.getAllData(),
      'is_new_report': this.isNewReport(),
      'report_list_id': this.getListId()
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

  public getFormula() {
    let formula = document.getElementById('formula').innerText.replace(/[\r\n]+/g, ' ');
    return formula;
  }


  private getAllData() {
    return {
      'selected_tables': this.selectedTables,
      'calculated_fields':  this.sharedDataService.getFormulaCalculatedData(),
      'aggregations': this.sharedDataService.getAggregationData(),
      'orderBy': this.sharedDataService.getOrderbyData(),
      'condition': this.sharedDataService.getNewConditionData(),
      'formula_fields': this.formula
    };
  }
}