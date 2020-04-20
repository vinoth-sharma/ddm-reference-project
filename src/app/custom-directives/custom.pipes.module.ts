import { NgModule } from "@angular/core";
import { MaterialModule } from "../material.module";
import { spaceFormaterString } from "./spaceFormaterString.pipe";
import { ButtonCssDirective } from "./button-css.directive";
import { NgToasterComponent } from "./ng-toaster/ng-toaster.component";
import { NgLoaderService } from './ng-loader/ng-loader.service';
import { NgCustomSpinnerComponent } from './ng-custom-spinner/ng-custom-spinner.component';
import { MultiSelectComponent } from "./multi-select/multi-select.component";
import { OrderByPipe } from "./filters/order-by.pipe";
import { CustomCookieService } from "./ng-custom-cookies-service/custom.cookies.service";
import { NgTimePickerComponent } from './ng-time-picker/ng-time-picker.component';

@NgModule({
    declarations : [spaceFormaterString,ButtonCssDirective,NgToasterComponent,MultiSelectComponent,
                    NgCustomSpinnerComponent,OrderByPipe, NgTimePickerComponent],
    providers:[NgLoaderService,CustomCookieService],
    imports : [MaterialModule],
    exports : [spaceFormaterString,ButtonCssDirective,NgToasterComponent,MultiSelectComponent,
        NgCustomSpinnerComponent,MaterialModule,OrderByPipe,NgTimePickerComponent]
})
export class CustomPipeModules{

    static forRoot(){
        return {
            ngModule: CustomPipeModules,
            providers : []
        } 
    }
}