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
  public typeFlag : string;

  constructor(private ObjectExplorerSidebarService: ObjectExplorerSidebarService, private toasterService: ToastrService) { }

  ngOnInit() { }

  public updateVisibilityDetails() {
    let changeData = this.items;
    // console.log("changeData -> ",changeData,"originalData ->" ,this.originalData);    
    let hiddenTables = [], visibleTables = [], hiddenColumns = [], visibleColumns = [];

    if(this.slTables['type'] == 'tables'){
      this.originalData.forEach(function (data, key) {
        if (!(changeData[key]["view_to_admins"] == data["view_to_admins"])) {
          if ((changeData[key]["view_to_admins"] === true)) {
            visibleTables.push(data["sl_tables_id"]);
          } else {
            hiddenTables.push(data["sl_tables_id"]);
          }
        }
      });
    }
    else if(this.slTables['type'] == 'custom tables'){
      this.originalData.forEach(function (data, key) {
        if (!(changeData[key]["view_to_admins"] == data["view_to_admins"])) {
          if ((changeData[key]["view_to_admins"] === true)) {
            visibleTables.push(data["custom_table_id"]);
          } else {
            hiddenTables.push(data["custom_table_id"]);
          }
        }
      });
    }

    let columnVisibility = [];
    let customColumnVisibility = []

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

      if(this.slTables['type'] == 'tables'){
        if (visibleColumns.length || hiddenColumns.length) {
          columnVisibility.push({
            'sl_tables_id': element['sl_tables_id'],
            'columns_to_visible': visibleColumns,
            'columns_to_hide': hiddenColumns,
            'type': 'tables'
          });
        }
      }
      else if(this.slTables['type'] == 'custom tables'){
        if (visibleColumns.length || hiddenColumns.length) {
          customColumnVisibility.push({
            'custom_table_id': element['custom_table_id'],
            'columns_to_visible': visibleColumns,
            'columns_to_hide': hiddenColumns,

          });
        }
      }

      if (visibleTables.length || hiddenTables.length || columnVisibility.length || customColumnVisibility.length) {
        this.isEnabled = true;
      }
    });

    this.options["visible_tables"] = visibleTables;
    this.options["hidden_tables"] = hiddenTables;
    if(this.slTables['type'] == 'tables'){
      this.options["columns_visibility_update"] = columnVisibility;
      this.options['type'] = 'tables';
    }
    else if(this.slTables['type'] == 'custom tables'){
      this.options["custom_visibility_update"] = customColumnVisibility;
      this.options['type'] = 'custom tables';
    }
    
  };

  onApply() {
    this.sendData.emit(this.options);
  }

  public resetAll() {
    this.items = JSON.parse(JSON.stringify(this.slTables['obtainedTables']['data']['sl_table']));
    this.customData = JSON.parse(JSON.stringify(this.slTables['obtainedTables']['data']['sl_table']));
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

    if(this.slTables['type'] == 'tables'){
      defaultData.forEach(element => {
        if (element['sl_tables_id'] == item['sl_tables_id'])
          element['view_to_admins'] = item['view_to_admins'];
      });
    }
    else if(this.slTables['type'] == 'custom tables'){
      defaultData.forEach(element => {
        if (element['custom_table_id'] == item['custom_table_id'])
          element['view_to_admins'] = item['view_to_admins'];
      });
    }
    // defaultData.forEach(element => {
    //   if (element['sl_tables_id'] == item['sl_tables_id'])
    //     element['view_to_admins'] = item['view_to_admins'];
    // });
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
    this.isAllChecked();
  };

  ngOnChanges() {
    if (typeof this.slTables != "undefined") {
      let differentiator;

      if(this.slTables['type'] == 'tables'){
        this.typeFlag = 'tables';
        differentiator = 'mapped_table_name';
        this.originalData = JSON.parse(JSON.stringify(this.slTables['obtainedTables']['data']['sl_table']));
      }
      else if(this.slTables['type'] == 'custom tables'){
        this.typeFlag = 'custom tables';
        differentiator = 'custom_table_name';
        this.originalData = JSON.parse(JSON.stringify(this.slTables['obtainedTables']));
      }
      
      this.originalData.sort(function (a, b) {
        a = a[differentiator].toLowerCase();
        b = b[differentiator].toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      });

      this.originalData.forEach(element => {
        element['column_properties'].sort(function (a, b) {
          a = a.column.toLowerCase();
          b = b.column.toLowerCase();
          return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
      })

      if(this.slTables['type'] == 'tables'){
        this.customData = JSON.parse(JSON.stringify(this.slTables['obtainedTables']['data']['sl_table']));
        this.items = JSON.parse(JSON.stringify(this.slTables['obtainedTables']['data']['sl_table']));
      }
      else if(this.slTables['type'] == 'custom tables'){
        this.customData = JSON.parse(JSON.stringify(this.slTables['obtainedTables']));
        this.items = JSON.parse(JSON.stringify(this.slTables['obtainedTables']));
      }

      //sorting the Itemstable values
      this.items.sort(function (a, b) {
        a = a[differentiator].toLowerCase();
        b = b[differentiator].toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      });

      this.items.forEach(element => {
        element['column_properties'].sort(function (a, b) {
          a = a.column.toLowerCase();
          b = b.column.toLowerCase();
          return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
      })    
      this.items.forEach(val => val.isShow = false)
      this.isAllChecked();
    }
    // }
  }
}