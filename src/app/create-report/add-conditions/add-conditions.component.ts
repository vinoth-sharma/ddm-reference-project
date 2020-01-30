import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate.min.js';
import { SharedDataService } from "../shared-data.service";
import { AddConditionsService } from "./add-conditions.service";
import Utils from "../../../utils";
import { ToastrService } from "ngx-toastr";
import { ConstantService } from '../../constant.service';
import { ListOfValuesService } from '../../modallist/list-of-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectExplorerSidebarService } from 'src/app/shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { constants_value } from '../../constants';

@Component({
  selector: 'app-add-conditions',
  templateUrl: './add-conditions.component.html',
  styleUrls: ['./add-conditions.component.css']
})
export class AddConditionsComponent implements OnInit {

  rowUsedTable;
  calcNames: any[] = [];
  results: any[] = [];
  oldValue: any;
  distinctValues: any;
  current;
  tableId;
  isFormulaInvalid: boolean;
  valueList = [];
  selectedTables = [];
  existingList: any[] = [];
  originalExisting: any[] = [];
  queryField: FormControl = new FormControl();
  private functions;
  public columns = [];
  public formula: string = '';
  conditionTables = [];
  selectedColumns = [];
  columnName: string = '';
  lov = [];
  semanticId;
  tables = [];
  public condition = [];
  public selected;
  public values = [];
  public selectedObj;
  public cachedConditions = [];
  public headers = ["Item", "Condition", "Value(s)", "Operator"];
  public operator = ["AND", "OR"];
  public conditionList = ["=", "!=", "<", ">", "<=", ">=", "<>", "BETWEEN", "LIKE", "NOT LIKE", "IN", "NOT BETWEEN", "NOT IN", "IS NULL", "IS NOT NULL"];
  public createFormula = [];
  lovValueList = [];
  public tableIds = [];
  whereConditionPrefix = '';
  areConditionsEmpty = true;
  defaultError = "There seems to be an error. Please try again later.";
  lastWord: string = '';
  isEdit: boolean = false;
  //variables for parameters data
  existingParamForTableColumn = [];
  paramsList = [];
  isEditView: boolean = false;
  constructor(private sharedDataService: SharedDataService,
    private activateRoute: ActivatedRoute,
    private route: Router,
    private addConditions: AddConditionsService,
    private toasterService: ToastrService,
    private constantService: ConstantService,
    private activatedRoute: ActivatedRoute,
    private listOfValuesService: ListOfValuesService,
    private objectExplorerSidebarService: ObjectExplorerSidebarService
  ) {
    this.functions = this.constantService.getSqlFunctions('aggregations');
  }

  ngOnInit() {
    this.route.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
    this.activateRoute.queryParams.subscribe(params => {
      if (params.report && params.sheet) {
        this.isEditView = true;
      } else {
        this.isEditView = false;
      }
    });

    this.sharedDataService.getNextClicked().subscribe(isClicked => {
      // this.calcNames = this.sharedDataService.getCalcData().data;
      this.tableIds = this.tables.map(table => {
        return table.id;
      });
      // this.activatedRoute.queryParams.subscribe(params =>{

      //   if(params.report && params.sheet){
      //     this.isEdit = true;
      //   }
      // });
      this.getConditions();
      // this.addColumnBegin();                             //To be fixed
    });
    this.sharedDataService.selectedTables.subscribe(tableList => {
      this.selectedTables = tableList;
      this.tables = this.getTables();
      // console.log(this.tables, "for LOV");

      this.columns = this.getColumns();
      let keyValues = this.sharedDataService.getNewConditionData().data;
      this.removeDeletedTableData(keyValues);
    });

    this.sharedDataService.resetQuerySeleted.subscribe(ele => {
      this.createFormula = [{ attribute: '', values: '', condition: '', operator: '', tableId: '', conditionId: '', mandatory_flag: false }];
      this.columnName = '';
      this.condition = [];
      this.reset();
    });
    this.sharedDataService.calDataForCondition.subscribe((calc: any[]) => {
      this.calcNames = calc;
      // console.log(this.calcNames);
    })
  }

