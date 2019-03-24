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

  columnDropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    maxHeight: 60
  };

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
      this.selectedTables[this.selectedTables.length - 1].disabled = false;

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
    return this.tables['custom tables'].map(table => table['sl_tables_id'])
      .includes(selected.table['sl_tables_id']);
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
    if (this.isRelated || !this.isTable(selected)) return;

    // fetch related tables only if it is a table and not a related or custom table
    Utils.showSpinner();
    this.reportsService.getTables(selected['table']['sl_tables_id']).subscribe(response => {
      this.tables['related tables'] = response['table_data'] || [];
      Utils.hideSpinner();

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

    if (!this.selectedTables.length) this.resetState();
  }

  resetState() {
    this.selectedTables = this.sharedDataService.getSelectedTables();

    this.getTables();
    this.updateSelectedTables();
    // this.isRelated = false;
    this.setRelated();

    if (!this.selectedTables.length) this.addRow();
  }

  getColumnTypes(selected: any) {
    let data = {};
    data['table_id'] = selected['table']['sl_tables_id'];
    // data['table_id'] = 194, 'mapped_table';

    if (this.isTable(selected)) {
      data['table_type'] = 'mapped_table';
    }
    else if (this.isCustomTable(selected)) {
      data['table_type'] = 'custom_table';
    }

    this.selectTablesService.getColumns(data).subscribe(response => {
      this.columnProps[data['table_id']] = response['data'];
    }, error => {
      // this.toasterService.error(error['message'].error || this.defaultError);
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

    if (selectedTables.length === 2) {
      this.joinData = [];
      let tables = selectedTables.map(table => {
        return {
          // table_id: 194, 
          // columns: this.columnProps[194] 
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
    let formula: string;

    // selct query for two tables
    if (selectedTables.length >= 2) {
      let columns = [];
      let keys = [];

      if (selectedTables[1]['keys'] && selectedTables[1]['keys'].length && selectedTables[0].columns.length && selectedTables[1].columns.length) {
        for (let i = 0; i < selectedTables.length; i++) {
          // TODO: check for custom table
          let tableName = selectedTables[i]['table']['mapped_table_name'];
          let temp = selectedTables[i].columns.map(col => `${tableName}.${col}`);
          columns.push(...temp);
        }

        let tempKeys = selectedTables[1]['keys'].map(key =>
          `${selectedTables[0]['table']['mapped_table_name']}.${key.primaryKey['mapped_column']} ${key.operation} ${selectedTables[1]['table']['mapped_table_name']}.${key.foreignKey['mapped_column']} ${key.operator ? key.operator : ''}`)

        keys.push(...tempKeys);

        formula = `SELECT ${columns} FROM VSMDDM.${selectedTables[0]['table']['mapped_table_name']} ${selectedTables[1]['join'].toUpperCase()} JOIN VSMDDM.${selectedTables[1]['table']['mapped_table_name']} ON ${keys.map(k => k.trim()).join(' ')}`;

        this.sharedDataService.setFormula('tables', formula);
        return;
      }
    }

    // select query for 1 table selection
    if (selectedTables.length >= 1 && selectedTables[0].table && selectedTables[0].table['mapped_column_name'].length && selectedTables[0].columns.length) {
      let columns = (selectedTables[0].table['mapped_column_name'].length === selectedTables[0].columns.length) ?
        '*' : selectedTables[0].columns.join(',');

      formula = `SELECT ${columns} FROM VSMDDM.${selectedTables[0]['table']['mapped_table_name']}`;
      this.sharedDataService.setFormula('tables', formula);
      return;
    }
  }

}