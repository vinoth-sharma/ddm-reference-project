import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { SemdetailsService } from '../semdetails.service'
import { ReportsService } from "../reports/reports.service";

@Component({
  selector: 'app-report-tables',
  templateUrl: './report-tables.component.html',
  styleUrls: ['./report-tables.component.css']
})

export class ReportTablesComponent implements OnInit {

  tables: any[];
  cachedTables: any[];
  relatedTables: any[];
  cachedRelatedTables: any[];
  // isLoading: boolean;
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private semdetailsService: SemdetailsService, private reportsService: ReportsService, private toasterService: ToastrService) { }

  ngOnInit() {
    // this.isLoading = true;
    this.semdetailsService.myMethod$.subscribe(response => {
      this.tables = response || [];
      this.cachedTables = this.tables.slice();
      // this.isLoading = false;
    });
  }

  public getRelatedTables(tableId: number) {
    this.reportsService.getTables(tableId).subscribe(response => {
      this.relatedTables = response['table_data'];
      this.cachedRelatedTables = this.relatedTables.slice();
    },
    error => {
      this.toasterService.error(error.message["error"] || this.defaultError);
      this.relatedTables = [];
    });
  }

  public getFilteredList(searchText: string, side: string) {
    if (side === 'left') {
      this.tables = this.filter(searchText, this.cachedTables)
    }
    else if (side === 'right') {
      this.relatedTables = this.filter(searchText, this.cachedRelatedTables)
    }
  }

  private filter(searchText: string, tables: any[]) {
    if (searchText) {
      return JSON.parse(JSON.stringify(tables)).filter(table => {
        if (table.mapped_table_name.toLowerCase().match(searchText.toLowerCase())) {
          return table;
        } else {
          table.mapped_column_name = table.mapped_column_name.filter(col => {
            return col.toLowerCase().match(searchText.toLowerCase());
          });
          if (table.mapped_column_name.length) return table;
        }
      });
    }
    else {
      return tables;
    }
  }
}

// TODO:
// get primary, secondary key, for related tables
// on select columns of a table, remove column sel for other tables