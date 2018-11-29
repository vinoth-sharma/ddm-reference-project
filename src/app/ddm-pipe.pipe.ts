import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ddmPipe'
})
export class DdmPipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
