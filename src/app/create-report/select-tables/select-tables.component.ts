import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { ReportsService } from '../../reports/reports.service';
import { SharedDataService } from '../shared-data.service';
import { SelectTablesService } from '../select-tables/select-tables.service';
import Utils from 'src/utils';

@Component({
  selector: 'app-select-tables',
  templateUrl: './select-tables.component.html',
  styleUrls: ['./select-tables.component.css']
})

export class SelectTablesComponent implements OnInit {

  tables = {};
  selectedTables = [];
  isRelated: boolean = false;
  relatedTableId: number;
  defaultError: string = "There seems to be an error. Please try again later.";

  joinData = [];
  columnProps = {};

  constructor(
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private toasterService: ToastrService,
    private reportsService: ReportsService,
    private selectTablesService: SelectTablesService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
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

  addRow() {
    this.selectedTables.push({});
  }

  setRelated() {
    let lastSelectedTableId = this.selectedTables.length &&
      this.selectedTables[this.selectedTables.length - 1]['table'] &&
      this.selectedTables[this.selectedTables.length - 1]['table']['sl_tables_id'];

    this.isRelated = lastSelectedTableId && this.relatedTableId && (lastSelectedTableId === this.relatedTableId);
  }

  onColumnSelect() {
    this.setRelated();

    // to update for only 1 table scenario
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
    return this.tables['tables'].map(table => table['sl_tables_id'])
      .includes(selected.table['sl_tables_id']);
  }

  isCustomTable(selected: any) {
    return this.tables['custom tables'].map(table => table['custom_table_id'])
      .includes(selected.table['custom_table_id']);
  }

  resetSelected(selected: any) {
    // reset columns and join on change of table selection
    selected.columns = [];
    selected.join = '';
  }

  getRelatedTables(selected: any) {
    this.resetSelected(selected);

    this.getColumnTypes(selected);

    // checks if not related or custom table
    if (this.isRelated || this.isCustomTable(selected)) return;

    // fetch related tables only if it is a table and not a related or custom table
    // Utils.showSpinner();
    this.reportsService.getTables(selected['table']['sl_tables_id']).subscribe(response => {
      this.tables['related tables'] = response['table_data'] || [];
      // Utils.hideSpinner();
      this.relatedTableId = this.tables['related tables'].length && selected['table']['sl_tables_id'];
    },
      error => {
        this.toasterService.error(error.message["error"] || this.defaultError);
        this.tables['related tables'] = [];
        Utils.hideSpinner();
      });
  }

  deleteJoin(index: number) {
    this.selectedTables.splice(index, 1);
    this.updateSelectedTables();
    this.joinData = [];
    if (!this.selectedTables.length) this.resetState();
  }

  resetState() {
    this.selectedTables = this.sharedDataService.getSelectedTables();
    this.joinData = [];

    this.getTables();
    this.updateSelectedTables();
    // this.isRelated = false;
    this.setRelated();

    if (!this.selectedTables.length) this.addRow();
  }

  getColumnTypes(selected: any) {
    let data = {};

    if (this.isTable(selected)) {
      data['table_id'] = selected['table']['sl_tables_id'];
      data['table_type'] = 'mapped_table';
    }
    else if (this.isCustomTable(selected)) {
      data['table_id'] = selected['table']['custom_table_id'];
      data['table_type'] = 'custom_table';
    }

    Utils.showSpinner();
    this.selectTablesService.getColumns(data).subscribe(response => {
      this.columnProps[data['table_id']] = response['data'] || [];
      Utils.hideSpinner();
    }, error => {
      this.toasterService.error(error['message'].error || this.defaultError);
      Utils.hideSpinner();
      this.columnProps[data['table_id']] = [];
    })
  }

  updateSelectedTables() {
    // TODO: obser
    // this.sharedDataService.setSelectedTables(JSON.parse(JSON.stringify(this.selectedTables)));
    this.sharedDataService.setSelectedTables(this.selectedTables);
    this.createFormula();
    this.disableFields();
  }

  setJoinData() {
    let selectedTables = this.sharedDataService.getSelectedTables();
    this.joinData = [];

    // TODO: custom tables
    if (selectedTables.length > 2) {
      let lastTable = selectedTables[selectedTables.length - 1]['table'] || selectedTables[selectedTables.length - 1]['table'];

      let cols = this.columnProps[lastTable['sl_tables_id'] || lastTable['custom_table_id']].map(col => {
        return Object.assign(col, { table_name: lastTable['mapped_table_name'] || lastTable['custom_table_name'] })
      })

      let table2 = {
        table_id: lastTable['sl_tables_id'] || lastTable['custom_table_id'],
        columns: cols
      }

      let table1 = {
        table_id: '',
        columns: []
      };

      for (let i = selectedTables.length - 2; i >= 0; i--) {
        let tableId = selectedTables[i]['table']['sl_tables_id'] || selectedTables[i]['table']['custom_table_id'];
        let cols = this.columnProps[tableId].filter(col => {
          if (selectedTables[i]['columns'].includes(col.mapped_column)) {
            return Object.assign(col, { table_name: selectedTables[i]['table']['mapped_table_name'] || selectedTables[i]['table']['custom_table_name'] })
          };
        })
        table1['columns'].push(...cols);
      }

      this.joinData.push(table1, table2);
      return;
    }

    if (selectedTables.length === 2) {
      let tables = selectedTables.map(table => {
        return {
          table_id: table['table']['sl_tables_id'],
          columns: this.columnProps[table['table']['sl_tables_id']]
        }
      })

      this.joinData.push(...tables);
      return;
    }
  }

  createFormula() {
    let selectedTables = this.sharedDataService.getSelectedTables();
    let formula: string = '';

    // TODO: check for custom table

    // select query for more than two tables
    if (selectedTables.length >= 3) {
      let columns = [];
      // let keys = [];
      let joins = [];

      for (let i = 0; i < selectedTables.length; i++) {
        let tableName = selectedTables[i]['table']['mapped_table_name'];
        let cols = selectedTables[i].columns.map(col => `${tableName}.${col}`);
        columns.push(...cols);
      }

      for (let j = 1; j < selectedTables.length; j++) {
        if (selectedTables[j]['keys'] && selectedTables[j]['keys'].length) {

          let keys = selectedTables[j]['keys'].map(key => {
            if (key.primaryKey['table_name'] && key.foreignKey['table_name']) {
              return `${key.primaryKey['table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${key.foreignKey['table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`
            }
            else {
              return `${selectedTables[j - 1]['table']['mapped_table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${selectedTables[j]['table']['mapped_table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`
            }
          })

          let joinString = `${selectedTables[j]['join'].toUpperCase()} JOIN VSMDDM.${selectedTables[j]['table']['mapped_table_name']} ON ${keys.map(k => k.trim()).join(' ')}`
          joins.push(joinString);
        }
      }

      formula = `SELECT ${columns.map(col => col.trim()).join(', ')} FROM VSMDDM.${selectedTables[0]['table']['mapped_table_name']} ${joins.join(' ')}`;
      this.sharedDataService.setFormula('tables', formula);
      return;
    }

    // select query for two tables
    if (selectedTables.length >= 2) {
      let columns = [];
      let keys = [];

      if (this.isTable(selectedTables[1]) && this.isTable(selectedTables[0]) && selectedTables[1]['keys'] && selectedTables[1]['keys'].length && selectedTables[0].columns.length && selectedTables[1].columns.length) {
        for (let i = 0; i < selectedTables.length; i++) {
          let tableName = selectedTables[i]['table']['mapped_table_name'];
          let cols = selectedTables[i].columns.map(col => `${tableName}.${col}`);
          columns.push(...cols);
        }

        let joinKeys = selectedTables[1]['keys'].map(key =>
          `${selectedTables[0]['table']['mapped_table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${selectedTables[1]['table']['mapped_table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`)

        keys.push(...joinKeys);

        formula = `SELECT ${columns.map(col => col.trim()).join(', ')} FROM VSMDDM.${selectedTables[0]['table']['mapped_table_name']} ${selectedTables[1]['join'].toUpperCase()} JOIN VSMDDM.${selectedTables[1]['table']['mapped_table_name']} ON ${keys.map(key => key.trim()).join(' ')}`;
        this.sharedDataService.setFormula('tables', formula);
        return;
      }
    }

    // select query for 1 table selection
    if (selectedTables.length >= 1 && this.isTable(selectedTables[0]) && selectedTables[0].table['mapped_column_name'].length && selectedTables[0].columns.length) {
      let columns = (selectedTables[0].table['mapped_column_name'].length === selectedTables[0].columns.length) ?
        '*' : selectedTables[0].columns.map(col => col.trim()).join(', ');

      formula = `SELECT ${columns} FROM VSMDDM.${selectedTables[0]['table']['mapped_table_name']}`;
      this.sharedDataService.setFormula('tables', formula);
      return;
    }

    this.sharedDataService.setFormula('tables', formula);
  }

}