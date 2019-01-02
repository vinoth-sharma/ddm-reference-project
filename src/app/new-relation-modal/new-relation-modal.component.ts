import { Component, OnInit } from "@angular/core";
import { NewRelationModalService } from "./new-relation-modal.service";
import { ActivatedRoute } from "@angular/router";
import * as $ from "jquery";
import { ToastrService } from "ngx-toastr";
import { forEach } from "@angular/router/src/utils/collection";

@Component({
  selector: "app-new-relation-modal",
  templateUrl: "./new-relation-modal.component.html",
  styleUrls: ["./new-relation-modal.component.css"]
})
export class NewRelationModalComponent implements OnInit {
  public rgtTables;
  public lftTables;
  public isToggledIcon;
  public getTableInfoSubscription;
  public selectedLeftTableID;
  public selectedLeftColumn;
  public selectedRightTableID;
  public selectedRightColumn;
  public selectedJoinType;
  public newRelationUpdateSubscription;
  public originalRgtTables;
  public originalLftTables;
  public rgtTableSearch = "";
  public lftTableSearch = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private newRelationModalService: NewRelationModalService
  ) {}

  ngOnInit() {
    this.getTableInfo();
  }

  public getTableInfo() {
    let semantic_id = this.activatedRoute.snapshot.data["semantic_id"];
    this.getTableInfoSubscription = this.newRelationModalService
      .getTableInfo(semantic_id)
      .subscribe(
        res => this.tableInfoCallback(res, null),
        err => this.tableInfoCallback(null, err)
      );
  }

  public tableInfoCallback(res: any, err: any) {
    if (err) {
      this.rgtTables = [];
      this.rgtTables = [];
      this.lftTables = [];
      this.originalRgtTables = [];
      this.originalLftTables = [];
    } else if (res && (res.data.sl_table.length || res.data.sl_view.length)) {
     
      let leftTable = this.inActivateChecked(res.data.sl_table);
      this.rgtTables = JSON.parse(JSON.stringify(leftTable));
      this.lftTables = JSON.parse(JSON.stringify(leftTable));
      this.originalRgtTables = JSON.parse(JSON.stringify(leftTable));
      this.originalLftTables = JSON.parse(JSON.stringify(leftTable));
    } else {
      this.rgtTables = [];
      this.lftTables = [];
      this.originalRgtTables = [];
      this.originalLftTables = [];
    }
  }

  public inActivateChecked(tableArr){
    let leftTable = [];
    tableArr.forEach(function(element,k ){
      leftTable.push(JSON.parse(JSON.stringify(element))); 
      leftTable[k]['mapped_column_name'] = [];
      element.mapped_column_name.forEach(function(data,i){
        leftTable[k]['mapped_column_name'].push({'name': data.name == undefined?data:data.name,'isChecked':false});
      })
    });
    return leftTable;
  }

  public isToggled(e, table) {
    table.isToggle = !table.isToggle;
  }

  public assignOriginalCopy(side) {
    if (side == "right") 
      this.rgtTables = JSON.parse(JSON.stringify(this.originalRgtTables));
    else if(side == "left")
      this.lftTables = JSON.parse(JSON.stringify(this.originalLftTables));
    else{
      this.rgtTables = JSON.parse(JSON.stringify(this.originalRgtTables));
      this.lftTables = JSON.parse(JSON.stringify(this.originalLftTables));
      this.selectedJoinType = undefined;
      this.rgtTableSearch = "";
      this.lftTableSearch = "";
    }
  }

  public searchTable(key) {
    this.rgtTables.forEach(item => {});
  } 

  private newRelationUpdateCallback(res: any, err: any) {
    if (err) {
    } else {
      if (res) {
        if (res.status == "Relation Created") {
          
          this.toastr.success(res.message);
          $("#saveButton").attr("data-dismiss", "modal");
        } else {
         
          this.toastr.error(res.message);
          // $("#saveButton").attr("data-dismiss", "modal");
          // $("#exampleModalCenter").hide();
          // $('#exampleModalCenter').removeClass('show');
          // (<any>$('#saveButton')[0]).modal('hide');
          // $('#exampleModalCenter').removeClass("in");
          // $('.modal-backdrop').remove();
          // $('body').removeClass('modal-open');
          // $('body').css('padding-right','');
          // $('#exampleModalCenter').hide();
          
        }
      }
    }
  }

  public saveNewRelation() {
    let options = {};
    (options["join_type"] = this.selectedJoinType),
      (options["left_table_id"] = this.selectedLeftTableID),
      (options["right_table_id"] = this.selectedRightTableID),
      (options["primary_key"] = this.selectedLeftColumn),
      (options["foreign_key"] = this.selectedRightColumn);
    this.newRelationUpdateSubscription = this.newRelationModalService
      .saveTableRelationsInfo(options)
      .subscribe(
        res => this.newRelationUpdateCallback(res, null),
        err => this.newRelationUpdateCallback(null, err)
      );
  }

  public selectColumn(i, j, side) {
   
    if (side == "right") {
      this.rgtTables = this.inActivateChecked(this.rgtTables);
      this.rgtTables[i]["mapped_column_name"][j].isChecked = true;
      this.selectedRightTableID = this.rgtTables[i].sl_tables_id;
      this.selectedRightColumn = this.rgtTables[i]["mapped_column_name"][j].name;
    } else {
      this.lftTables = this.inActivateChecked(this.lftTables);
      this.lftTables[i]["mapped_column_name"][j].isChecked = true;
      this.selectedLeftTableID = this.lftTables[i].sl_tables_id;
      this.selectedLeftColumn = this.lftTables[i]["mapped_column_name"][j].name;
    }
  }

  public selectedJoin(value) {
    this.selectedJoinType = value;
  }

  public filterItem(value, side) {
    if (side == "right") {
      let isFound;
      let results = [];
      if (value != "" || value != undefined) {
        results = JSON.parse(JSON.stringify(this.originalRgtTables)).filter(
          ele => {
            if (
              ele.mapped_table_name.toLowerCase().match(value.toLowerCase())
            ) {
              return ele;
            } else {
              ele.mapped_column_name = ele.mapped_column_name.filter(data => {
                return data.name.toLowerCase().match(value.toLowerCase());
              });
              if (ele.mapped_column_name.length != 0) {
                return ele;
              }
            }
          }
        );
      } else {
        results = JSON.parse(JSON.stringify(this.originalRgtTables));
      }
      this.rgtTables = results;
    } else {
      let results = [];
      if (value != "" || value != undefined) {
        results = JSON.parse(JSON.stringify(this.originalLftTables)).filter(
          ele => {
            if (
              ele.mapped_table_name.toLowerCase().match(value.toLowerCase())
            ) {
              return ele;
            } else {
              ele.mapped_column_name = ele.mapped_column_name.filter(data => {
                return data.name.toLowerCase().match(value.toLowerCase());
              });
              if (ele.mapped_column_name.length != 0) {
                return ele;
              }
            }
          }
        );
      } else {
        results = JSON.parse(JSON.stringify(this.originalLftTables));
      }
      this.lftTables = results;
    }
  }

  public isSave() {
    if (
      this.selectedJoinType &&
      this.selectedLeftTableID &&
      this.selectedRightTableID &&
      this.selectedLeftColumn &&
      this.selectedRightColumn
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * cancelNewRelation
   */
  public cancelNewRelation() {
    this.assignOriginalCopy('both');
  }

  ngOnDestroy() {
    this.getTableInfoSubscription.unsubscribe();
    if (this.newRelationUpdateSubscription)
      this.newRelationUpdateSubscription.unsubscribe();
  }
}
