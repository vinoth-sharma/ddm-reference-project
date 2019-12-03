import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maximumCharacter'
})
export class MaximumCharacterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value && value.length != 0)
    if(value.length > 30) return value.substring(0,30) + '...';
    return value;
  }

}
