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
  public button;
  @Input() slTables: any[];
  @Input() isLoad: boolean;
  @Output() public sendData = new EventEmitter();
  public visibleTables = [];
  public hiddenTables = [];
  public originalData;
  public customData;
  public selectValue;
  public isEnabled: boolean = false;
  public isShow: boolean = false;
  options: any = [];
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private ObjectExplorerSidebarService: ObjectExplorerSidebarService, private toasterService: ToastrService) { }

  ngOnInit() { }

  public updateVisibilityDetails() {
    let changeData = this.items;
    let hiddenTables = [], visibleTables = [], hiddenColumns = [], visibleColumns = [];
    this.originalData.forEach(function (data, key) {
      if (!(changeData[key]["view_to_admins"] == data["view_to_admins"])) {
        if ((changeData[key]["view_to_admins"] === true)) {
          visibleTables.push(data["sl_tables_id"]);
        } else {
          hiddenTables.push(data["sl_tables_id"]);
        }
      }
    });

    let columnVisibility = [];
    this.originalData.forEach((element, key) => {
      visibleColumns = [], hiddenColumns = [];
      element['column_properties'].forEach((column, cKey) => {
        if (column['column_view_to_admins'] !== changeData[key]['column_properties'][cKey]['column_view_to_admins']) {
          if (changeData[key]['column_properties'][cKey]['column_view_to_admins']) {
            visibleColumns.push(column['column']);
          } else {
            hiddenColumns.push(column['column']);
          }
        }
      });
      if (visibleColumns.length || hiddenColumns.length) {
        columnVisibility.push({
          'sl_tables_id': element['sl_tables_id'],
          'columns_to_visible': visibleColumns,
          'columns_to_hide': hiddenColumns
        });
      }
      if (visibleTables.length || hiddenTables.length || columnVisibility.length) {
        this.isEnabled = true;
      }
    });

    this.options["visible_tables"] = visibleTables;
    this.options["hidden_tables"] = hiddenTables;
    this.options["columns_visibility_update"] = columnVisibility;
  };

  onApply() {
    this.sendData.emit(this.options);
  }

  public resetAll() {
    this.items = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
    this.customData = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
    this.isAllChecked();
  }

  showColumns(i, item) {
    this.button = i;
    this.isShow = !this.isShow;
    item.isShow = !item.isShow;
  }

  public onSelect(item) {
    item.column_properties.forEach(val => val.column_view_to_admins = !item.view_to_admins)
    item.view_to_admins = !item.view_to_admins;
    let defaultData = this.customData;
    defaultData.forEach(element => {
      if (element['sl_tables_id'] == item['sl_tables_id'])
        element['view_to_admins'] = item['view_to_admins'];
    });
    this.customData = defaultData;
    this.isAllChecked();
  }

  public onSelectColumn(item, index) {
    item.column_properties[index].column_view_to_admins = !item.column_properties[index].column_view_to_admins;
    item.view_to_admins = item.column_properties.some((val) => { return val["column_view_to_admins"] === true })
    this.isAllChecked();
  }

  public isAllChecked() {
    this.selectValue = this.items.every((data) => data["view_to_admins"]);
    // let changeData = this.customData;
    // let button = false;
    // this.originalData.forEach(function (data, key) {
    //   if (!(changeData[key]["view_to_admins"] == data["view_to_admins"] || changeData[key]["column_view_to_admins"] == data["column_view_to_admins"])) {
    //     // button = true;
    //   }
    // })
    // this.isEnabled = button;
    this.updateVisibilityDetails();
  }

  public selectAll(event) {
    let state = event.target.checked;
    let defaultData = this.customData;
    this.items.forEach(function (item: any) {
      item.view_to_admins = state;
      item.column_properties.forEach(val => val.column_view_to_admins = item.view_to_admins)
      defaultData.forEach(element => {
        if (element['sl_tables_id'] == item['sl_tables_id'])
          element['view_to_admins'] = item['view_to_admins'];
      });
    })
    this.customData = defaultData;
  }

  public filterList(searchText: string) {
    this.items = this.customData;
    if (searchText) {
      this.items = JSON.parse(JSON.stringify(this.customData)).filter(table => {
        if ((table['mapped_table_name'] && table['mapped_table_name'].toLowerCase().match(searchText.toLowerCase())) ||
          (table['table_name'] && table['table_name'].toLowerCase().match(searchText.toLowerCase()))) {
          return table;
        }
      })
    }
    //sorting the Itemstable values
    this.items.sort(function (a, b) {
      a = a.mapped_table_name.toLowerCase();
      b = b.mapped_table_name.toLowerCase();
      return (a < b) ? -1 : (a > b) ? 1 : 0;
    });
    this.isAllChecked();
  };

  ngOnChanges() {
    if (typeof this.slTables != "undefined") {
      this.originalData = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
      // this.originalData.sort(function (a, b) {
      //   a = a.mapped_table_name.toLowerCase();
      //   b = b.mapped_table_name.toLowerCase();
      //   return (a < b) ? -1 : (a > b) ? 1 : 0;
      // });
      this.customData = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
      this.items = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
      this.items.forEach(val => val.isShow = false)
      this.isAllChecked();
    }
  }
}