import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { ReportsService } from 'src/app/reports/reports.service';
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

  constructor(private objectExplorerSidebarService: ObjectExplorerSidebarService, private toasterService: ToastrService, private reportsService: ReportsService) { }

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

  addRow(relatedTables?:boolean) {
    // listType is set for default list selection

    if(relatedTables){
      this.selectedTables.push({ listType: 'related tables' });
    }
    else {
      this.selectedTables.push({ listType: 'tables' });
      // delete this.tables['related tables'];
    }
    console.log('addRow', this.selectedTables, this.tables)
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
      // this.tables['related tables'] = response['table_data'] || [];
      Utils.hideSpinner();
    },
    error => {
      this.toasterService.error(error.message["error"] || this.defaultError);
      // this.relatedTables = [];
      Utils.hideSpinner();
    });
  }

  createJoin(checked?: boolean, rowIndex?: number) {
    // console.log('createJoin', this.currentJoin, checked, rowIndex)

    if (checked && !this.currentJoin['tables'].includes(rowIndex) && this.currentJoin['tables'].length < 2) {
      this.currentJoin['tables'].push(rowIndex);
      // console.log('if 1', this.currentJoin)
    }

    if (!checked && this.currentJoin['tables'].includes(rowIndex)) {
      this.currentJoin['tables'].splice(this.currentJoin['tables'].indexOf(rowIndex), 1);
      // console.log('if 2', this.currentJoin)
      return;
    }

    if (this.currentJoin['tables'].length === 2 && !!this.currentJoin['type']) {
      this.currentJoin['joinId'] = this.currentJoin['tables'].join('-');
      this.joins.push(JSON.parse(JSON.stringify(this.currentJoin)));
      this.currentJoin = {
        tables: [],
        joinId: '',
        type: ''
      };
    }
    console.log('if 3', this.currentJoin, this.joins)
  }

  // deleteJoin(joinId: string) {
  //   // let join = this.joins.find(j => j['joinId'] === joinId)
  //   // this.joins.splice(this.joins.indexOf(join), 1);

  //   console.log('deleteJoin', joinId, this.joins)
  // }

  
  // onColumnSelect(item: any) {
  //   console.log(item);
  // }

  // onColumnSelectAll(items: any) {
  //   console.log(items);
  // }
}
