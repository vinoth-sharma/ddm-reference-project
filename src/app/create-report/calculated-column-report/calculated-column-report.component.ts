import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CalculatedColumnReportService } from './calculated-column-report.service';
import { SharedDataService } from '../shared-data.service';
import { sqlFunctions } from '../../../constants';

@Component({
  selector: 'app-calculated-column-report',
  templateUrl: './calculated-column-report.component.html',
  styleUrls: ['./calculated-column-report.component.css']
})
export class CalculatedColumnReportComponent implements OnInit {

  public columns: any = [];
  public selectedColumns: any = [];
  public selectedParamList: any = [];
  public selectedParam: string;
  public tableColList;
  public parameters: any = [];
  public formulaColumns: any = [];
  public columnNames:any = [];
  public selected: string;
  public category: string;
  public paramConditionList: any = [];
  public selectedConditionList: any = [];
  public selectedTables:any = [];
  public isDuplicate:any ;
  public mainSql:any;
  public formulas:any;
  public customInput:string = '';
  public formulaIndex:number = 0;
  public selectedCustomInput:any = [];
  public isReplace:boolean = false;
  public formulaColIndex:number = 0;
  public functionsList = sqlFunctions;
  public calFields = [];
  public cachedCalculatedFields = [];
  public isLoad: boolean = true;
  public selectedObj;
  public sql;
  
  constructor( private toasterService: ToastrService,
               private calculatedColumnReportService:CalculatedColumnReportService,
               private sharedDataService:SharedDataService ) { }

  ngOnInit() {
    this.reset();
    this.getParameters();
    this.showCalculatedFields();
  }

  public showCalculatedFields(){
    this.calculatedColumnReportService.getCalculatedFields().subscribe(res => {
      this.calFields = res['data']; 
      this.cachedCalculatedFields = this.calFields.slice();
      this.isLoad = false;
    })
  }

  public onSelectCal(calculatedVal) {
    this.selectedObj = this.calFields.find(x =>
      x.calculated_field_name.trim().toLowerCase() == calculatedVal.trim().toLowerCase()
    ).calculated_field_formula;
  }

  public filterList(searchText: string) {
    this.selectedObj = null;
    this.calFields = this.cachedCalculatedFields;
    if (searchText) {
      this.calFields = this.calFields.filter(calculated => {
        if (calculated['calculated_field_name']
          && (calculated['calculated_field_name'].toLowerCase().indexOf(searchText.toLowerCase())) > -1) {
          return calculated;
        }
      });
    }
  }

  public getParameters() {
    // let tableUsed = ['XYZ','MNO'];
    let tableUsed = this.getTables();
    let data = {
      table_used : tableUsed
    }
    this.calculatedColumnReportService.getParameterList(data).subscribe(
      res => {
        let params = [];
        this.paramConditionList = res['data'];
        this.paramConditionList.forEach(element => {
          params.push(element['parameter_name']);
        });
        this.parameters = params;
      },
      err => {
        this.paramConditionList = [];
      }
    )
  };

  public setCategory(category: string) {
    this.category = category;
  }

  public apply(){
    let mainFormula = [];
    let otherFormula = [];
    let colList = this.columnNames;
    this.formulas.forEach((element,key) => {
      mainFormula.push('('+ element.formulaColumns.join(' ').split(',').map(f => f.trim())[0]+') '+ colList[key]['col']);
      otherFormula.push( element.formulaColumns.join(' ').split(',').map(f => f.trim())[0]);
    });
    this.sql = mainFormula.join();
    this.mainSql = otherFormula;
  }

  public getOption(){
    console.log('this is calling');
    
  }

  public onSelect(selected: string,event) {
console.log($('#columns').find('option:selected').attr('id'));
    // console.log('onSele', selected, event)
    let opt = $('option[value="'+selected+'"]');
    console.log(opt.length ? opt.attr('id'):'NO OPtion');
    
    let id = opt.length ? opt.attr('id'):'1000';
    // let table = opt.attr('table');


// console.log(this.tableColList[id]);  
    // let inputSelected = document.getElementById('columnId').dataset.value;
    
    if (selected) {
      if(this.isColumn(selected)) {
        if (!this.selectedColumns.includes(this.tableColList[id].table + '.'+selected))
          this.selectedColumns.push(this.tableColList[id].table + '.'+ selected);
      } else if(this.isParam(selected)) {
        if (!this.selectedParamList.includes(selected)) {
          this.selectedParamList.push(selected);
          this.paramConditionList.forEach(element => {
          if(selected == element['parameter_name'])
            this.selectedConditionList.push(element['parameter_formula']);
          });
        }
      } else
        this.toasterService.error('Parameter/Column already selected');
    } else {
        this.toasterService.error('Please select a valid Parameter/Column');
    }
    
    this.selected = '';
    this.selectedParam = '';
  }

  public deleteSelected(index: number, isColumn?:boolean) {
    let selected;
    if(isColumn)
      selected = this.selectedColumns.splice(index, 1).shift()
    else {
      selected = this.selectedConditionList.splice(index, 1).shift();
      this.selectedParamList.splice(index, 1);
    }
    if (this.formulaColumns.includes(selected)) {
      this.deleteFormulaColumn();
    }
  }

