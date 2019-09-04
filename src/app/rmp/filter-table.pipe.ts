import { Pipe, PipeTransform } from '@angular/core';
import { transformAll } from '@angular/compiler/src/render3/r3_ast';

@Pipe({
  name: 'filterTable'
})
export class FilterTablePipe implements PipeTransform {
  transform(items: any, filter: any, defaultFilter: boolean): any {
    // console.log("Transform parameters")
    // console.log(items)
    // console.log(filter)
    // console.log(defaultFilter)
    if (!filter){
      return items;
    }

    if (!Array.isArray(items)){
      return items;
    }

    if (filter && Array.isArray(items)) {
    //   let filterKeys = Object.keys(filter);

    //   if (defaultFilter) {
    //     return items.filter(item =>
    //         filterKeys.reduce((x, keyName) =>
    //             (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true));
    //   }
    //   else {
    //     return items.filter(item => {
    //       return filterKeys.some((keyName) => {
    //         return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
    //       });
    //     });
    //   }
    let data = items.slice();
    const allKeys = Object.keys(items[0]);
    const keys = Object.keys(filter).filter(key => filter[key] != '' && key != 'global');
    if (filter.global != '') {
      const globalFilter = filter.global ? filter.global.toLowerCase() : '';
      data = data.filter(reportRow => allKeys.reduce((res, key) => res || (reportRow[key] ? reportRow[key].toString().toLowerCase().includes(globalFilter) : false), false));
    }
    data = data.filter(reportRow =>  keys.reduce((res, key) => res && (reportRow[key] ? reportRow[key].toString().toLowerCase().includes(filter[key].toLowerCase()) : false), true));
    return data;
  }
  }

}
