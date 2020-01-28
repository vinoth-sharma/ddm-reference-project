import { Pipe , PipeTransform  } from "@angular/core";
import { constants_value } from "../constants";

@Pipe({ name : "spaceFormater" })
export class spaceFormaterString implements PipeTransform{

    transform(value:string):string{
        let regex = new RegExp(constants_value.column_space_replace_value,"gi")
        return value?value.replace(regex," "):value;
    }
}