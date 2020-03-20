import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from "@angular/common";
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { NgPipesModule } from 'angular-pipes';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MultiDatePickerMaterialModule } from './custom-directives/multiple-dates-picker/material-module'
// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppComponent } from "./app.component";
import { SaveReportComponent} from "./save-report/save-report.component";
import { SemanticLayerMainComponent } from "./semantic-layer-main/semantic-layer-main.component";
import { SemanticSLComponent } from "./semantic-sl/semantic-sl.component";
import { SemanticRMPComponent } from "./semantic-rmp/semantic-rmp.component";
import { SemanticExistingComponent } from "./semantic-existing/semantic-existing.component";
import { SemanticNewComponent } from "./semantic-new/semantic-new.component";
import { DdmLandingPageComponent } from "./ddm-landing-page/ddm-landing-page.component";
import { RmpLandingPageComponent } from "./rmp-landing-page/rmp-landing-page.component";
import { SortTableComponent } from "./sort-table/sort-table.component";
import { SemanticReportsComponent } from "./semantic-reports/semantic-reports.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { TagmodalComponent } from "./tagmodal/tagmodal.component";
import { LoginComponent } from "./login/login.component";
import { SharedComponentsModule } from "./shared-components/shared-components.module";
import { SecurityModalComponent } from './security-modal/security-modal.component';
import { PrivilegeModalComponent } from './privilege-modal/privilege-modal.component';
import { PrivilegeModalService } from './privilege-modal/privilege-modal.service';
import { SecurityModalService } from './security-modal/security-modal.service';
import { ReportsNavbarComponent } from './reports-navbar/reports-navbar.component';
import { ReportsComponent } from './reports/reports.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { QueryBuilderService } from './query-builder/query-builder.service';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { CreateReportModule } from './create-report/create-report.module';
import { setAppInjector } from '../app-injector';
import { AppRoutingModule } from './app-routing.module';
import { ShareReportsComponent } from "./share-reports/share-reports.component";
import { MultiDatePicker } from "./multi-date-picker/multi-date-picker";
// import { MultiDatesPickerComponent } from "./multi-dates-picker/multi-dates-picker.component";
import { LogEntryComponent } from './log-entry/log-entry.component';
// RMP
// import { RMPModule } from "./rmp/rmp.module";
// import {RMPRoutingModule} from "./rmp/rmp-routing.module"
import { SharedModule } from './report-manipulation/shared/shared.module';
import { ScheduledReportsComponent } from './scheduled-reports/scheduled-reports.component';
import { ShowSignatureComponent } from './show-signature/show-signature.component'; 
import { ShareReportService } from './share-reports/share-report.service';
import { AuthSsoService } from './auth-sso.service';
import { AuthInterceptor } from './auth-interceptor.service';
import { CookieService } from 'ngx-cookie-service';
// import { CreateCalculatedColumnComponent } from './create-report/create-calculated-column/create-calculated-column.component';
import { CustomModalsModule } from './rmp/custom-modals/custom-modals.module';
import { CreateRelationComponent } from './relations/create-relation/create-relation.component';
import { ShowRelationsComponent } from './relations/show-relations/show-relations.component';
import { ConditionModalWrapperComponent } from './condition-modal/condition-modal-wrapper/condition-modal-wrapper.component';
import { CreateConditionComponent } from './condition-modal/create-condition/create-condition.component';
import { ManageConditionComponent } from './condition-modal/manage-condition/manage-condition.component';
import { ConditionsService } from "./condition-modal/conditions.service";
import { CalculatedColumnComponent } from './calculated-column/calculated-column.component';
import { RelationLayoutComponent } from './relations/relation-layout/relation-layout.component';
// import { OndemandConfigReportsComponent } from './custom-modals/ondemand-config-reports/ondemand-config-reports.component';
// import { OndemandReportsComponent } from './custom-modals/ondemand-reports/ondemand-reports.component';
// import { RelationsService } from '../app/relations/';
// import { ButtonCssDirective } from "./custom-directives/button-css.directive";
import { InputValidatorDirective } from "./custom-directives/input-validator.directive";
import { CreateParametersComponent } from './parameters-modal/create-parameters/create-parameters.component';
import { ManageParametersComponent } from './parameters-modal/manage-parameters/manage-parameters.component';
import { ParametersContainerComponent } from './parameters-modal/parameters-container/parameters-container.component';
// import { MultiSelectComponent } from "./custom-directives/multi-select/multi-select.component";
// import { spaceFormaterString } from "./custom-directives/spaceFormaterString.pipe";
import { CustomPipeModules } from "./custom-directives/custom.pipes.module";
import { QuillModule } from "ngx-quill";
import { SchedulerPrivilegesComponent } from './privilege-modal/scheduler-privileges/scheduler-privileges.component';
// import { MaximumCharacterPipe } from './maximum-character.pipe';
import { ShowSignatureSchedularComponent } from './show-signature-schedular/show-signature-schedular.component';
import { MaterialModule } from "./material.module";
import { MultipleDatesPickerComponent } from './custom-directives/multiple-dates-picker/multiple-dates-picker.component';
export function authoSsoServiceFactory(authSsoService: AuthSsoService): Function {
  return () => authSsoService.authLoad();
}

