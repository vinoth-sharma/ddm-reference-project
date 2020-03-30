import { NgModule } from "@angular/core";
import { MaterialModule } from "../material.module";
import { spaceFormaterString } from "./spaceFormaterString.pipe";
import { ButtonCssDirective } from "./button-css.directive";
import { NgToasterComponent } from "./ng-toaster/ng-toaster.component";
import { NgLoaderService } from './ng-loader/ng-loader.service';
import { MultiSelectComponent } from "./multi-select/multi-select.component";
@NgModule({
    declarations : [spaceFormaterString,ButtonCssDirective,NgToasterComponent,MultiSelectComponent],
    providers:[NgLoaderService],
    imports : [MaterialModule],
    exports : [spaceFormaterString,ButtonCssDirective,NgToasterComponent,MultiSelectComponent]
})
export class CustomPipeModules{

    static forRoot(){
        return {
            ngModule: CustomPipeModules,
            providers : []
        }
    }
}