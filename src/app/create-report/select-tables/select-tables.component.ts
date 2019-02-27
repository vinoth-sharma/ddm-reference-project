import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { ReportsService } from 'src/app/reports/reports.service';

@Component({
  selector: 'app-select-tables',
  templateUrl: './select-tables.component.html',
  styleUrls: ['./select-tables.component.css']
})

export class SelectTablesComponent implements OnInit {

  tables = {};
  relatedTables: any[];
  selectedTables = [{}];
  columnDropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // allowSearchFilter: true,
    itemsShowLimit: 1,
    maxHeight: 60
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

  addRow() {
    this.selectedTables.push({});
    // console.log('addRow', this.selectedTables)
  }

  getRelatedTables(tableId: number) {
    this.reportsService.getTables(tableId).subscribe(response => {
      this.relatedTables = response['table_data'] || [];
    },
      error => {
        this.toasterService.error(error.message["error"] || this.defaultError);
        // this.relatedTables = [];
      });
  }

  // onColumnSelect(item: any) {
  //   console.log(item);
  // }

  // onColumnSelectAll(items: any) {
  //   console.log(items);
  // }

}