  public fetchLov(id, column) {
    let options = {
      tableId: null,
      columnName: ''
    };
    options.tableId = id;
    options.columnName = column;
    if (options.tableId && options.columnName) {
      this.listOfValuesService.getLov(options).subscribe(res => {
        this.lovValueList = res['data'];
        // this.lovValueList.forEach(obj => this.valueList.push( {name : obj['lov_name']}))
        // this.lovValueList.forEach(obj => {
        //   // if (!this.valueList.includes({ name: obj['lov_name'] })) {
        //   //   this.valueList.push({ name: obj['lov_name'] })
        //   // }
        //   if(!this.valueList.some(ele=>ele===obj['lov_name'])){
        //     this.valueList.push(obj['lov_name'])
        //   }
        // })
        this.valueList = this.lovValueList.map(ele=>ele.lov_name)
        // console.log(this.valueList, "show values");
      })
    }
  }

  onSelectLov(eve,type,con) {
    if (type === 'value' && (eve.option.group.label === "Values")) {
    this.lov = this.lovValueList.find(x =>
      x.lov_name.trim().toLowerCase() == con.values.trim().toLowerCase()
    ).value_list;
    if (typeof this.lov[0] === "number") {
      con.values = `( ${this.lov} )`;
    } else if (typeof (this.lov[0]) === "string") {
      let uploadData = this.lov.map(t => `'${t}'`);
      con.values = `( ${uploadData} )`;
    }
  }
  }


  // public searchedExistingList(value: string) {
  //   return this.originalExisting.filter(option =>
  //     option['calculated_field_name'].toLowerCase().includes(value.toLowerCase())
  //   )
  // }

  public getTables() {  //fetch selected tables
    return this.selectedTables.map(element => {
      return {
        'name': element['table']['select_table_name'],
        'id': element['table']['select_table_id'],
        'alias': element['select_table_alias']
      };
    });
  }

  public getColumns() {   //fetch columns for selected tables
    let columnData = [];
    let columnWithTable = this.selectedTables.map(element => {
      return element['table']['column_properties'].map(col => {
        return `${element['select_table_alias']}.${col.column}`
      });
    });
    columnWithTable.forEach(data => {
      columnData.push(...data);
    });
    return columnData;
  }

  public addColumn(con) { // called on add button next to every row
    // console.log(con);
    this.createFormula.splice(this.createFormula.indexOf(con) + 1, 0, {
      values: "", condition: "", attribute: "", operator: "AND", tableId: '', conditionId: '', mandatory_flag: false
    });
  };

  addColumnBegin() {    // called on ngOninit for default row.
    return [{ attribute: "", values: "", condition: "", operator: "AND", tableId: '', conditionId: '', isMandatory: false }];
  }

  resetRow(con) {
    this.clearCondition();
    let id = con.conditionId;
    this.condition.forEach(data => {
      if (id === data.condition_id) {
        data.checked = false;
      }
    })
    this.createFormula.splice(this.createFormula.indexOf(con), 1);
    this.createFormula = this.addColumnBegin();
    this.columnName = '';
    this.reset();
  }

  public removeColumn(con) {  // remove row on remove button 
    let id = con.conditionId;
    this.condition.forEach(data => {
      if (id === data.condition_id) {
        data.checked = false;
      }
    })
    this.createFormula.splice(this.createFormula.indexOf(con), 1);
  }

  // public validateFormula() {
  //   let isFormulaInvalid = true;
  //   const isValid = this.createFormula.reduce((res, item, index) => res && this.isRowValid(item, index), true);
  //   if (this.areConditionsEmpty && isValid) {
  //     this.whereConditionPrefix = '';
  //     isFormulaInvalid = !isValid;
  //     this.whereConditionPrefix = 'WHERE';
  //   }
  //   return isFormulaInvalid;
  // }
  validateGivenCondition() {
    let valid = true;
    if (this.createFormula.length == 1) {
      if (this.isNullOrEmpty(this.createFormula[0].attribute) || this.isNullOrEmpty(this.createFormula[0].condition))
        valid = false

    }
    return valid
    // this.createFormula[0].attribute 
    // return this.createFormula.every(row=>{
    //   if(this.isNullOrEmpty(row.attribute) || this.isNullOrEmpty(row.condition))
    //     false
    //   else
    //     true
    // })
  }

