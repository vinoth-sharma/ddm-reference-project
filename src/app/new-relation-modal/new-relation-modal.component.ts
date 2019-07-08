import { Component, OnInit, Input, SimpleChanges, SimpleChange } from "@angular/core";
import { NewRelationModalService } from "./new-relation-modal.service";
import { ToastrService } from "ngx-toastr";
import Utils from "../../utils";
import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";

@Component({
  selector: "app-new-relation-modal",
  templateUrl: "./new-relation-modal.component.html",
  styleUrls: ["./new-relation-modal.component.css"]
})
export class NewRelationModalComponent implements OnInit {
  public leftObject: any;
  public rightObject: any;
  public selectedJoinType: string;
  public newRelationUpdateSubscription;
  public tables:any;
  public originalTable:any;

  constructor(
    private toastr: ToastrService,
    private newRelationModalService: NewRelationModalService,
    private objectExplorerSidebarService: ObjectExplorerSidebarService
  ) {}

  ngOnInit() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables = Array.isArray(tables) ? tables : [];
      this.resetState();
    });
  }

  private newRelationUpdateCallback(res: any, err: any) {
    if (err) {
    } else {
      if (res.message.toLowerCase() == 'new relation created' || res.message.toLowerCase() == "relation created") {
        this.toastr.success(res.message);
        Utils.hideSpinner();
        Utils.closeModals();
      }else{
        this.toastr.error(res.message);
        Utils.hideSpinner();
      }
    }
  }

  public save() {
    let options = {};
    Utils.showSpinner();
    options = {
      'join_type' :  this.selectedJoinType,
      'left_table_id' : this.leftObject['selectedTableId'],
      'right_table_id' : this.rightObject['selectedTableId'],
      'primary_key' : this.leftObject['selectedColumn'],
      'foreign_key' : this.rightObject['selectedColumn']
    }
    this.newRelationUpdateSubscription = this.newRelationModalService
      .saveTableRelationsInfo(options)
      .subscribe(
        res => this.newRelationUpdateCallback(res, null),
        err => this.newRelationUpdateCallback(null, err)
      );
  }

  public selectColumn(i, j, side) {

    if (side == "right") {
      this.rightObject["selectedTableId"] = this.rightObject["tables"][i].sl_tables_id;
      this.rightObject["selectedColumn"] = this.rightObject["tables"][i]["mapped_column_name"][j];
      this.rightObject["selectedDataType"] = this.rightObject["tables"][i]["column_properties"][j]['data_type'];
    } else {
      this.leftObject["selectedTableId"] = this.leftObject["tables"][i].sl_tables_id;
      this.leftObject["selectedColumn"] = this.leftObject["tables"][i]["mapped_column_name"][j];
      this.leftObject["selectedDataType"] = this.leftObject["tables"][i]["column_properties"][j]['data_type'];
    }
  }

  /**
   * isEnable
   */
  public isEnable() {
    return !(
      this.selectedJoinType && 
      this.leftObject['selectedTableId'] &&
      this.rightObject['selectedTableId'] && 
      this.leftObject['selectedColumn'] &&
      this.rightObject['selectedColumn'] && 
      (this.rightObject["selectedDataType"] === this.leftObject["selectedDataType"])
    )
  }

  /**
   * searchedItem
   */
  public searchedItem(value) {
    let results = [];

    if (value) {
      results = JSON.parse(JSON.stringify(this.originalTable)).filter(ele => {
        if (ele.mapped_table_name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          return ele;
        } else {
          ele.mapped_column_name = ele.mapped_column_name.filter(data => {
            return (data.toLowerCase().indexOf(value.toLowerCase()) > -1);
          });
          if (ele.mapped_column_name.length != 0) {
            return ele;
          }
        }
      });
    } else {
      results = JSON.parse(JSON.stringify(this.originalTable));
    }
    
    return results;
  }

  public filterItem(value, side) {
    if (side == "right") {
      this.rightObject['selectedTableId'] = '';
      this.rightObject['selectedColumn'] = '';
      this.rightObject["tables"] = this.searchedItem(value);
    } else {
      this.leftObject['selectedTableId'] = '';
      this.leftObject['selectedColumn'] = '';
      this.leftObject["tables"] = this.searchedItem(value);
    }
  }

  ngOnDestroy() {
    if (this.newRelationUpdateSubscription)
      this.newRelationUpdateSubscription.unsubscribe();
  }


  public resetState(){

    this.originalTable = JSON.parse(JSON.stringify(this.tables));
    this.selectedJoinType = '';
    this.rightObject = {
      'tables' : JSON.parse(JSON.stringify(this.tables)),
      'search' : '',
      'selectedTableId' : '',
      'selectedColumn' : '',
      'selectedDataType': ''
    }

    this.leftObject = {
      'tables' : JSON.parse(JSON.stringify(this.tables)),
      'search' : '',
      'selectedTableId' : '',
      'selectedColumn' : '',
      'selectedDataType': '' 
    }
  }

  toggleCollapse(event){
    if(event.target.parentNode.classList[1] && event.target.parentNode.classList[1] == 'collapsed'){
      event.target.parentNode.attributes['aria-expanded'].value = true;
    }else{
      event.target.parentNode.attributes['aria-expanded'].value = false;
    }
  }

}
