import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, AbstractControl } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { SharedDataService } from "../shared-data.service";
import { CreateCalculatedColumnService } from "./create-calculated-column.service";
import Utils from "../../../utils";
import { ToastrService } from "ngx-toastr";
import { ConstantService } from '../../constant.service';


@Component({
  selector: "app-create-calculated-column",
  templateUrl: "./create-calculated-column.component.html",
  styleUrls: ["./create-calculated-column.component.css"]
})
export class CreateCalculatedColumnComponent implements OnInit {

  public suggestionList: any[] = [];
  oldValue:any;
  // bracketStack:any = {
  //               'open' : [],
  //               'close' : []
  // };
  // tableId;
  selectedTables = [];
  // columnUsed =[];
  existingList:any[] = [];
  originalExisting:any[] = [];
  queryField: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl('',[this.duplicateTable.bind(this)]);
  columnName:  FormControl = new FormControl();
  private functions = [];
  public tables = [];
  public columns = [];
  public chips = [];
  // tableUsed = [];
  selectable = true;
  curentName:string = '';
  removable = true;
  confirmText:string = 'Are you sure you want to delete the existing calculated field?';
  confirmHeader:string = 'Delete existing calculated field';
  fieldId: number;
  lastWord = '';

  constructor( 
    private sharedDataService:SharedDataService,
    private calculatedColumnReportService:CreateCalculatedColumnService,
    private toasterService: ToastrService,
    private constantService: ConstantService
  ) {
      this.functions = this.constantService.getSqlFunctions('aggregations');
    }