  public validateFormula() {
    let isFormulaInvalid = true;
    const isValid = this.createFormula.reduce((res, item, index) => res && this.isRowValid(item, index), true);
    if (this.areConditionsEmpty && isValid) {
      if (this.isNullOrEmpty(this.columnName)) {
        this.isFormulaInvalid = false;
      } else {
        this.isFormulaInvalid = true;
      }
      this.whereConditionPrefix = '';
    } else {
      this.isFormulaInvalid = !(isValid && !this.isNullOrEmpty(this.columnName));
      this.isFormulaInvalid = !(isValid);
      this.whereConditionPrefix = 'WHERE';
    }
    return this.isFormulaInvalid;
  }


  isRowValid(formulaRow: { attribute: string, condition: string, values: string, operator: string }, index: number) {
    if (index === 0 && this.isNullOrEmpty(formulaRow.attribute) && this.isNullOrEmpty(formulaRow.condition) && this.isNullOrEmpty(formulaRow.values)) {
      this.areConditionsEmpty = true;
      return true;
    } else {
      this.areConditionsEmpty = false;
      if (['IS NULL', 'IS NOT NULL'].includes(formulaRow.condition)) {
        if (!this.isNullOrEmpty(formulaRow.values)) {
          return false;
        }
      } else {
        if (this.isNullOrEmpty(formulaRow.values)) {
          return false;
        }
      }
      if (index === this.createFormula.length - 1) {
        if (!this.isNullOrEmpty(formulaRow.operator)) {
          return false;
        }
      } else {
        if (this.isNullOrEmpty(formulaRow.operator)) {
          return false;
        }
      }
      if (this.isNullOrEmpty(formulaRow.attribute) || this.isNullOrEmpty(formulaRow.condition)) {
        return false;
      }
    }
    return true;
  }

  isNullOrEmpty(value) {
    if (!value || value === '') {
      return true;
    }
    return false;
  }

  public resetToSave() {
    this.clearCondition();
    this.createFormula = this.addColumnBegin();
    this.columnName = '';
    this.conditionTables = [];
    this.selectedColumns = [];
    this.getConditions();
  }


  public reset() {
    this.columnName = '';
    this.sharedDataService.setFormula(['where'], '');
    let conditionObj = [];
    this.sharedDataService.setConditionData(conditionObj);
    this.sharedDataService.setNewConditionData(conditionObj);
    // this.sharedDataService.setNewConditionData().name;
  }

  clearCondition() {
    if (this.createFormula.length == 1) {
      let obj = this.createFormula[0];
      if (obj.attribute == '' && obj.values == '' && obj.condition == '' && obj.operator == '') {
        this.sharedDataService.setFormula(['where'], '');
        let conditionObj = [];
        this.sharedDataService.setConditionData(conditionObj);
        this.sharedDataService.setNewConditionData(conditionObj);
      }
    }
  }

