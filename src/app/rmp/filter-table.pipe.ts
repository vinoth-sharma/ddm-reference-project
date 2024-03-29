import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTable'
})
export class FilterTablePipe implements PipeTransform {
  transform(items: any, filter: any, defaultFilter: boolean): any {
    if (!filter) {
      return items;
    }

    if (!Array.isArray(items)) {
      return items;
    }

    if (filter && Array.isArray(items)) {
      let data = items.slice();
      const allKeys = Object.keys(items[0]);
      const keys = Object.keys(filter).filter(key => filter[key] != '' && key != 'global');
      if (filter.global != '') {
        const globalFilter = filter.global ? filter.global.toLowerCase() : '';
        data = data.filter(reportRow => allKeys.reduce((res, key) => res || (reportRow[key] ? reportRow[key].toString().toLowerCase().includes(globalFilter) : false), false));
      }
      data = data.filter(reportRow => keys.reduce((res, key) => res && (reportRow[key] ? reportRow[key].toString().toLowerCase().includes(filter[key].toLowerCase()) : false), true));
      return data;
    }
  }

}
