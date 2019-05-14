import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import { Report } from '../reports-list-model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChartSelectorComponent } from '../chart-selector/chart-selector.component';
import { PivotBuilderComponent } from '../pivot-builder/pivot-builder.component';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Utils from '../../../../utils';

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
  private messages: string[];
  private defaultError: string = 'There seems to be an error. Please try again later';
  public types = ['excel', 'pdf', 'csv'];
  public selectedType: string;

  constructor(private reportsService: ReportsService,
    private toasterService: ToastrService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

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
    return (obj && Object.keys(obj)) || [];
  }

  openNewSheet(sheetData: { label: string, id: string, component: any }) {
    this.dialog.open(sheetData.component, {
      width: '1000px',
      height: '580px',
      panelClass: 'custom-mat-dialog',
      minHeight: '580px',
      minWidth: '1000px',
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
          type: type,
        };
        this.reportsData.pages.push(newSheetData);
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
      // this.toasterService.success('Data updated successfully');
      this.showToastMessage('Data updated successfully', 'success');
      // this.getReport(this.reportId);
    }, error => {
      Utils.hideSpinner();
      // this.toasterService.error('There seems to be an error. Please try again later');
      this.showToastMessage(error['message'].error || this.defaultError, 'error');
    });
  }

  collapseObjectExplorer() {
    // TODO: jquery 
    if (!$("#sidebar").hasClass("active")) {
      $("#sidebar").toggleClass("active");
    }
  }

  deleteSheet(index: number) {
    this.reportsData.pages.splice(index, 1);
    this.saveReport();
  }

  onUpdate(data: any, index: any) {
    this.reportsData.pages[index].data = data;
  }

  renameSheet(event: any, index: number) {
    // TODO: name validation, no space allowed in name, 
    let sheetName = event['table_name'].trim();
    let sheetLabels = this.reportsData.pages.map(page => page['label'].trim());

    if (sheetLabels.includes(sheetName)) {
      // this.toasterService.error('Please enter a unique label');
      this.showToastMessage('This worksheet name already exists. Select a unique name', 'error');
      return;
    }

    this.reportsData.pages[index]['label'] = sheetName;
    this.saveReport();
  }

  showToastMessage(message: string, type: string = 'success') {
    this.messages = [];
    this.messages.push(message);

    switch (type) {
      case 'error':
        this.toasterService.error(this.messages[0]);
        break;

      case 'success':
        this.toasterService.success(this.messages[0]);
        break;

      default:
        this.toasterService.success(this.messages[0]);
    }

  }

  exportReport(type: string) {    
    this.selectedType = type;    

    // Utils.showSpinner();
    // this.reportsService.exportReport([this.reportId]).subscribe(response => {
    //   Utils.hideSpinner();
    //   this.showToastMessage('Report downloaded successfully', 'success');
    // }, error => {
    //   Utils.hideSpinner();
    //   this.showToastMessage(error['message'].error || this.defaultError, 'error');
    // });
  }

}
