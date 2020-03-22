import { Pipe , PipeTransform  } from "@angular/core";
import { constants_value } from "../constants";
import { CommonModule } from "@angular/common";

@Pipe({ name : "spaceFormater" })
export class spaceFormaterString implements PipeTransform{

    transform(value:string):string{
        let regex = new RegExp(constants_value.column_space_replace_value,"gi")
        if(typeof(value) == "string"){
            return value ? value.replace(regex," "):value;
        }else return value
        
    }
}