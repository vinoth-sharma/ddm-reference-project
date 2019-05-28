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
  public reportId: number;
  public baseColumns:any[] = [];
  public parameterNames:any[] = [];
  public existingParameters:any[] = [];
  private messages: string[];
  private defaultError: string = 'There seems to be an error. Please try again later';
  public formats = [
    {name: 'Excel', type: 'xlsx'}, 
    {name: 'Csv', type: 'csv'}
  ];
  private originalReportData:Report;
  public sheetIndex: number;
  public confirmText = 'Are you sure you want to delete the sheet?';
  public confirmHeader = 'Delete sheet';
  public isDownloading: boolean;

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

    this.collapseObjectExplorer();
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
      Utils.closeModals();
      Utils.hideSpinner();
      this.showToastMessage('Data updated successfully', 'success');
      this.getReport(this.reportId);
    }, error => {
      Utils.closeModals();
      Utils.hideSpinner();     
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
    let report = this.reportsData.pages[index];

    // TODO: name validation, no space allowed in name, 
    let sheetName = event['table_name'].trim();
    let sheetLabels = this.reportsData.pages.map(page => page['label'].trim());

    if (sheetLabels.includes(sheetName)) {
      this.showToastMessage('This worksheet name already exists. Select a unique name', 'error');
      return;
    }

    report['label'] = sheetName;

    if (report['type'] === 'table') {
      this.renameDataSheet(report['sheet_id'], sheetName);
      return;
    }

    this.saveReport();
  }

  renameDataSheet(sheetId: number, sheetName: string){
    let data = {
      report_sheet_id: sheetId,
      sheet_name: sheetName
    }

    this.reportsService.renameSheet(data).subscribe(response => {
      this.saveReport();
    }, error => {
      Utils.hideSpinner();
      this.showToastMessage('Sheet rename failed', 'error');
    })
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

  private getParameters(reportId: number){
    
    this.parametersService.getParameters(reportId).subscribe(
      res =>{
        let selectedTables = res['data']['selected_tables'];
        selectedTables.forEach(table => {
          table['columns'].forEach(column => {
            this.baseColumns.push({'table': table.table_id,'column':column});
          });
        });
        this.parameterNames = res['data']['parameter_names'];
        this.existingParameters = res['data']['existing_parameters'];

        this.existingParameters.forEach(element => {
          element['dataset'] = this.getDatasets(element);
          element['selectedDataset'] = [];
          element['isChecked'] = false;
        });
      },
      err =>{
        this.baseColumns = [];
        this.parameterNames = [];
        this.existingParameters = []; 
      });
  }

  paramChecked(value,event,index){
    let columnUsed = value.column_used;
    let valuesUsed = value.default_value_parameter;    
    this.existingParameters[index].isChecked = event.checked;
    this.onValueSelect({value:[]},columnUsed,index);
    event.selectedDataset = [];
  }

  isChecked() {
    return this.existingParameters.some((data) => data["isChecked"]);
  }

  getDatasets(param){
    let values = param.parameter_formula.substring(param.parameter_formula.search(/\bIN\b/) + 4,param.parameter_formula.length-1);
    // let valuesUsed = JSON.parse('[' + values.replace(/ 0+(?![\. }])/g, ' ') + ']');
    let valuesUsed = values.split(',');
    valuesUsed = valuesUsed.map(element => {
      return element.replace(/['"]+/g,'');
    });
    return valuesUsed;
  }

  onValueSelect(event,column,i){
    this.existingParameters[i]['selectedDataset'] = event.value;
    let selected = [];
    let isFound = false;
    if(this.existingParameters.every(e => {return e.isChecked === false})){
      this.reportsData.pages[0]['data'] = this.originalReportData.pages[0]['data'];
      this.parametersService.setParamTables(this.reportsData.pages[0]['data']);
      return;
    }
      this.existingParameters.forEach(ele => {
        
        if( ele['isChecked']){
          if(ele['selectedDataset'].length){
            selected.push(...this.originalReportData.pages[0]['data'].filter(d => ele['selectedDataset'].includes(d[ele.column_used])))
            isFound = true;
          }
          else if(!isFound && !ele['selectedDataset'].length){
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

  isAllUnchecked(){
    let data = this.reportsData.pages[0]['data'].map(data => data.isChecked);
    return data.length ? false : true;
  }

  saveParameter(data){

    this.parametersService.createParameter(data).subscribe(
      res => {
        this.getParameters(this.reportId);
        Utils.hideSpinner();
        // this.toastrService.success(res['message']);
        this.showToastMessage(res['message'], 'success');
        Utils.closeModals();
      },
      err => {
        // this.toastrService.error(err['message']);
        this.showToastMessage(err['message'], 'error');
      })
  }

  saveHierarchy(data){
    Utils.showSpinner();
    this.parametersService.createHierarchy(data).subscribe(
      res => {
        this.getParameters(this.reportId);
        Utils.hideSpinner();
        // this.toastrService.success(res['message']);
        this.showToastMessage(res['message'], 'success');
        Utils.closeModals();
      },
      err => {
        // this.toastrService.error(err['message']);
        this.showToastMessage(err['message'], 'error');
      })
  }

  deleteParameters(){
    let selectedParam = [];
     this.existingParameters.forEach(param => {
      if(param.isChecked){
        return selectedParam.push(param.parameters_id);
      }
    })
    let data = {
      'parameters_id' : selectedParam
    }
    Utils.showSpinner();
    this.parametersService.deleteParameter(data).subscribe(
      res => {
        this.getParameters(this.reportId);
        Utils.hideSpinner();
        // this.toastrService.success(res['message']);
        this.showToastMessage(res['detail'], 'success');
        Utils.closeModals();
      },
      err => {
        Utils.hideSpinner();
        // this.toastrService.error(err['message']);
        this.showToastMessage(err['message'], 'error');
      })
  }

  exportReport(format: any) {     
    // let data = {
    //   report_list_id: this.reportId,
    //   file_type: format.type
    // };

    let data = {
      report_list_id: this.reportId,
      file_type: format.type
    };


    this.isDownloading = true;
    this.reportsService.exportReport(data).subscribe(response => {
      this.createDownloadLink(response['all_file_path']['zip_url']);
    }, error => {
      this.showToastMessage(error['message'].error || this.defaultError, 'error');
      this.isDownloading = false;
    });
  }

  createDownloadLink(url: string){
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = `${environment.baseUrl}${url}`;    
    downloadLink.click();
    document.body.removeChild(downloadLink);
    this.isDownloading = false;
  }

}
