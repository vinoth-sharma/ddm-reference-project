import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from "rxjs/operators";
import { ReportsData, Report } from './reports-list-model';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  public expandableSymbol = '__level__';
  constructor(private _http: HttpClient) { }

  // getReportsList(): Observable<ReportsData> {
  //   const reportsServiceApi = `assets/reports-list.json`;
  //   return this._http.get<ReportsData>(reportsServiceApi);
  // }

  // getReportData(reportId: number): Observable<Report> {
  //   const reportApi = `assets/report${reportId}.json`;
  //   return this._http.get<Report>(reportApi);
  // }

  getAggregatedTable(tableData: object[], rowFieldKeys: string[], valueFieldKeys: { field: string, aggregation: string }[]) {
    const aggregatedData = [];
    return new Promise((resolve, reject) => {
      try {
        if (rowFieldKeys.length > 0) {
          const lastLevel = rowFieldKeys[rowFieldKeys.length - 1];
          const uniqueValsObject = {};
          rowFieldKeys.forEach(rowFieldKey => {
            const values = [...new Set(tableData.map(item => item[rowFieldKey]))];
            uniqueValsObject[rowFieldKey] = {
              index: 0,
              values: values,
              condition: values[0]
            };
          });
          let indexPtr = 0;
          while (true) {
            const itemsLeft = Object.values(uniqueValsObject).map((item: any) => item.values.length - item.index).reduce((p, t) => p + t);
            if (itemsLeft > 0) {
              const rowValueObj = uniqueValsObject[rowFieldKeys[indexPtr]];
              const rowFieldValue = rowValueObj.values[rowValueObj.index];
              rowValueObj.condition = rowValueObj.values[rowValueObj.index];
              if (indexPtr === rowFieldKeys.length - 1) {
                uniqueValsObject[lastLevel].values.forEach(lastLevelValue => {
                  const dataRows = {};
                  const filData = tableData.filter(item => {
                    let condition = true;
                    for (let j = 0; j < indexPtr; j++) {
                      condition = condition && uniqueValsObject[rowFieldKeys[j]].condition === item[rowFieldKeys[j]];
                    }
                    return condition && item[lastLevel] === lastLevelValue;
                  });
                  if (filData.length > 0) {
                    dataRows['label'] = lastLevelValue;
                    // for (let k = 0; k < valueFieldKeys.length; k++) {
                    //   const valueFieldKey = valueFieldKeys[k].field;
                    //   dataRows[valueFieldKey] = this.getAggregatedValues(valueFieldKeys[k].aggregation, filData, valueFieldKey);
                    // }

                    for (let key in valueFieldKeys) {
                      const valueFieldKey = valueFieldKeys[key].field;
                      dataRows[valueFieldKey] = this.getAggregatedValues(valueFieldKeys[key].aggregation, filData, valueFieldKey);
                    }
                    dataRows['__isHidden__'] = false;
                    aggregatedData.push(dataRows);
                  }
                });
                rowValueObj.index = rowValueObj.values.length;
                if (rowFieldKeys.length > 1) {
                  rowValueObj.index = 0;
                }
                indexPtr = indexPtr - 1;
                if (indexPtr >= 1) {
                  if (uniqueValsObject[rowFieldKeys[indexPtr]].index === uniqueValsObject[rowFieldKeys[indexPtr]].values.length) {
                    uniqueValsObject[rowFieldKeys[indexPtr]].index = 0;
                    indexPtr = indexPtr - 1;
                  }
                }
              } else if (indexPtr < rowFieldKeys.length - 1) {
                const dataRowFiltered = tableData.filter(item => {
                  let condition = true;
                  for (let j = 0; j < indexPtr; j++) {
                    condition = condition && uniqueValsObject[rowFieldKeys[j]].condition === item[rowFieldKeys[j]];
                  }
                  return condition && item[rowFieldKeys[indexPtr]] === rowFieldValue;
                });
                const dataRow = {};
                if (dataRowFiltered.length > 0) {
                  dataRow['label'] = rowFieldValue;
                  // for (let k = 0; k < valueFieldKeys.length; k++) {
                  //   const valueFieldKey = valueFieldKeys[k].field;
                  //   dataRow[valueFieldKey] = this.getAggregatedValues(valueFieldKeys[k].aggregation, dataRowFiltered, valueFieldKey);
                  // }

                  for (let key in valueFieldKeys) {
                    const valueFieldKey = valueFieldKeys[key].field;
                    dataRow[valueFieldKey] = this.getAggregatedValues(valueFieldKeys[key].aggregation, dataRowFiltered, valueFieldKey);
                  }

                  const sym1 = '__level__';
                  dataRow[sym1] = indexPtr;
                  dataRow['__isHidden__'] = false;
                  dataRow['__endIndex__'] = aggregatedData.length;
                  dataRow['__expanded__'] = true;
                  aggregatedData.push(dataRow);
                }
                if (rowValueObj.index >= rowValueObj.values.length && indexPtr !== 0) {
                  rowValueObj.index = 0;
                } else {
                  rowValueObj.index++;
                }
                indexPtr++;
              } else {
                indexPtr = indexPtr - 1;
              }
            } else {
              break;
            }
          }
        } else if (valueFieldKeys.length > 0) {
          const dataRow = {};
          valueFieldKeys.forEach(valueFieldKey => {
            // dataRow[valueFieldKey] = tableData.reduce((result, item) => result + +item[valueFieldKey], 0);
            dataRow[valueFieldKey.field] = this.getAggregatedValues(valueFieldKey.aggregation, tableData, valueFieldKey.field);
            dataRow['__isHidden__'] = false;
          });
          aggregatedData.push(dataRow);
        }
        this.generateExpansionMapping(aggregatedData).then(res => {
          resolve(res);
        })
          .catch(error => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  generateExpansionMapping(pivotData) {
    const openLevels = [];
    return new Promise((resolve, reject) => {
      try {
        openLevels[0] = {
          level: pivotData[0][this.expandableSymbol],
          startRowNumber: 0
        };
        let lastOpenLevel = openLevels[openLevels.length - 1];
        for (let i = 1; i < pivotData.length; i++) {
          const curRow = pivotData[i];
          if (this.expandableSymbol in curRow) {
            pivotData[lastOpenLevel.startRowNumber]['__endIndex__'] = i - 1;
            if (curRow[this.expandableSymbol] < lastOpenLevel.level) {
              openLevels.pop();
              lastOpenLevel = openLevels[openLevels.length - 1];
              pivotData[lastOpenLevel.startRowNumber]['__endIndex__'] = i - 1;
              openLevels.pop();
            } else if (curRow[this.expandableSymbol] === lastOpenLevel.level) {
              openLevels.pop();
            }
            openLevels.push({ level: curRow[this.expandableSymbol], startRowNumber: i });
            lastOpenLevel = openLevels[openLevels.length - 1];
          } else {
            continue;
          }
        }
        while (openLevels.length > 0) {
          pivotData[lastOpenLevel.startRowNumber]['__endIndex__'] = pivotData.length - 1;
          openLevels.pop();
          lastOpenLevel = openLevels[openLevels.length - 1];
        }
        resolve(pivotData);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAggregatedValues(aggregation: string, values: any[], valueFieldKey: string) {
    switch (aggregation) {
      case 'Sum':
        return values.reduce((a, b) => a + +b[valueFieldKey], 0);

      case 'Max':
        return Math.max(...values.map(val => +val[valueFieldKey]));

      case 'Min':
        return Math.min(...values.map(val => +val[valueFieldKey]));

      case 'Average':
        return values.reduce((a, b) => a + +b[valueFieldKey], 0) / values.length;
    }
  }

  getReportData(reportId: number): Observable<Report> {
    const reportApi = `${environment.baseUrl}reports/report_charts/?report_list_id=${reportId}`;

    return this._http.get<Report>(reportApi);
  }

  updateReport(data: any) {
    const reportApi = `${environment.baseUrl}reports/report_charts/`;

    return this._http.put(reportApi, data)
      .pipe(catchError(this.handleError));
  }

  handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }

  exportReport(data: any) {
    const exportApi = `${environment.baseUrl}reports/export_excel/`;

    return this._http.post(exportApi, data)
      .pipe(catchError(this.handleError));
  }

  renameSheet(data: any) {
    const url = `${environment.baseUrl}reports/rename_report_sheet`;

    return this._http.put(url, data)
      .pipe(catchError(this.handleError));
  }

}

