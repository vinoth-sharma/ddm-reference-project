import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { SharedDataService } from '../shared-data.service';
import { SelectTablesService } from '../select-tables/select-tables.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';
import { constants_value } from '../../constants';

@Component({
  selector: 'app-select-tables',
  templateUrl: './select-tables.component.html',
  styleUrls: ['./select-tables.component.css']
})

export class SelectTablesComponent implements OnInit{

  @Output() enablePreview = new EventEmitter();
  @Input() fromType: string;
  public tables = {};
  public selectedTables = [];
  public isRelated: boolean = false;
  public relatedTableId: number;
  public invalid;
  // joinData = {};
  public showKeys = {};
  public operations = ['=', '!='];
  public joinTypes = ['Left Outer', 'Right Outer', 'Full Outer', 'Inner', 'Cross']; 
  public defaultError: string = 'There seems to be an error. Please try again later.';
  public errData: boolean;
  public schema:string;
  public relatedTableData:any;
  public isLoadingRelated:boolean = false;
  public isDiffKeys: boolean = false;
  public tableSearch:string = '';
  public columnSearch:string = '';
  public primarySearch:string = '';
  public foreignSearch:string = '';
  public selectTables: boolean = false;
  public Originaltables:any = [];
  public selectedTablesInitial : any;
  public noEntriesFoundTable:boolean = true;
  public noEntriesFoundColumn: boolean = true;
  @Output() isValidTables = new EventEmitter();
  public columnNames = [];

  constructor(
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private toasterService: NgToasterComponent,
    private selectTablesService: SelectTablesService,
    private sharedDataService: SharedDataService, 
    private router: Router,
    private  authenticationService:AuthenticationService
  ) { }

  ngOnInit() {
    this.schema = this.authenticationService.getSchema();
    // to get list of selected tables
    this.sharedDataService.selectedTables.subscribe(tables => {
      if (tables) {
        let selectedValues;
        this.selectedTables = tables;
      }
    });
    this.resetState(); // to reset or initialize the state of selected tables
    if (this.selectedTables.length == 1) {
      this.getFavoriteSortedTables('custom tables');
      // this.getFavoriteSortedTables('related tables');
      this.getFavoriteSortedTables('tables');
    }
    this.sharedDataService.resetQuerySeleted
    .subscribe(ele=> this.resetData() );
  }
  
