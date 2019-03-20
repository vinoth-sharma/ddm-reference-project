import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
// import { SemdetailsService } from '../semdetails.service'
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
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
  defaultError: string = "There seems to be an error. Please try again later.";
  join: string = '';
  primaryKey: string = '';
  foreignKey: string = '';
  checked={'tables':{}, 'relatedTables': {}};

  constructor(private objectExplorerSidebarService: ObjectExplorerSidebarService, private reportsService: ReportsService, private toasterService: ToastrService) { }

  ngOnInit() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      console.log('semdetails', tables)
      this.tables = tables || [];
      this.cachedTables = this.tables.slice();
      // this.isLoading = false;
    })
  }

  public getRelatedTables(tableId: number) {
    this.reportsService.getTables(tableId).subscribe(response => {
      this.relatedTables = response['table_data'] || [];
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

  public setJoinInfo(table: any){
    this.join = table['type_of_join'];
    // TODO: where to?
    this.primaryKey = table['keys']['p_key']['primary_key'];
    this.foreignKey = table['keys']['f_key']['foreign_key'];

    console.log('setJoin', table, this.join, this.primaryKey, this.foreignKey)

  }

  setChecked(column, event){
    event.stopPropagation();
    // this.checked[column+'_'+index] = !this.checked[column+'_'+index]
    // console.log('setCol', column, event, this.checked);
  }

  setKey(column:string, side: string){
    console.log('setKey', column, side)
    if(side === 'left'){
      this.primaryKey = column;
    }
    else if(side === 'right'){
      this.foreignKey = column;
    }
  }
}

// TODO:
// get primary, secondary key, for related tables
// on select columns of a table, remove column sel for other tables