  public defineFormula() {  // called on clicking finish 

    //column/table name with space handler
    this.createFormula.forEach(row=>{
      row.attribute = this.columnNameWithSpaceHandler(row.attribute)
      row.values = this.columnNameWithSpaceHandler(row.values)
    })
    this.selectedColumns = this.selectedColumns.map(col=>this.columnNameWithSpaceHandler(col))

    this.createFormula.forEach(row => {
      if (row.operator.length === 0)
        row.operator = 'AND'
    })
    if (this.createFormula.length) {
      let len = this.createFormula.length
      this.createFormula[len - 1].operator = "";
      // if (!this.validateFormula()) {
      // if (!this.areConditionsEmpty) {
      if (this.validateGivenCondition()) {
        // this.conditionSelected = this.createFormula.reduce((res, item) => `${res} ${item.attribute} ${item.condition} ${item.values} ${item.operator}`, '');
        let conditionSelected = this.createFormula.reduce((res, item) => `${res} ${item.attribute} ${item.condition} ${item.values} ${item.operator}`, '');
        if ((conditionSelected.match(/[(]/g) || []).length === (conditionSelected.match(/[)]/g) || []).length) {
          // this.isMissing = false;
          this.formula = this.whereConditionPrefix + conditionSelected;
          $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")
          this.sharedDataService.setFormula(['where'], conditionSelected);
          this.removeUnwantedColumnNames(conditionSelected);
          this.validateAndAddTableId();
          let conditionObj = [{
            "condition_id": 0,
            "condition_name": this.columnName,
            "table_used": this.conditionTables,
            "columns_used_condition": this.selectedColumns,
            "condition_formula": conditionSelected,
            "applied_flag_condition": true,
            "condition_json": this.createFormula
          }];
          if (this.sharedDataService.getExistingCondition().length) {
            conditionObj[0].condition_id = this.sharedDataService.getExistingCondition()[0].condition_id;
          }
          // if(this.columnName !== '') {
          //   this.sharedDataService.setNewConditionData(conditionObj,'');
          // }
          // let keyValue = this.groupBy(this.createFormula, 'tableId');
          this.sharedDataService.setConditionData(conditionObj);
          this.sharedDataService.setNewConditionData(this.createFormula);
        }
        // }
      }
      // else {
      //   this.toasterService.error("Invalid Formula");
      // }
    }
  }

  validateAndAddTableId() {
    let all_ids = this.tables.map(ele => ele.id);
    this.createFormula.forEach(row => {
      if (row.tableId.length === 0)
        row.tableId = all_ids;
    })
  }

  private groupBy(arr: any, attr: string) {   // creates an obj with slId as key and related rows as values
    return arr.reduce(function (rv, x) {
      (rv[x[attr]] = rv[x[attr]] || []).push(x);
      return rv;
    }, {});
  }

  // requiredFieldsToSave() {
  //   return !(this.areConditionsEmpty && this.columnName);
  // }

  public saveCondition() {  // called on clicking save 

    //column/table name with space handler
    this.createFormula.forEach(row=>{
        row.attribute = this.columnNameWithSpaceHandler(row.attribute)
        row.values = this.columnNameWithSpaceHandler(row.values)
    })
    this.selectedColumns = this.selectedColumns.map(col=>this.columnNameWithSpaceHandler(col))
    
    this.createFormula.forEach(row => {
      if (row.operator.length === 0)
        row.operator = 'AND'
    })
    if (this.createFormula.length) {
      let len = this.createFormula.length
      this.createFormula[len - 1].operator = "";
      // if (!this.validateFormula()) {
      // if (!this.areConditionsEmpty) {
      if (this.validateGivenCondition()) {
        let conditionSelected = this.createFormula.reduce((res, item) => `${res} ${item.attribute} ${item.condition} ${item.values} ${item.operator}`, '');
        if ((conditionSelected.match(/[(]/g) || []).length === (conditionSelected.match(/[)]/g) || []).length) {
          // this.isMissing = false;
          // this.formula = this.whereConditionPrefix + conditionSelected;
          $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")
          // this.sharedDataService.setFormula(['where'], conditionSelected);
          this.removeUnwantedColumnNames(conditionSelected);
          this.validateAndAddTableId();
          let object = {};
          object["condition_name"] = this.columnName,
            object["table_list"] = this.conditionTables,
            object["column_used"] = this.selectedColumns,
            object["condition_formula"] = conditionSelected,
            object["applied_flag"] = true,
            object["condition_json"] = this.createFormula
          // console.log("to save",object);              
          Utils.showSpinner();
          this.addConditions.saveCondition(object).subscribe(
            res => {
              this.toasterService.success("Condition saved successfully")
              this.getConditions();
              Utils.hideSpinner();
            }, error => {
              Utils.hideSpinner();
            })
        }
        // }
      }
      //  else {
      //   this.toasterService.error("Invalid Formula");
      // }
    }
  }



