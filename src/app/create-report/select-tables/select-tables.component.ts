import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { SharedDataService } from '../shared-data.service';
import { SelectTablesService } from '../select-tables/select-tables.service';
import Utils from 'src/utils';

@Component({
  selector: 'app-select-tables',
  templateUrl: './select-tables.component.html',
  styleUrls: ['./select-tables.component.css']
})

export class SelectTablesComponent implements OnInit {

  @Output() enablePreview = new EventEmitter();

  @Output() callCalculatedApi = new EventEmitter();

  tables = {};
  selectedTables = [];
  isRelated: boolean = false;
  relatedTableId: number;

  joinData = {};
  columnProps = {};
  showKeys = {};

  operations = ['=', '!='];
  operators = ['AND', 'OR'];
  defaultError: string = "There seems to be an error. Please try again later.";

  constructor(
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private toasterService: ToastrService,
    private selectTablesService: SelectTablesService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    this.sharedDataService.selectedTables.subscribe(tables => this.selectedTables = tables)

    this.resetState();
  }

  getTables() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables['tables'] = tables || [];
    })

    this.objectExplorerSidebarService.getCustomTables.subscribe(customTables => {
      this.tables['custom tables'] = customTables || [];
    })
  }

  addRow(index?: number) {
    this.selectedTables.push({});

    if (index) this.showKeys[index] = false;
  }

  setRelated() {
    let lastSelectedTableId = this.selectedTables.length &&
      this.selectedTables[this.selectedTables.length - 1]['table'] &&
      this.selectedTables[this.selectedTables.length - 1]['table']['sl_tables_id'];

    this.isRelated = lastSelectedTableId && this.relatedTableId && (lastSelectedTableId === this.relatedTableId);
  }

  onTableColumnSelect() {
    this.setRelated();

    this.updateSelectedTables();
  }

  disableFields() {
    if (this.selectedTables.length) {
      // enable last item
      let lastTable = this.selectedTables[this.selectedTables.length - 1];
      if (lastTable['table'] && lastTable['columns'].length) {
        lastTable.disabled = false;
      }

      // disable all other items
      if (this.selectedTables.length >= 2) {
        for (let i = this.selectedTables.length - 2; i >= 0; i--) {
          this.selectedTables[i].disabled = true;
        }
      }
    }
  }

  isTable(selected: any) {
    return selected.table['sl_tables_id'] &&
      this.tables['tables'].map(table => table['sl_tables_id']).includes(selected.table['sl_tables_id']);
  }

  isCustomTable(selected: any) {
    return selected.table['custom_table_id'] &&
      this.tables['custom tables'].map(table => table['custom_table_id']).includes(selected.table['custom_table_id']);
  }

  resetSelected(selected: any) {
    // reset columns and join on change of table selection
    selected.columns = [];
    selected.join = '';
    selected.keys = [];

    this.addKey(selected);
  }

  getRelatedTables(selected: any) {
    this.resetSelected(selected);

    this.getColumnTypes(selected);

    // checks if not related or custom table
    if (this.isRelated || this.isCustomTable(selected)) return;

    // fetch related tables only if it is a table and not a related or custom table
    // Utils.showSpinner();
    this.selectTablesService.getRelatedTables(selected['table']['sl_tables_id']).subscribe(response => {
      this.tables['related tables'] = response['table_data'] || [];
      // Utils.hideSpinner();
      this.relatedTableId = this.tables['related tables'].length && selected['table']['sl_tables_id'];
    }, error => {
      this.toasterService.error(error.message["error"] || this.defaultError);
      this.tables['related tables'] = [];
      Utils.hideSpinner();
    });
  }

  deleteRow(index: number) {
    this.selectedTables.splice(index, 1);
    this.updateSelectedTables();

    // reset joinData
    this.joinData[index] = {
      table1: {},
      table2: {}
    };

    this.showKeys[index] = false;

    if (!this.selectedTables.length) this.resetState();
  }

  resetState() {
    this.joinData = {
      table1: {},
      table2: {}
    };

    this.getTables();
    this.updateSelectedTables();

    if (!this.selectedTables.length) this.addRow();
  }

  getColumnTypes(selected: any) {
    let tableId = selected['table']['sl_tables_id'] || selected['table']['custom_table_id'];
    let isPresent = Object.keys(this.columnProps).includes(tableId.toString()) && this.columnProps[tableId].length;

    let data = {};
    data['table_id'] = tableId;

    if (this.isTable(selected)) {
      data['table_type'] = 'mapped_table';
    }
    else if (this.isCustomTable(selected)) {
      data['table_type'] = 'custom_table';
    }

    if (!isPresent) {
      Utils.showSpinner();
      this.selectTablesService.getColumns(data).subscribe(response => {
        this.columnProps[tableId] = response['data'] || [];
        Utils.hideSpinner();
      }, error => {
        this.toasterService.error(error['message'].error || this.defaultError);
        Utils.hideSpinner();
        this.columnProps[tableId] = [];
      })
    }
  }

  updateSelectedTables() {    
    this.selectedTables.forEach(item => {
      item.table.select_table_name= item['table']['custom_table_name'] || item['table']['mapped_table_name'],
      item.table.select_table_id = item['table']['custom_table_id'] || item['table']['sl_tables_id']
    });

    this.sharedDataService.setSelectedTables(this.selectedTables);

    this.disableFields();
  }

  setJoinData(index: number) {
    this.showKeys[index] = true;

    if (this.selectedTables.length > 2) {
      let lastTable = this.selectedTables[this.selectedTables.length - 1];
      let isCustomTable = this.isCustomTable(lastTable);
      let cols = [];

      if (isCustomTable) {
        cols = this.columnProps[lastTable['table']['custom_table_id']].map(col => Object.assign(col, { table_name: lastTable['table']['custom_table_name'] }));
      }
      else {
        cols = this.columnProps[lastTable['table']['sl_tables_id']].map(col => Object.assign(col, { table_name: lastTable['table']['mapped_table_name'] }));
      }

      let table2 = {
        table_id: lastTable['table']['sl_tables_id'] || lastTable['table']['custom_table_id'],
        columns: cols
      }

      let table1 = {
        table_id: '',
        columns: []
      };

      for (let i = this.selectedTables.length - 2; i >= 0; i--) {
        let tableId = this.selectedTables[i]['table']['sl_tables_id'] || this.selectedTables[i]['table']['custom_table_id'];
        let isCustomTable = this.isCustomTable(this.selectedTables[i]);

        let cols = this.columnProps[tableId].filter(col => {
          if (this.selectedTables[i]['columns'].includes(col.mapped_column)) {
            if (isCustomTable) {
              return Object.assign(col, { table_name: this.selectedTables[i]['table']['custom_table_name'] })
            }
            else {
              return Object.assign(col, { table_name: this.selectedTables[i]['table']['mapped_table_name'] })
            }
          };
        })
        table1['columns'].push(...cols);
      }

      this.joinData[index] = {
        table1,
        table2
      }
      return;
    }

    if (this.selectedTables.length === 2) {
      let tables = this.selectedTables.map(table => {
        let tableId = table['table']['sl_tables_id'] || table['table']['custom_table_id'];
        return {
          table_id: tableId,
          columns: this.columnProps[tableId]
        }
      })

      this.joinData[index] = {
        table1: tables[0],
        table2: tables[1]
      }
      return;
    }
  }

  createFormula() {
    this.enablePreview.emit(true);
    this.callCalculatedApi.emit(true);
    // select query for more than two tables
    if (this.selectedTables.length >= 3) {
      let columns = [];
      let joins = [];
      let table1: string;

      for (let i = 0; i < this.selectedTables.length; i++) {
        let tableName = this.selectedTables[i]['table']['custom_table_name'] || this.selectedTables[i]['table']['mapped_table_name'];;

        // let cols = this.selectedTables[i].columns.map(col => `${tableName}.${col}`);
        let cols = this.selectedTables[i].columns.map(col => (`${tableName}.${col}`).trim());
        columns.push(...cols);
      }

      for (let j = 1; j < this.selectedTables.length; j++) {
        let tableName: string;

        if (this.selectedTables[j]['keys'] && this.selectedTables[j]['keys'].length) {

          let keys = this.selectedTables[j]['keys'].map(key => {
            if (key.primaryKey['table_name'] && key.foreignKey['table_name']) {
              return `${key.primaryKey['table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${key.foreignKey['table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`
            }
            else {
              return `${this.selectedTables[j - 1]['table']['custom_table_name'] || this.selectedTables[j - 1]['table']['mapped_table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${this.selectedTables[j]['table']['custom_table_name'] || this.selectedTables[j]['table']['mapped_table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`
            }
          })

          if (this.isTable(this.selectedTables[j])) {
            tableName = `VSMDDM.${this.selectedTables[0]['table']['mapped_table_name']}`;
          }
          else if (this.isCustomTable(this.selectedTables[j])) {
            tableName = `(${this.selectedTables[j].table['custom_table_query']}) ${this.selectedTables[j].table['custom_table_name']}`
          }

          let joinString = `${this.selectedTables[j]['join'].toUpperCase()} JOIN ${tableName} ON ${keys.map(k => k.trim()).join(' ')}`
          joins.push(joinString);
        }
      }

      if (this.isTable(this.selectedTables[0])) {
        table1 = `VSMDDM.${this.selectedTables[0]['table']['mapped_table_name']}`;
      }
      else if (this.isCustomTable(this.selectedTables[1])) {
        table1 = `(${this.selectedTables[0].table['custom_table_query']}) ${this.selectedTables[0].table['custom_table_name']}`
      }

      // formula = `SELECT ${columns.map(col => col.trim()).join(', ')} FROM ${table1} ${joins.join(' ')}`;

      this.sharedDataService.setFormula(['select', 'tables'], columns)
      this.sharedDataService.setFormula(['from'], table1);
      this.sharedDataService.setFormula(['joins'], joins)
      return;
    }

    // select query for two tables
    if (this.selectedTables.length >= 2) {
      let columns = [];
      let keys = [];
      let joins = [];
      let table1: string;
      let table2: string;

      // table 1 is a table
      if (this.isTable(this.selectedTables[0]) && this.selectedTables[1]['keys'] && this.selectedTables[1]['keys'].length && this.selectedTables[0].columns.length && this.selectedTables[1].columns.length) {
        table1 = `VSMDDM.${this.selectedTables[0]['table']['mapped_table_name']}`;

        for (let i = 0; i < this.selectedTables.length; i++) {
          let tableName = this.selectedTables[i]['table']['custom_table_name'] || this.selectedTables[i]['table']['mapped_table_name'];
          let cols = this.selectedTables[i].columns.map(col => `${tableName}.${col}`);
          columns.push(...cols);
        }

        // table 2 is a table
        if (this.isTable(this.selectedTables[1])) {
          table2 = `VSMDDM.${this.selectedTables[1]['table']['mapped_table_name']}`;

          let joinKeys = this.selectedTables[1]['keys'].map(key =>
            `${this.selectedTables[0]['table']['mapped_table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${this.selectedTables[1]['table']['mapped_table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`)

          keys.push(...joinKeys);
        }

        // table 2 is a custom table
        else if (this.isCustomTable(this.selectedTables[1])) {
          table2 = `(${this.selectedTables[1].table['custom_table_query']}) ${this.selectedTables[1].table['custom_table_name']}`

          let joinKeys = this.selectedTables[1]['keys'].map(key =>
            `${this.selectedTables[0]['table']['mapped_table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${this.selectedTables[1]['table']['custom_table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`)

          keys.push(...joinKeys);
        }

        // formula = `SELECT ${columns.map(col => col.trim()).join(', ')} FROM ${table1} ${this.selectedTables[1]['join'].toUpperCase()} JOIN ${table2} ON ${keys.map(key => key.trim()).join(' ')}`;

        let joinString = `${this.selectedTables[1]['join'].toUpperCase()} JOIN ${table2} ON ${keys.map(key => key.trim()).join(' ')}`
        joins.push(joinString);

        this.sharedDataService.setFormula(['select', 'tables'], columns)
        this.sharedDataService.setFormula(['from'], table1);
        this.sharedDataService.setFormula(['joins'], joins);

        return;
      }

      // table 1 is custom table
      if (this.isCustomTable(this.selectedTables[0]) && this.selectedTables[1]['keys'] && this.selectedTables[1]['keys'].length && this.selectedTables[0].columns.length && this.selectedTables[1].columns.length) {
        table1 = `(${this.selectedTables[0].table['custom_table_query']}) ${this.selectedTables[0].table['custom_table_name']}`

        for (let i = 0; i < this.selectedTables.length; i++) {
          let tableName = this.selectedTables[i]['table']['custom_table_name'] || this.selectedTables[i]['table']['mapped_table_name'];
          let cols = this.selectedTables[i].columns.map(col => `${tableName}.${col}`);
          columns.push(...cols);
        }

        // table 2 is table
        if (this.isTable(this.selectedTables[1])) {
          table2 = `VSMDDM.${this.selectedTables[1]['table']['mapped_table_name']}`;

          let joinKeys = this.selectedTables[1]['keys'].map(key =>
            `${this.selectedTables[0]['table']['custom_table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${this.selectedTables[1]['table']['mapped_table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`)

          keys.push(...joinKeys);
        }

        // table 2 is custom table
        else if (this.isCustomTable(this.selectedTables[1])) {
          table2 = `(${this.selectedTables[1].table['custom_table_query']}) ${this.selectedTables[1].table['custom_table_name']}`

          let joinKeys = this.selectedTables[1]['keys'].map(key =>
            `${this.selectedTables[0]['table']['custom_table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${this.selectedTables[1]['table']['custom_table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`)

          keys.push(...joinKeys);
        }

        // formula = `SELECT ${columns.map(col => col.trim()).join(', ')} FROM ${table1} ${this.selectedTables[1]['join'].toUpperCase()} JOIN ${table2} ON ${keys.map(key => key.trim()).join(' ')}`;

        let joinString = `${this.selectedTables[1]['join'].toUpperCase()} JOIN ${table2} ON ${keys.map(key => key.trim()).join(' ')}`
        joins.push(joinString);

        this.sharedDataService.setFormula(['select', 'tables'], columns)
        this.sharedDataService.setFormula(['from'], table1);
        this.sharedDataService.setFormula(['joins'], joins);

        return;
      }
    }

    // select query for 1 table selection
    if (this.selectedTables.length >= 1 && this.selectedTables[0].table['mapped_column_name'].length && this.selectedTables[0].columns.length) {

      let table1: string;
      let columns = [];

      if (this.isTable(this.selectedTables[0])) {
        columns = (this.selectedTables[0].table['mapped_column_name'].length === this.selectedTables[0].columns.length) ?
          '*' : this.selectedTables[0].columns.map(col => col.trim());

        table1 = `VSMDDM.${this.selectedTables[0]['table']['mapped_table_name']}`;
      }

      else if (this.isCustomTable(this.selectedTables[0])) {
        // TODO: error for all columns selection (*)
        columns = this.selectedTables[0].columns.map(col => `${this.selectedTables[0].table['custom_table_name']}.${col}`);

        table1 = `(${this.selectedTables[0].table['custom_table_query']}) ${this.selectedTables[0].table['custom_table_name']}`
      }

      // formula = `SELECT ${columns} FROM ${table1}`;

      this.sharedDataService.setFormula(['select', 'tables'], columns)
      this.sharedDataService.setFormula(['from'], table1);
      this.sharedDataService.setFormula(['joins'], []);
      return;
    }
  }

  addKey(selected: any) {
    selected.keys.push({
      primaryKey: '',
      operation: '',
      foreignKey: ''
    });
  }

  deleteKey(selected: any, index: number) {
    selected['keys'].splice(index, 1);
    this.updateSelectedTables();
  }

  validateKeySelection(selected: any, index: number, rowIndex?:number) {
    let currentKey = selected.keys[index];

    if (currentKey.primaryKey && currentKey.foreignKey &&
      currentKey.primaryKey['data_type'] !== currentKey.foreignKey['data_type']) {
      this.toasterService.error('Primary key and foreign key cannot be of different data types');
      return;
    }

    this.updateSelectedTables();

    if (currentKey.primaryKey && currentKey.foreignKey) {
      this.showKeys[rowIndex] = false;
    }
  }

}