  public getFavoriteSortedTables(value) {
    if (this.selectedTables.length) {
      let finalFavNonFavTables = [];
      let differeniator = value;
      let lengthValue = this.selectedTables.length;
      let selectedValues = this.selectedTables[lengthValue - 1].tables[differeniator]
      // let selectedValues = this.selectedTables[0].tables[differeniator]
      let duplicateValues = [...selectedValues];
      if (selectedValues) { // if selcted values?
        selectedValues = Array.isArray(selectedValues) ? selectedValues : [];
        // let originalTables = JSON.parse(JSON.stringify(selectedValues));
        let selector;
        if (value == 'tables')
          selector = 'mapped_table_name';
        else if (value == 'custom tables')
          selector = 'custom_table_name';
        // else if(value == 'related tables'){
        //   selector = 'relationship_name';
        // }
        selectedValues.sort(function (a, b) {
          a = a[selector].toLowerCase();
          b = b[selector].toLowerCase();
          return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
        let favTab = selectedValues.filter(i => i.is_favourite)
        let favTabSorted = favTab.sort(function (a, b) {
          a = a[selector].toLowerCase();
          b = b[selector].toLowerCase();
          return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
        let nonFavTab = selectedValues.filter(i => i.is_favourite === false)
        let nonFavTabSorted = nonFavTab.sort(function (a, b) {
          a = a[selector].toLowerCase();
          b = b[selector].toLowerCase();
          return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
        let favTabSortedCopy = favTabSorted;
        Array.prototype.push.apply(favTabSortedCopy, nonFavTabSorted);
        let finalFavNonFavTables = favTabSortedCopy;
        if (value == 'tables') {
          this.selectedTables[lengthValue - 1].tables['tables'] = favTabSortedCopy;
        }
        else if (value == 'custom tables') {
          this.selectedTables[lengthValue - 1].tables['custom tables'] = favTabSortedCopy;
        }
        // else if(value == 'custom tables'){
        //   this.selectedTables[0].tables['related tables'] = favTabSortedCopy
        // }
        this.selectedTablesInitial = this.selectedTables;
      }
    }
    else {
      // do nothing
    }
  }

  public resetData(){
    this.selectedTables = []
    this.resetState();
  }

  // 
  public getTables() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables['tables'] = (tables && tables.filter(t => t['view_to_admins']));
      if (this.tables['tables'])
        this.tables['tables'] = this.tables['tables'].map(element => {
          element.column_properties = element.column_properties.filter(data => {
            return data.column_view_to_admins;
          })
          return element;
        })
      // this.updateTables(this.tables , 'table');
      this.checkErr();
    })
    this.updateTables(this.tables, 'table');
    this.objectExplorerSidebarService.getCustomTables.subscribe(customTables => {
      this.tables['custom tables'] = customTables || [];
      // this.tables['custom tables'] = (customTables && customTables.filter(i=>i.column_properties.filter(t=>t['column_view_to_admins']))); 
      this.tables['custom tables'] = (customTables && customTables.filter(t => t['view_to_admins']));
      this.tables['custom tables'] = this.tables['custom tables'].map(element => {
        element.column_properties = element.column_properties.filter(data => {
          return data.column_view_to_admins;
        })
        return element;
      });
      this.updateTables(this.tables, 'custom table');
    });
    this.tables['related tables'] = [];
    this.Originaltables = JSON.parse(JSON.stringify(this.tables));
    this.sharedDataService.setTablesDataFromSideBar(this.Originaltables)
  }

  public updateTables(data, type) {
    this.selectedTables.forEach(element => {
      if (type === 'table') {
        element.tables['tables'] = data['tables'];
      } else {
        element.tables['custom tables'] = data['custom tables'];
      }
    });
    this.Originaltables = JSON.parse(JSON.stringify(data));
    // resetting the groupBy values
    this.sharedDataService.setFormula(['groupBy'], "")
  }

  public checkErr() {
    if (!this.selectedTables.length) {
      this.router.config.forEach(element => {
        if (element.path == "semantic") {
          if (element.data["semantic_id"]) {
            this.errData = false;
          } else {
            this.errData = true;
          }
        }
      });
    } else {
      this.errData = false;
    }
  }

  // add new row for selected custom table and selected column name
  public addRow(index?: number) {
    this.selectedTables.push({
      'tables': {
        'related tables': [],
        'tables': this.tables['tables'],
        'custom tables': this.tables['custom tables']
      }
    });
    this.disableFields();
    this.filterTable('', this.selectedTables.length - 1);
  }

  public setRelated() {
    let lastSelectedTableId = this.selectedTables[this.selectedTables.length - 1]['table']['sl_tables_id'];
    this.isRelated = lastSelectedTableId && this.relatedTableId && (lastSelectedTableId === this.relatedTableId);
  }

  public selectAll(event: any, selected: any) {
    // Check if the 'All' option is active
    if (event.source.options.first.active) {
      // Check if "All" option is selected
      if (event.source.options.first.selected) {
        // Get all the options in the dropdown and map their values to the corresponding dropdown model
        selected['columns'] = event.source.options._results.map(o => {
          return o.value;
        });
      } else {
        // Unselect all the options by setting the dropdown model to empty array
        selected['columns'] = [];
      }
    } else {
      // Check length of selected options
      if (event.value.length === event.source.options._results.length - 1) {
        // Check if first option is not selected
        if (!event.source.options.first.selected) {
          // Get all the options in the dropdown and map their values to the corresponding dropdown model
          selected['columns'] = event.source.options._results.map(o => {
            return o.value;
          });
        } else {
          // Remove the unselected option from the dropdown model
          selected['columns'] = selected['columns'].filter(e => e !== event.source.options.first.value)
        }
      }
    }
  }

  public onTableColumnSelect(event: any, selected: any, tableIndex?: number) {
    // this.setRelated();
    this.updateSelectedTables();
    this.selectAll(event, selected);  
    let isRelatedSelected = 
        this.selectedTables.some(table => table['table'] && table['table']['mapped_table_id']);
  }

  public disableFields() {
    if (this.selectedTables.length) {
      if (this.selectedTables.length > 1) {
        this.selectedTables.forEach(table => table.disabled = true);
      }
      this.selectedTables[this.selectedTables.length - 1].disabled = false;
    }
  }

  public isCustomTable(selected: any) {
    return selected.tableId &&
    selected['tables']['custom tables'].map(table => table['custom_table_id']).includes(selected.tableId);
  }

  public isRelatedTable(selected: any) {
    return selected.tableId && selected['tables']['related tables'] && selected['tables']['related tables'].length &&
    selected['tables']['related tables'].map(table => table['mapped_table_id']).includes(selected.tableId);
  }

  public resetSelected(selected: any) {
    // reset columns and join on change of table selection
    selected.columns = [];
    selected.columnAlias = {};
    selected.join = '';
    selected.keys = [];
    selected.originalColumns = selected['table']['column_properties'].slice();
    this.addKey(selected);
  }

  public setSelectedTable(selected: any, index: number, event:any) {
    setTimeout(()=>
    {
      if(event.source.selected._mostRecentViewValue.length > 30) 
          event.source.selected._mostRecentViewValue = 
            event.source.selected._mostRecentViewValue.substring(0, 30) + '...';
    } ,0 );
    selected['tableId'] =  typeof selected.tableId === 'string' ? Number(selected.tableId.split('_')[0]) : selected.tableId;
    // if table is a related table
    if (this.isRelatedTable(selected) && event.source.selected.group.label === 'Related Tables')
      selected['table'] = selected['tables']['related tables'].find(table => selected['tableId'] === table['mapped_table_id']);
    // if table is a custom table
    else if (this.isCustomTable(selected) && event.source.selected.group.label === 'Custom Tables')
      selected['table'] = selected['tables']['custom tables'].find(table => selected['tableId'] === table['custom_table_id']);
    else if(event.source.selected.group.label === 'Tables')
      selected['table'] = selected['tables']['tables'].find(table => selected['tableId'] === table['sl_tables_id']);
    selected['tableType'] = event.source.selected.group.label;
    this.getRelatedTables(selected, index);
      // this.multiSelectColumnsCollector(index);
    selected['columnsForMultiSelect'] = selected.table.column_properties.map(ele=>ele.column)
      // this.filterTable('');
  }

  // to get the list of unique realtion table data
  public getUniqueRelatedTables(tables: any[]) {
    let relatedTables = [];
    for (let i = 0; i < tables.length; i++) {
      if (!relatedTables.map(t => t['mapped_table_name']).includes(tables[i]['mapped_table_name'])) {
        relatedTables.push(tables[i]);
      }
    }
    return relatedTables;
  }

  // get the list of relationships_list table data
  public getRelatedTables(selected: any, index?:number) {
    let isRelatedSelected = this.selectedTables.some(table => table['table'] && table['table']['mapped_table_id']);
    // let isRelatedSelected = this.selectedTables.some(table => table['tables'] && table['tables']['related tables']['mapped_table_id']);
    this.resetSelected(selected);
    // this.updateSelectedTables();
    if(isRelatedSelected && index === 1) {
      this.updateSelectedTables();
      this.setJoinData(selected,this.selectedTables.length-1);
      // this.selectedTables[this.selectedTables.length-1].join = selected['table']['join_type'];
      selected.join = selected['table']['join_type'];
      // this.selectedTables[this.selectedTables.length-1]['keys'][0]['foreignKeyName'] = selected['table']['foreign_key'];
      // this.selectedTables[this.selectedTables.length-1]['keys'][0]['primaryKeyName'] = selected['table']['primary_key'];
      // this.selectedTables[this.selectedTables.length-1]['keys'][0]['operation'] = '=';
      // this.selectedTables[this.selectedTables.length-1]['keys'][0]['primaryKey'] = selected['joinData']['table1']['columns'].find(item => item['column'] === this.selectedTables[this.selectedTables.length-1]['keys'][0]['primaryKeyName']);;
      // this.selectedTables[this.selectedTables.length-1]['keys'][0]['foreignKey'] = selected['joinData']['table2']['columns'].find(item => item['column'] === this.selectedTables[this.selectedTables.length-1]['keys'][0]['foreignKeyName']);
      selected['table']['relationships_list'].forEach((element,index) => {
        selected['keys'][index]['primaryKeyName'] = element['primary_key'];
        selected['keys'][index]['foreignKeyName'] = element['foreign_key'];
        selected['keys'][index]['operation'] = '=';
        selected['keys'][index]['primaryKey'] = selected['joinData']['table1']['columns'].find(item => item['column'] === element['primary_key']);
        selected['keys'][index]['foreignKey'] = selected['joinData']['table2']['columns'].find(item => item['column'] === element['foreign_key']);
        if(index + 1 !== selected['table']['relationships_list'].length) {
          this.addKey(selected);
        }
      });
    }
    // checks if not related or custom table
    if (this.isRelated || this.isCustomTable(selected) || isRelatedSelected || index !== 0) return;
    // fetch related tables only if it is a table and not a related or custom table
  }

  public deleteRow(index: number) {
    this.selectedTables.splice(index, 1);
    this.updateSelectedTables();
    this.showKeys[index] = false;
    if (!this.selectedTables.length) { 
      this.resetState();
      this.sharedDataService.setFormula(['select', 'tables'], []);
      this.sharedDataService.setFormula(['from'], '');
      this.sharedDataService.setFormula(['joins'], []);
    }
  }

  public resetState() {
    // this.joinData = {};
    this.getTables();
    this.updateSelectedTables();
    if (!this.selectedTables.length) this.addRow();
  }

  // getTableAlias(tableName: string, index?: number) {
  //   return `A_${tableName.substring(0, 3)}_${index}`;
  // }

  public getTableAlias(obj){
    if(obj.tableType === "Custom Tables")
      return `C_${obj.tableId}`;
    else
      return `T_${obj.tableId}`;
   }

   public updateSelectedTables() {
    let isDiffKeyFound:boolean = false;
    this.selectedTables.forEach((item, index) => {
      let tableName = item['table']['custom_table_name'] || item['table']['mapped_table_name'];
      item.table.select_table_name = tableName,
      // TODO: remove and use item.tableId
      item.table.select_table_id = item['table']['custom_table_id'] || item['table']['sl_tables_id'] || item['table']['mapped_table_id'],
      item.select_table_alias = this.getTableAlias(item);
      // if (item['keys'][0].primaryKey && item['keys'][0].foreignKey &&
      //   item['keys'][0].primaryKey['data_type'] !== item['keys'][0].foreignKey['data_type']) {
      //    isDiffKeyFound = true;
      // }
      item['keys'].forEach(element => {
        if (element.primaryKey && element.foreignKey &&
          element.primaryKey['data_type'] !== element.foreignKey['data_type']) {
         isDiffKeyFound = true;
        }
      });
    });
    if(isDiffKeyFound) {
      this.isDiffKeys = true;
    }else {
      this.isDiffKeys = false;
    }
    this.sharedDataService.setSelectedTables(this.selectedTables);
    this.disableFields();
  }

  public setJoinData(selected: any, index: number) {
    // selected.keys = [];
    // selected.keys.push({
    //   primaryKey: '', 
    //   operation: '',
    //   foreignKey: ''
    // }); 
    this.updateSelectedTables();
    // no keys required for cross join
    if (this.selectedTables[index].join && this.selectedTables[index].join === 'cross') {
      this.showKeys[index] = false;
      return;
    }   
    this.showKeys[index] = true;
    let table1 = {
      table_id: '',
      columns: []
    }
    let table2 = {
      table_id: '',
      columns: []
    }
    let lastTable = this.selectedTables[this.selectedTables.length - 1];
    let cols = JSON.parse(JSON.stringify(lastTable['table']['column_properties'])).map(col => Object.assign(col, { table_name: lastTable['select_table_alias'] }));
    table2['table_id'] = lastTable['table']['select_table_id'];
    table2['columns'] = cols;
    if (index > 1) {
      for (let i = this.selectedTables.length - 2; i >= 0; i--) {
        let cols = JSON.parse(JSON.stringify(this.selectedTables[i]['table']['column_properties'])).map(col => Object.assign(col, { table_name: this.selectedTables[i]['select_table_alias'] }));
        table1['columns'].push(...cols);
        table1['table_id'] = '';
      }
    }
    // else {    
    else if (index > 0) {
      let cols = JSON.parse(JSON.stringify(this.selectedTables[0]['table']['column_properties'])).map(col => Object.assign(col, { table_name: this.selectedTables[0]['select_table_alias'] }));
      table1['table_id'] = this.selectedTables[0]['table']['select_table_id'];
      table1['columns'] = cols;
    }
    // this.joinData[index] = {
    //   table1,
    //   table2
    // }
    selected['originalJoinData'] = JSON.parse(JSON.stringify({
      table1,
      table2
    }));
    selected['joinData'] = {
      table1,
      table2
    }
  }

  public createFormula() {
    // this.setRelated();
    this.updateSelectedTables();
    this.enablePreview.emit(true);
    this.sharedDataService.setNextClicked(true);        // after clicking on next call api to get existing columns
    this.doColumnAliasSpaceValidation();
    // select query for more than one table
    if (this.selectedTables.length >= 2) {
      let columns = [];
      let joins = [];
      let table1: string = '';
      // if (this.isCustomTable(this.selectedTables[0])) {
      //   table1 = `(${this.selectedTables[0].table['custom_table_query']}) ${this.selectedTables[0]['select_table_alias']}`;
      // }
      // else {
      //   table1 = `${this.schema}.${this.selectedTables[0]['table']['mapped_table_name']} ${this.selectedTables[0]['select_table_alias']}`;
      // }
      for (let i = 0; i < this.selectedTables.length; i++) {
        let tableName = this.selectedTables[i]['select_table_alias'];
        let table = this.selectedTables[i];
        let cols = [];
           // remove 'all', if selected['columns'] has 'all'
          //  if (this.selectedTables[i].columns.includes('all')) {
          //   cols = this.selectedTables[i].columns.slice(1).map(col => (`${tableName}.${col} ${ this.columnAliasSpaceQuoter(this.selectedTables[i]['columnAlias'][col]) ? `${ this.columnAliasSpaceQuoter(this.selectedTables[i]['columnAlias'][col])}`:''}`));
          // }
          // else {
            cols = this.selectedTables[i].columns.map(col => 
              (`${tableName}.${col} ${ this.selectedTables[i]['columnAlias'][col] ? `${ this.selectedTables[i]['columnAlias'][col] }`:''}`)
            );
          // }
        columns.push(...cols);
      }
      // for (let j = 1; j < this.selectedTables.length; j++) {
      for (let j = 0; j < this.selectedTables.length; j++) {
        let tableName: string;
        // if (this.selectedTables[j]['keys'] && this.selectedTables[j]['keys'].length) {
        if (this.selectedTables[j].join && this.selectedTables[j]['keys'] && this.selectedTables[j]['keys'].length) {
          let keys = this.selectedTables[j]['keys'].map((key, index, array) => {
            return `${key.primaryKey['table_name']}.${key.primaryKey['column']} ${key.operation} ${key.foreignKey['table_name']}.${key.foreignKey['column']} ${key.operator ? key.operator : ''} ${index ===  array.length-1 ? '' : 'AND'}`
          });
          if (this.isCustomTable(this.selectedTables[j])) {
            tableName = `(${this.selectedTables[j].table['custom_table_query']}) ${this.selectedTables[j]['select_table_alias']}`;
          }
          else {
            tableName = `${this.schema}.${this.selectedTables[j]['table']['mapped_table_name']} ${this.selectedTables[j]['select_table_alias']}`;
          }
          let joinString;
          if (this.selectedTables[j]['join'] === 'cross') {
            joinString = `${this.selectedTables[j]['join'].toUpperCase()} JOIN ${tableName}`;
          }
          else {
            joinString = `${this.selectedTables[j]['join'].toUpperCase()} JOIN ${tableName} ON ${keys.map(k => k.trim()).join(' ')}`;
            // this.selectedTables[j]['keys']
            // joinString = `${this.selectedTables[j]['join'].toUpperCase()} JOIN ${tableName} ON ${this.selectedTables[j]['keys'].join(' ')}`;
          }
          joins.push(joinString);
        } else {
          if (this.isCustomTable(this.selectedTables[j])) {
            table1 = table1 + ` ${table1 === '' ? '( ' : ', ('}${this.selectedTables[j].table['custom_table_query']} ) ${this.selectedTables[j]['select_table_alias']}`;
          }
          else {
            table1 = table1 + `${table1 === '' ? '' : ', '}${this.schema}.${this.selectedTables[j]['table']['mapped_table_name']} ${this.selectedTables[j]['select_table_alias']}`;
          }
        }
      }
      // formula = `SELECT ${columns} FROM ${table1} ${joins}`;
      let currentState = this.sharedDataService.getFormulaObject();
      if(currentState.select.calculated  && currentState.select.calculated.length){
        let calcs = currentState.select.calculated;
        let columnsCopy = [...columns]
        this.sharedDataService.setFormula(['select', 'tables'], columns)
        this.sharedDataService.setFormula(['groupBy'], columnsCopy);
        // calcs.forEach(i=>columns.push(i))
        // this.sharedDataService.setFormula(['select', 'tables'], columns)
      }
      else{
        this.sharedDataService.setFormula(['select', 'tables'], columns)
      }
      //check for calculated columns object, if it exists,then do the abov set formula again,push the calc here
      this.sharedDataService.setFormula(['from'], table1);
      this.sharedDataService.setFormula(['joins'], joins);
      return;
    }

    // select query for 1 table
    if (this.selectedTables.length >= 1 ) {
      let table1: string;
      let columns = [];
      // remove 'all', if selected['columns'] has 'all'
      // if (this.selectedTables[0].columns.includes('all')) {
      //   columns = this.selectedTables[0].columns.slice(1).map(col => `${this.selectedTables[0]['select_table_alias']}.${col} ${ this.columnAliasSpaceQuoter( this.selectedTables[0]['columnAlias'][col]) ? `${ this.columnAliasSpaceQuoter(this.selectedTables[0]['columnAlias'][col])}`:''}`);
      // }
      // else {
        columns = this.selectedTables[0].columns.map(col => `${this.selectedTables[0]['select_table_alias']}.${col} ${ this.selectedTables[0]['columnAlias'][col] ? `${ this.selectedTables[0]['columnAlias'][col] }`:''}`);
      // }
      if (this.isCustomTable(this.selectedTables[0])) {
        table1 = `(${this.selectedTables[0].table['custom_table_query']}) ${this.selectedTables[0]['select_table_alias']}`;
      }
      else {
        table1 = `${this.schema}.${this.selectedTables[0]['table']['mapped_table_name']} ${this.selectedTables[0]['select_table_alias']}`;
      }
      // formula = `SELECT ${columns} FROM ${table1}`;
      this.sharedDataService.setFormula(['select', 'tables'], columns)
      this.sharedDataService.setFormula(['from'], table1);
      this.sharedDataService.setFormula(['joins'], []);
      $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")
    }
  }

  public addKey(selected: any) {
    selected.keys.push({
      primaryKey: '', 
      operation: '=',
      foreignKey: ''
    }); 
  }

  public setSelectedKey(selected: any, keyIndex: number,  rowIndex: number, primary?: boolean) {
    if (primary) {
      // selected['keys']['primaryKey'] = this.joinData[rowIndex]['table1']['columns'].find(item => item['column'] === selected['keys']['primaryKeyName']);
      selected['keys'][keyIndex]['primaryKey'] = selected['joinData']['table1']['columns'].find(item => item['column'] === selected['keys'][keyIndex]['primaryKeyName']);
    }
    else {
      selected['keys'][keyIndex]['foreignKey'] = selected['joinData']['table2']['columns'].find(item => item['column'] === selected['keys'][keyIndex]['foreignKeyName']);
    }
    // if (selected['keys'][keyIndex]['primaryKeyName'] && selected['keys'][keyIndex]['foreignKeyName'] && selected['keys'][keyIndex]['operation']) {
      if (selected['keys'][keyIndex]['primaryKeyName'] && selected['keys'][keyIndex]['foreignKeyName']) {
      this.validateKeySelection(selected, keyIndex, rowIndex);
    }
  }

  public validateKeySelection(selected: any, index:number, rowIndex?: number) {
    let currentKey = selected.keys[index];
    if (currentKey.primaryKey && currentKey.foreignKey &&
      currentKey.primaryKey['data_type'] !== currentKey.foreignKey['data_type']) {
      this.isDiffKeys = true;
      this.toasterService.error('Primary key and foreign key cannot be of different data types');
      return;
    }
    this.updateSelectedTables();
  }

  public onTableClick(event) {
    this.isLoadingRelated = true;
    this.selectTablesService.getRelatedTables(this.selectedTables[0]['tableId']).subscribe(response => {
    this.selectedTables[1].tables['related tables'] = response['data'];
    this.Originaltables['related tables'] = response['data'];
    let keyContent = this.selectedTables[1].tables['related tables'].map(data => {
        return data.relationships_list.map(ele => {
          return `Primary Key: ${ele.primary_key} 
Foreign Key: ${ele.foreign_key}
`
        })
    })
    this.selectedTables[1].tables['related tables'].forEach((element, key) => {
      element['content'] = `${keyContent[key].map(k => k)}`
    });
      this.isLoadingRelated = false;
      this.relatedTableId = this.selectedTables[1].tables['related tables'].length && this.selectedTables[0]['table']['sl_tables_id'];   
    }, error => {
      this.isLoadingRelated = false;
      this.toasterService.error(error.message["error"] || this.defaultError);
      // this.tables['related tables'] = [];
      this.selectedTables[1].tables['related tables'] = [];
    });
  }


  // to filter the respected table
  public filterTable(search,rowIndex) {
    if(!search) {
      this.selectedTables[rowIndex]['tables'] =  JSON.parse(JSON.stringify(this.Originaltables));
      // this.selectedTables[rowIndex]['tables'] =  JSON.parse(JSON.stringify(this.selectedTablesInitial));
      // this.getFavoriteSortedTables('related tables');
      this.getTables();
      this.getFavoriteSortedTables('custom tables');
      // this.getTables();
      this.getFavoriteSortedTables('tables');
      this.noEntriesFoundTable = true;
      return;
    }else {
      search = search.toLowerCase();
    }
    if((search == "") && (rowIndex == 0)) {
      return this.selectedTablesInitial;
    }
    if(!this.selectedTables[rowIndex]['tables']) {
      return;
    }
    let isDataAvailable = false;
      for (let key in this.selectedTables[rowIndex]['tables']) {
        this.selectedTables[rowIndex]['tables'][key] =  this.Originaltables[key].filter(table => 
          (table.relationship_name && table.relationship_name.toLowerCase() || table.custom_table_name && table.custom_table_name.toLowerCase() || table.mapped_table_name.toLowerCase()).indexOf(search.toLowerCase()) > -1
        )
        if( this.selectedTables[rowIndex]['tables'][key].length) {
          isDataAvailable = true;
        }
      }
      this.noEntriesFoundTable = isDataAvailable;
  }

  // to filter the respected column
  public filterColumn(search,rowIndex) {
    if(!this.selectedTables[rowIndex]['table']['column_properties']) {
      return;
    }
    if(!search) {
      this.selectedTables[rowIndex]['table']['column_properties'] =  JSON.parse(JSON.stringify(this.selectedTables[rowIndex]['originalColumns']));
      this.noEntriesFoundColumn = true;
      return;
    }else {
      search = search.toLowerCase();
    }
    this.selectedTables[rowIndex]['table']['column_properties'] = this.selectedTables[rowIndex]['originalColumns'].filter(
      column => column['column'].toLowerCase().indexOf(search) > -1
    )
    this.noEntriesFoundColumn = this.selectedTables[rowIndex]['table']['column_properties'].length ? true : false;
    if(this.selectedTables[rowIndex]['columns'][0] == 'all') {
      this.selectedTables[rowIndex]['columns'].shift();
    }
  }

  // to filter the respected key
  public filterKey(search, rowIndex, key) {
    if(key === 'primary') {
      if(!search) {
        this.selectedTables[rowIndex]['joinData']['table1']['columns'] =  
          JSON.parse(JSON.stringify(this.selectedTables[rowIndex]['originalJoinData']['table1']['columns']));
        return;
      }else {
        search = search.toLowerCase();
      }
      this.selectedTables[rowIndex]['joinData']['table1']['columns'] = 
        this.selectedTables[rowIndex]['originalJoinData']['table1']['columns'].filter(
        column => column['column'].toLowerCase().indexOf(search) > -1
      )
      this.noEntriesFoundColumn = this.selectedTables[rowIndex]['joinData']['table1']['columns'].length ? true : false;
    } else {
      if(!search) {
        this.selectedTables[rowIndex]['joinData']['table2']['columns'] =  
          JSON.parse(JSON.stringify(this.selectedTables[rowIndex]['originalJoinData']['table2']['columns']));
        return;
      }else {
        search = search.toLowerCase();
      }
      this.selectedTables[rowIndex]['joinData']['table2']['columns'] = 
        this.selectedTables[rowIndex]['originalJoinData']['table2']['columns'].filter(
        column => column['column'].toLowerCase().indexOf(search) > -1
      )
      this.noEntriesFoundColumn = this.selectedTables[rowIndex]['joinData']['table2']['columns'].length ? true : false;
    }
  }

  // delete the respected row of selected table 
  public deleteKey(selected:any, index:number) {
    selected.keys.splice(index, 1);
    this.updateSelectedTables();
  }

  // to get list of selected calculated column data
  public getCalculatedData() {
    let isValid = true;
    this.selectedTables.forEach(data => {
      if(!data['table']) {
        isValid = false;
      }
    })
    if(isValid) {
      this.updateSelectedTables();
      this.enablePreview.emit(this.selectedTables);
    }
  }

  
  // close the respected select option
  public isOpened(event,rowIndex,type) {
    if(type === 'table') {
      this.filterTable('',rowIndex);
      this.tableSearch = '';
    } else if( type === 'column') {
      this.filterColumn('',rowIndex);
      this.columnSearch = '';
    } else {
      this.filterKey('', rowIndex, type) 
      type === 'primary' ? this.primarySearch = '' : this.foreignSearch = '';
    }
  }

  // disableed select button selectedTableForm is invalid
  public isDisabled(form) {
    this.invalid = form;
    this.isValidTables.emit({'isValid': this.invalid || this.isDiffKeys});
    if(this.fromType === 'calculated-column' && !this.invalid) {
      // this.sharedDataService.isValidSelectedTable
      this.getCalculatedData();
    }
    return form;
  }

  // public multiSelectColumnsCollector(index){
  //   // return []
  //   return Object.keys(this.selectedTables[index]['table']?this.selectedTables[index]['table']:{}).length?this.selectedTables[index].table.column_properties.map(ele=>ele.column):[];
  // }

  public selectionDone(event,index){
    this.selectedTables[index].columnAlias = {};
    this.selectedTables[index].columns = [];
    let columns = Object.keys(event)
    columns.forEach(column=>{
      if(event[column].checked){
        this.selectedTables[index].columns.push(column);
        // event[column].aliasName = event[column].aliasName.trim()
        if(event[column].aliasName.length > 0)
        this.selectedTables[index].columnAlias[column] = event[column].aliasName;
        // this.columnAliasSpaceQuoter(event[column].aliasName)?JSON.stringify(event[column].aliasName):event[column].aliasName;
      }
    })
  }

  // to remove unwanted spaces while selecting alias name of column
  public doColumnAliasSpaceValidation(){
    this.selectedTables.forEach(row=>{
      let obj = row.columnAlias;
      let keys = Object.keys(obj);
      for(let i=0;i<keys.length;i++){
        obj[keys[i]] = this.spaceHandler(obj[keys[i]])
      }
      row.columnAlias = obj;
    })
  }

  // to remove unwantes space
  public spaceHandler(str){
    return str?str.trim().replace(/\s+/g," ").replace(/\s/g,constants_value.column_space_replace_value):"";
  }

  public resetCreateRelate(event) {
    this.selectTables = event;
  }

  // columnAliasSpaceQuoter(value){
  //   let val = value?value.trim():'';
  //   let regex = /\s/;
  //   if(regex.test(val))
  //     return JSON.stringify(value)
  //   else
  //    return val
  // }
}