  public uploadFile(event: any, con: any, index) {  // function to upload excel
    let filesData = event.target.files[0];
    XlsxPopulate.fromDataAsync(filesData)
      .then(workbook => {
        let value = workbook.sheet(0).range("A1:A1000").value();
        let excelValues = [];
        excelValues.push(value);
        let list = [];
        excelValues.forEach(element => {
          element.forEach(data => {
            data.forEach(d => {
              if (typeof d !== "undefined") {
                list.push(d);
              }
            });
          });
        });
        this.values = list;
        let valueString = '';
        if (typeof this.values[0] === "number") {
          valueString = `( ${this.values} )`;
        } else if (typeof (this.values[0]) === "string") {
          let uploadData = list.map(t => `'${t}'`);
          valueString = `( ${uploadData} )`;
        }
        con.values = valueString;
        this.validateFormula();
        event.target.value = '';
      })
  }

  public triggerFileBtn(index) {
    document.getElementById("valueInput" + index).click();
  }

  private removeDeletedTableData(data) {
    this.createFormula = [];
    // for (let key in data) {
    //   if (!(this.selectedTables.find(table =>
    //     key.includes(table['table']['select_table_id'].toString())
    //   ))) {
    //     delete data[key];
    //   }
    // }
    let selectedTableIds = this.selectedTables.map(tab=>tab.table.select_table_id)
    data = data.filter(row => {
      return this.selectedTables.some(tableItem =>{
          let l_tableID = Array.isArray(row.tableId)?row.tableId.sort():row.tableId;
          return +tableItem['table']['select_table_id'] === +row.tableId || JSON.stringify(selectedTableIds.sort()) === JSON.stringify(l_tableID)
      })
    })

    if (this.isObjEmpty(data)) {
      this.conditionTables = [];
      this.createFormula = this.addColumnBegin();
      this.columnName = '';
    }
    // else {
    //   this.createFormula = [];
    //   this.columnName = '';
    // }
    // for(let d in data) {
    //   this.createFormula.push(...data[d]);
    // //  console.log(this.conditionTables,"this.conditionTables") 
    //   // this.conditionTables = this.createFormula.map(data => {
    //   //   return data.tableId;
    //   // })
    // }
    this.createFormula.push(...data);
  }

