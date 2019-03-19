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
  isRelated: boolean = false;
  relatedTableId: number;
  selectedTables = [{}];
  defaultError: string = "There seems to be an error. Please try again later.";

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
    this.selectedTables.push({});
  }

  setRelated() {
    let lastSelectedTableId = this.selectedTables[this.selectedTables.length - 1]['table']['sl_tables_id'];
    this.isRelated = (lastSelectedTableId === this.relatedTableId);

    this.updateSelectedTables();
  }

  getRelatedTables(selected: any) {
    // reset columns on change of table selection
    selected.columns = [];

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

  isTable(selected: any) {
    return this.tables['tables'].map(table => table['sl_tables_id'])
      .includes(selected.table['sl_tables_id']);
  }

  updateSelectedTables() {
    this.sharedDataService.setSelectedTables(JSON.parse(JSON.stringify(this.selectedTables)));
  }

}