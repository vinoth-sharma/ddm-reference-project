import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { sqlFunctions } from "../../../constants";
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate.min.js';
import { SharedDataService } from "../shared-data.service";
import { AddConditionsService } from "./add-conditions.service";
import Utils from "../../../utils";
import { ToastrService } from "ngx-toastr";

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
  selectedTables = [];
  confirmFn;
  tableName;
  isError: boolean;
  existingList: any[] = [];
  originalExisting: any[] = [];
  queryField: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl();
  // columnName: FormControl = new FormControl();
  tableControl: FormControl = new FormControl('', [Validators.required]);
  confirmHeader = '';
  private functions = sqlFunctions;
  confirmText = '';
  public columns = [];
  public chips = [];
  visible = true;
  selectable = true;
  removable = true;
  public formula: string = '';
  tableData = [];
  tableParameters = [];
  uploadData = [];
  tableInfo = [];
  isValid: boolean = false;
  isMissing: boolean = false;
  conditionTables = [];
  selectedColumns = [];
  columnName: string = '';
  selectedTable;
  valueString = '';
  selectedonditions = [];
  public conditionSelected: string = '';
  public conditions = [];
  public selectedId;
  public searchValue: string;
  checkRowEmpty = [];
  tables = [];
  populateColumns;
  isEmpty: boolean = false;
  public condition = [];
  public isLoading: boolean = true;
  public selected;
  public values = [];
  public lastObj = {};
  public excelValues = [];
  public selectedObj;
  public cachedConditions = [];
  public headers = ["Item", "Condition", "Value(s)", "Operator"];
  public operator = ["-", "AND", "OR"];
  public conditionList = ["=", "!=", "<", ">", "<=", ">=", "<>", "BETWEEN", "LIKE", "NOT LIKE", "IN", "NOT BETWEEN", "NOT IN", "IS NULL", "IS NOT NULL"];
  public createFormula = [];
  public isUploaded: boolean = false;
  bracketsClose = []; bracketsOpen = [];
  defaultError = "There seems to be an error. Please try again later.";


  constructor(private sharedDataService: SharedDataService,
    private addConditions: AddConditionsService,
    private toasterService: ToastrService
  ) { }

  ngOnInit() {
    // this.addColumnBegin();
    this.sharedDataService.selectedTables.subscribe(tableList => {
      this.selectedTables = tableList
      this.tables = this.getTables();
      this.columns = this.getColumns();
      // let formulaCalculated = this.sharedDataService.getFormulaCalculatedData();
      // this.removeDeletedTableData(formulaCalculated);
      let keyValues = this.sharedDataService.getNewConditionData();
          this.removeDeletedTableData(keyValues);
    });
    this.queryField.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        if ((value || '').trim())
          this.existingList = this.searchedExistingList(value);
        else
          this.existingList = this.originalExisting;
      });
  }

  public searchedExistingList(value: string) {
    return this.originalExisting.filter(option =>
      option['calculated_field_name'].toLowerCase().includes(value.toLowerCase())
    )
  }

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
    columnWithTable.forEach(data =>{
      columnData.push(...data);
    });    
    return columnData;
  }
 
  public addColumn(con) { // called on add button next to every row
    // con.tableId = this.rowUsedTable;
    if (con.operator && con.attribute && con.values && con.condition) {
      this.createFormula.push({
        values: "", condition: "", attribute: "", operator: "", tableId: ''
      });
    } else {
      this.toasterService.error("Please fill all required fields.");
    }
  };

  addColumnBegin() {    // called on ngOninit for default raw.
    this.createFormula.push({ attribute: "", values: "", condition: "", operator: "", tableId: '' });
  }

  // public onTableSelection(event, con) {
  //   con.tableId = this.selectedTables.filter(item => item.select_table_alias === event.target.value)[0].table.select_table_id;
  //   con.columns = this.selectedTables.filter(item => item.select_table_alias === event.target.value)[0].table.mapped_column_name;
  // }

  public removeColumn(con) {  // remove row on remove button 
    this.createFormula.splice(this.createFormula.indexOf(con), 1);
  }

  public defineFormula() {  // called on clicking finish
    if (this.createFormula.length) {
      for (let i = 0; i <= this.createFormula.length - 2; ++i) {
        let obj = Object.values(this.createFormula[i]);
        if (obj.includes("")) {
          this.toasterService.error("Please fill all required fields");
          this.isValid = true;
        } else {
          this.isValid = false;
        }
      }
        for (let i = 0; i < this.createFormula.length; ++i) {
        this.conditionSelected = '';
        const curRow = this.createFormula[i];
          this.conditionSelected += `${curRow.attribute} ${curRow.condition} ${curRow.values}
          ${curRow.operator}`;
        }
        
        if ((this.conditionSelected.match(/[(]/g) || []).length === (this.conditionSelected.match(/[)]/g) || []).length) {
          this.isMissing = false;
        } else {
          this.isMissing = true;
          this.toasterService.error("Brackets missing.");        
      }
      this.lastObj = this.createFormula[this.createFormula.length - 1];
      if ((this.lastObj['operator'] == "AND") || (this.lastObj['operator'] == "OR") || (this.lastObj['values'] == '') || (this.lastObj['condition'] == '') ||
        (this.lastObj['attribute'] == '')) {
        this.toasterService.error("Invalid Syntax.");
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    }
    if (this.isMissing === false && this.isValid === false && this.isEmpty === false  && this.columnName ) { // add condition_name is to be added
      this.conditionSelected = '';
      for (let i = 0; i < this.createFormula.length; ++i) {
        const curRow = this.createFormula[i];
        this.conditionSelected += `${curRow.attribute} ${curRow.condition} ${curRow.values}
        ${curRow.operator} `;
      }
      // for (let i = 0; i < this.createFormula.length; ++i) {
      //   const curRow = this.createFormula[i];
      //   this.selectedColumns.push(curRow['attribute']);
      //   this.conditionTables.push(curRow['table']);
      // }
      // this.selectedColumns = [...new Set(this.selectedColumns)];
      // this.conditionTables = [...new Set(this.conditionTables)];
      this.formula = "WHERE" + this.conditionSelected;
      this.sharedDataService.setFormula(['where'], this.conditionSelected);
      let conditionObj = [{
        "condition_id": 0,
        "condition_name": this.columnName,
        "table_used": this.conditionTables,
        "columns_used_condition": this.selectedColumns,
        "condition_formula": this.conditionSelected,
        "applied_flag_condition": true,
        "condition_json": this.createFormula
      }];
      if(this.sharedDataService.getExistingCondition().length){
        conditionObj[0].condition_id = this.sharedDataService.getExistingCondition()[0].condition_id;
      }
      this.sharedDataService.setConditionData(conditionObj);
      let keyValue = this.groupBy(this.createFormula, 'tableId');
      this.sharedDataService.setNewConditionData(keyValue);
    }
  }

  private groupBy(arr: any, attr: string) {   // creates an obj with slId as key and related rows as values
    return arr.reduce(function (rv, x) {
      (rv[x[attr]] = rv[x[attr]] || []).push(x);
      return rv;
    }, {});
  }

  public uploadFile(event: any, con: any, index) {  // function to upload excel
    let filesData = event.target.files[0];
    XlsxPopulate.fromDataAsync(filesData)
      .then(workbook => {
        let value = workbook.sheet(0).range("A1:A100").value();
        this.excelValues = [];
        this.excelValues.push(value);
        let list = [];
        this.excelValues.forEach(element => {
          element.forEach(data => {
            data.forEach(d => {
              if (typeof d !== "undefined") {
                list.push(d);
              }
            });
          });
        });
        this.values = list;
        if (typeof this.values[0] === "number") {
          // this.valueString = `( ${this.values.join(', ')} )`; 
          this.valueString = `( ${this.values} )`;

        } else if (typeof (this.values[0]) === "string") {
          this.uploadData = list.map(t => '"' + t + '"');
          this.valueString = `( ${this.uploadData} )`;
        }
        //  else if(typeof(this.values[0]) === "date") {
        // this.uploadData = list.map(t => ' + t + ');
        // this.valueString = `( ${this.uploadData} )`; 
        // } 
        con.values = this.valueString;
      })
  }

  public triggerFileBtn(index) {
    document.getElementById("valueInput" + index).click();
  }



  // ngOnInit() {
  //   this.sharedDataService.selectedTables.subscribe(tableList => {
  //     this.selectedTables = tableList
  //     this.tables = this.getTables();
  //     let tableParameters = [];
  //     for (let i = 0; i < this.tables.length; ++i) {
  //       tableParameters[i] = this.tables[i]["name"];
  //       console.log(tableParameters, "tableParameters")
  //       this.tableParameters = tableParameters;
  //     }

  //     this.tableParameters = [...new Set(this.tableParameters)];
  //     // console.log("params", this.tableParameters);        
  //     let keyValues = this.sharedDataService.getNewConditionData();
  //     this.removeDeletedTableData(keyValues);
  //     if (this.tableParameters) { this.getConditions(); }
  //   });
  // }

  private removeDeletedTableData(data) {
    for (let key in data) {
      if (!(this.selectedTables.find(table =>
        table['table']['select_table_id'].toString().includes(key)
      ))) {
        delete data[key];
      }
    }
    // this.createFormula = [];
    // this.createFormula.push({
    //   values: "", condition: "", attribute: "", operator: ""
    // });
    // if(!this.isObjEmpty(data)){
    //   this.createFormula = [];
    // }
    // if(!data.length){
    //   this.createFormula.push({
    //       values: "", condition: "", attribute: "", operator: ""
    //     });
    // }

    if(data.length == 0){
      this.addColumnBegin();
    }

    for (let d in data) {
      this.createFormula.push(...data[d]);
    }
  }

  private isObjEmpty(obj){
    for(let key in obj){
      if(obj.hasOwnProperty(key)){
        return false;
      }
    }
  }

  public getExistingList(value: string) {
    return this.cachedConditions.filter(option =>
      option['condition_name'].toLowerCase().includes(value.toLowerCase())
    )
  }
  public getConditions(callback = null) {
    this.addConditions.fetchCondition(this.tableParameters).subscribe(res => {
      this.condition = res['existing_conditions'];
      this.cachedConditions = this.condition.slice();
      this.isLoading = false;
      if (callback) {
        callback();
      }
    })
  }

  public onSelect(conditionVal, conditionId, item) {   // when an item is selected from the existingList
    this.selectedObj = this.condition.find(x =>
      x.condition_name.trim().toLowerCase() == conditionVal.trim().toLowerCase()
    ).condition_json;
    this.selectedId = conditionId;
    if (item.checked == true) {
      for (let i = 0; i < this.selectedObj.length; ++i) {
        if (!this.createFormula.includes(this.selectedObj[i])) {
          this.createFormula.push(this.selectedObj[i]);
        }
      }
    } else {
      for (let i = 0; i < this.selectedObj.length; ++i) {
        if (this.createFormula.includes(this.selectedObj[i])) {
          this.createFormula.splice(this.selectedObj[i], 1);
        }
      }
    }
  }

  public deleteCondition() {   // delete a selected condition from existingList
    Utils.showSpinner();
    this.addConditions.delCondition(this.selectedId).subscribe(response => {
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

  // public getExistingList(name){
  //   this.addConditions.fetchCondition(name).subscribe(res => {
  //     this.existingList = res['data'];
  //     this.originalExisting = JSON.parse(JSON.stringify(this.existingList));
  //   });
  // }

  public inputValue(value) {
    if ((value || '').trim()) {
      this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + ' ';
      });
      this.current = this.oldValue[this.oldValue.length - 1];
      this.results = this.getSearchedInput(this.oldValue[this.oldValue.length - 1]);
    } else {
      this.results = [{ groupName: 'Functions', values: [] }, { groupName: 'Columns', values: [] }];
    }
  }

  private getSearchedInput(value: any) {
    let functionArr = [], columnList = [];
    for (let key in this.functions) {
      functionArr.push(
        ...this.functions[key].filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    columnList = this.columns.filter(element => {
      return element.toLowerCase().includes(value.toLowerCase())
    });
    return [{ groupName: 'Functions', values: functionArr }, { groupName: 'Columns', values: columnList }];
  }


  public onSelectionChanged(event, con, type) {   
    let index = this.oldValue.length > 0?this.oldValue.length-1:0; 
    if(this.isColumn(event.option.value)){
      this.getDetails(event.option.value,con);
    }
      this.oldValue[index] = event.option.value + '  ';
      if(type == 'attribute'){
        con.attribute = (this.oldValue.join(' '));
      }else{
        con.values = (this.oldValue.join(' '));
      }
      
      }

      public getDetails(event,con){
        let ids = [];
    
          ids = this.tables.map(table => {
          if(event.split('.')[0] === table.alias)
          return table.id;
        })
        this.selectedColumns.push(event.split('.')[1])
        this.conditionTables.push(...ids);
        let unique = [...new Set(this.conditionTables)];
        this.selectedColumns = [...new Set(this.selectedColumns)]
        unique = unique.filter(element => {
          return element !== undefined 
        });
        this.conditionTables = unique;
        this.rowUsedTable = unique;
        con.tableId = this.rowUsedTable;
      }


  private isColumn(item) {
    return this.columns.map(col => col.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }


  public getNewFields() {
    let newColumns = [];
    let existingList = this.existingList;
    this.chips.forEach(element => {
      let isExist = false;
      existingList.forEach(list => {
        if (element.name === list.calculated_field_name) {
          isExist = true;
        }
      })
      if (!isExist)
        newColumns.push(element);
    });
    return newColumns;
  }

  private getField(type, newFeilds) {

    let newArr = newFeilds.map(element => {
      if (type === 'name')
        return element.name;
      else
        return element.formula;
    });
    return newArr;
  }


  public deleteField(id) {
    // public removeCustomTable(tableId: number) {
    // this.isCustomTable = true;
    // this.isLoading = true;
    // this.selectedTables = [];
    // this.selectedTables.push(tableId);
    // this.confirmHeader = 'Delete existing calculated field';
    // this.confirmText = 'Are you sure you want to delete the field(s)?';
    // this.confirmFn = function () {
    Utils.showSpinner();
    this.addConditions.delCondition(id).subscribe(response => {
      this.toasterService.success(response['message'])
      Utils.hideSpinner();
      // Utils.closeModals();
      // this.getExistingList();
    }, error => {
      this.toasterService.error(error.message['error']);
      Utils.hideSpinner();
      // Utils.closeModals();
      // this.getCustomTables();
    });
  };
  // }
  // }

}
