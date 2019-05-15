import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { NgPipesModule } from 'angular-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatSortModule, MatAutocompleteModule, MatIconModule } from '@angular/material';
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
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { SemanticLayerMainComponent } from "./semantic-layer-main/semantic-layer-main.component";
import { SemanticHomeComponent } from "./semantic-home/semantic-home.component";
import { SemanticSLComponent } from "./semantic-sl/semantic-sl.component";
import { SemanticRMPComponent } from "./semantic-rmp/semantic-rmp.component";
import { SemanticExistingComponent } from "./semantic-existing/semantic-existing.component";
import { SemanticNewComponent } from "./semantic-new/semantic-new.component";
import { DdmLandingPageComponent } from "./ddm-landing-page/ddm-landing-page.component";
import { RmpLandingPageComponent } from "./rmp-landing-page/rmp-landing-page.component";
import { SortTableComponent } from "./sort-table/sort-table.component";
import { UserService } from "./user.service";
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
import { MultiDatesPickerComponent } from "./multi-dates-picker/multi-dates-picker.component";
import { LogEntryComponent } from './log-entry/log-entry.component';
import {MatPaginatorModule} from '@angular/material/paginator';
// RMP
// import { RMPModule } from "./rmp/rmp.module";
// import {RMPRoutingModule} from "./rmp/rmp-routing.module"
import { SharedModule } from './report-manipulation/shared/shared.module';
import { ScheduledReportsComponent } from './scheduled-reports/scheduled-reports.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SemanticLayerMainComponent,
    SemanticHomeComponent,
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
    LoginComponent,
    SecurityModalComponent,
    PrivilegeModalComponent,
    ReportsNavbarComponent,
    ReportsComponent,
    QueryBuilderComponent,
    InfoModalComponent,
    ShareReportsComponent,
    MultiDatePicker,
    MultiDatesPickerComponent,
    LogEntryComponent,
    ScheduledReportsComponent
  ],
  imports: [
    MatTabsModule,
    MatPaginatorModule,
    BrowserModule,
    NgPipesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule,
    MatChipsModule,
    MatIconModule,
    Ng2SmartTableModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule,
    SharedComponentsModule,
    CreateReportModule,
    NgbModule.forRoot(),
    // RMP
    // FooterComponent,
    // HeaderComponent,
    // RMPModule,
    // RMPRoutingModule
  ],
  providers: [
    UserService,
    SecurityModalService,
    PrivilegeModalService,
    QueryBuilderService
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  exports:[]
})

export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
