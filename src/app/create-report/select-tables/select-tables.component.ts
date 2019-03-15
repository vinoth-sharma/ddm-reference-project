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
  joins = [];
  isRelated: boolean = false;
  relatedTableId: number;
  selectedTables: any[];
  currentJoin: any;
  reportType: string = '';
  noOfTables: number;
  noOfJoins: number;
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

  setReport() {
    switch (this.reportType) {
      case '1 table':
        this.noOfTables = 1;
        this.noOfJoins = 0;
        break;
      case '1 join':
        this.noOfTables = 2;
        this.noOfJoins = 1;
        break;
      case '2 joins':
        this.noOfTables = 4;
        this.noOfJoins = 3;
        break;
      case '1 join and 1 table':
        this.noOfTables = 3;
        this.noOfJoins = 2;
        break;
      default:
        this.noOfTables = 0;
        this.noOfJoins = 0;
    }
  }

  setRelated() {
    let lastSelectedTableId = this.selectedTables[this.selectedTables.length - 1]['table']['sl_tables_id'];
    this.isRelated = (lastSelectedTableId === this.relatedTableId);
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

  // resetColumns(selected: any) {
  //   selected.columns = [];
  // }

  isTable(selected: any) {
    return this.tables['tables'].map(table => table['sl_tables_id'])
      .includes(selected.table['sl_tables_id']);
  }

  createJoin(selected: any, checked?: boolean) {
    let join = {};
    //'1 table'
    if (this.reportType === '1 table') {
      join['table1'] = JSON.parse(JSON.stringify(this.selectedTables[0]));
      join['table2'] = {};
      join['type'] = '';
      join['id'] = '';

      this.updateJoins(join);
      this.updateSelectedTables(JSON.parse(JSON.stringify(this.selectedTables)));
      this.resetState();
      return;
    };

    // '1 join'
    if (this.reportType === '1 join') {
      if (this.currentJoin['tables'].length < 2) {
        let tableId = selected.table['sl_tables_id'];
        if (checked && !this.currentJoin['tables'].includes(tableId)) {
          this.currentJoin['tables'].push(tableId);
        }

        if (!checked && this.currentJoin['tables'].includes(tableId)) {
          this.currentJoin['tables'].splice(this.currentJoin['tables'].indexOf(tableId), 1);
        }
        return;
      }

      if (this.currentJoin['tables'].length === 2 && this.currentJoin['type']) {
        join['table1'] = JSON.parse(JSON.stringify(this.selectedTables[0]));
        join['table2'] = JSON.parse(JSON.stringify(this.selectedTables[1]));
        join['type'] = this.currentJoin['type'];
        join['id'] = this.currentJoin['tables'].join('-');

        this.updateJoins(join);
        this.updateSelectedTables(this.selectedTables);
        this.resetState();
        return;
      }
    }
  }

  updateJoins(join: any) {
    let selectedJoins = [];
    selectedJoins.push(join);
    this.sharedDataService.setJoins(selectedJoins);
    this.joins = this.sharedDataService.getJoins();
  }

  updateSelectedTables(tables: any) {
    this.sharedDataService.setSelectedTables(tables);
  }

  resetState() {
    this.selectedTables = [{}];
    this.currentJoin = {
      tables: [],
      joinId: '',
      type: ''
    };
  }
}