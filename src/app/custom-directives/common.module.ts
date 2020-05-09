import { NgModule } from "@angular/core";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { MaterialModule } from "../material.module";
import { RouterModule } from '@angular/router';


@NgModule({
    declarations : [ HeaderComponent, FooterComponent ],
    providers:[],
    imports : [ MaterialModule,RouterModule ],
    exports : [  HeaderComponent, FooterComponent ]
})
export class CommonModuleDdmRmp {

    static forRoot(){
        return {
            ngModule: CommonModuleDdmRmp,
            providers : []
        }
    }
}