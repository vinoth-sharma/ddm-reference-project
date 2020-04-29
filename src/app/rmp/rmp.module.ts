import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RMPRoutingModule } from './rmp-routing.module';
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
import { RequestStatusComponent } from './request-status/request-status.component';
import { ReportsComponent } from './reports/reports.component';
import { MetricsComponent } from './metrics/metrics.component';
import { DealerAllocationComponent } from './Submit/dealer-allocation/dealer-allocation.component';
import { OrderToSaleComponent } from './Submit/order-to-sale/order-to-sale.component';
import { SelectReportCriteriaComponent } from './Submit/select-report-criteria/select-report-criteria.component';
import { SubmitLandingPageComponent } from './Submit/submit-landing-page/submit-landing-page.component';
import { FilterTablePipe } from './filter-table.pipe'; 
import { OrderModule } from 'ngx-order-pipe';
import { RequestOnBehalfComponent } from './request-on-behalf/request-on-behalf.component';
import { MainMenuLandingPageComponent } from './Main/main-menu-landing-page/main-menu-landing-page.component';
import { AngularMultiSelectModule } from "angular4-multiselect-dropdown/angular4-multiselect-dropdown";
import { DatePipe } from '@angular/common';
import { DataProviderService } from "./data-provider.service";
import { NgxPaginationModule } from 'ngx-pagination';
import { Angular2FontawesomeModule } from "angular2-fontawesome";
import { TagInputModule } from 'ngx-chips';
import { CustomModalsModule } from './custom-modals/custom-modals.module';
import { MultiDatePickerOngoingComponent } from './multi-date-picker-ongoing/multi-date-picker-ongoing.component'
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule} from '@angular/material/form-field';
import { QuillModule } from "ngx-quill";
import { CustomPipeModules } from "../custom-directives/custom.pipes.module";
import { CommonModuleDdmRmp } from "../custom-directives/common.module";
import { NotesWrapperComponent } from './admin-notes/notes-wrapper/notes-wrapper.component';
import { DisplayNotesComponent } from './admin-notes/display-notes/display-notes.component';
import { ExistingNotesContainerComponent } from './admin-notes/existing-notes-container/existing-notes-container.component';
import { ManageNotesComponent } from './admin-notes/manage-notes/manage-notes.component';

@NgModule({
  declarations: [
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
    MultiDatePickerOngoingComponent,
    NotesWrapperComponent,
    DisplayNotesComponent,
    ExistingNotesContainerComponent,
    ManageNotesComponent
  ],
  imports: [
    QuillModule.forRoot(),
    RMPRoutingModule,
    CustomModalsModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    CommonModule,
    OrderModule,
    MatChipsModule,
    MatFormFieldModule,
    NgbModule,
    HttpClientModule,
    CustomPipeModules,
    AngularMultiSelectModule,
    Angular2FontawesomeModule,
    CustomPipeModules.forRoot(),
    CommonModuleDdmRmp.forRoot(),
    NgxPaginationModule
  ],
  providers: [
    DatePipe,
    DataProviderService
  ],
  entryComponents : [DisplayNotesComponent,NotesWrapperComponent]
})
export class RMPModule { }