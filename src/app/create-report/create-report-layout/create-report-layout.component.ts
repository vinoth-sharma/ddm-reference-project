import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

import { SharedDataService } from "../shared-data.service";
import { Router, ActivatedRoute } from '@angular/router';
import Utils from '../../../utils';
import { QueryBuilderService } from '../../query-builder/query-builder.service';
import { CreateReportLayoutService } from './create-report-layout.service'
import { SemanticReportsService } from '../../semantic-reports/semantic-reports.service';

@Component({
  selector: 'app-create-report-layout',
  templateUrl: './create-report-layout.component.html',
  styleUrls: ['./create-report-layout.component.css']
})

export class CreateReportLayoutComponent implements OnInit {

  // show: boolean;
  enableButtons: boolean = false;
  public semanticId;
  public columnsKeys:any = [];
  public tableData:any = [];
  dataSource;
  displayedColumn= [];
  public errorMessage:string = "";
  public isPreview:boolean = false;
  isCallable:boolean = false;
  public formulaObj = {};
  public requestDetails:any;
  isDqm = false;
  isExistingReport:boolean = false;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private queryBuilderService:QueryBuilderService,
    private activatedRoute: ActivatedRoute,
    private createReportLayoutService: CreateReportLayoutService,
    private semanticReportsService:SemanticReportsService) {
  }

  ngOnInit() {

    this.isDqm = this.semanticReportsService.isDqm
    //this is for edit report

    this.activatedRoute.queryParams.subscribe(params =>{

  
      if(params.report && params.sheet){

        Utils.showSpinner();
        this.createReportLayoutService.getAllForEdit(params).subscribe(data => {
          
          //  Calculated column data
          this.sharedDataService.setFormulaCalculatedData(data['data']['sheet_json']['calculated_fields']);
          this.sharedDataService.setCalculatedData(data['data']['calculated_column_data']);

          //Add aggregations
          this.sharedDataService.setAggregationData(data['data']['sheet_json']['aggregations']['data'],data['data']['sheet_json']['aggregations']['aggregation']);

          //Order by
          this.sharedDataService.setOrderbyData(data['data']['sheet_json']['orderBy']);

          //having
          this.sharedDataService.setHavingData(data['data']['sheet_json']['having']);

          //Condition
          this.sharedDataService.setNewConditionData(data['data']['sheet_json']['condition']['data'],data['data']['sheet_json']['condition']['name']);
          this.sharedDataService.setConditionData(data['data']['condition_data']);

          this.sharedDataService.setExistingCondition(data['data']['condition_data']);

          
          //select tables
          this.sharedDataService.setSelectedTables(data['data']['sheet_json']['selected_tables']);
          
          // query update
          for(let key in data['data']['sheet_json']['formula_fields']){
            if(key === 'select'){
              for(let innerKey in data['data']['sheet_json']['formula_fields'][key]){
                this.sharedDataService.setFormula([key, innerKey],data['data']['sheet_json']['formula_fields'][key][innerKey]);
              }
            }
            this.sharedDataService.setFormula([key],data['data']['sheet_json']['formula_fields'][key]);
          }
          this.sharedDataService.setEditRequestId(data['data']['sheet_json']['request_id']);
          this.enablePreview(true);
          this.sharedDataService.setNextClicked(true);
          this.sharedDataService.setExistingColumns(data['data']['calculated_column_data'])

          this.sharedDataService.setSaveAsDetails({'name':data['data']['report_name'],'desc':data['data']['description'],'isDqm':data['data']['is_dqm']});
          //Add condition
          Utils.hideSpinner();
        })

       
      }
      else if(params.report){
        // console.log(params.report);
        this.isDqm = true;
        this.isExistingReport = true;
        this.sharedDataService.setReportConditionFlag(true);
      }
      // else {

        this.sharedDataService.setSelectedTables([]);
        this.sharedDataService.resetFormula();
        this.sharedDataService.setExistingColumns([]);
    
        //afetr
        this.sharedDataService.setFormulaCalculatedData([]);
        this.sharedDataService.setAggregationData([],'');
        this.sharedDataService.setOrderbyData([]);
        this.sharedDataService.setNewConditionData({},'');
        this.sharedDataService.setExistingCondition({});
        // this.sharedDataService.setSelectedTables([]);
        // this.sharedDataService.setSaveAsDetails({});
        this.sharedDataService.formula.subscribe(formula => {
        this.formulaObj = formula;
        })
      // }


    })

    // TODO: jquery 
    if (!$("#sidebar").hasClass("active")) {
      $("#sidebar").toggleClass("active"); 
    }

    // this.sharedDataService.setSelectedTables([]);
    // this.sharedDataService.resetFormula();
    // this.sharedDataService.setExistingColumns([]);

    // //afetr
    // this.sharedDataService.setFormulaCalculatedData([]);
    // this.sharedDataService.setAggregationData([],'');
    // this.sharedDataService.setOrderbyData([]);
    // this.sharedDataService.setNewConditionData({},'');
    // this.sharedDataService.setExistingCondition({});
    // // this.sharedDataService.setSelectedTables([]);
    // // this.sharedDataService.setSaveAsDetails({});
    // this.sharedDataService.formula.subscribe(formula => {
    // this.formulaObj = formula;
    // })

  }


  private getEditData(data:any) {
    this.sharedDataService.setFormulaCalculatedData(data['calculated_fields']);
          this.sharedDataService.setCalculatedData(data['calculated_column_data']);

          //Add aggregations
          this.sharedDataService.setAggregationData(data['aggregations']['data'],data['aggregations']['aggregation']);

          //Order by
          this.sharedDataService.setOrderbyData(data['orderBy']);

          //having
          this.sharedDataService.setHavingData(data['having']);

          //Condition
          this.sharedDataService.setNewConditionData(data['condition']['data'],data['condition']['name']);
          this.sharedDataService.setConditionData(data['condition_data']);

          this.sharedDataService.setExistingCondition(data['condition_data']);

          
          
          
          // query update
          for(let key in data['formula_fields']){
            if(key === 'select'){
              for(let innerKey in data['formula_fields'][key]){
                this.sharedDataService.setFormula([key, innerKey],data['formula_fields'][key][innerKey]);
              }
            }
            this.sharedDataService.setFormula([key],data['formula_fields'][key]);
          }
          this.sharedDataService.setEditRequestId(data['request_id']);
          this.enablePreview(true);
          this.sharedDataService.setNextClicked(true);
          this.sharedDataService.setExistingColumns(data['calculated_column_data'])

          //select tables
          this.sharedDataService.setSelectedTables(data['selected_tables']);
          Utils.hideSpinner();
          // this.sharedDataService.setSaveAsDetails({'name':data,'desc':data['data']['description'],'isDqm':data['is_dqm']});
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
    let query = 'SELECT * FROM ('+this.sharedDataService.generateFormula(this.formulaObj)+ ') WHERE ROWNUM <= 10'    
    // let query = this.sharedDataService.generateFormula(this.formulaObj,10);
    
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

  // public getFormula(){
  //   let formula = document.getElementById('formula').innerText.replace(/[\r\n]+/g, ' ')
  //   return formula;
  // }

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
    this.errorMessage = '';
  }

  enablePreview(event){
    this.enableButtons = event;
  }

  getRequestDetails(){
    let id;
    this.activatedRoute.queryParams.subscribe(params =>{
      if(params.report){
        id = this.sharedDataService.getEditRequestId();
      }else{
        id = this.sharedDataService.getRequestId();
      }
    });
    
    this.createReportLayoutService.getRequestDetails(id).subscribe( res =>{
      this.requestDetails = res;
    },error =>{
      this.requestDetails = [];
    });
  }

  resetQuery(){
    this.sharedDataService.resetQuery();
  }
}