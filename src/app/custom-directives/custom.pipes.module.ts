import { NgModule } from "@angular/core";
import { spaceFormaterString } from "./spaceFormaterString.pipe";

@NgModule({
    declarations : [spaceFormaterString],
    exports : [spaceFormaterString]
})
export class CustomPipeModules{

    static forRoot(){
        return {
            ngModule: CustomPipeModules,
            providers : []
        }
    }
}