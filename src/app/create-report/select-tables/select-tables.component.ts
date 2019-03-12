import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { ReportsService } from '../../reports/reports.service';
import { SharedDataService } from '../shared-data.service';
import Utils from 'src/utils';

@Component({
  selector: 'app-select-tables',
  templateUrl: './select-tables.component.html',
  styleUrls: ['./select-tables.component.css']
})

export class SelectTablesComponent implements OnInit {

  tables = {};
  relatedTables: any[];
  selectedTables = [{ listType: 'tables' }];
  joins = [];
  isRelated: boolean = false;
  relatedTableId: number;

  columnDropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    maxHeight: 60
  };

  currentJoin = {
    tables: [],
    joinId: '',
    type: ''
  };

  defaultError: string = "There seems to be an error. Please try again later.";

  constructor(
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private toasterService: ToastrService,
    private reportsService: ReportsService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    this.getTables();
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
    // listType is set for default list selection
    if (this.isRelated) {
      this.selectedTables.push({ listType: 'related tables' });
    }
    else {
      this.selectedTables.push({ listType: 'tables' });
    }
  }

  resetColumns(selected: any) {
    selected.columns = [];
  }

  setRelated() {
    let lastSelectedTableId = this.selectedTables[this.selectedTables.length - 1]['table']['sl_tables_id'];
    this.isRelated = (lastSelectedTableId === this.relatedTableId);
  }

  getRelatedTables(selected: any) {
    // reset columns on change of table selection
    this.resetColumns(selected);

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

  createJoin(selected: any, checked?: boolean) {
    let tableId = selected.table['sl_tables_id'];

    if (this.currentJoin['tables'].length < 2) {
      if (checked && !this.currentJoin['tables'].includes(tableId)) {
        this.currentJoin['tables'].push(tableId);
      }

      if (!checked && this.currentJoin['tables'].includes(tableId)) {
        this.currentJoin['tables'].splice(this.currentJoin['tables'].indexOf(tableId), 1);
      }
      return;
    }

    if (this.currentJoin['tables'].length === 2 && this.currentJoin['type']) {
      let join = {};
      join['table1'] = JSON.parse(JSON.stringify(this.selectedTables[0]));
      join['table2'] = JSON.parse(JSON.stringify(this.selectedTables[1]));
      join['type'] = this.currentJoin['type'];
      join['id'] = this.currentJoin['tables'].join('-');

      this.joins.push(join);
      this.sharedDataService.setJoin(JSON.parse(JSON.stringify(this.joins)));
      this.sharedDataService.setSelectedTables(JSON.parse(JSON.stringify(this.selectedTables)));
    }
  }
}