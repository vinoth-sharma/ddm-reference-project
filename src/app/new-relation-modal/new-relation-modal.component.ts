import { Component, OnInit, Input } from "@angular/core";
import { NewRelationModalService } from "./new-relation-modal.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import Utils from "../../utils";

@Component({
  selector: "app-new-relation-modal",
  templateUrl: "./new-relation-modal.component.html",
  styleUrls: ["./new-relation-modal.component.css"]
})
export class NewRelationModalComponent implements OnInit {
  public leftObject: any = {};
  public rightObject: any = {};
  public selectedJoinType;
  public getTableInfoSubscription;
  public newRelationUpdateSubscription;
  @Input() tables: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private newRelationModalService: NewRelationModalService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.tables) {
      this.rightObject["rgtTables"] = JSON.parse(JSON.stringify(this.tables));
      this.leftObject["lftTables"] = JSON.parse(JSON.stringify(this.tables));
      this.rightObject["originalRgtTables"] = JSON.parse(
        JSON.stringify(this.tables)
      );
      this.leftObject["originalLftTables"] = JSON.parse(
        JSON.stringify(this.tables)
      );
      this.rightObject["rgtTableSearch"] = "";
      this.leftObject["lftTableSearch"] = "";
    } else {
      this.rightObject["rgtTables"] = [];
      this.leftObject["lftTables"] = [];
      this.rightObject["originalRgtTables"] = [];
      this.leftObject["originalLftTables"] = [];
      this.rightObject["rgtTableSearch"] = "";
      this.leftObject["lftTableSearch"] = "";
    }
  }

  /**
   * assignRightOriginal
   */
  public assignRightOriginal() {
    return JSON.parse(JSON.stringify(this.rightObject["originalRgtTables"]));
  }

  /**
   * assignLeftOriginal
   */
  public assignLeftOriginal() {
    return JSON.parse(JSON.stringify(this.leftObject["originalLftTables"]));
  }

  /**
   * assignOriginalCopy
   */
  public assignOriginalCopy(side) {
    if (side == "right")
      this.rightObject["rgtTables"] = this.assignRightOriginal();
    else if (side == "left")
      this.leftObject["lftTables"] = this.assignLeftOriginal();
    else {
      this.rightObject["rgtTables"] = this.assignRightOriginal();
      this.leftObject["lftTables"] = this.assignLeftOriginal();
      this.selectedJoinType = "Join";
      this.rightObject["rgtTableSearch"] = "";
      this.leftObject["lftTableSearch"] = "";
      this.leftObject["selectedLeftTableID"] = undefined;
      this.rightObject["selectedRightTableID"] = undefined;
      this.leftObject["selectedLeftColumn"] = undefined;
      this.rightObject["selectedRightColumn"] = undefined;
    }
  }

  private newRelationUpdateCallback(res: any, err: any) {
    if (err) {
    } else {
      if (res) {
        this.toastr.success(res.message);
        Utils.hideSpinner();
        Utils.closeModals();
      }
    }
  }

  public saveNewRelation() {
    let options = {};
    Utils.showSpinner();
    (options["join_type"] = this.selectedJoinType),
      (options["left_table_id"] = this.leftObject["selectedLeftTableID"]),
      (options["right_table_id"] = this.rightObject["selectedRightTableID"]),
      (options["primary_key"] = this.leftObject["selectedLeftColumn"]),
      (options["foreign_key"] = this.rightObject["selectedRightColumn"]);
    this.newRelationUpdateSubscription = this.newRelationModalService
      .saveTableRelationsInfo(options)
      .subscribe(
        res => this.newRelationUpdateCallback(res, null),
        err => this.newRelationUpdateCallback(null, err)
      );
  }

  public selectColumn(i, j, side) {
    if (side == "right") {
      this.rightObject["selectedRightTableID"] = this.rightObject["rgtTables"][
        i
      ].sl_tables_id;
      this.rightObject["selectedRightColumn"] = this.rightObject["rgtTables"][
        i
      ]["mapped_column_name"][j];
    } else {
      this.leftObject["selectedLeftTableID"] = this.leftObject["lftTables"][
        i
      ].sl_tables_id;
      this.leftObject["selectedLeftColumn"] = this.leftObject["lftTables"][i][
        "mapped_column_name"
      ][j];
    }
  }

  public selectedJoin(value) {
    this.selectedJoinType = value;
  }

  /**
   * searchedItem
   */
  public searchedItem(value, originalData) {
    let results = [];

    if (value) {
      results = JSON.parse(JSON.stringify(originalData)).filter(ele => {
        if (ele.mapped_table_name.toLowerCase().match(value.toLowerCase())) {
          return ele;
        } else {
          ele.mapped_column_name = ele.mapped_column_name.filter(data => {
            return data.toLowerCase().match(value.toLowerCase());
          });
          if (ele.mapped_column_name.length != 0) {
            return ele;
          }
        }
      });
    } else {
      results = JSON.parse(JSON.stringify(originalData));
    }
    return results;
  }

  public filterItem(value, side) {
    if (side == "right") {
      this.rightObject["rgtTables"] = this.searchedItem(
        value,
        this.rightObject["originalRgtTables"]
      );
    } else {
      this.leftObject["lftTables"] = this.searchedItem(
        value,
        this.leftObject["originalLftTables"]
      );
    }
  }

  public isSave() {
    return !(
      this.selectedJoinType &&
      this.leftObject["selectedLeftTableID"] &&
      this.rightObject["selectedRightTableID"] &&
      this.leftObject["selectedLeftColumn"] &&
      this.rightObject["selectedRightColumn"]
    );
  }
  /**
   * cancelNewRelation
   */
  public cancelNewRelation() {
    this.assignOriginalCopy("both");
  }

  ngOnDestroy() {
    if (this.newRelationUpdateSubscription)
      this.newRelationUpdateSubscription.unsubscribe();
  }
}
