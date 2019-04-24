import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import { Report } from '../reports-list-model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChartSelectorComponent } from '../chart-selector/chart-selector.component';
import { PivotBuilderComponent } from '../pivot-builder/pivot-builder.component';
import { MatDialog, MatSnackBar } from '@angular/material';
// import { ComponentType } from '@angular/core/src/render3';
import { ToastrService } from 'ngx-toastr';
import Utils from '../../../../utils';

import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate.min.js";
import { Row } from 'ng2-smart-table/lib/data-set/row';
import { range } from 'rxjs';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.scss']
})
export class InsertComponent implements OnInit {
  public reportsData: Report;
  public insertOptions = [
    { label: 'Chart', id: 'chart', component: ChartSelectorComponent },
    { label: 'Pivot', id: 'pivot', component: PivotBuilderComponent }
  ];
  public isLoading: boolean;
  public reportId: number;

  constructor(private reportsService: ReportsService,
    private toasterService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.reportId = +params.get('reportId');
      if (this.reportId) {
        this.getReport(this.reportId);
      }
    });
    
    this.collapseObjectExplorer();
  }

  getReport(reportId: number) {
    this.isLoading = true;
    this.reportsService.getReportData(reportId).subscribe(data => {
      this.combineJsonAndQueryData(data['data']).then((finalData: Report) => {
        this.isLoading = false;
        this.reportsData = finalData;
      });
    });
  }

  combineJsonAndQueryData(reportJson: Report) {
    return new Promise((resolve, reject) => {
      const baseSheet = reportJson.pages[0];
      reportJson.pages.slice(1).forEach(page => {
        switch (page.type) {
          case 'table':
            page.data = baseSheet.data;
            break;

          case 'chart':
            page.data.data.json = baseSheet.data;
            break;

          case 'pivot':
            page.data._data = baseSheet.data;
            this.reportsService.getAggregatedTable(page.data._data, page.data.rows, page.data.values).then(res => {
              page.data.data = res;
            });
            break;

          // default:
          //   console.log('Default');
        }
      });
      resolve(reportJson);
    });
  }

  getKeys(obj) {
    return Object.keys(obj);
  }

  openNewSheet(sheetData: { label: string, id: string, component: any }) {
    this.dialog.open(sheetData.component, {
      width: '800px',
      height: '500px',
      data: this.reportsData.pages[0].data
    }).afterClosed().subscribe(data => {
      let type = 'chart';
      if (sheetData.id === 'pivot') {
        type = 'pivot';
      }
      if (data) {
        const newSheetLabel = `Sheet ${this.reportsData.pages.length + 1}`;
        const newSheetData = {
          label: newSheetLabel,
          data: data,
          type: type
        };
        this.reportsData.pages.push(newSheetData);
        this.snackBar.open(`${newSheetLabel} added successfully`, null, {
          duration: 100
        });
      }
    });
  }

  saveReport() {
    const reportsData = JSON.parse(JSON.stringify(this.reportsData));

    reportsData.pages.forEach(page => {
      switch (page.type) {
        case 'table':
          page.data = [];
          break;

        case 'chart':
          page.data.data.json = [];
          break;

        case 'pivot':
          page.data._data = [];
          break;

        // default:
        //   console.log('Default');
      }
    });

    const data = {
      report_list_id: this.reportId,
      pages: reportsData.pages
    }
    Utils.showSpinner();
    this.reportsService.updateReport(data).subscribe(response => {
      Utils.hideSpinner();
      this.toasterService.success('Data updated successfully');
    }, error => {
      Utils.hideSpinner();
      this.toasterService.error('There seems to be an error. Please try again later');
    });
  }

  collapseObjectExplorer(){
    // TODO: jquery 
    if (!$("#sidebar").hasClass("active")) {
      $("#sidebar").toggleClass("active"); 
    }
  }

  deleteSheet(index:number){
    this.reportsData.pages.splice(index, 1);
  }


  exportByExcel(){
    const reportData = this.reportsData.pages[0].data;
    const sheetName = this.reportsData.pages[0].label;
    const EXCEL_EXTENSION = ".xlsx";

    XlsxPopulate.fromBlankAsync()
      .then(workbook => {

        // workbook.sheet("Sheet1").cell("A1").value('sahna');
        const wb = workbook.addSheet(sheetName,0);
        workbook.activeSheet(sheetName);

        this.getKeys(reportData[0]).forEach((key,row) => {
          wb.cell(0 + 1, row + 1).value(key);
          reportData.forEach((element,col) => {
            wb.cell(col + 2,row + 1).value(element[key]);
          });
          wb.column(row+1).width(this.getWidth(wb,row + 1)); 
        });
        
        console.log(wb.usedRange());
        // this.getWidth(wb);
        // console.log(this.getWidth(wb,wb.column(1)),'width');
        
        // wb.column(1).width(this.getWidth(wb,wb.column(1))); 
//         9
// _maxRowNumber
// :
// 50
// _minColumnNumber
// :
// 1
// _minRowNumber
// :
// 1
// _numColumns
// :
// 9
// _numRows
// :
// 50
        workbook.outputAsync().then(function(blob) {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // If IE, you must uses a different method.
            window.navigator.msSaveOrOpenBlob(
              blob,
              "dummy" + new Date().getTime() + EXCEL_EXTENSION
            );
          } else {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            a.download =
              "dummy" + new Date().getTime() + EXCEL_EXTENSION;
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
        });
      })
      .catch(err => console.error(err));
  }

  private getWidth = function(wb,colNum) {
    console.log(colNum);
    
    const maxWidth = wb.range(0,0,50,colNum)
      .reduce((max, cell) => {
        console.log(cell._columnNumber,cell._row._cells.length);
        
        // const value = cell(cell._columnNumber,cell._row._cells.length).value();wb.row(colNum).
        const value = wb.column(colNum).cell(cell._row._cells.length).value();
        if (value === undefined) return max;
        return Math.max(max, value.toString().length);
      }, 0);
    return maxWidth;
    // const maxWidth = wb.range('0:50')
    }
  
}
