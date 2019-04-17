import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

import { SharedDataService } from "../shared-data.service";
import { Router, ActivatedRoute } from '@angular/router';
import Utils from '../../../utils';
import { QueryBuilderService } from '../../query-builder/query-builder.service';
import { CreateReportLayoutService } from './create-report-layout.service'

@Component({
  selector: 'app-create-report-layout',
  templateUrl: './create-report-layout.component.html',
  styleUrls: ['./create-report-layout.component.css']
})

export class CreateReportLayoutComponent implements OnInit {

  show: boolean;
  enableButtons: boolean;
  public semanticId;
  public columnsKeys:any = [];
  public tableData:any = [];
  dataSource;
  displayedColumn= [];
  public errorMessage:string = "";
  public isPreview:boolean = false;
  isCallable:boolean = false;
  public formulaObj = {};

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private queryBuilderService:QueryBuilderService,
    private activatedRoute: ActivatedRoute,
    private createReportLayoutService: CreateReportLayoutService) {
  }

  ngOnInit() {

    //this is for edit report

    this.activatedRoute.params.subscribe(params =>{

      if(params.id){

        Utils.showSpinner();
        this.createReportLayoutService.getAllForEdit(params.id).subscribe(data => {
          
          //  Calculated column data
          this.sharedDataService.setFormulaCalculatedData(data['data']['report_json']['calculated_fields']);

          //Add aggregations
          this.sharedDataService.setAggregationData(data['data']['report_json']['aggregations']);

          //Order by
          this.sharedDataService.setOrderbyData(data['data']['report_json']['orderBy']);

          this.sharedDataService.setNewConditionData(data['data']['report_json']['condition']['data'],data['data']['report_json']['condition']['name']);

          this.sharedDataService.setExistingCondition(data['data']['condition_data']);

          
          //select tables
          this.sharedDataService.setSelectedTables(data['data']['report_json']['selected_tables']);
          
          // query update
          for(let key in data['data']['report_json']['formula_fields']){
            if(key === 'select'){
              for(let innerKey in data['data']['report_json']['formula_fields'][key]){
                this.sharedDataService.setFormula([key, innerKey],data['data']['report_json']['formula_fields'][key][innerKey]);
              }
            }
            this.sharedDataService.setFormula([key],data['data']['report_json']['formula_fields'][key]);
          }

          this.enablePreview(true);
          this.sharedDataService.setNextClicked(true);
          this.sharedDataService.setExistingColumns(data['data']['calculated_column_data'])

          this.sharedDataService.setSaveAsDetails({'name':data['data']['report_name'],'desc':data['data']['description'],'isDqm':data['data']['is_dqm']});
          //Add condition
          Utils.hideSpinner();
        })
      }
    })

    // TODO: jquery 
    if (!$("#sidebar").hasClass("active")) {
      $("#sidebar").toggleClass("active"); 
    }

    this.sharedDataService.setSelectedTables([]);
    this.sharedDataService.resetFormula();
    this.sharedDataService.setExistingColumns([]);

    //afetr
    this.sharedDataService.setFormulaCalculatedData([]);
    this.sharedDataService.setAggregationData([]);
    this.sharedDataService.setOrderbyData([]);
    this.sharedDataService.setNewConditionData({},'');
    this.sharedDataService.setExistingCondition({});
    this.sharedDataService.setSelectedTables([]);
    this.sharedDataService.setSaveAsDetails({});
    this.sharedDataService.formula.subscribe(formula => {
      this.formulaObj = formula;
    })

  }

  public reset(){
    this.semanticId;
    this.columnsKeys = [];
    this.tableData = [];
  }

    /**
   * get semantic id from router
   */
  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
  } 

  public executeSql() {
    // let query = 'SELECT * FROM ('+this.getFormula()+ ') WHERE ROWNUM <= 10'    
    let query = this.sharedDataService.generateFormula(this.formulaObj);
    
    // let query = 'select ANHR_PROD_IND from vsmddm.CDC_VEH_EDD_EXTRACTS WHERE ROWNUM <= 10'
    let data = { sl_id: this.semanticId, custom_table_query: query,page_no: 1 , per_page:10};

    Utils.showSpinner();
    this.columnsKeys = [];
    this.tableData = [];
    this.queryBuilderService.executeSqlStatement(data).subscribe(
      res => {
        this.errorMessage = "";
        Utils.hideSpinner();

        if (res['data']["list"].length) {
          this.columnsKeys = this.getColumnsKeys(res['data']["list"][0]);
          this.tableData = res['data']["list"];
          this.dataSource = this.tableData;
          this.displayedColumn = this.columnsKeys;
        }
      },
      err => {
        Utils.hideSpinner();
        this.tableData = [];
        this.errorMessage = err['message']['error'];
      }
    );
  }

  public getFormula(){
    let formula = document.getElementById('formula').innerText.replace(/[\r\n]+/g, ' ')
    return formula;
  }

    /**
   * getColumnsKeys
   */
  public getColumnsKeys(column) {
    return Object.keys(column);
  }

  public goBack(){
    this.isPreview = false;
  }

  public goToView(){
    this.getSemanticId();
    this.executeSql();
    this.isPreview = true;
  }

  enablePreview(event){
    this.enableButtons = event;
  }

}