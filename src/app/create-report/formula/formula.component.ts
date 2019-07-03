import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

import { SharedDataService } from "../shared-data.service";
import { AuthenticationService } from '../../authentication.service';
import { FormulaService } from './formula.service';
import Utils from '../../../utils';
import { SemanticReportsService } from '../../semantic-reports/semantic-reports.service';
// import { SemanticReportsService } from "../../semantic-reports/semantic-reports.service"

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit {

  @Output() onView = new EventEmitter();
  @Input() enablePreview:boolean;

  // public formula = {};
  public formula: any;

  public selectColumns: string;
  public semanticId: number;
  public userId: string;
  public selectedTables = [];
  public validSelectQuery: boolean = false;
  public isDqm:boolean = false;
  public isEditView:boolean = false;
  // public dqmCurrent: boolean;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private formulaService: FormulaService,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    private semanticReportsService:SemanticReportsService
    // private semanticReportsService: SemanticReportsService
  ) { }

  ngOnInit() {
    this.sharedDataService.validQueryFlagEmittor.subscribe(ele=>{
      this.validSelectQuery = ele;
    })

    this.activateRoute.params.subscribe(params =>{
      if(params.id){
        this.isEditView = true;
      }else{
        this.isEditView = false;
      }
    });

    this.sharedDataService.selectedTables.subscribe(tables => this.selectedTables = tables)

    // this.getUserDetails();

    this.sharedDataService.formula.subscribe(formula => {
      this.formula = formula;
      
      let columns = [];
      for (let key in this.formula['select']) {
        columns.push(...formula['select'][key]);
      }
      this.selectColumns = columns.join(', ');
    })

    this.sharedDataService.saveAsDetails.subscribe(data =>{ 
      this.isDqm = data.isDqm;
    });

    this.isDqm = this.semanticReportsService.isDqm;
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
    return this.semanticId;
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
      'sl_id': this.getUserDetails(),
      'report_name': data.name,
      "created_by": this.userId,
      'modified_by': this.userId,
      'description': data.desc? data.desc: undefined,
      'is_dqm': this.isDqm,
      'extract_flag': [1, 2],
      'user_id': [this.userId],
      'dl_list': ['dl_list_5'],
      'sl_tables_id': this.getTableIds(),
      // 'sheet_name': 'sheet01',
      'sheet_name': 'Sheet 1',
      'is_chart': true,
      'query_used': this.sharedDataService.generateFormula(this.formula),
      'color_hexcode': 'ffffff',
      'columns_used': this.getColumns(),
      'condition_flag': this.sharedDataService.isAppliedCondition(),
      'conditions_data': this.sharedDataService.getConditionData(),
      'calculate_column_flag': this.sharedDataService.isAppliedCaluclated(),
      'calculate_column_data': this.sharedDataService.getCalculateData(),
      'report_json': this.getAllData(),
      'is_new_report': this.isNewReport(),
      'report_list_id': this.getListId(),
      'request_id': this.getRequestId()
    }
    

    // this.dqmCurrent = this.semanticReportsService.g

    this.formulaService.generateReport(options).subscribe(
      res => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.sharedDataService.setRequestId(0);
        this.toastrService.success(res['message']);
        if(this.isDqm){
          this.router.navigate(['semantic/dqm'])  
        }
        else{
        this.router.navigate(['semantic/sem-reports/home']);
        }
      },
      err => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.toastrService.error(err['message']['error']);
      }
    )
  }

  // public getFormula() {
  //   let formula = document.getElementById('formula').innerText.replace(/[\r\n]+/g, ' ');
  //   return formula;
  // }


  private getAllData() {
    return {
      'selected_tables': this.selectedTables,
      'calculated_fields':  this.sharedDataService.getFormulaCalculatedData(),
      'aggregations': this.sharedDataService.getAggregationData(),
      'having': this.sharedDataService.getHavingData(),
      'orderBy': this.sharedDataService.getOrderbyData(),
      'condition': this.sharedDataService.getNewConditionData(),
      'formula_fields': this.formula,
      'request_id' : this.getRequestId()
    };
  }

  private getRequestId() {
    return this.isEditView ? this.sharedDataService.getEditRequestId() : this.sharedDataService.getRequestId();
  }
}