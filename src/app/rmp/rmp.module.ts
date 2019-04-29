import { NgModule,APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RMPRoutingModule } from './rmp-routing.module';
import { DdmLandingPageComponent } from './ddm-landing-page/ddm-landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RmpLandingPageComponent } from './rmp-landing-page/rmp-landing-page.component';
import { HttpClientModule } from '@angular/common/http';
import { MainMenuComponent } from './Main/main-menu/main-menu.component';
import { DdmIntroComponent } from './Main/ddm-intro/ddm-intro.component';
import { UserProfileComponent } from './Main/user-profile/user-profile.component';
import { DdmTeamComponent } from './Main/ddm-team/ddm-team.component';
import { ReferenceDocComponent } from './Main/reference-doc/reference-doc.component';
import { DdmAdminComponent } from './Main/ddm-admin/ddm-admin.component';
import { SubmitRequestComponent } from './Submit/submit-request/submit-request.component';
import { RequestStatusComponent } from './Request/request-status/request-status.component';
import { ReportsComponent } from './Report/reports/reports.component';
import { MetricsComponent } from './Metric/metrics/metrics.component';
import { DealerAllocationComponent } from './Submit/dealer-allocation/dealer-allocation.component';
import { OrderToSaleComponent } from './Submit/order-to-sale/order-to-sale.component';
import { SelectReportCriteriaComponent } from './Submit/select-report-criteria/select-report-criteria.component';
import { SubmitLandingPageComponent } from './Submit/submit-landing-page/submit-landing-page.component';
import { FilterTablePipe } from './filter-table.pipe'; 
import { OrderModule } from 'ngx-order-pipe';
import { RequestOnBehalfComponent } from './request-on-behalf/request-on-behalf.component';
import { MainMenuLandingPageComponent } from './Main/main-menu-landing-page/main-menu-landing-page.component';
import { AngularMultiSelectModule } from "angular4-multiselect-dropdown/angular4-multiselect-dropdown";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { DataProviderService } from "./data-provider.service";
import { ToastrModule } from "ngx-toastr";
import { NgxPaginationModule } from 'ngx-pagination';
// import { MatPaginatorModule } from '@angular/material';
import { Angular2FontawesomeModule } from "angular2-fontawesome";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { SharedComponentsModule } from '../shared-components/shared-components.module';

export function dataProviderFactory(provider: DataProviderService) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    DdmLandingPageComponent,
    RmpLandingPageComponent,
    MainMenuComponent,
    DdmIntroComponent,
    UserProfileComponent,
    DdmTeamComponent,
    ReferenceDocComponent,
    DdmAdminComponent,
    SubmitRequestComponent,
    RequestStatusComponent,
    ReportsComponent,
    MetricsComponent,
    DealerAllocationComponent,
    OrderToSaleComponent,
    SelectReportCriteriaComponent,
    SubmitLandingPageComponent,
    FilterTablePipe,
    RequestOnBehalfComponent,
    MainMenuLandingPageComponent,
  ],
  imports: [
    CommonModule,
    RMPRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OrderModule,
    NgbModule,
    HttpClientModule,
    AngularMultiSelectModule,
    Angular2FontawesomeModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    CKEditorModule,
    SharedComponentsModule
  ],
  providers: [
    DatePipe,
    DataProviderService,
    { provide: APP_INITIALIZER, useFactory: dataProviderFactory, deps: [DataProviderService], multi: true }
  ],
})
export class RMPModule { }
