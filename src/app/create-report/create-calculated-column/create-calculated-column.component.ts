import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { sqlFunctions } from "../../../constants";
import { SharedDataService } from "../shared-data.service";
import { CreateCalculatedColumnService } from "./create-calculated-column.service";
import Utils from "../../../utils";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-calculated-column",
  templateUrl: "./create-calculated-column.component.html",
  styleUrls: ["./create-calculated-column.component.css"]
})
export class CreateCalculatedColumnComponent implements OnInit {
  results: any[] = [];
  oldValue:any;
  bracketStack:any = {
                'open' : [],
                'close' : []
  };
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
  public tables = [];
  confirmText = '';
  public columns = [];
  public chips = [];
  visible = true;
  selectable = true;
  removable = true;
  

  constructor( private sharedDataService:SharedDataService,
              private calculatedColumnReportService:CreateCalculatedColumnService,
              private toasterService: ToastrService
            ) {}

  ngOnInit() {
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
      let id = table['table']['sl_tables_id'];
      for(let key in data){
        if(key === id){
          delete data[key];
          this.queryTextarea.setValue('');
          this.columnName.setValue('');
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

  public getTables() {  
    return this.selectedTables.map(element => {
      return {'name' : element['table']['mapped_table_name'],'id': element['table']['sl_tables_id']};
    });
  }

  public onTableSelection(selected){
    let temp = this.selectedTables.find(table => parseInt(selected['value']) === table['table']['sl_tables_id']);

    this.tableId = parseInt(selected['value']);
    this.tableName = temp['table']['mapped_table_name'];

    this.columns.push(...temp['columns'])
    this.getExistingList(this.tableId);
    this.chips = [];
    this.columnName.setValue('');
    this.queryTextarea.setValue('');
  }

  public getExistingList(id){
    this.calculatedColumnReportService.getCalculatedFields(id,'table').subscribe(res => {
      this.existingList = res['data'];
      this.originalExisting = JSON.parse(JSON.stringify(this.existingList));
    });
  }

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
    
    this.setTextareaValue(this.oldValue.join(' ').split(',').map(f => f)[0]);
    


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
    let newFeilds = this.getNewFields()
    let obj = {
      'calculated_field_name': this.getField('name',newFeilds),
      'sl_table_id': this.tableId,
      'columns_used_calculate_column': this.columns,
      'calculated_field_formula': this.getField('formula',newFeilds),
      'applied_flag_calculate_column': true
    }
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
      this.calculatedColumnReportService.deleteField(id).subscribe(response => {
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
