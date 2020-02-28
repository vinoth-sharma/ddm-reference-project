import { NgModule } from "@angular/core";
import { spaceFormaterString } from "./spaceFormaterString.pipe";
import { ButtonCssDirective } from "./button-css.directive";

@NgModule({
    declarations : [spaceFormaterString,ButtonCssDirective],
    exports : [spaceFormaterString,ButtonCssDirective]
})
export class CustomPipeModules{

    static forRoot(){
        return {
            ngModule: CustomPipeModules,
            providers : []
        }
    }
}