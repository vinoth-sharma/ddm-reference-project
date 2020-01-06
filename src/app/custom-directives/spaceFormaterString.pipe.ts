import { Pipe , PipeTransform  } from "@angular/core";
import { constants_value } from "../../environments/environment";

@Pipe({ name : "spaceFormater" })
export class spaceFormaterString implements PipeTransform{

    transform(value:string):string{
        let regex = new RegExp(constants_value.encryption_key,"gi")
        return value?value.replace(regex," "):value;
    }
}