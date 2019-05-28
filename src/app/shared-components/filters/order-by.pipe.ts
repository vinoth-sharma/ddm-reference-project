import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  noManipulationTypes = ['number', 'boolean'];

  transform(array: any, field?: any, type?: any): any[] {
    array.sort((a: any, b: any) => {
      let isAsc = type == '' || type == undefined ? true : false;

      // let aVal = (a[field].toString() || '').toLowerCase();
      // let bVal = ( b[field].toString() || '').toLowerCase();

      // a[field] = a[field] === undefined ? '' : a[field];
      // b[field] = b[field] === undefined ? '' : b[field];

      let aVal = this.noManipulationTypes.includes(typeof a[field]) ? a[field] : (a[field] || '').toLowerCase();
      let bVal = this.noManipulationTypes.includes(typeof b[field]) ? b[field] : (b[field] || '').toLowerCase();

      if (isAsc ? (aVal < bVal) : (aVal > bVal)) {
        return -1;
      } else if (isAsc ? (aVal > bVal) : (aVal < bVal)) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
