import { Component, OnInit } from "@angular/core";
import { NewRelationModalService } from "./new-relation-modal.service";
import { ActivatedRoute } from "@angular/router";
import * as $ from "jquery";
import { ToastrService } from "ngx-toastr";
import Utils from "../../utils";

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

  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService, private newRelationModalService: NewRelationModalService) { }

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
     
      // let leftTable = this.inActivateChecked(res.data.sl_table);
      this.rgtTables = JSON.parse(JSON.stringify(res.data.sl_table));
      this.lftTables = JSON.parse(JSON.stringify(res.data.sl_table));
      this.originalRgtTables = JSON.parse(JSON.stringify(res.data.sl_table));
      this.originalLftTables = JSON.parse(JSON.stringify(res.data.sl_table));
    } else {
      this.rgtTables = [];
      this.lftTables = [];
      this.originalRgtTables = [];
      this.originalLftTables = [];
    }
  }

  public isToggled(e, th) {
    this.isToggledIcon = !this.isToggledIcon;
  }

  public assignOriginalCopy(side) {
    if (side == "right") 
    this.rgtTables = JSON.parse(JSON.stringify(this.originalRgtTables));
  else if(side == "left")
    this.lftTables = JSON.parse(JSON.stringify(this.originalLftTables));
  else{
    this.rgtTables = JSON.parse(JSON.stringify(this.originalRgtTables));
    this.lftTables = JSON.parse(JSON.stringify(this.originalLftTables));
    this.selectedJoinType = 'Join';
    this.rgtTableSearch = "";
    this.lftTableSearch = "";
  }
  }

  public searchTable(key) {
    this.rgtTables.forEach(item => { });
  }

  private newRelationUpdateCallback(res: any, err: any) {
    if (err) {
    } else {
      if (res) {
        if (res.status == "Relation Created") {
          //  $('modal').modal('hide');
          this.toastr.success(res.status);
          Utils.hideSpinner();
          Utils.closeModals();
        } else {
          this.toastr.error(res.status);
          Utils.hideSpinner();
        }
      }
    }
  }

  public saveNewRelation() {
    let options = {};
    Utils.showSpinner();
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
      this.selectedRightTableID = this.rgtTables[i].sl_tables_id;
      this.selectedRightColumn = this.rgtTables[i]["mapped_column_name"][j];
    } else {
      this.selectedLeftTableID = this.lftTables[i].sl_tables_id;
      this.selectedLeftColumn = this.lftTables[i]["mapped_column_name"][j];
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
                return data.toLowerCase().match(value.toLowerCase());
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
                return data.toLowerCase().match(value.toLowerCase());
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

  // public isCollapse(event) {
  //   if (event.target.parentNode.classList.contains("collapsed")) {
  //   }
  // };

  public isSave() {
    if (this.selectedJoinType &&
      this.selectedLeftTableID &&
      this.selectedRightTableID &&
      this.selectedLeftColumn &&
      this.selectedRightColumn) {
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