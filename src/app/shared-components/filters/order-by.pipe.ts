import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any, field?: any, type?: any): any[] {
    array.sort((a:any , b:any) => {
      let isAsc = type == '' || type == undefined ?true:false;
      field = field.toLowerCase().replace(/\s/g, "_");
      let aVal = (a[field] || '').toLowerCase();
      let bVal = ( b[field] || '').toLowerCase();

      if(isAsc ? (aVal < bVal) : (aVal > bVal) ){
        return -1;
      }else if(isAsc ? (aVal > bVal) : (aVal < bVal) ){ 
        return 1;
      }else{
        return 0;
      }
    });
    return array;
  }
}