  public deleteFormulaColumn() {
    this.formulaColumns = [];
  }

  public isColumn(item: string) {
    return this.columns.map(col => col.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  public isParam(item: string) {
    return this.parameters.map(param => param.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  public getColumns() {
    let columnData = [];

    this.selectedTables.forEach(element => {
      element['columns'].forEach(columns => {
        columnData.push(columns);
      });
    });
    
    return columnData;
  }


  public addToFormula(item: string) {
    let lastItem = this.formulaColumns[this.formulaColumns.length - 1]
    if(this.isParam(item)) {
      item = this.getCondition(item).parameter_formula;
    }
    if (item === lastItem) {
      this.toasterService.error('Please select a different column/function');
      return;
    }
    if(!this.isReplace)
      this.formulas[this.formulaIndex].formulaColumns.push(item);
    else
      this.formulas[this.formulaIndex].formulaColumns.splice(this.formulaColIndex, 0, item);
    this.isReplace = false;
    this.checkDuplicateFormula();
  }

  public checkDuplicateFormula(){
    this.apply();
    let currentFormula = this.mainSql[this.formulaIndex];
    let forml = this.mainSql.filter((element,key) => {
      if(this.formulaIndex != key)
        return element === currentFormula;
    });

    let form11 = this.calFields.filter((element,key) => {
      if(this.formulaIndex != key)
        return  currentFormula === element['calculated_field_formula'];;
    });


    if(forml.length > 0 || form11.length > 0){
      this.isDuplicate['column'] = true;
    }else{
      this.isDuplicate['column'] = false;
    }
    console.log(forml,'forml');
    
  }

  public getCondition(item:any) {      
    return this.paramConditionList.find(element => { 
      return element['parameter_name'] == item;
    });
  }

   /**
   * deleteCol
   */
  public deleteCol(index) {
    this.columnNames.splice(index,1);
  }

  /**
   * addColumn
   */
  public add(type) { 
    if(type == 'column')
      this.columnNames.push({'col':''});
    else if(type == 'formula'){
      this.formulaIndex = this.formulas.length;
      this.formulas.forEach(element => {
        element.disabled = false;
      });
      this.formulas.push({'formulaColumns': [],'disabled': true});
      this.isReplace= false;
    }
    else{
      this.selectedCustomInput.push(this.customInput);
      this.customInput = '';
    }
  }

   /**
   * deleteFormula
   */
  public deleteFormulaSec(i) {
    this.formulas.splice(i,1);
  }


   /**
   * deleteFormula
   */
  public deleteFormula(col,i,j) {
    this.formulaColIndex == this.formulas[i].formulaColumns.length 
    this.formulas[i].formulaColumns.splice(j,1);
    this.checkDuplicateFormula();
  }


  /**
   * deleteSelectedCustomInput
   */
  public deleteSelectedCustomInput(index) {
    this.selectedCustomInput.splice(index, 1)
  }

  public replaceFormula(data, i, j){
    this.formulaColIndex = j;
    this.isReplace = true;
    this.formulas[i].formulaColumns.splice(j,1);
    this.checkDuplicateFormula();
  }


  /**
   * editFormulaSec
   */
  public editFormulaSec(i) {
    this.isReplace= false;
    this.formulaIndex = i;
    this.formulas.forEach(element => {
      element.disabled = false;
    });
    this.formulas[i].disabled = true;
  }

  /**
   * getTables
   */
  public getTables() {
    let tables = [];

    this.selectedTables.forEach(element => {
      tables.push(element['table']['mapped_table_name']);
    });
    
    return tables;
  }

  public getBoth(){
    let obj = [];
    this.selectedTables.forEach(element => {
      console.log(element,'ele');
      
      element.columns.forEach(e => {
        console.log(e,'e');
        
        obj.push({'table':element['table']['mapped_table_name'] ,'column':e})
      });
      
    });
    return obj;
  }

  public getIndex(param){

  }

  public reset() {
    this.selectedTables = this.sharedDataService.getSelectedTables();
    this.columns = this.getColumns();
    this.tableColList = this.getBoth();
    this.selectedColumns = [];
    this.formulaColumns = [];
    this.columnNames = [];
    this.selected = '';
    this.category = 'mathematical';
    this.formulas = [{
      'formulaColumns': [],
      'disabled': true
    }];
    this.isDuplicate = {
      'column' : false,
      'formula' : false
    }
    this.customInput= '';
    this.formulaColIndex = 0;
    this.selectedCustomInput = [];
  }

  public checkDuplicate(type, value,index, event){
    if(type == 'column'){
     
     let DupCols = this.columnNames.filter((element,key) => {
                      if(key !=  index) 
                        return value === element['col'];
                    });
                    let dupColsOne =this.calFields.filter(ele => {
                      return value === ele['calculated_field_name'];
                    })

      if(DupCols.length > 0 || dupColsOne.length > 0){
        this.isDuplicate['column'] = true;
      }else{
        this.isDuplicate['column'] = false;
      }
    
    }
  }
}
