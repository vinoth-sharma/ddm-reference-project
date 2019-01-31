import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any, field?: any, type?: any): any[] {
    array.sort((a:any , b:any) => {
      if(type ? (a[field] || '').toLowerCase() < ( b[field] || '').toLowerCase() : (a[field] || '').toLowerCase() < ( b[field] || '').toLowerCase() ){
        return -1;
      }else if(type ? (a[field] || '').toLowerCase() > ( b[field] || '').toLowerCase() : (a[field] || '').toLowerCase() > ( b[field] || '').toLowerCase() ){ 
        return 1;
      }else{
        return 0;
      }
    });
    return array;
  }
}
