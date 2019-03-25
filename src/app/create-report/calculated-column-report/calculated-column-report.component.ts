import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CalculatedColumnReportService } from './calculated-column-report.service';
import { SharedDataService } from '../shared-data.service';
import { sqlFunctions } from 'src/constants';
import Utils from "../../../utils";

@Component({
  selector: 'app-calculated-column-report',
  templateUrl: './calculated-column-report.component.html',
  styleUrls: ['./calculated-column-report.component.css']
})
export class CalculatedColumnReportComponent implements OnInit {

  public calFields = [];
  public cachedCalculatedFields = [];
  public isLoading: boolean = true;
  public selectedObj;
  public selectedId: any;
  public searchValue: string;
  public selectedName;
  public addedCalculation = [];
  public sendFormula = [];
  public close: boolean = false;
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private toasterService: ToastrService,
    private calculatedColumnReportService: CalculatedColumnReportService,
    private sharedDataService: SharedDataService) { }


  // updated variables here
  private formulaIndex: number;   //to store formula tab index
  public selectedInput: string;   // to get applied user input
  public customInput: any;
  public createCalculatedQuery: string;
  public formulaList: any;
  public columns: any;
  public selectedColumns: any;
  public selectedParamList: any;
  public formulas: any;
  public isDuplicate: any;
  public selectedTables: any;
  public selectedConditionList: any;
  public selected: string;
  public category: string;
  public selectedParam: string;
  public isReplace: boolean;
  public columnNames: any;
  public parameters: any;
  public tableColList: any;
  public paramConditionList: any;
  public formulaColIndex: number;
  public selectedCustomInput: any;
  public columnList: any;

  public functionsList = sqlFunctions;


  ngOnInit() {
    this.reset();
    this.getParameters();
    this.showCalculatedFields();
  }

  public showCalculatedFields(callback = null) {
    this.calculatedColumnReportService.getCalculatedFields().subscribe(res => {
      this.calFields = res['data'];
      this.cachedCalculatedFields = this.calFields.slice();
      this.isLoading = false;
      if (callback) {
        callback();
      }
    })
  }

  public onSelectCal(calculatedVal, calculatedId) {
    this.selectedId = calculatedId;
    this.selectedName = calculatedVal;
    this.selectedObj = this.calFields.find(x =>
      x.calculated_field_name.trim().toLowerCase() == calculatedVal.trim().toLowerCase()
    ).calculated_field_formula;
  }
  public calculationAdded() {
    this.close = true;
    this.sendFormula = [];
    if (!this.addedCalculation.includes(this.selectedName)) {
      this.addedCalculation.push(this.selectedName);
      this.sendFormula.push(this.selectedObj);
    }
    console.log(this.sendFormula, "sendFormula")
    let lastestQuery = this.sharedDataService.getFormula();
    let fromPos = lastestQuery.search('FROM');
    let sendFormula = ',' + this.sendFormula
    var output = [lastestQuery.slice(0, fromPos), sendFormula, lastestQuery.slice(fromPos)].join('');
    console.log(output, 'output in apply');
    this.sharedDataService.setFormula('existing-calculated', output);
  }


  public discardCalculation(i) {
    let index = this.addedCalculation.indexOf(i);
    this.addedCalculation.splice(index, 1);
    // this.sendFormula.splice(index, 1);
    //   this.sharedDataService.setFormula('conditions',this.sendFormula)
  }

  public filterList(searchText: string) {
    this.selectedObj = '';
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

  public deleteCalculation() {
    this.searchValue = '';
    Utils.showSpinner();
    this.calculatedColumnReportService.delCalculation(this.selectedId).subscribe(response => {
      this.showCalculatedFields(() => {
        Utils.hideSpinner();
        this.toasterService.success("Calculated Field deleted Successfully");
      });
      this.selectedObj = '';
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    });
  }

  /**
  * deleteFormula
  */
  public deleteFormula(col, i, j) {
    this.formulaColIndex == this.formulas[i].formulaColumns.length;
    this.formulas[i].formulaColumns.splice(j, 1);
    this.checkDuplicateFormula();
  }


  public replaceFormula(data, i, j) {
    this.formulaColIndex = j;
    this.isReplace = true;
    this.formulas[i].formulaColumns.splice(j, 1);
    this.checkDuplicateFormula();
  }


  /**
   * editFormulaSec
   */
  public editFormulaSec(i) {
    this.isReplace = false;
    this.formulaIndex = i;
    this.formulas.forEach(element => {
      element.disabled = false;
    });
    this.formulas[i].disabled = true;
  }

  // updated one start from here


  // To add new column/formula
  public addNew(type) {
    if (type == 'column')
      this.columnNames.push({ 'col': '' });
    else {
      this.makeFormulaDisable();
      this.formulaIndex = this.formulas.length;
      this.formulas.push({ 'formulaColumns': [], 'disabled': true });
      this.isReplace = false;
    }
  }

  // Disable all formula to make enable selected one
  private makeFormulaDisable() {
    this.formulas.forEach(element => {
      element.disabled = false;
    });
  }


  public onSelect(selected: string, event) {

    let option = $('option[value="' + selected + '"]');
    let optionId = option.length ? option.attr('id') : '1000';

    if (selected) {
      if (this.isColumn(selected)) {
        if (!this.selectedColumns.includes(this.tableColList[optionId].table + '.' + selected))
          this.selectedColumns.push(this.tableColList[optionId].table + '.' + selected);
      } else if (this.isParam(selected)) {
        if (!this.selectedParamList.includes(selected)) {
          this.selectedParamList.push(selected);
          this.paramConditionList.forEach(element => {
            if (selected == element['parameter_name'])
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

  // To create new User input tags
  public onApply(item) {
    if (!this.isCustomInput(item)) {
      this.customInput.push(item);
      this.selectedInput = '';
    } else {
      this.toasterService.error('This input already selected');
    }
  }

  // check for columns
  private isColumn(item: string) {
    return this.columns.map(col => col.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  // Check for parameters
  private isParam(item: string) {
    return this.parameters.map(param => param.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  //check for custom inputs
  private isCustomInput(item: string) {
    return this.customInput.map(param => param.trim())
      .includes(item.trim());
  }


  // to delete column/formula
  public deleteOld(type, index) {
    if (type == 'column')
      this.columnNames.splice(index, 1);
    else {
      this.formulas.splice(index, 1);
    }
  }

  // get list of parameters based on selected tables
  public getParameters() {
    // let tableUsed = ['XYZ','MNO'];
    let tableUsed = this.getTables();
    let data = {
      table_used: tableUsed
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
  }

  // to select category from more functions
  public setCategory(category: string) {
    this.category = category;
  }


  // to delete selected tags
  public deleteSelected(type: string, index: number) {
    let selected;
    if (type == 'column')
      selected = this.selectedColumns.splice(index, 1).shift();
    else if (type == 'param') {
      selected = this.selectedConditionList.splice(index, 1).shift();
      this.selectedParamList.splice(index, 1);
    } else {
      this.customInput.splice(index, 1)
    }
  }

  // to add clicked tags to the selected formula bar
  public addToFormula(item: string) {

    // let lastItem = this.formulaColumns[this.formulaColumns.length - 1];
    let lastItem = this.formulas[this.formulaIndex].formulaColumns[this.formulaColIndex];

    if (this.isParam(item)) {
      item = this.getCondition(item).parameter_formula;
    }

    if (item === lastItem) {
      this.toasterService.error('Please select a different column/function');
      return;
    }

    if (!this.isReplace)
      this.formulas[this.formulaIndex].formulaColumns.push(item);
    else
      this.formulas[this.formulaIndex].formulaColumns.splice(this.formulaColIndex, 0, item);

    this.isReplace = false;
    this.checkDuplicateFormula();
  }


  // To check duplicate formula
  public checkDuplicateFormula() {

    this.getCreateCalculatedQuery();
    let currentFormula = this.formulaList[this.formulaIndex];

    let currentList = this.formulaList.filter((element, key) => {
      if (this.formulaIndex != key)
        return element === currentFormula;
    });

    let existingList = this.calFields.filter((element, key) => {
      if (this.formulaIndex != key)
        return currentFormula === element['calculated_field_formula'];;
    });


    if (currentList.length > 0 || existingList.length > 0) {
      this.isDuplicate['formula'] = true;
    } else {
      this.isDuplicate['formula'] = false;
    }

  }

  public getCreateCalculatedQuery() {
    let subQuery = [];
    let list = [];
    let colList = this.columnNames;
    this.columnList = [];

    this.formulas.forEach((element, key) => {
      subQuery.push('(' + element.formulaColumns.join(' ').split(',').map(f => f.trim())[0] + ') ' + colList[key]['col'] + ' ');
      list.push(element.formulaColumns.join(' ').split(',').map(f => f.trim())[0]);

    });

    this.columnNames.forEach(element => {
      this.columnList.push(element['col']);
    });

    this.createCalculatedQuery = subQuery.join().toUpperCase();
    this.formulaList = list;
  }

  public getColumns() {
    let columnData = [];

    this.selectedTables.forEach(element => {
      columnData.push(...element['columns']);
    });

    return columnData;
  }


  public getCondition(item: any) {
    return this.paramConditionList.find(element => {
      return element['parameter_name'] == item;
    });
  }

  public getTables() {
    let tables = [];

    this.selectedTables.forEach(element => {
      tables.push(element['table']['mapped_table_name']);
    });

    return tables;
  }

  public getBoth() {
    let obj = [];
    this.selectedTables.forEach(element => {
      element.columns.forEach(e => {
        obj.push({ 'table': element['table']['mapped_table_name'], 'column': e })
      });

    });
    return obj;
  }

  public reset() {
    this.columnList = [];
    this.selectedTables = this.sharedDataService.getSelectedTables();
    this.columns = this.getColumns();
    this.tableColList = this.getBoth();
    this.selectedColumns = [];
    // this.formulaColumns = [];
    this.columnNames = [{ 'col': '' }];
    this.selected = '';
    this.category = 'mathematical';
    this.formulas = [{
      'formulaColumns': [],
      'disabled': true
    }];
    this.isDuplicate = {
      'column': false,
      'formula': false
    }
    this.selectedInput = '';
    this.formulaColIndex = 0;
    this.customInput = [];
    this.formulaIndex = 0;
    this.createCalculatedQuery = '';
    this.isReplace = false;
    this.formulaList = [];
    this.selectedParamList = [],
      this.selectedConditionList = [];
    this.selectedParam = '';
    this.parameters = [];
    this.paramConditionList = [];
    this.selectedCustomInput = [];

  }

  public checkDuplicateColumn(value, index, event) {

    let currentList = this.columnNames.filter((element, key) => {
      if (key != index)
        return value === element['col'];
    });
    let existingList = this.calFields.filter(ele => {
      return value === ele['calculated_field_name'];
    });

    if (currentList.length > 0 || existingList.length > 0) {
      this.isDuplicate['column'] = true;
    } else {
      this.isDuplicate['column'] = false;
      this.getCreateCalculatedQuery();
    }

  }

  public getTableIds() {
    let tableIds = [];
    // let selectedTables = this.sharedDataService.getSelectedTables();

    this.selectedTables.forEach(element => {
      tableIds.push(element['table']['sl_tables_id']);
    });

    return tableIds;
  }

  private getFormatData() {
    let obj = {
      'calculated_field_name': this.columnList,
      'sl_table_id': this.getTableIds(),
      'columns_used_calculate_column': this.columns,
      'calculated_field_formula': this.formulaList,
      'applied_flag_calculate_column': true
    }
    return obj;
  }

  public apply() {
    let lastestQuery = this.sharedDataService.getFormula();
    let fromPos = lastestQuery.search('FROM');
    let createCalculatedQuery = ',' + this.createCalculatedQuery
    var output = [lastestQuery.slice(0, fromPos), createCalculatedQuery, lastestQuery.slice(fromPos)].join('');
    console.log(output, 'output in apply');

    this.sharedDataService.setFormula('calculated-fields', output);
    // let data = this.getFormatData();
    this.sharedDataService.setCalculatedData(this.getFormatData());
  }
}
