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

  columnDropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // allowSearchFilter: true,
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

  addRow(relatedTables?: boolean) {
    // listType is set for default list selection
    if (relatedTables) {
      this.selectedTables.push({ listType: 'related tables' });
    }
    else {
      this.selectedTables.push({ listType: 'tables' });
    }
  }

  resetColumns(selected: any) {
    selected.columns = [];
  }

  getRelatedTables(selected: any) {
    // reset columns on change of table selection
    selected.columns = [];

    Utils.showSpinner();
    this.reportsService.getTables(selected['table']['sl_tables_id']).subscribe(response => {
      this.relatedTables = response['table_data'] || [];
      Utils.hideSpinner();
    },
      error => {
        this.toasterService.error(error.message["error"] || this.defaultError);
        // this.relatedTables = [];
        Utils.hideSpinner();
      });
  }

  createJoin(checked?: boolean, rowIndex?: number) {
    if (checked && !this.currentJoin['tables'].includes(rowIndex) && this.currentJoin['tables'].length < 2) {
      this.currentJoin['tables'].push(rowIndex);
    }

    if (!checked && this.currentJoin['tables'].includes(rowIndex)) {
      this.currentJoin['tables'].splice(this.currentJoin['tables'].indexOf(rowIndex), 1);
      return;
    }

    if (this.currentJoin['tables'].length === 2 && !!this.currentJoin['type']) {
      this.currentJoin['joinId'] = this.currentJoin['tables'].join('-');
      this.joins.push(this.currentJoin);
      this.sharedDataService.setJoin(JSON.parse(JSON.stringify(this.currentJoin)));
    }
  }

}