@NgModule({
  declarations: [
    AppComponent,
    SemanticLayerMainComponent,
    SemanticReportsComponent,
    SemanticSLComponent,
    SaveReportComponent,
    DdmLandingPageComponent,
    SemanticRMPComponent,
    SemanticExistingComponent,
    SemanticNewComponent,
    RmpLandingPageComponent,
    SortTableComponent,
    ScheduleComponent,
    TagmodalComponent,
    ShareReportsComponent,
    LoginComponent,
    SecurityModalComponent,
    PrivilegeModalComponent,
    ReportsNavbarComponent,
    ReportsComponent,
    QueryBuilderComponent,
    InfoModalComponent,
    MultiDatePicker,
    // MultiDatesPickerComponent,
    LogEntryComponent,
    ScheduledReportsComponent,
    ShowSignatureComponent,
    CreateRelationComponent,
    ShowRelationsComponent,
    ConditionModalWrapperComponent,
    CreateConditionComponent,
    ManageConditionComponent,
    // ButtonCssDirective,
    CreateParametersComponent,
    ManageParametersComponent,
    ParametersContainerComponent,
    CalculatedColumnComponent,
    RelationLayoutComponent,
    InputValidatorDirective,
    // spaceFormaterString
    SchedulerPrivilegesComponent,
    ShowSignatureSchedularComponent,
    MultipleDatesPickerComponent
    // MaximumCharacterPipe
    // MultiSelectComponent
    // OndemandConfigReportsComponent,
    // OndemandReportsComponent
  ],
  imports: [
    BrowserModule,
    QuillModule,
    // CommonModule,
    NgPipesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MultiDatePickerMaterialModule,
    // Ng2SmartTableModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CustomModalsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule,
    SharedComponentsModule,
    CreateReportModule,
    // NgbModule.forRoot(),
    CustomPipeModules.forRoot(),
    MaterialModule.forRoot()
    // RMP
    // FooterComponent,
    // HeaderComponent,
    // RMPModule,
    // RMPRoutingModule
  ],
  providers: [
    SecurityModalService,
    // MatDatepickerModule,
    CookieService,
    PrivilegeModalService,
    QueryBuilderService,
    {
      provide: APP_INITIALIZER,
      useFactory: authoSsoServiceFactory,
      deps: [AuthSsoService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthSsoService,
    ConditionsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [CreateRelationComponent,ShowRelationsComponent,SchedulerPrivilegesComponent,
    ConditionModalWrapperComponent,ParametersContainerComponent,RelationLayoutComponent],
  exports:[]
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