  ngOnInit() {
    this.sharedDataService.getNextClicked().subscribe(isClicked => {
      let tableIds = this.tables.map(table =>{
                        return table.id
                      });
      this.getExistingList(tableIds);
    })

    this.sharedDataService.selectedTables.subscribe(tableList => {
      this.selectedTables = tableList
      this.tables = this.getTables();
      this.columns = this.getColumns();
      // let formulaCalculated = this.sharedDataService.getFormulaCalculatedData();
      this.removeDeletedTableData(this.sharedDataService.getFormulaCalculatedData());
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

    this.sharedDataService.resetQuerySeleted.subscribe(ele=>{
      this.chips = [];
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
      // this.tableUsed = [];
      // this.columnUsed = [];
      this.existingList = [];
    });

  }

  public removeDeletedTableData(data){
    let isChips = false;
    for(let key in data){
      if(!(this.selectedTables.find(table => 
        key.includes(table['table']['select_table_id'].toString())
      )))
      {
        delete data[key];
        this.queryTextarea.setValue('');
        this.columnName.setValue('');
      }
    }
    this.chips = [];
    for(let d in data){
      this.chips.push(...data[d]);
    }

    this.next();
  }

  public searchedExistingList(value:string){
    return this.originalExisting.filter(option =>
      option['calculated_field_name'].toLowerCase().includes(value.toLowerCase())
    )
  }

  public getTables() {  
    return this.selectedTables.map(element => {
      return {
        'name' : element['table']['select_table_name'],
        'id': element['table']['select_table_id'],
        'alias': element['select_table_alias']
      };
    });
  }

  public getColumns() {
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

  public getExistingList(id){
    let ids = {'table_ids':id}
    this.calculatedColumnReportService.getCalculatedFields(ids).subscribe(res => {
      this.existingList = res['data'];
      this.originalExisting = JSON.parse(JSON.stringify(this.existingList));
      this.existingList.forEach(element => {
        if((this.chips.find(chip => 
          chip['name'].toString().includes(element['calculated_field_name'])
        ))){
          element.checked = true;
        }
      })
    });
  }

  public inputValue(event, value){
    let query = <HTMLInputElement>document.getElementById('cccId');
    let i;
    for(i = query.selectionStart-1; i>=0;i--) {
      if(value[i] === ' ') {
        break;
      }
    }
    i++;
    const word = value.slice(i).split(" ")[0];

    if((word || '').trim()){
      this.checkIsExisting();
      this.lastWord = value;
      this.oldValue = word.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + ' ';
      });
      // this.current = this.oldValue[this.oldValue.length-1]
      this.suggestionList =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
    }else{
      this.suggestionList = [{ groupName:'Functions',values:[]},{groupName: 'Columns',values:[]} ];
    }

  }

  checkIsExisting() {
    let columnName = this.columnName.value;
    let ele = this.chips.filter(data => {
      if(columnName.toLowerCase() === data.name && data.isExist) {
        return data;
      }
    });
    if(ele.length) {
      this.columnName.setValue('');
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

    let query = <HTMLInputElement>document.getElementById('cccId');
    let i;
    let value = this.lastWord.split(" ");
    for ( i = 0;i < value.length;i++) {
      if(value[i] == this.oldValue) {
        value[i] = event.option.value + ' ';
        break;
      }
    }
    // let index = this.oldValue.length > 0?this.oldValue.length-1:0;

    // if(this.isColumn(event.option.value)){
    //   this.getDetails(event.option.value);
    // }

    //   this.oldValue[index] = event.option.value + '  ';
    
    this.setTextareaValue(value.join(' '));
    
    // if(event.option.value === '(')
    //   this.bracketStack['open'].push(event.option.value);
    // else if(event.option.value === ')')
    //   this.bracketStack['close'].push(event.option.value);
      // this.checkDuplicate(this.oldValue.join(' ').split(',').map(f => f.trim())[0],'formula');
  }

  public getDetails(event){
    // let ids = [];

    //   ids = this.tables.map(table => {
    //   if(event.split('.')[0] === table.alias)
    //   return table.id;
    // })
    // this.columnUsed.push(event.split('.')[1])
    // this.tableUsed.push(...ids);
    // let unique = [...new Set(this.tableUsed)];
    // this.columnUsed = [...new Set(this.columnUsed)]
    // unique = unique.filter(element => {
    //   return element !== undefined 
    // });
    // this.tableUsed = unique;
     let tId, cId;
     tId = this.tables.map(table => {
            if(event.split('.')[0] === table.alias)
              return table.id;
            });
      cId = event.split('.')[1];
      return {'table': tId, 'column': cId}
  }

  private isColumn(item){
    return this.columns.map(col => col.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
  }

  public toggle(item,event){
    if(event.checked){
      this.columnName.setValue(item.calculated_field_name);
      this.queryTextarea.setValue(item.calculated_field_formula);
      // this.tableUsed = item.table_list
      // this.columnUsed = item.column_used;
      this.add(true);
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
    this.next();
  }

  checkDuplicateChip(input) {
    let isChipDuplicate = false;
    this.chips.forEach(data => {
      if(data['name'].toLowerCase() === input.toLowerCase()) {
        isChipDuplicate = true;
      }
    })
    return isChipDuplicate;
  }

  getTableUsed(value) {
    let ids,tableUsed = [],columnUsed = [];
    let values = value.split(" ");
    for(let i =0; i< values.length;i++) {
      if(values[i].trim() && this.isColumn(values[i].trim())){
       ids = this.getDetails(values[i]);
       tableUsed.push(...ids['table']);
       columnUsed.push(ids['column']);
      }
    }
    return {'table': tableUsed , 'column': columnUsed}
  }

  public add(isExist = false){
    const input = this.columnName.value ? this.columnName.value : '';
    const value = this.queryTextarea.value;
    let usedDetails= this.getTableUsed(value);

    if ((value || '').trim()) {    
      if(this.checkDuplicateChip(input)){
      //  let tableUsed =  this.tableUsed;
      //  let columnUsed = this.columnUsed
        this.chips.forEach(chip => {
          if(chip['name'].toLowerCase() === input.toLowerCase()){
            {
              chip['name'] = input.trim(),
              chip['formula']  = value.trim(),
              chip['tableUsed'] = usedDetails['table'].length ? new Set(usedDetails['table']): [],
              chip['columnUsed'] = usedDetails['column'].length ? new Set(usedDetails['column']) : []
          }
        }
        })
      }else{
        this.chips.push(
          {
            name: (input ? input.trim(): ''),
            formula: value.trim(),
            tableUsed: usedDetails['table'].length ? new Set(usedDetails['table']): [],
            columnUsed: usedDetails['column'].length ? new Set(usedDetails['column']) : [],
            id: 0,
            isExist : isExist
          }
        );
      }
      
    }
      this.columnName.setValue('');
      this.queryTextarea.setValue(' ');
      // this.tableUsed = [];
      // this.columnUsed = [];
  }

  public getSelected(chip){
    this.curentName = chip.name;
    this.columnName.setValue(chip.name);
    this.queryTextarea.setValue(chip.formula);
  }

  public checkDuplicate(value,type) {

    if((value || '').trim() && this.curentName !== value){
        let currentList = this.chips.filter((element, key) => {
            if(type === 'column'){
              return value.trim().toLowerCase() === element['name'].trim().toLowerCase();
            }else{
              return  (value.trim().toLowerCase() === element['formula'].trim().toLowerCase()  && this.curentName.trim().toLowerCase() !== element['name'].trim().toLowerCase());
            }
        });
        let existingList = this.existingList.filter(element => {
          if(type === 'column'){
            return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
          }else{
            return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
          }
        });
    
        let tableList = this.tables.filter(element => {
          if(type === 'column'){
            return value.toLowerCase() === element['name'].toLowerCase();
          }
        });

        let columnList = this.columns.filter(element => {
          if(type === 'column'){
            return value.toLowerCase() === element.split('.')[1].toLowerCase();
          }
        });

        if (currentList.length > 0 || existingList.length > 0 || tableList.length > 0 || columnList.length > 0) {
          if(type === 'column') {
            this.columnName.setErrors({'incorrect': false});
          }else {
            // this.queryTextarea.setErrors({'incorrect': false});
            return true;
          };
        } else {
          if(type === 'column') {
            this.columnName.setErrors(null)
          }else {
            // this.queryTextarea.setErrors(null);
            return false;
          }
        }
    
      }else
        if(type === 'column') {
          this.columnName.setErrors(null)
        } else {
          return false;
        }
    
      }

      public next(){
        this.add();
        let formula = [];
        console.log(this.chips,'chips')
        this.chips.forEach(element => {
          formula.push(`${element.formula} ${element.name}`);          
        });
        this.sharedDataService.setFormula(['select','calculated'],formula);
        // let tableId = this.tableId;

        // let formulaList = {};
        // formulaList[tableId] = formula;

        let keyChips = this.getKeyWise()
        
        this.sharedDataService.setFormulaCalculatedData(keyChips);
        this.sharedDataService.setCalculatedData(this.getFormatData());
        $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")
      }

      private getKeyWise(){
         return this.chips.reduce(function(rv, x){
           (rv[x['tableUsed']] = rv[x['tableUsed']] || []).push(x);
           return rv;
         }, {});

      };
  
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

  private getFormatData() {
    let newFeilds = this.getNewFields();

    let columns = this.columns;
    let obj = [];
    newFeilds.forEach(element=>{
      obj.push({
        'calculated_field_id': element.id,
        'calculated_field_name' : element.name,
        'sl_table_id': element.tableUsed,
        'columns_used_calculate_column': element.columnUsed,
        'calculated_field_formula': element.formula,
        'applied_flag_calculate_column': true
      })
    })

    if(this.chips){
      obj.push(...this.sharedDataService.getExistingColumns());
    }
    
    return obj;
  }

  public deleteField(id){
    Utils.showSpinner();
    this.calculatedColumnReportService.deleteField(id).subscribe(response => {
      this.toasterService.success(response['detail'])
      Utils.hideSpinner();
      Utils.closeModals();
      let tableIds = this.tables.map(table =>{
        return table.id
    });
      this.getExistingList(tableIds);
    }, error => {
      this.toasterService.error(error.message['error']);
      Utils.hideSpinner();
    });
  }

  duplicateTable(control: AbstractControl): {[key: string]: boolean} | null {
    let value = control.value;
    if((value || '').trim()){  // && this.curentName !== value
      if (this.checkDuplicate(value,'formula') ) {
        // if(!this.allowMultiColumn)
        this.queryTextarea.setErrors({'incorrect': false});
          return {'dupName': true};
      } else {
        this.queryTextarea.setErrors(null);
        return null;
      }
    }
    return {'dupName': null};
  }

}