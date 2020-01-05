import { Pipe , PipeTransform  } from "@angular/core";

@Pipe({ name : "spaceFormater" })
export class spaceFormaterString implements PipeTransform{

    transform(value:string):string{
        return value?value.replace(/_dummy_/gi," "):value;
    }
}