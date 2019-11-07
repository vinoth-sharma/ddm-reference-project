import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { SharedDataService } from '../shared-data.service';
import { SelectTablesService } from '../select-tables/select-tables.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-select-tables',
  templateUrl: './select-tables.component.html',
  styleUrls: ['./select-tables.component.css']
})

export class SelectTablesComponent implements OnInit {

  @Output() enablePreview = new EventEmitter();
  @Input() fromType: string;

  tables = {};
  selectedTables = [];
  isRelated: boolean = false;
  relatedTableId: number;
  invalid;

  // joinData = {};
  showKeys = {};

  operations = ['=', '!='];
  joinTypes = ['Left Outer', 'Right Outer', 'Full Outer', 'Inner', 'Cross']; 
  defaultError: string = 'There seems to be an error. Please try again later.';
  errData: boolean;
  schema:string;
  relatedTableData:any;
  isLoadingRelated:boolean = false;
  isDiffKeys: boolean = false;
  tableSearch:string = '';
  columnSearch:string = '';
  primarySearch:string = '';
  foreignSearch:string = '';

  Originaltables:any = [];
  noEntriesFoundTable:boolean = true;
  noEntriesFoundColumn: boolean = true;
  @Output() isValidTables = new EventEmitter();

  constructor(
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private toasterService: ToastrService,
    private selectTablesService: SelectTablesService,
    private sharedDataService: SharedDataService, 
    private router: Router,
    private  authenticationService:AuthenticationService
  ) { }

