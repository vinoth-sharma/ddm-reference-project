import { NgModule } from "@angular/core";
import { spaceFormaterString } from "./spaceFormaterString.pipe";
import { ButtonCssDirective } from "./button-css.directive";
import { NgToasterComponent } from "./ng-toaster/ng-toaster.component";
@NgModule({
    declarations : [spaceFormaterString,ButtonCssDirective,NgToasterComponent],
    exports : [spaceFormaterString,ButtonCssDirective,NgToasterComponent]
})
export class CustomPipeModules{

    static forRoot(){
        return {
            ngModule: CustomPipeModules,
            providers : []
        }
    }
}