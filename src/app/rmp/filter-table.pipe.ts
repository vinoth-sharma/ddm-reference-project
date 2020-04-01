import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTable'
})
export class FilterTablePipe implements PipeTransform {
  transform(items: any, filter: any, defaultFilter: boolean): any {
    if (!filter) {
      console.log("returning because of no FILTER");
      console.log("returning items", items)
      return items;
    }

    if (!Array.isArray(items)) {
      console.log("returning because of no ARRAY");
      console.log("returning items", items)
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

      console.log("returning processed daat");
      console.log("returning DATA", data)
      return data;
    }
  }

}
