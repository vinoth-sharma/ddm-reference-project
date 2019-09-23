import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { NgPipesModule } from 'angular-pipes';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatSortModule, MatAutocompleteModule, MatIconModule, MatCheckboxModule , MatDatepickerModule,MatNativeDateModule, MatProgressSpinnerModule, MatSelectModule, MatGridListModule, MatInputModule, MatExpansionModule, MatButtonModule} from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatFormFieldModule} from '@angular/material';
import { MatChipsModule } from '@angular/material/chips'
import { MatTabsModule } from '@angular/material'
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
import {MatPaginatorModule} from '@angular/material/paginator';
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
import { CreateCalculatedColumnComponent } from './create-report/create-calculated-column/create-calculated-column.component';
import { CustomModalsModule } from './rmp/custom-modals/custom-modals.module';
import { CreateRelationComponent } from './relations/create-relation/create-relation.component';
import { ShowRelationsComponent } from './relations/show-relations/show-relations.component';
import { ShowLovComponent } from './modallist/show-lov/show-lov.component';
import { ConditionModalWrapperComponent } from './condition-modal/condition-modal-wrapper/condition-modal-wrapper.component';
import { CreateConditionComponent } from './condition-modal/create-condition/create-condition.component';
import { ManageConditionComponent } from './condition-modal/manage-condition/manage-condition.component';
// import { OndemandConfigReportsComponent } from './custom-modals/ondemand-config-reports/ondemand-config-reports.component';
// import { OndemandReportsComponent } from './custom-modals/ondemand-reports/ondemand-reports.component';
// import { RelationsService } from '../app/relations/';

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
    ShowLovComponent,
    ConditionModalWrapperComponent,
    CreateConditionComponent,
    ManageConditionComponent
    // OndemandConfigReportsComponent,
    // OndemandReportsComponent
  ],
  imports: [
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CKEditorModule,
    MatPaginatorModule,
    BrowserModule,
    NgPipesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    // Ng2SmartTableModule,
    HttpClientModule,
    MatGridListModule,
    BrowserAnimationsModule,
    CustomModalsModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatButtonModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule,
    SharedComponentsModule,
    CreateReportModule,
    MatGridListModule,
    NgbModule.forRoot(),
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
  ],
  bootstrap: [AppComponent],
  entryComponents: [CreateCalculatedColumnComponent,CreateRelationComponent,ShowRelationsComponent,
    ShowLovComponent,ConditionModalWrapperComponent],
  exports:[]
})

export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