  private isObjEmpty(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  // public getExistingList(value: string) {
  //   return this.cachedConditions.filter(option =>
  //     option['condition_name'].toLowerCase().includes(value.toLowerCase())
  //   )
  // }

  public getConditions(callback = null) {
    let tableIds;
    tableIds = this.tableIds.map(t => t.toString());
    tableIds = [...new Set(tableIds)]
    this.addConditions.fetchCondition(tableIds).subscribe(res => {

      if (!this.isEditView)
        this.createFormula = [{ attribute: '', values: '', condition: '', operator: '', tableId: '', conditionId: '', mandatory_flag: false }];
      this.columnName = '';
      this.condition = [];
      this.condition = res['existing_conditions'];
      this.cachedConditions = this.condition.slice();

      //updating with existing mandatory conditions
      this.updateColumnNameWithAlias();
      this.updateConditionResponse();
      if (!this.isEditView)
        this.updateConditionsOnUserLevel();
      if (callback) {
        callback();
      }
    })
  }

  updateColumnNameWithAlias() {

    this.condition.filter(cond0 => cond0.has_no_alias).forEach(cond => {
      cond.column_used.forEach(column => {
        let found_master_column = this.columns.find(ele => {
          if (ele.split('.')[1] === column)
            return ele
        })
        let reg = new RegExp(column, "gi")

        cond.condition_formula = cond.condition_formula.replace(reg, found_master_column);

        cond.condition_json.forEach(json => {
          json.attribute = json.attribute.replace(reg, found_master_column);
          json.values = json.values.replace(reg, found_master_column);
        });
      });
    })
  }

  updateConditionResponse() {
    this.condition.forEach(condition => {
      //update OR , when opeartor empty
      let len = condition.condition_json.length
      condition.condition_json[len - 1].operator = "AND";

      //added mandatory to all rows in condition_json
      let l_flag = condition.mandatory_flag;
      condition.condition_json.forEach(element => {
        element['mandatory_flag'] = l_flag
      });

      //add checked attribute from mandatory_flag
      condition.checked = condition.mandatory_flag;
    })
  }

  updateConditionsOnUserLevel() {

    this.condition.forEach(con => {
      // con.checked = con.mandatory_flag;
      if (con.mandatory_flag) {
        this.onSelect(con.condition_name, con.condition_id, { checked: con.mandatory_flag }, con);
      }
    })
    this.defineFormula();
  }

  public onSelect(conditionVal, conditionId, item, itemObj) {   // when an item is selected from the existingList
    let obj = this.createFormula[0];
    if (obj.attribute == '' && obj.values == '' && obj.condition == '' && obj.operator == '') {
      this.createFormula.splice(this.createFormula[0], 1);
    }
    this.selectedObj = this.condition.find(x =>
      x.condition_id == conditionId
    ).condition_json;
    let l_flag = this.condition.find(x =>
      x.condition_id == conditionId
    ).isMandatory;
    this.selectedObj.forEach(element => {
      element['isMandatory'] = l_flag;
    });
    let selectedId = conditionId;
    this.selectedObj.forEach(t => t.conditionId = selectedId);
    if (item.checked == true) {
      for (let i = 0; i < this.selectedObj.length; ++i) {
        this.createFormula.push(this.selectedObj[i]);
        // }
      }
    } else {
      for (let i = 0; i < this.selectedObj.length; ++i) {
        //   if (this.createFormula.includes(this.selectedObj[i])){          
        //   this.createFormula.splice(this.selectedObj[i], 1);
        // }
        this.createFormula = this.createFormula.filter(row => {
          return !(row.conditionId == this.selectedObj[i].conditionId)
        })
      }
    }
    if (!this.createFormula.length) {
      this.createFormula = this.addColumnBegin();
    }
    this.clearCondition();
    this.conditionTables = itemObj.table_list
    this.selectedColumns.push(...new Set(itemObj.column_used));
  }

  public deleteCondition(id) {   // delete a selected condition from existingList
    Utils.showSpinner();
    this.addConditions.delCondition(id).subscribe(response => {
      this.getConditions(() => {
        Utils.hideSpinner();
        this.toasterService.success("Condition deleted Successfully");
        for (let i = 0; i < this.selectedObj.length; ++i) {
          if (this.createFormula.includes(this.selectedObj[i])) {
            this.createFormula.splice(this.selectedObj[i], 1);
          }
        }
      });
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    });
  }


  public inputValue(value, type, index, con) {
    // if ((value || '').trim()) {
    // console.log(value);
    let id = type+index;
    con[type] = value; 
    //   this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
    //   this.oldValue.forEach(element => {
    //     element + ' ';
    //   });
    //   this.current = this.oldValue[this.oldValue.length - 1];
    //   this.results = this.getSearchedInput(this.oldValue[this.oldValue.length - 1],type);
    // } else {
    //   this.results = [{ groupName: 'Functions', values: [] }, 
    //                   { groupName: 'Columns', values: [] },
    //                   { groupName: 'Values', values: [] },
    //                 { groupName : 'Parameters' , values : [] }];
    // }

    let query = <HTMLInputElement>document.getElementById(id);
    let i;
    for (i = query.selectionStart - 1; i >= 0; i--) {
      if (value[i] === ' ') {
        break;
      }
    }
    i++;
    const word = value.slice(i).split(" ")[0];
    
    if ((word || '').trim()) {
      this.lastWord = value;
      this.oldValue = word.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + ' ';
      });
      this.results = this.getSearchedInput(this.oldValue[this.oldValue.length - 1], type);
    } else {
      this.results = this.getFullList(type);
      // this.results = [{ groupName: 'Functions', values: [] },
      // { groupName: 'Columns', values: [] },
      // { groupName: 'Calculated Columns', values: [] },
      // // { groupName: 'LOVs', values: [] },
      // { groupName: 'Values', values: [] },
      // { groupName: 'Parameters', values: [] }];
    }
  }
  getFullList(type){
    
    let functionArr = this.functions.slice();
    let columnList = this.columns.map(ele => {
      return { 'name': ele, 'formula': ele }
    });
    let calcList = this.calcNames.slice();
    let paramsList = this.paramsList.map(ele => {
      return { 'name': ele, 'formula': ele }
    });
    let valuesList = this.valueList.map(ele => {
      return { 'name': ele, 'formula': ele }
    });

    let arrList = [{ groupName: 'Functions', values: functionArr },
    { groupName: 'Columns', values: columnList },
    { groupName: 'Calculated Columns', values: calcList }];
   
    if (type === 'values') {
      // arrList.push({ groupName: 'Values', values: this.distinctValues })
      // arrList.push({ groupName: 'LOVs', values: this.valueList })
      arrList.push({ groupName: 'Values', values: valuesList })
      arrList.push({ groupName: 'Parameters', values: paramsList })
    }
    return arrList
  }

  private getSearchedInput(value: any, type) {
    let functionArr = [], columnList = [], calcList = [];
    this.functions.forEach(element => {
      if (element.name.toLowerCase().includes(value.toLowerCase())) {
        functionArr.push(element);
      }
    });
    this.calcNames.forEach(element => {
      if (element.name.toLowerCase().includes(value.toLowerCase())) {
        calcList.push(element);
      }
    });
    // console.log("this.paramsList", this.paramsList);

    columnList = this.columns.filter(element => {
      return element.toLowerCase().includes(value.toLowerCase())
    }).map(ele => {
      return { 'name': ele, 'formula': ele }
    });
    let paramsList = this.paramsList.map(ele => {
      return { 'name': ele, 'formula': ele }
    });
    let valuesList = this.valueList.map(ele => {
      return { 'name': ele, 'formula': ele }
    });
    // console.log("columnList", columnList);

    let arrList = [{ groupName: 'Functions', values: functionArr },
    { groupName: 'Columns', values: columnList },
    { groupName: 'Calculated Columns', values: calcList }];

    if (type === 'values') {
      // arrList.push({ groupName: 'Values', values: this.distinctValues })
      // arrList.push({ groupName: 'LOVs', values: this.valueList })
      arrList.push({ groupName: 'Values', values: valuesList })
      arrList.push({ groupName: 'Parameters', values: paramsList })
    }
    // console.log(arrList, "arrList");
    return arrList
  }

  // for (let key in this.functions) {
  //   functionArr.push(
  //     ...this.functions[key].filter(option =>
  //       option.toLowerCase().includes(value.toLowerCase())
  //     )
  //   );
  // }
  // columnList = this.columns.filter(element => {
  //   return element.toLowerCase().includes(value.toLowerCase())
  // });

  public listofvalues(table, column) {
    // console.log(table, "lisssttttt");
    let options = {};
    options["slId"] = this.semanticId;
    options['columnName'] = column;
    options['tableId'] = table['name'];
    // console.log("params", options);
    this.objectExplorerSidebarService.listValues(options).subscribe(res => {
      this.distinctValues = res;
    })
  }

  public onSelectionChanged(event, con, type) {
    let column = event.option.value.slice(event.option.value.indexOf(".") + 1);
    let id = [];
    if (type == 'attribute') {
      id = this.tables.map(table => {
        if (event.option.value.split('.')[0] === table.alias)
          return table;
      }).filter(ele => ele ? true : false)
      if(this.isColumn(event.option.value)) {
        this.fetchLov(id[0].id, column);
        this.listofvalues(id[0], column);
        this.fetchParametersForTable(id[0].id, column)
      }
      // console.log("event", event.option.value, event, column, id[0]);
    }
    // let index = this.oldValue.length > 0 ? this.oldValue.length - 1 : 0;
    let i;
    let value = this.lastWord.split(" ");
    for (i = 0; i < value.length; i++) {
      if (value[i] == this.oldValue) {
        value[i] = event.option.value + ' ';
        break;
      }
    }

    if (this.isColumn(event.option.value)) {
      this.getDetails(event.option.value, con);
    }

    // this.oldValue[index] = event.option.value + '  ';
    if (type == 'attribute') {
      con.attribute = (value.join(' '));
    } else {
      con.values = (value.join(' '));
    }
    this.validateParameters(event, con, type);
    this.onSelectLov(event,type,con);
  }

  fetchParametersForTable(id, column){
    this.addConditions.getExistingParametersTables(id, column).subscribe(res => {
      this.existingParamForTableColumn = res.data;
      this.paramsList = this.existingParamForTableColumn.map(obj => obj.parameter_name)
    })
  }

  validateParameters(eve, con, type) {
    if (type === 'value' && (eve.option.group.label === "Parameters")) {
      let l_formula = "( ";
      this.existingParamForTableColumn.forEach((ele, i) => {
        if (ele.parameter_name === eve.option.value) {
          let l_len = ele.parameter_formula.length;
          ele.parameter_formula.forEach((val, i) => {
            let l_value = isNaN(+val) ? replaceDoubletoSingleQuote(JSON.stringify(val)) : +val
            l_formula += l_value + (i === l_len - 1 ? "" : ",");
          })
        }

      })
      con.values = l_formula + " )";
    }
  }


  public getDetails(event, con) {

    let ids = [];
    ids = this.tables.filter(table => {
      if (event.split('.')[0] === table.alias)
        return true;
      else
        return false
    }).map(table => table.id)

    this.selectedColumns.push(event.split('.')[1])
    this.conditionTables.push(...ids);

    let unique = [...new Set(this.conditionTables)];
    this.selectedColumns = [...new Set(this.selectedColumns)]
    unique = unique.filter(element => {
      return element !== undefined
    });
    this.conditionTables = unique;
    this.rowUsedTable = unique;
    con.tableId = ids[0];
  }

  removeUnwantedColumnNames(query) {
    this.selectedColumns = [...new Set(this.selectedColumns)]
    this.selectedColumns = this.selectedColumns.filter(col => {
      return query.includes(col)
    })
    this.conditionTables = this.conditionTables.map(id => +id)
    this.conditionTables = [...new Set(this.conditionTables)]
  }

  private isColumn(item) {
    return this.columns.map(col => col.toUpperCase().trim()).includes(item.toUpperCase().trim());
  }

  requiredFields() {
    let obj = this.createFormula[0];
    if (obj && obj.attribute == '' && obj.condition == '' && obj.conditionId == '' && obj.operator == '' && obj.tableId == '' && obj.values == '') {
      return true;
    }
  }

  getSelectedColumns(selectedTables){
    let l_columns = [];
    selectedTables.forEach(element => {
      l_columns.push(...element.table.column_properties.filter(ele=>ele.column_view_to_admins).map(obj=>obj.column))
    });
    return l_columns
  }

  columnNameWithSpaceHandler(val){
    let columns = this.getSelectedColumns(this.selectedTables);
    let l_value = val;
    let key = constants_value.column_space_replace_value;
      let regEx = new RegExp(key,"gi");
    columns = columns.filter(col=>{
      return col.indexOf(key) === -1?false:true;
    })
    
    columns.forEach(column=>{
      let l_col = column.replace(regEx," ");
      let regEx1 = new RegExp(l_col,"gi");
      l_value = l_value.replace(regEx1,column)
    })
      return l_value    
    }
}

function replaceDoubletoSingleQuote(str) {
  return str.replace(/"/g, "'")
}