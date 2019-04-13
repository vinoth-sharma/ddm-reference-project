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
  results: any[] = [];
  oldValue:any;
  bracketStack:any = {
                'open' : [],
                'close' : []
  };
 
  conditiong = [ {
    "condition_id": 125,
    "condition_name": "Condition 1",
    "table_list": [
        "HOLD_VID_VEHICLE"
    ],
    "column_used": [
        "EXT_TIME_EXTENSION"
    ],
    "condition_json": [
        {
            "table": "HOLD_VID_VEHICLE",
            "close": ")",
            "open": "(",
            "condition": "<>",
            "attributes": "EXT_TIME_EXTENSION",
            "columns": [
                "DLR_REC_BUS_AST_CD",
                "DLR_REC_BUS_FCN_CD",
                "DLR_REC_SLG_SRC_CD",
                "ENGNRN_MODL_DESGTR" 
                            ]}  ] } ]
  current;
  tableId;
  selectedTables = [];
  confirmFn;
  tableName;
  isError:boolean;
  existingList:any[] = [];
  originalExisting:any[] = [];
  queryField: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl();
  columnName:  FormControl = new FormControl();
  tableControl: FormControl = new FormControl('',[Validators.required]);
  confirmHeader = '';
  private functions = sqlFunctions;
  // public tables = [];
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
  // columnName: string;
  selectedTable;
  valueString = '';
  selectedonditions = [];
  public conditionSelected: string = '';
  public conditions = [];
  public selectedId;
  // selectedTables = [];
  public searchValue: string;
  checkRowEmpty = [];
  tables = [];
  populateColumns;
  isEmpty: boolean = false;
  public condition = [];
  // public columns = [];
  public isLoading: boolean = true;
  public selected;
  public values = [];
  public lastObj = {};
  public excelValues = [];
  public selectedObj;
  public cachedConditions = [];
  // public headers = ["(", "Table", "Attribute", "Condition", "Value", ")", "Operator"];
  public headers = ["Item", "Condition", "Value(s)","Operator"];
  public operator = ["-", "AND", "OR"];
  public conditionList = ["=", "!=", "<", ">", "<=", ">=", "<>", "BETWEEN", "LIKE", "NOT LIKE", "IN", "NOT BETWEEN", "NOT IN", "IS NULL", "IS NOT"];
  public createFormula = [];
  public isUploaded: boolean = false;
  bracketsClose = []; bracketsOpen = [];
  defaultError = "There seems to be an error. Please try again later.";
  

  constructor( private sharedDataService:SharedDataService,
              private addConditions:AddConditionsService,
              private toasterService: ToastrService
            ) {}

  ngOnInit() {
    this.addColumnBegin();
    this.sharedDataService.selectedTables.subscribe(tableList => {
      this.selectedTables = tableList
      this.tables = this.getTables();
      let formulaCalculated = this.sharedDataService.getFormulaCalculatedData();
      this.removeDeletedTableData(formulaCalculated);
    });
    
    this.queryField.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        if((value || '').trim())
          this.existingList = this.searchedExistingList(value);
        else
          this.existingList = this.originalExisting;
      });

    this.columnName.valueChanges.subscribe(value => {
      this.checkDuplicate(value,'column');
    });
  }

  public removeDeletedTableData(data){
    let isChips = false;
    this.selectedTables.map(table => {
      let id = table['table']['select_table_id'];
      for(let key in data){
        if(key === id){
          delete data[key];
          this.queryTextarea.setValue('');
          this.columnName.setValue('');
          this.tableControl.setValue('');
          isChips = true;
        }
      }
    })
    if(isChips)
      this.chips = [];
  }

  public searchedExistingList(value:string){
    return this.originalExisting.filter(option =>
      option['calculated_field_name'].toLowerCase().includes(value.toLowerCase())
    )
  }

  public addColumn(con) {
    let temp = Object.values(con);
    if (temp.includes("")) {
      this.toasterService.error("Please fill all required fields.");
    } else {
      this.createFormula.push({
       values: "", condition: "", queryTextarea: "(", operator: ""
      });
    }
  };

  // public onTableSelection(event, con) {
  //   con.tableId = this.selectedTables.filter(item => item.select_table_alias === event.target.value)[0].table.select_table_id;
  //   con.columns = this.selectedTables.filter(item => item.select_table_alias === event.target.value)[0].table.mapped_column_name;
  // }

  public removeColumn(con) {
    this.createFormula.splice(this.createFormula.indexOf(con), 1);
  }

  checkOpen(event) {
    return (event.keyCode == 40);
  }

  checkClose(event) {
    return (event.keyCode == 41);
  }

  fetchParameters() {
    this.toasterService.error("No Parameters Available.");
  }

  public defineFormula() {
    console.log(this.createFormula, "data")
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
        const curRow = this.createFormula[i];
        this.bracketsOpen.push(curRow['open']);
        this.bracketsClose.push(curRow['close']);
        if (this.bracketsOpen.length === this.bracketsClose.length) {
          this.isMissing = false;
        } else {
          this.isMissing = true;
          this.toasterService.error("Brackets missing.");
        }
      }
      this.lastObj = this.createFormula[this.createFormula.length - 1];
      if ((this.lastObj['operator'] == "AND") || (this.lastObj['operator'] == "OR") || (this.lastObj['values'] == '') || (this.lastObj['condition'] == '') ||
        (this.lastObj['attributes'] == '') || (this.lastObj['table'] == '')) {
        this.toasterService.error("Invalid Syntax.");
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    }
    if (this.isMissing === false && this.isValid === false && this.isEmpty === false) {
      this.conditionSelected = '';
      for (let i = 0; i < this.createFormula.length; ++i) {
        const curRow = this.createFormula[i];
        this.conditionSelected += `${curRow.open} ${curRow.table}.${curRow.attributes} ${curRow.condition} ${curRow.values}
          ${curRow.close} ${curRow.operator}`;
      }
      for (let i = 0; i < this.createFormula.length; ++i) {
        const curRow = this.createFormula[i];
        this.selectedColumns.push(curRow['attributes']);
        this.conditionTables.push(curRow['table']);
      }
      this.selectedColumns = [...new Set(this.selectedColumns)];
      this.conditionTables = [...new Set(this.conditionTables)];
      this.formula = "WHERE" + this.conditionSelected;
      this.sharedDataService.setFormula(['where'], this.conditionSelected);
      let conditionObj = [{
        "condition_name": this.columnName,
        "table_used": this.conditionTables,
        "columns_used_condition": this.selectedColumns,
        "condition_formula": this.conditionSelected,
        "applied_flag_condition": true,
        "condition_json": this.createFormula
      }];
      this.sharedDataService.setConditionData(conditionObj);
      let keyValue = this.groupBy(this.createFormula, 'tableId');
      console.log(keyValue, 'keyValue in condition');
      this.sharedDataService.setNewConditionData(keyValue);
    }
  }

  private groupBy(arr: any, attr: string) {
    return arr.reduce(function (rv, x) {
      (rv[x[attr]] = rv[x[attr]] || []).push(x);
      return rv;
    }, {});
  }

  public uploadFile(event: any, con: any, index) {
    console.log(con, 'con');
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

  addColumnBegin() {
    this.createFormula.push({ attributes: "", close: ")", values: "", condition: "", open: "(", operator: "" });
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

  // private removeDeletedTableData(data) {
  //   for (let key in data) {
  //     if (!(this.selectedTables.find(table =>
  //       table['table']['select_table_id'].toString().includes(key)
  //     ))) {
  //       delete data[key];
  //     }
  //   }
  //   this.createFormula = [];
  //   for (let d in data) {
  //     this.createFormula.push(...data[d]);
  //   }
  //   console.log(this.createFormula, 'create formula in condition');
  // }

  removeFormula() {
    this.formula = '';
  }

  public getExistingList(value: string) {
    return this.cachedConditions.filter(option =>
      option['condition_name'].toLowerCase().includes(value.toLowerCase())
    )
  }
  public getConditions(callback = null) {
    this.addConditions.fetchCondition(this.tableParameters).subscribe(res => {
      this.condition = res['existing_conditions'];
      console.log("seee", this.condition);
      this.cachedConditions = this.condition.slice();
      this.isLoading = false;
      if (callback) {
        callback();
      }
    })
  }

  public triggerFileBtn(index) {
    console.log("valueInput" + index, 'inside trigger');
    document.getElementById("valueInput" + index).click();
  }

  public onSelect(conditionVal, conditionId, item) {
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

  public deleteCondition() {
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

  public getTables() {  
    return this.selectedTables.map(element => {
      // return {'name' : element['table']['select_table_name'],'id': element['table']['select_table_id']};
      return {
        'name' : element['table']['select_table_name'],
        'id': element['table']['select_table_id'],
        'alias': element['select_table_alias']
      };
    });
  }

  public onTableSelection(selected){
    let temp = this.selectedTables.find(table => parseInt(selected['value']) === table['table']['select_table_id']);

    this.tableId = parseInt(selected['value']);
    // this.tableName = temp['table']['select_table_name'];
    this.tableName = temp['select_table_alias'];

    this.columns.push(...temp['columns'])
    // this.columns = this.getColumns();
    this.getExistingList(this.tableName);
    this.chips = [];
    this.columnName.setValue('');
    this.queryTextarea.setValue('');
  }



  public getColumns() {
    let columnData = [];

    let columnWithTable = this.selectedTables.map(element => {
      // columnData.push(element['table]['select_table_name']+ ''+ ...element['columns']);
        return element.columns.map(column => {
          return `${element['table']['select_table_name']}.${column}`
        });
    
      // `(${element.formula}) ${element.name}`
    });
    columnWithTable.forEach(data =>{
      columnData.push(...data);
    });
    
    return columnData;
  }

  // public getExistingList(name){
  //   this.addConditions.fetchCondition(name).subscribe(res => {
  //     this.existingList = res['data'];
  //     this.originalExisting = JSON.parse(JSON.stringify(this.existingList));
  //   });
  // }

  public inputValue(value){
    if((value || '').trim()){
      this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + ' ';
      });
      this.current = this.oldValue[this.oldValue.length-1];
      this.results =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
    }else{
      this.results = [{ groupName:'Functions',values:[]},{groupName: 'Columns',values:[]} ];
    }
  }

  private getSearchedInput(value: any) {
    let functionArr = [],columnList = [];
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
    return [{ groupName:'Functions',values:functionArr},{groupName: 'Columns',values:columnList} ];
  }

  public onSelectionChanged(event) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }
    let index = this.oldValue.length > 0?this.oldValue.length-1:0;
    if(this.isColumn(event.option.value))
      this.oldValue[index] = this.tableName+ '.' +event.option.value + '  ';
    else
      this.oldValue[index] = event.option.value + '  ';
    
    this.setTextareaValue(this.oldValue.join(' '));
    


    if(event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if(event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);

      // this.hasError();
      
      this.checkDuplicate(this.oldValue.join(' ').split(',').map(f => f.trim())[0],'formula');
  }

  private isColumn(item){
    return this.columns.map(col => col.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
  }

  private setSelectValue(value){
    this.queryField.setValue(value);
  }

  public hasError = () => {
    if (this.queryTextarea.value) {
      if(this.bracketStack['open'].length === this.bracketStack['close'].length){
        this.isError = false;
      }
      else{
        this.isError = true;
      }
    }
  };


  public toggle(item,event){
    if(event.checked){
      this.columnName.setValue(item.calculated_field_name);
      this.queryTextarea.setValue(item.calculated_field_formula);
      this.add();
    }else{
      let obj = {name: item.calculated_field_name.trim(),formula: item.calculated_field_formula.trim()};
      this.remove(obj);
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
    }
  }

  remove(tag) {
    const index = this.chips.findIndex(x => x.name === tag.name);
    if(tag.name === this.columnName.value){
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
    }
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }

  public add(){
    const input = this.columnName.value;
    const value = this.queryTextarea.value;

    if ((value || '').trim()) {
      this.chips.push({name: input.trim(),formula: value.trim()});
    }

    if (this.columnName.value) {
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
    }
  }

  public getSelected(chip){
     this.columnName.setValue(chip.name);
     this.queryTextarea.setValue(chip.formula);
  }

  public checkDuplicate(value,type) {

    if((value || '').trim()){
        let currentList = this.chips.filter((element, key) => {
            if(type === 'column'){
              return value.toLowerCase() === element['name'].toLowerCase();
            }else{
              return value.toLowerCase() === element['formula'].toLowerCase();
            }
        });
        let existingList = this.existingList.filter(element => {
          if(type === 'column'){
            return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
          }else{
            return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
          }
        });
    
        if (currentList.length > 0 || existingList.length > 0) {
          type === 'column'?this.columnName.setErrors({'incorrect': false}):this.queryTextarea.setErrors({'incorrect': false});
        } else {
          type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
        }
    
      }else
        type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
    
      }

      public next(){
        this.add();
        this.getFormatData();
        let formula = [];
        this.chips.forEach(element => {
          formula.push(`(${element.formula}) ${element.name}`);
        });
        this.sharedDataService.setFormula(['select','calculated'],formula);
        // let formulaList = [];
        let tableId = this.tableId;
        // formulaList.push({tableId:formula})

        let formulaList = {};
        formulaList[tableId] = formula;

        this.sharedDataService.setFormulaCalculatedData(formulaList);
        this.sharedDataService.setCalculatedData(this.getFormatData());
      }
  
      public getNewFields(){
        let newColumns = [];
        let existingList = this.existingList;
        this.chips.forEach(element => {
          let isExist = false;
          existingList.forEach(list => {
            if(element.name === list.calculated_field_name){
              isExist = true;
            }
          })
          if(!isExist)
            newColumns.push(element);
        });
        return newColumns;
      }

      private getField(type,newFeilds){

        let newArr = newFeilds.map(element => {
          if(type === 'name')
            return element.name;
          else
            return element.formula;
        });
        return newArr;
      }

  private getFormatData() {
    let newFeilds = this.getNewFields();
    let columns = this.columns;
    let obj = [];
    newFeilds.forEach(element=>{
      obj.push({
        'calculated_field_name' : element.name,
        'sl_table_id': [this.tableId],
        'columns_used_calculate_column': columns,
        'calculated_field_formula': element.formula,
        'applied_flag_calculate_column': true
      })
    })
    
    return obj;
  }

public deleteField(id){
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
