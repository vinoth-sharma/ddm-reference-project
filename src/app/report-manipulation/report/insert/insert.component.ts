import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { ChartSelectorComponent } from '../chart-selector/chart-selector.component';
import { PivotBuilderComponent } from '../pivot-builder/pivot-builder.component';
import { Report } from '../reports-list-model';
import { ReportsService } from '../reports.service';
import { ParametersService } from '../parameters/parameters.service';
import { environment } from '../../../../environments/environment';
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
  public isParamLoading: boolean;
  public reportId: number;
  public baseColumns: any[] = [];
  public parameterNames: any[] = [];
  public existingParameters: any[] = [];
  private defaultError: string = 'There seems to be an error. Please try again later';
  public formats = [
    { name: 'Excel', type: 'xlsx' },
    { name: 'Csv', type: 'csv' }
  ];
  private originalReportData: Report;
  public sheetIndex: number;
  public confirmText = 'Are you sure you want to delete the sheet?';
  public confirmHeader = 'Delete sheet';
  public isDownloading: boolean;
  type:string = '';
  sheetType:string = 'table';

  constructor(private reportsService: ReportsService,
    private toasterService: ToastrService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private parametersService: ParametersService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.reportId = +params.get('reportId');
      if (this.reportId) {
        this.getReport(this.reportId);
        this.getParameters(this.reportId);
      }
    });

    // this.collapseObjectExplorer();
  }

  getReport(reportId: number) {
    this.isLoading = true;
    this.reportsService.getReportData(reportId).subscribe(data => {
      this.combineJsonAndQueryData(data['data']).then((finalData: Report) => {
        this.isLoading = false;
        this.reportsData = finalData;
        this.originalReportData = JSON.parse(JSON.stringify(finalData));
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
        const newSheetData = {
          label: this.setSheetLabel(),
          data: data,
          type: type,
        };
        this.reportsData.pages.push(newSheetData);
      }
    });
  }

  setSheetLabel() {
    let sheetLabels = this.reportsData.pages.map(page => page['label'].trim());
    let newSheetLabel: string;

    // Sheet 1 is data sheet
    for (let i = 1; i <= sheetLabels.length; i++) {
      newSheetLabel = `Sheet ${i + 1}`;
      if (!sheetLabels.includes(newSheetLabel)) break;
    }

    return newSheetLabel;
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
      }
    });

    const data = {
      report_list_id: this.reportId,
      pages: reportsData.pages
    }

    Utils.showSpinner();
    this.reportsService.updateReport(data).subscribe(response => {
      Utils.closeModals();
      Utils.hideSpinner();
      this.toasterService.success('Data updated successfully');
      this.getReport(this.reportId);
    }, error => {
      Utils.closeModals();
      Utils.hideSpinner();
      this.toasterService.error(error['message'].error || this.defaultError);
    });
  }

  // collapseObjectExplorer() {
  //   if (!$("#sidebar").hasClass("active")) {
  //     $("#sidebar").addClass('d-none');
  //   }
  // }

  deleteSheet(index: number) {
    this.reportsData.pages.splice(index, 1);
    this.saveReport();
  }

  delete(type:string, index?: number) {
    if(type === 'sheet') {
      this.reportsData.pages.splice(index, 1);
      this.saveReport();
    } else {
      let selectedParam = [];
      this.existingParameters.forEach(param => {
        if (param.isDisabled) {
          return selectedParam.push(param.parameters_id);
        }
      })
      let data = {
        'parameters_id': selectedParam
      }
      Utils.showSpinner();
      this.parametersService.deleteParameter(data).subscribe(
        res => {
          this.getParameters(this.reportId);
          this.parametersService.setParamTables(this.originalReportData.pages[0]['data']);
          Utils.hideSpinner();
          this.toasterService.success(res['detail']);
          Utils.closeModals();
        },
        err => {
          Utils.hideSpinner();
          this.toasterService.error(err['message']);
        })
    }
  }

  onUpdate(data: any, index: any) {
    this.reportsData.pages[index].data = data;
  }

  renameSheet(event: any, index: number) {
    let report = this.reportsData.pages[index];

    let sheetName = event['table_name'].trim();
    let sheetLabels = this.reportsData.pages.map(page => page['label'].trim());

    if (sheetLabels.includes(sheetName) && sheetLabels.indexOf(sheetName) !== index) {
      this.toasterService.error('This worksheet name already exists. Select a unique name');
      return;
    }

    report['label'] = sheetName;

    if (report['type'] === 'table') {
      this.renameDataSheet(report['sheet_id'], sheetName);
      return;
    }

    this.saveReport();
  }

  renameDataSheet(sheetId: number, sheetName: string) {
    let data = {
      report_sheet_id: sheetId,
      sheet_name: sheetName
    }

    this.reportsService.renameSheet(data).subscribe(response => {
      this.saveReport();
    }, error => {
      Utils.hideSpinner();
      this.toasterService.error('Sheet rename failed');
    })
  }

  private getParameters(reportId: number,type?) {
    this.isParamLoading = true;
    this.parametersService.getParameters(reportId).subscribe(
      res => {
        this.isParamLoading = false;
        let selectedTables = res['data']['selected_tables'];
        selectedTables.forEach(table => {
          table['columns'].forEach(column => {
            if(column !== 'all'){
              this.baseColumns.push({ 'table': table.table_id, 'column': column });
            }
          });
        });
        this.parameterNames = res['data']['parameter_names'];
        this.existingParameters = res['data']['existing_parameters'];

        let paramLen = this.existingParameters.length - 1;
        this.existingParameters.forEach((element,i) => {
          element['default_value_parameter_arr'] = [element['default_value_parameter']];
          element['dataset'] = this.getDatasets(element);
          element['selectedDataset'] = [];
          element['isChecked'] = (paramLen === i && type == 'create')?true:false;
        });
        if(type == 'create'){
          this.paramChecked(this.existingParameters[this.existingParameters.length-1] , {'checked': true}, this.existingParameters.length-1);
        }else{
          if(this.originalReportData) {
            this.reportsData.pages[0]['data'] = this.originalReportData.pages[0]['data'];
          }
        }
      },
      err => {
        this.isParamLoading = false;
        this.baseColumns = [];
        this.parameterNames = [];
        this.existingParameters = [];
      });
  }

  paramChecked(value, event, index) {
    let columnUsed = value.column_used;
    let valuesUsed = value.default_value_parameter;
    this.existingParameters[index].isChecked = event.checked;
    if(!event.checked) {
      this.onValueSelect({ value: [] }, columnUsed, index);
    }else {
      value.default_value_parameter_arr = [value.default_value_parameter];
      this.onValueSelect({ value: [valuesUsed] }, columnUsed, index);
    }
    event.selectedDataset = [];
  }

  isChecked() {
    return this.existingParameters.some((data) => data["isChecked"]);
  }

  getDatasets(param) {
    let values = param.parameter_formula.substring(param.parameter_formula.search(/\bIN\b/) + 4, param.parameter_formula.length - 1);
    // let valuesUsed = JSON.parse('[' + values.replace(/ 0+(?![\. }])/g, ' ') + ']');
    let valuesUsed = values.split(',');
    valuesUsed = valuesUsed.map(element => {
      return element.replace(/['"]+/g, '');
    });
    return valuesUsed;
  }

  onValueSelect(event, column, i) {
    this.existingParameters[i]['selectedDataset'] = event.value;
    let selected = [];
    let isFound = false;
    if (this.existingParameters.every(e => { return e.isChecked === false })) {
      this.reportsData.pages[0]['data'] = this.originalReportData.pages[0]['data'];
      this.parametersService.setParamTables(this.reportsData.pages[0]['data']);
      return;
    }
    this.existingParameters.forEach(ele => {
      if (ele['isChecked']) {
        if (ele['selectedDataset'].length) {
          selected.push(...this.originalReportData.pages[0]['data'].filter(d => ele['selectedDataset'].includes(d[ele.column_used])))
          isFound = true;
        }
        else if (!isFound && !ele['selectedDataset'].length) {
          selected.push(...this.originalReportData.pages[0]['data'].filter(d => d[ele.column_used]))
        }
      }
    });
    let unique = [...new Set(selected)];
    this.reportsData.pages[0]['data'] = unique;
    this.combineJsonAndQueryData(this.reportsData).then((finalData: Report) => {
      // this.isLoading = false;
      this.reportsData = finalData;
      // this.originalReportData = JSON.parse(JSON.stringify(finalData));
    });
    this.parametersService.setParamTables(unique);
  }

  isAllUnchecked() {
    let data = this.reportsData.pages[0]['data'].map(data => data.isChecked);
    return data.length ? false : true;
  }

  saveParameter(data) {
    this.parametersService.createParameter(data).subscribe(
      res => {
        this.getParameters(this.reportId,'create');
        Utils.hideSpinner();
        this.toasterService.success(res['message']);
        Utils.closeModals();
      },
      err => {
        this.toasterService.error(err['message']);
      })
  }

  saveHierarchy(data) {
    Utils.showSpinner();
    this.parametersService.createHierarchy(data).subscribe(
      res => {
        this.getParameters(this.reportId);
        Utils.hideSpinner();
        this.toasterService.success(res['message']);
        Utils.closeModals();
      },
      err => {
        this.toasterService.error(err['message']);
      })
  }

  setConfirmation() {
    this.confirmHeader = 'Delete sheet';
    this.confirmText = "Are you sure you want to delete the sheet?";
    this.type = 'sheet';
  }

  deleteParameters() {
    this.confirmHeader = 'Delete Parameter(s)';
    this.confirmText = "Are you sure you want to delete the parameter(s)?";
    this.type = 'param';
  }

  exportReport(format: any) {
    let data = {
      report_list_id: this.reportId,
      file_type: format.type
    };

    this.isDownloading = true;
    this.reportsService.exportReport(data).subscribe(response => {
      this.createDownloadLink(response['all_file_path']['zip_url']);
    }, error => {
      this.toasterService.error(error['message'].error || this.defaultError);
      this.isDownloading = false;
    });
  }

  createDownloadLink(url: string) {
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = `${environment.baseUrl}${url}`;
    downloadLink.click();
    document.body.removeChild(downloadLink);
    this.isDownloading = false;
  }

  actionParameter(event) {
    this.existingParameters = event;
    this.existingParameters.forEach((ele,index) => {
      if(ele.checked && ele.isDisabled) {
        this.onValueSelect({ value: [] }, ele.columnUsed, index);
      }
      // }else {
      //   value.default_value_parameter_arr = [value.default_value_parameter];
      //   this.onValueSelect({ value: [valuesUsed] }, columnUsed, index);
      // }
    })
    Utils.closeModals();
  }

}