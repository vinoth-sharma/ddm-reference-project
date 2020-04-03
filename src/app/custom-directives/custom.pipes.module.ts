import { NgModule } from "@angular/core";
import { spaceFormaterString } from "./spaceFormaterString.pipe";
import { ButtonCssDirective } from "./button-css.directive";
import { NgToasterComponent } from "./ng-toaster/ng-toaster.component";
import { NgLoaderService } from './ng-loader/ng-loader.service';
import { NgCustomSpinnerComponent } from './ng-custom-spinner/ng-custom-spinner.component';
@NgModule({
    declarations : [spaceFormaterString,ButtonCssDirective,NgToasterComponent, NgCustomSpinnerComponent],
    providers:[NgLoaderService],
    exports : [spaceFormaterString,ButtonCssDirective,NgToasterComponent,NgCustomSpinnerComponent]
})
export class CustomPipeModules{

    static forRoot(){
        return {
            ngModule: CustomPipeModules,
            providers : []
        } 
    }
}