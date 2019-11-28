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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-conditions',
  templateUrl: './add-conditions.component.html',
  styleUrls: ['./add-conditions.component.css']
})
export class AddConditionsComponent implements OnInit {

  rowUsedTable;
  results: any[] = [];
  oldValue: any;
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
    private addConditions: AddConditionsService,
    private toasterService: ToastrService,
    private constantService: ConstantService,
    private activatedRoute: ActivatedRoute,
    private listOfValuesService: ListOfValuesService
  ) {
    this.functions = this.constantService.getSqlFunctions('aggregations');
  }

  ngOnInit() {
    this.activateRoute.queryParams.subscribe(params => {
      if (params.report && params.sheet) {
        this.isEditView = true;
      } else {
        this.isEditView = false;
      }
    });

    this.sharedDataService.getNextClicked().subscribe(isClicked => {
      
      this.tableIds = this.tables.map(table => {
        return table.id;
      });
      // this.activatedRoute.queryParams.subscribe(params =>{

      //   if(params.report && params.sheet){
      //     this.isEdit = true;
      //   }
      // });
      this.getConditions();
      // this.addColumnBegin();
    });

    this.sharedDataService.selectedTables.subscribe(tableList => {
      this.selectedTables = tableList;
      this.tables = this.getTables();
      this.columns = this.getColumns();
      let keyValues = this.sharedDataService.getNewConditionData().data;
      // this.columnName = this.sharedDataService.getNewConditionData().name;
      this.removeDeletedTableData(keyValues);
    });

    this.sharedDataService.resetQuerySeleted.subscribe(ele => {
      this.createFormula = [{ attribute: '', values: '', condition: '', operator: '', tableId: '', conditionId: '', mandatory_flag: false }];
      this.columnName = '';
      this.condition = [];
      this.reset();
    });
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
        this.lovValueList.forEach(obj => this.valueList.push(obj['lov_name']))
      })
    }
  }

  onSelectLov(con) {
    this.lov = this.lovValueList.find(x =>
      x.lov_name.trim().toLowerCase() == con.values.trim().toLowerCase()
    ).value_list;
    // console.log(this.lov, "selected lov");
    if (typeof this.lov[0] === "number") {
      con.values = `( ${this.lov} )`;
    } else if (typeof (this.lov[0]) === "string") {
      let uploadData = this.lov.map(t => `'${t}'`);
      con.values = `( ${uploadData} )`;
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
      return element['table']['mapped_column_name'].map(column => {
        return `${element['select_table_alias']}.${column}`
      });
    });
    columnWithTable.forEach(data => {
      columnData.push(...data);
    });
    return columnData;
  }

  public addColumn(con) { // called on add button next to every row
    console.log(con);
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
      // console.log(this.isNullOrEmpty(this.createFormula[0].attribute));
      if (this.isNullOrEmpty(this.createFormula[0].attribute) || this.isNullOrEmpty(this.createFormula[0].condition))
        valid = false

    }

    // console.log(this.createFormula);

    // console.log(valid);

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
    
    this.createFormula.forEach(row=>{
      if(row.operator.length === 0)
        row.operator = 'AND'
    })
    if (this.createFormula.length) {
      let len = this.createFormula.length
      this.createFormula[len - 1].operator = "";
      // if (!this.validateFormula()) {
        // if (!this.areConditionsEmpty) {
          if(this.validateGivenCondition()){
          // this.conditionSelected = this.createFormula.reduce((res, item) => `${res} ${item.attribute} ${item.condition} ${item.values} ${item.operator}`, '');
          let conditionSelected = this.createFormula.reduce((res, item) => `${res} ${item.attribute} ${item.condition} ${item.values} ${item.operator}`, '');
          if ((conditionSelected.match(/[(]/g) || []).length === (conditionSelected.match(/[)]/g) || []).length) {
            // this.isMissing = false;
            this.formula = this.whereConditionPrefix + conditionSelected;
            $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")
            this.sharedDataService.setFormula(['where'], conditionSelected);
            this.removeUnwantedColumnNames(conditionSelected);
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
    // console.log(data);

    this.createFormula = [];
    // for (let key in data) {
    //   if (!(this.selectedTables.find(table =>
    //     key.includes(table['table']['select_table_id'].toString())
    //   ))) {
    //     delete data[key];
    //   }
    // }

    data = data.filter(row=>{
      return this.selectedTables.some(tableItem=> +tableItem['table']['select_table_id'] === +row.tableId)
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
    this.createFormula.push(...data)
    // console.log(this.createFormula.slice());

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

      // console.log(this.isEdit);

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
    // console.log(this.createFormula);
    // console.log(this.condition);

    this.defineFormula();
  }

  public onSelect(conditionVal, conditionId, item, itemObj) {   // when an item is selected from the existingList
    // console.log(this.createFormula.slice());

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

  public inputValue(value, type, id: string) {
    // if ((value || '').trim()) {
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
      this.results = [{ groupName: 'Functions', values: [] },
      { groupName: 'Columns', values: [] },
      { groupName: 'Values', values: [] },
      { groupName: 'Parameters', values: [] }];
    }
  }

  private getSearchedInput(value: any, type) {
    let functionArr = [], columnList = [];
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

    this.functions.forEach(element => {
      if (element.name.toLowerCase().includes(value.toLowerCase())) {
        functionArr.push(element);
      }
    });

    columnList = this.columns.filter(element => {
      return element.toLowerCase().includes(value.toLowerCase())
    }).map(ele => {
      return { 'name': ele, 'formula': ele }
    });

    let arrList = [{ groupName: 'Functions', values: functionArr },
    { groupName: 'Columns', values: columnList }];

    if (type === 'value') {
      arrList.push({ groupName: 'Values', values: this.valueList })
      arrList.push({ groupName: 'Parameters', values: this.paramsList })
    }

    return arrList
    // return [{ groupName: 'Functions', values: functionArr }, 
    //         { groupName: 'Columns', values: columnList }, 
    //         { groupName: 'Values', values: this.valueList},
    //         { groupName : 'Parameters' , values : this.paramsList }];
  }

  public onSelectionChanged(event, con, type) {
    // console.log(this.tables);
    // console.log(this.results);

    let column = event.option.value.slice(event.option.value.indexOf(".") + 1);
    let id = [];
    if (type == 'attribute') {
      id = this.tables.map(table => {
        if (event.option.value.split('.')[0] === table.alias)
          return table.id;
      })
      this.fetchLov(id[0], column);
      this.fetchParametersForTable(id[0], column)
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

    // this.onSelectLov(con);
  }

  fetchParametersForTable(id, column) {
    this.addConditions.getExistingParametersTables(id, column).subscribe(res => {
      // console.log(res);
      this.existingParamForTableColumn = res.data;
      this.paramsList = this.existingParamForTableColumn.map(obj => obj.parameter_name)
    })
  }
  validateParameters(eve, con, type) {
    if (type === 'value' && (eve.option.group.label === "Parameters")) {
      // console.log(con);
      // console.log(eve);
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
      // console.log(l_formula);
      con.values = l_formula + " )";
    }
  }


  public getDetails(event, con){
    
    let ids = [];
    ids = this.tables.filter(table =>{
      if(event.split('.')[0] === table.alias)
        return true;
      else
        return false
    }).map(table=>table.id)

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
    // console.log(con.tableId,"con.tableId");    
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
}

function replaceDoubletoSingleQuote(str) {
  return str.replace(/"/g, "'")
}