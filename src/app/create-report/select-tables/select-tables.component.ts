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
    this.sharedDataService.selectedTables.subscribe(tables => this.selectedTables = tables);
    this.resetState();
  }

  getTables() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables['tables'] = (tables && tables.filter(t => t['view_to_admins'])) || [];
    })

    this.objectExplorerSidebarService.getCustomTables.subscribe(customTables => {
      this.tables['custom tables'] = (customTables && customTables.filter(t => t['view_type'])) || [];
    })
  }

  addRow(index?: number) {
    this.selectedTables.push({});
    if (index) this.showKeys[index] = false;
  }

  setRelated() {
    let lastSelectedTableId = this.selectedTables[this.selectedTables.length - 1]['table']['sl_tables_id'];
    this.isRelated = lastSelectedTableId && this.relatedTableId && (lastSelectedTableId === this.relatedTableId);
  }

  onTableColumnSelect() {
    this.setRelated();
    this.updateSelectedTables();
  }

  disableFields() {
    if (this.selectedTables.length) {
      if (this.selectedTables.length > 1) {
        this.selectedTables.forEach(table => table.disabled = true);
      }
      this.selectedTables[this.selectedTables.length - 1].disabled = false;
    }
  }

  // isTable(selected: any) {
  //   return selected.table['sl_tables_id'] &&
  //     this.tables['tables'].map(table => table['sl_tables_id']).includes(selected.table['sl_tables_id']);
  // }

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
    let isRelatedSelected = this.selectedTables.some(table => table['table']['mapped_table_id']);

    this.resetSelected(selected);

    this.getColumnTypes(selected);

    // checks if not related or custom table
    if (this.isRelated || this.isCustomTable(selected) || isRelatedSelected) return;

    // fetch related tables only if it is a table and not a related or custom table
    this.selectTablesService.getRelatedTables(selected['table']['sl_tables_id']).subscribe(response => {
      this.tables['related tables'] = response['data'] || [];
      this.relatedTableId = this.tables['related tables'].length && selected['table']['sl_tables_id'];
    }, error => {
      this.toasterService.error(error.message["error"] || this.defaultError);
      this.tables['related tables'] = [];
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
    this.joinData = {};

    this.getTables();
    this.updateSelectedTables();

    if (!this.selectedTables.length) this.addRow();
  }

  getColumnTypes(selected: any) {
    let tableId = selected['table']['sl_tables_id'] || selected['table']['mapped_table_id'] || selected['table']['custom_table_id'];

    let isPresent = Object.keys(this.columnProps).includes(tableId.toString()) && this.columnProps[tableId].length;

    let data = {};
    data['table_id'] = tableId;
    data['table_type'] = this.isCustomTable(selected) ? 'custom_table' : 'mapped_table';

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

  getTableAlias(tableName: string, index?: number) {
    return `A_${tableName.substring(0, 3)}_${index}`;
  }

  updateSelectedTables() {
    this.selectedTables.forEach((item, index) => {
      let tableName = item['table']['custom_table_name'] || item['table']['mapped_table_name'];

      item.table.select_table_name = tableName,
      item.table.select_table_id = item['table']['custom_table_id'] || item['table']['sl_tables_id'] || item['table']['mapped_table_id'],
      item.select_table_alias = this.getTableAlias(tableName, index);
    });

    this.sharedDataService.setSelectedTables(this.selectedTables);

    this.disableFields();
  }

  setJoinData(index: number) {
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
    let cols = JSON.parse(JSON.stringify(this.columnProps[lastTable['table']['select_table_id']])).map(col => Object.assign(col, { table_name: lastTable['select_table_alias'] }));

    table2['table_id'] = lastTable['table']['select_table_id'];
    table2['columns'] = cols;

    if (this.selectedTables.length > 2) {
      for (let i = this.selectedTables.length - 2; i >= 0; i--) {
        let tableId = this.selectedTables[i]['table']['select_table_id'];

        let cols = JSON.parse(JSON.stringify(this.columnProps[tableId])).filter(col => {
          if (this.selectedTables[i]['columns'].includes(col.mapped_column)) {
            return Object.assign(col, { table_name: this.selectedTables[i]['select_table_alias'] })
          };
        })
        table1['columns'].push(...cols);
        table1['table_id'] = '';
      }
    }

    else {
      let cols = JSON.parse(JSON.stringify(this.columnProps[this.selectedTables[0]['table']['select_table_id']])).map(col => Object.assign(col, { table_name: this.selectedTables[0]['select_table_alias'] }));

      table1['table_id'] = this.selectedTables[0]['table']['select_table_id'],
      table1['columns'] = cols
    }

    this.joinData[index] = {
      table1,
      table2
    }
  }

  createFormula() {
    this.enablePreview.emit(true);

    // select query for more than one table
    if (this.selectedTables.length >= 2) {
      let columns = [];
      let joins = [];
      let table1: string;

      if (this.isCustomTable(this.selectedTables[0])) {
        table1 = `(${this.selectedTables[0].table['custom_table_query']}) ${this.selectedTables[0]['select_table_alias']}`;
      }
      else {
        table1 = `VSMDDM.${this.selectedTables[0]['table']['mapped_table_name']} ${this.selectedTables[0]['select_table_alias']}`;
      }

      for (let i = 0; i < this.selectedTables.length; i++) {
        let tableName = this.selectedTables[i]['select_table_alias'];

        let cols = this.selectedTables[i].columns.map(col => (`${tableName}.${col}`).trim());
        columns.push(...cols);
      }

      for (let j = 1; j < this.selectedTables.length; j++) {
        let tableName: string;

        if (this.selectedTables[j]['keys'] && this.selectedTables[j]['keys'].length) {
          let keys = this.selectedTables[j]['keys'].map(key => {
            return `${key.primaryKey['table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${key.foreignKey['table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`
          })

          if (this.isCustomTable(this.selectedTables[j])) {
            tableName = `(${this.selectedTables[j].table['custom_table_query']}) ${this.selectedTables[j]['select_table_alias']}`;
          }
          else {
            tableName = `VSMDDM.${this.selectedTables[j]['table']['mapped_table_name']} ${this.selectedTables[j]['select_table_alias']}`;
          }

          let joinString = `${this.selectedTables[j]['join'].toUpperCase()} JOIN ${tableName} ON ${keys.map(k => k.trim()).join(' ')}`
          joins.push(joinString);
        }
      }

      // formula = `SELECT ${columns.map(col => col.trim()).join(', ')} FROM ${table1} ${joins.join(' ')}`;

      this.sharedDataService.setFormula(['select', 'tables'], columns)
      this.sharedDataService.setFormula(['from'], table1);
      this.sharedDataService.setFormula(['joins'], joins);
      return;
    }

    // select query for 1 table
    if (this.selectedTables.length >= 1 && this.selectedTables[0].table['mapped_column_name'].length && this.selectedTables[0].columns.length) {

      let table1: string;
      let columns = [];

      if (this.isCustomTable(this.selectedTables[0])) {
        // TODO: error for all columns selection (*)
        // columns = this.selectedTables[0].columns.map(col => `${this.selectedTables[0].table['custom_table_name']}.${col}`);
        columns = this.selectedTables[0].columns.map(col => `${this.selectedTables[0]['select_table_alias']}.${col}`);

        table1 = `(${this.selectedTables[0].table['custom_table_query']}) ${this.selectedTables[0]['select_table_alias']}`;
      }
      else {
        // columns = (this.selectedTables[0].table['mapped_column_name'].length === this.selectedTables[0].columns.length) ?
        //   '*' : this.selectedTables[0].columns.map(col => col.trim());
        columns = (this.selectedTables[0].table['mapped_column_name'].length === this.selectedTables[0].columns.length) ?
          '*' : this.selectedTables[0].columns.map(col => `${this.selectedTables[0]['select_table_alias']}.${col}`);

        table1 = `VSMDDM.${this.selectedTables[0]['table']['mapped_table_name']} ${this.selectedTables[0]['select_table_alias']}`;
      }

      // formula = `SELECT ${columns} FROM ${table1}`;

      this.sharedDataService.setFormula(['select', 'tables'], columns)
      this.sharedDataService.setFormula(['from'], table1);
      this.sharedDataService.setFormula(['joins'], []);
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

  validateKeySelection(selected: any, index: number, rowIndex?: number) {
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