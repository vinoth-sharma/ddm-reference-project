import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import { Report, ReportsData } from '../reports-list-model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChartSelectorComponent } from '../chart-selector/chart-selector.component';
import { PivotBuilderComponent } from '../pivot-builder/pivot-builder.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ComponentType } from '@angular/core/src/render3';
import { QueryBuilderService } from 'src/app/query-builder/query-builder.service';
import { SharedDataService } from 'src/app/create-report/shared-data.service';

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
  constructor(private reportsService: ReportsService, private queryBuilderService: QueryBuilderService, private sharedDataService: SharedDataService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const reportId = +params.get('reportId');
      if (reportId) {
        this.getReport(reportId);
      }
    });
  }

  getReport(reportId: number) {
    this.reportsService.getReportData(reportId).subscribe(data => {
      this.combineJsonAndQueryData(data).then((finalData: Report) => {
        console.log('getReort', finalData)
        this.reportsData = finalData;
      });
    });
  }

  combineJsonAndQueryData(reportJson: Report) {
    return new Promise((resolve, reject) => {
      const baseSheet = reportJson.pages[0];
      const numberOfRows = 1000;
      let data = {
        custom_table_query: `SELECT * FROM (${this.sharedDataService.currentReportMetadata.query_used}) WHERE ROWNUM <= ${numberOfRows}`,
        page_no: 1,
        per_page: numberOfRows,
        sl_id: this.sharedDataService.currentReportMetadata.sl_id
      };

      console.log('getData data', data);

      this.getData(data).then((queryData: { data: { list: any[] } }) => {
        baseSheet.data = queryData.data.list;
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

            default:
              console.log('Default');
          }
        });
        resolve(reportJson);
      });
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
        console.log(newSheetData);
        this.snackBar.open(`${newSheetLabel} added successfully`, null, {
          duration: 100
        });
      }
    });
  }

  getData(reportMeta: { custom_table_query: string, page_no: number, per_page: number, sl_id: number }) {
    return new Promise((resolve, reject) => {
      this.queryBuilderService.executeSqlStatement(reportMeta).subscribe(res => {
        console.log('respoendjfhfs in execute', res);
        resolve(res);
      }, error => {
        reject(error);
      });
    });

  }

}
