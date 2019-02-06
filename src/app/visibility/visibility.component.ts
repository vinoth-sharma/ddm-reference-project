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
  public stables;
  public selectValue;
  public isEnabled: boolean = false;
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private ObjectExplorerSidebarService: ObjectExplorerSidebarService, private toasterService: ToastrService) { }

  ngOnInit() {
  }

  public updateVisibilityDetails(option) {

    if (option.view_to_admins == true) {
      this.visibleTables.push(option.sl_tables_id);
    } else {
      this.hiddenTables.push(option.sl_tables_id);
    }
    let button = false;
    let changeData = this.items;
    this.originalData.forEach(function (data, key) {
      if (!(changeData[key]["view_to_admins"] == data["view_to_admins"]))
        button = true;

    }

    )
    this.isEnabled = button;
  };

  public updateVisibility() {

    let options = {};
    options["visible_tables"] = this.visibleTables;
    options["hidden_tables"] = this.hiddenTables;
    this.sendData.emit(options);
  }

  public resetAll() {
    this.items = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
  }

  public isAllChecked() {

    this.selectValue = this.items.every((data) => data["view_to_admins"]);

  }

  public selectAll(event) {

    console.log(event.target.checked, "hm");
    // if (event.target.checked) {
    let state = event.target.checked;
    this.items.forEach(function (item: any) {
      item.view_to_admins = state;
    })
    let button = false;
    let changeData = this.items;
    this.originalData.forEach(function (data, key) {
      if (!(changeData[key]["view_to_admins"] == data["view_to_admins"]))
        button = true;

    }

    )
    this.isEnabled = button;
    // } else {
    //   let value = this.selectValue;
    //   this.items.forEach(function (item: any) {
    //     item.view_to_admins = value ;s
    //   })  
    // }
  }


  public filterList(searchText: string) {
    console.log(searchText, "this is the letter being");
    if (searchText) {
      this.items = JSON.parse(JSON.stringify(this.originalData)).filter(table => {
        if ((table['mapped_table_name'] && table['mapped_table_name'].toLowerCase().match(searchText.toLowerCase())) ||
          (table['table_name'] && table['table_name'].toLowerCase().match(searchText.toLowerCase()))) {
          return table;
        }
      })
    }
  };


  ngOnChanges() {
    if (typeof this.slTables != "undefined") {
      this.originalData = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
      this.items = JSON.parse(JSON.stringify(this.slTables['data']['sl_table']));
    }
  }
}
