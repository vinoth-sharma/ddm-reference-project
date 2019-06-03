import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { SharedDataService } from '../shared-data.service';
import { SelectTablesService } from '../select-tables/select-tables.service';
import { Router } from '@angular/router';

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
  showKeys = {};

  operations = ['=', '!='];
  defaultError: string = 'There seems to be an error. Please try again later.';
  errData: boolean;

  constructor(
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private toasterService: ToastrService,
    private selectTablesService: SelectTablesService,
    private sharedDataService: SharedDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sharedDataService.selectedTables.subscribe(tables => {
      this.selectedTables = tables;
    });
    this.resetState();
  }

  getTables() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables['tables'] = (tables && tables.filter(t => t['view_to_admins'])) || [];
      this.checkErr();
    })

    this.objectExplorerSidebarService.getCustomTables.subscribe(customTables => {
      this.tables['custom tables'] = customTables || [];
    })
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

  isCustomTable(selected: any) {
    return selected.tableId &&
      this.tables['custom tables'].map(table => table['custom_table_id']).includes(selected.tableId);
  }

  isRelatedTable(selected: any) {
    return selected.tableId && this.tables['related tables'] && this.tables['related tables'].length &&
      this.tables['related tables'].map(table => table['mapped_table_id']).includes(selected.tableId);
  }

  resetSelected(selected: any) {
    // reset columns and join on change of table selection
    selected.columns = [];
    selected.join = '';
    selected.keys = [];

    this.addKey(selected);
  }

  setSelectedTable(selected: any) {
    // if table is a custom table
    if (this.isCustomTable(selected)) {
      selected['table'] = this.tables['custom tables'].find(table => selected['tableId'] === table['custom_table_id']);
    }
    // if table is a related table
    else if (this.isRelatedTable(selected)) {
      selected['table'] = this.tables['related tables'].find(table => selected['tableId'] === table['mapped_table_id']);
    }
    else {
      selected['table'] = this.tables['tables'].find(table => selected['tableId'] === table['sl_tables_id']);
    }

    this.getRelatedTables(selected);
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

  getRelatedTables(selected: any) {
    let isRelatedSelected = this.selectedTables.some(table => table['table'] && table['table']['mapped_table_id']);

    this.resetSelected(selected);

    // checks if not related or custom table
    if (this.isRelated || this.isCustomTable(selected) || isRelatedSelected) return;

    // fetch related tables only if it is a table and not a related or custom table
    this.selectTablesService.getRelatedTables(selected['table']['sl_tables_id']).subscribe(response => {
      this.tables['related tables'] = this.getUniqueRelatedTables(response['data']);
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

  getTableAlias(tableName: string, index?: number) {
    return `A_${tableName.substring(0, 3)}_${index}`;
  }

  updateSelectedTables() {
    this.selectedTables.forEach((item, index) => {
      let tableName = item['table']['custom_table_name'] || item['table']['mapped_table_name'];

      item.table.select_table_name = tableName,
        // TODO: remove and use item.tableId
        item.table.select_table_id = item['table']['custom_table_id'] || item['table']['sl_tables_id'] || item['table']['mapped_table_id'],
        item.select_table_alias = this.getTableAlias(tableName, index);
    });

    this.sharedDataService.setSelectedTables(this.selectedTables);

    this.disableFields();
  }

  setJoinData(index: number) {
    // no keys required for cross join
    if (this.selectedTables[index].join && this.selectedTables[index].join === 'cross') return;

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
        let cols = JSON.parse(JSON.stringify(this.selectedTables[i]['table']['column_properties'])).filter(col => {
          if (this.selectedTables[i]['columns'].includes(col.column)) {
            return Object.assign(col, { table_name: this.selectedTables[i]['select_table_alias'] })
          };
        })

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

    this.joinData[index] = {
      table1,
      table2
    }
  }

  createFormula() {
    this.enablePreview.emit(true);
    this.sharedDataService.setNextClicked(true);        // after clicking on next call api to get existing columns

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
            return `${key.primaryKey['table_name']}.${key.primaryKey['column']} ${key.operation} ${key.foreignKey['table_name']}.${key.foreignKey['column']} ${key.operator ? key.operator : ''}`
          })

          if (this.isCustomTable(this.selectedTables[j])) {
            tableName = `(${this.selectedTables[j].table['custom_table_query']}) ${this.selectedTables[j]['select_table_alias']}`;
          }
          else {
            tableName = `VSMDDM.${this.selectedTables[j]['table']['mapped_table_name']} ${this.selectedTables[j]['select_table_alias']}`;
          }

          let joinString;
          if (this.selectedTables[j]['join'] === 'cross') {
            joinString = `${this.selectedTables[j]['join'].toUpperCase()} JOIN ${tableName}`;
          }
          else {
            joinString = `${this.selectedTables[j]['join'].toUpperCase()} JOIN ${tableName} ON ${keys.map(k => k.trim()).join(' ')}`;
          }

          joins.push(joinString);
        }
      }

      // formula = `SELECT ${columns} FROM ${table1} ${joins}`;
      this.sharedDataService.setFormula(['select', 'tables'], columns)
      this.sharedDataService.setFormula(['from'], table1);
      this.sharedDataService.setFormula(['joins'], joins);
      return;
    }

    // select query for 1 table
    if (this.selectedTables.length >= 1 && this.selectedTables[0].table['mapped_column_name'].length && this.selectedTables[0].columns.length) {

      let table1: string;
      let columns = this.selectedTables[0].columns.map(col => `${this.selectedTables[0]['select_table_alias']}.${col}`);

      if (this.isCustomTable(this.selectedTables[0])) {
        table1 = `(${this.selectedTables[0].table['custom_table_query']}) ${this.selectedTables[0]['select_table_alias']}`;
      }
      else {
        table1 = `VSMDDM.${this.selectedTables[0]['table']['mapped_table_name']} ${this.selectedTables[0]['select_table_alias']}`;
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
      operation: '',
      foreignKey: ''
    });
  }

  setSelectedKey(selected: any, keyIndex: number, rowIndex: number, primary?: boolean) {
    if (primary) {
      selected['keys'][keyIndex]['primaryKey'] = this.joinData[rowIndex]['table1']['columns'].find(item => item['column'] === selected['keys'][keyIndex]['primaryKeyName']);
    }
    else {
      selected['keys'][keyIndex]['foreignKey'] = this.joinData[rowIndex]['table2']['columns'].find(item => item['column'] === selected['keys'][keyIndex]['foreignKeyName']);
    }

    if (selected['keys'][keyIndex]['primaryKeyName'] && selected['keys'][keyIndex]['foreignKeyName'] && selected['keys'][keyIndex]['operation']) {
      this.validateKeySelection(selected, keyIndex, rowIndex);
    }
  }

  validateKeySelection(selected: any, index: number, rowIndex?: number) {
    let currentKey = selected.keys[index];

    if (currentKey.primaryKey && currentKey.foreignKey &&
      currentKey.primaryKey['data_type'] !== currentKey.foreignKey['data_type']) {
      this.toasterService.error('Primary key and foreign key cannot be of different data types');
      return;
    }

    this.updateSelectedTables();

    if (currentKey.primaryKey && currentKey.foreignKey && currentKey.operation) {
      this.showKeys[rowIndex] = false;
    }
  }
}