import { Component, OnInit } from "@angular/core";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate.min.js";
import { AuthenticationService } from "../authentication.service";
import { SemanticNewService } from "../semantic-new/semantic-new.service";

@Component({
  selector: "app-semantic-existing",
  templateUrl: "./semantic-existing.component.html",
  styleUrls: ["./semantic-existing.component.css"]
})
export class SemanticExistingComponent implements OnInit {
  public userId: string;
  public semanticLayers = [];

  constructor(
    private user: AuthenticationService,
    private semanticNewService: SemanticNewService
  ) {
    this.user.Method$.subscribe(userid => (this.userId = userid));
    this.semanticNewService.dataMethod$.subscribe(semanticLayers => {
      this.semanticLayers = semanticLayers;
    });
  }

  ngOnInit() {}

  public print() {
    const semanticLayerList = this.semanticLayers;
    const EXCEL_EXTENSION = ".xlsx";

    XlsxPopulate.fromBlankAsync()
      .then(workbook => {

        const wb = workbook.addSheet("Semantic_Layer", 0);
        workbook.activeSheet('Semantic_Layer');
        // Adding table name
        wb.cell("A1").value("Semantic Layer");
        wb.cell("B1").value("Tables");
        //style to first row
        wb.row(1).style({bold: true,fill:"004e63"}); 

        this.semanticLayers.forEach((element,key) => {
          wb.row(key).height(30);
        });

        const colA = wb.range("A2:A" + this.semanticLayers.length);
        const colB = wb.range("B2:B" + this.semanticLayers.length);
        this.addDetails(colA, "A");
        this.addDetails(colB, "B");

        wb.column("A").width(this.getWidth(wb,"A")); 
        wb.column("B").width(this.getWidth(wb,"B")); 

        workbook.outputAsync().then(function(blob) {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // If IE, you must uses a different method.
            window.navigator.msSaveOrOpenBlob(
              blob,
              "semantic-layers-" + new Date().getTime() + EXCEL_EXTENSION
            );
          } else {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            a.download =
              "semantic-layers-" + new Date().getTime() + EXCEL_EXTENSION;
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
        });
      })
      .catch(err => console.error(err));
  }

  // insert data to each cell
  private addDetails = function(col, type) {
    col.value((cell, ri, ci, range) => this.getData(ri, type));
  };

  private getData = function(ri, type) {
    return type === "A"
      ? this.semanticLayers[ri].sl_name
      : this.semanticLayers[ri].mapped_tables.toString();
  }


  private getWidth = function(wb,type) {
    const maxWidth = wb.range(
        type == "A"
          ? "A1:A" + this.semanticLayers.length
          : "B1:B" + this.semanticLayers.length
      )
      .reduce((max, cell) => {
        const value = cell.value();
        if (value === undefined) return max;
        return Math.max(max, value.toString().length);
      }, 0);
    return maxWidth;
  };

}