  ngOnInit() {
    this.schema = this.authenticationService.getSchema();
    this.sharedDataService.selectedTables.subscribe(tables => {
      this.selectedTables = tables;
    });
    this.resetState();

    this.sharedDataService.resetQuerySeleted.subscribe(ele=>{
      this.resetData();
    })
  }
  resetData(){
    this.selectedTables = []
    this.resetState();
  }
  getTables() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables['tables'] = (tables && tables.filter(t => t['view_to_admins']));
      this.tables['tables'] = this.tables['tables'].map(element => {
        element.column_properties = element.column_properties.filter(data => {
          return data.column_view_to_admins;
        })
        return element;
      })
      this.updateTables(this.tables , 'table');
      this.checkErr();
    })

    this.objectExplorerSidebarService.getCustomTables.subscribe(customTables => {
      this.tables['custom tables'] = customTables || [];
      this.updateTables(this.tables , 'custom table');
    })

    this.tables['related tables'] = [];

    this.Originaltables = JSON.parse(JSON.stringify(this.tables));
  }

  updateTables(data, type) {
    this.selectedTables.forEach(element => {
      if (type === 'table') {
        element.tables['tables'] = data['tables'];
      } else {
        element.tables['custom tables'] = data['custom tables'];
      }
    });
    this.Originaltables = JSON.parse(JSON.stringify(data));
  }

  checkErr() {
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

  addRow(index?: number) {
    this.selectedTables.push({
      'tables': {
        'related tables': [],
        'tables': this.tables['tables'],
        'custom tables': this.tables['custom tables']
      }
    });
    this.disableFields();
    this.filterTable('',this.selectedTables.length - 1);
  }

  setRelated() {
    let lastSelectedTableId = this.selectedTables[this.selectedTables.length - 1]['table']['sl_tables_id'];
    this.isRelated = lastSelectedTableId && this.relatedTableId && (lastSelectedTableId === this.relatedTableId);
  }

  selectAll(event: any, selected: any) {
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

  onTableColumnSelect(event: any, selected: any, tableIndex?: number) {
    // this.setRelated();
    this.updateSelectedTables();

    this.selectAll(event, selected);  

    let isRelatedSelected = this.selectedTables.some(table => table['table'] && table['table']['mapped_table_id']);

  }

  disableFields() {
    if (this.selectedTables.length) {
      if (this.selectedTables.length > 1) {
        this.selectedTables.forEach(table => table.disabled = true);
      }
      this.selectedTables[this.selectedTables.length - 1].disabled = false;
    }
  }

  isCustomTable(selected: any) {
    return selected.tableId &&
    selected['tables']['custom tables'].map(table => table['custom_table_id']).includes(selected.tableId);
  }

  isRelatedTable(selected: any) {
    return selected.tableId && selected['tables']['related tables'] && selected['tables']['related tables'].length &&
    selected['tables']['related tables'].map(table => table['mapped_table_id']).includes(selected.tableId);
  }

  resetSelected(selected: any) {
    // reset columns and join on change of table selection
    
    selected.columns = [];
    selected.columnAlias = {};
    selected.join = '';
    selected.keys = [];
    selected.originalColumns = selected['table']['column_properties'].slice();

    this.addKey(selected);
    
  }

  setSelectedTable(selected: any, index: number, event:any) {
    selected['tableId'] =  typeof selected.tableId === 'string' ? Number(selected.tableId.split('_')[0]) : selected.tableId;

    // if table is a related table
    if (this.isRelatedTable(selected) && event.source.selected.group.label === 'Related Tables') {
      selected['table'] = selected['tables']['related tables'].find(table => selected['tableId'] === table['mapped_table_id']);
    }
    // if table is a custom table
    else if (this.isCustomTable(selected) && event.source.selected.group.label === 'Custom Tables') {
      selected['table'] = selected['tables']['custom tables'].find(table => selected['tableId'] === table['custom_table_id']);
    }
    else if(event.source.selected.group.label === 'Tables'){
      selected['table'] = selected['tables']['tables'].find(table => selected['tableId'] === table['sl_tables_id']);
    }

      this.getRelatedTables(selected, index);
      // this.multiSelectColumnsCollector(index);
    selected['columnsForMultiSelect'] = selected.table.column_properties.map(ele=>ele.column)
      // this.filterTable('');
      // console.log(this.selectedTables);
      
  }


  getUniqueRelatedTables(tables: any[]) {
    let relatedTables = [];

    for (let i = 0; i < tables.length; i++) {
      if (!relatedTables.map(t => t['mapped_table_name']).includes(tables[i]['mapped_table_name'])) {
        relatedTables.push(tables[i]);
      }
    }
    return relatedTables;
  }

  getRelatedTables(selected: any, index?:number) {
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

  deleteRow(index: number) {
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

  resetState() {
    // this.joinData = {};

    this.getTables();
    this.updateSelectedTables();

    if (!this.selectedTables.length) this.addRow();
  }

  getTableAlias(tableName: string, index?: number) {
    return `A_${tableName.substring(0, 3)}_${index}`;
  }

  updateSelectedTables() {
    let isDiffKeyFound:boolean = false;
    this.selectedTables.forEach((item, index) => {
      let tableName = item['table']['custom_table_name'] || item['table']['mapped_table_name'];

      item.table.select_table_name = tableName,
      // TODO: remove and use item.tableId
      item.table.select_table_id = item['table']['custom_table_id'] || item['table']['sl_tables_id'] || item['table']['mapped_table_id'],
      item.select_table_alias = this.getTableAlias(tableName, index);
      
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

  setJoinData(selected: any, index: number) {

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

  createFormula() {
    // this.setRelated();
    this.updateSelectedTables();
    this.enablePreview.emit(true);
    this.sharedDataService.setNextClicked(true);        // after clicking on next call api to get existing columns

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
           if (this.selectedTables[i].columns.includes('all')) {
            cols = this.selectedTables[i].columns.slice(1).map(col => (`${tableName}.${col} ${this.selectedTables[i]['columnAlias'][col] ? `${this.selectedTables[i]['columnAlias'][col]}`:''}`).trim());
          }
          else {
            cols = this.selectedTables[i].columns.map(col => 
              (`${tableName}.${col} ${this.selectedTables[i]['columnAlias'][col] ? `${this.selectedTables[i]['columnAlias'][col]}`:''}`).trim()
            );
          }

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
            table1 = table1 + `(${table1 === '' ? '' : ', '}${this.selectedTables[j].table['custom_table_query']}) ${this.selectedTables[j]['select_table_alias']}`;
          }
          else {
            table1 = table1 + `${table1 === '' ? '' : ', '}${this.schema}.${this.selectedTables[j]['table']['mapped_table_name']} ${this.selectedTables[j]['select_table_alias']}`;
          }
        }
      }

      // formula = `SELECT ${columns} FROM ${table1} ${joins}`;
      this.sharedDataService.setFormula(['select', 'tables'], columns)
      this.sharedDataService.setFormula(['from'], table1);
      this.sharedDataService.setFormula(['joins'], joins);
      return;
    }

    // select query for 1 table
    if (this.selectedTables.length >= 1 ) {
      let table1: string;
      let columns = [];

      // remove 'all', if selected['columns'] has 'all'
      if (this.selectedTables[0].columns.includes('all')) {
        columns = this.selectedTables[0].columns.slice(1).map(col => `${this.selectedTables[0]['select_table_alias']}.${col} ${this.selectedTables[0]['columnAlias'][col] ? `${this.selectedTables[0]['columnAlias'][col]}`:''}`);
      }
      else {
        columns = this.selectedTables[0].columns.map(col => `${this.selectedTables[0]['select_table_alias']}.${col} ${this.selectedTables[0]['columnAlias'][col] ? `${this.selectedTables[0]['columnAlias'][col]}`:''}`);
      }

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

  addKey(selected: any) {
    selected.keys.push({
      primaryKey: '', 
      operation: '=',
      foreignKey: ''
    }); 
  }

  setSelectedKey(selected: any, keyIndex: number,  rowIndex: number, primary?: boolean) {
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

  validateKeySelection(selected: any, index:number, rowIndex?: number) {
    let currentKey = selected.keys[index];

    if (currentKey.primaryKey && currentKey.foreignKey &&
      currentKey.primaryKey['data_type'] !== currentKey.foreignKey['data_type']) {
      this.isDiffKeys = true;
      this.toasterService.error('Primary key and foreign key cannot be of different data types');
      return;
    }

    this.updateSelectedTables();
  }

  onTableClick(event) {
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


  filterTable(search,rowIndex) {
    if(!this.selectedTables[rowIndex]['tables']) {
      return;
    }

    if(!search) {
      this.selectedTables[rowIndex]['tables'] =  JSON.parse(JSON.stringify(this.Originaltables));
      this.noEntriesFoundTable = true;
      return;
    }else {
      search = search.toLowerCase();
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

  filterColumn(search,rowIndex) {
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

  filterKey(search, rowIndex, key) {
    if(key === 'primary') {
      if(!search) {
        this.selectedTables[rowIndex]['joinData']['table1']['columns'] =  JSON.parse(JSON.stringify(this.selectedTables[rowIndex]['originalJoinData']['table1']['columns']));
        return;
      }else {
        search = search.toLowerCase();
      }
  
      this.selectedTables[rowIndex]['joinData']['table1']['columns'] = this.selectedTables[rowIndex]['originalJoinData']['table1']['columns'].filter(
        column => column['column'].toLowerCase().indexOf(search) > -1
      )
  
      this.noEntriesFoundColumn = this.selectedTables[rowIndex]['joinData']['table1']['columns'].length ? true : false;
    } else {
      if(!search) {
        this.selectedTables[rowIndex]['joinData']['table2']['columns'] =  JSON.parse(JSON.stringify(this.selectedTables[rowIndex]['originalJoinData']['table2']['columns']));
        return;
      }else {
        search = search.toLowerCase();
      }
  
      this.selectedTables[rowIndex]['joinData']['table2']['columns'] = this.selectedTables[rowIndex]['originalJoinData']['table2']['columns'].filter(
        column => column['column'].toLowerCase().indexOf(search) > -1
      )
  
      this.noEntriesFoundColumn = this.selectedTables[rowIndex]['joinData']['table2']['columns'].length ? true : false;
    }
    
  }

  deleteKey(selected:any, index:number) {
    selected.keys.splice(index, 1);
    this.updateSelectedTables();
  }

  getCalculatedData() {
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

  
  isOpened(event,rowIndex,type) {
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

  isDisabled(form) {
    this.invalid = form;
    this.isValidTables.emit({'isValid': this.invalid || this.isDiffKeys});
    
    if(this.fromType === 'calculated-column' && !this.invalid) {
      // this.sharedDataService.isValidSelectedTable
      this.getCalculatedData();
    }
    return form;
  }

  columnNames = [];
  
  multiSelectColumnsCollector(index){
    // console.log(this.selectedTables);
    // return []
    return Object.keys(this.selectedTables[index]['table']?this.selectedTables[index]['table']:{}).length?this.selectedTables[index].table.column_properties.map(ele=>ele.column):[];
  }

  selectionDone(event,index){
    // console.log(this.selectedTables.slice());
    // console.log(event);
    // console.log(index);
    this.selectedTables[index].columnAlias = {};
    this.selectedTables[index].columns = [];
    let columns = Object.keys(event)
    columns.forEach(column=>{
      if(event[column].checked){
        this.selectedTables[index].columns.push(column)
        if(event[column].aliasName.length > 0)
        this.selectedTables[index].columnAlias[column] = event[column].aliasName
      }
    })
    // console.log(this.selectedTables);
  }
}