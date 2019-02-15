import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { ToastrService } from "ngx-toastr";


@Component({
  selector: 'app-visibility',
  templateUrl: './visibility.component.html',
  styleUrls: ['./visibility.component.css']
})
export class VisibilityComponent implements OnInit {
  public items = [];
  public data; values;
  @Input() slTables: any[];
  @Input() isLoad: boolean;
  @Output() public sendData = new EventEmitter();
  public visibleTables = [];
  public hiddenTables = [];
  public originalData;
  public selectValue;
  public isEnabled: boolean = false;
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private ObjectExplorerSidebarService: ObjectExplorerSidebarService, private toasterService: ToastrService) { }

  ngOnInit() {
  }

  public updateVisibilityDetails() {
    let changeData = this.items;
    let hiddenTables = [];
    let visibleTables = [];
    this.originalData.forEach(function (data, key) {
      if (!(changeData[key]["view_to_admins"] == data["view_to_admins"])) {
        if ((changeData[key]["view_to_admins"] === true)) {
          visibleTables.push(data["sl_tables_id"]);
        } else {
          hiddenTables.push(data["sl_tables_id"]);
        }
      }
    })
    this.visibleTables = visibleTables;
    this.hiddenTables = hiddenTables;
    this.updateVisibility();
  };

  public updateVisibility() {

    let options = {};
    options["visible_tables"] = this.visibleTables;
    options["hidden_tables"] = this.hiddenTables;
    this.sendData.emit(options);
  }

  public resetAll() {
    this.items = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
    this.isAllChecked();
  }

  public isAllChecked() {
    this.selectValue = this.items.every((data) => data["view_to_admins"]);
    let changeData = this.items;
    let button = false;
    this.originalData.forEach(function (data, key) {
      if (!(changeData[key]["view_to_admins"] == data["view_to_admins"])) {
        button = true;
      }
    })
    this.isEnabled = button;
  }

  public selectAll(event) {
    let state = event.target.checked;
    this.items.forEach(function (item: any) {
      item.view_to_admins = state;
    })
  }

  public filterList(searchText: string) {
    if (searchText) {
      this.items = JSON.parse(JSON.stringify(this.originalData)).filter(table => {
        if ((table['mapped_table_name'] && table['mapped_table_name'].toLowerCase().match(searchText.toLowerCase())) ||
          (table['table_name'] && table['table_name'].toLowerCase().match(searchText.toLowerCase()))) {
          return table;

        }
      })
    }
    let orgData = this.originalData;
    let searchedData = [];
    this.items.forEach(function (data, key) {
      if ((orgData[key]["sl_tables_id"] == data["sl_tables_id"])) {
        searchedData.push(orgData[key]);
      }
    })
    this.originalData = searchedData;
  };


  ngOnChanges() {
    if (typeof this.slTables != "undefined") {
      this.originalData = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
      this.items = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
      this.isAllChecked();
    }
  }
}
