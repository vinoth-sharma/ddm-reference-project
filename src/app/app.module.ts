import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector } from "@angular/core";
import { NgPipesModule } from "angular-pipes";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule, MatSortModule } from "@angular/material";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpModule } from "@angular/http";
import { ToastrModule } from "ngx-toastr";
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from "./app.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { SemanticLayerMainComponent } from "./semantic-layer-main/semantic-layer-main.component";
import { SemanticHomeComponent } from "./semantic-home/semantic-home.component";
import { SemanticSLComponent } from "./semantic-sl/semantic-sl.component";
import { SemanticRMPComponent } from "./semantic-rmp/semantic-rmp.component";
import { SemanticDQMComponent } from "./semantic-dqm/semantic-dqm.component";
import { SemanticExistingComponent } from "./semantic-existing/semantic-existing.component";
import { SemanticNewComponent } from "./semantic-new/semantic-new.component";
import { DdmLandingPageComponent } from "./ddm-landing-page/ddm-landing-page.component";
import { SearchbarComponent } from "./searchbar/searchbar.component";
import { RmpLandingPageComponent } from "./rmp-landing-page/rmp-landing-page.component";
import { SortTableComponent } from "./sort-table/sort-table.component";
import { UserService } from "./user.service";
import { ShareReportComponent } from "./share-report/share-report.component";
import { SemanticReportsComponent } from "./semantic-reports/semantic-reports.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { TagmodalComponent } from "./tagmodal/tagmodal.component";
import { LoginComponent } from "./login/login.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SharedComponentsModule } from "./shared-components/shared-components.module";
import { SecurityModalComponent } from './security-modal/security-modal.component';
import { PrivilegeModalComponent } from './privilege-modal/privilege-modal.component';
import { PrivilegeModalService } from "./privilege-modal/privilege-modal.service";
import { SecurityModalService } from "./security-modal/security-modal.service";
import { ReportsNavbarComponent } from './reports-navbar/reports-navbar.component';
import { JoinsHelpOptionComponent } from './joins-help-option/joins-help-option.component';
import { ReportsComponent } from './reports/reports.component';
import { QueryBuilderComponent } from "./query-builder/query-builder.component";
import { QueryBuilderService } from "./query-builder/query-builder.service";
import { InfoModalComponent } from './info-modal/info-modal.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { ReportTablesComponent } from './report-tables/report-tables.component';
import { ReportConditionsComponent } from './report-conditions/report-conditions.component';
import { setAppInjector } from '../app-injector';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SemanticLayerMainComponent,
    SemanticHomeComponent,
    SemanticReportsComponent,
    SemanticSLComponent,
    DdmLandingPageComponent,
    SemanticRMPComponent,
    SemanticDQMComponent,
    SemanticExistingComponent,
    SemanticNewComponent,
    SearchbarComponent,
    RmpLandingPageComponent,
    SortTableComponent,
    ShareReportComponent,
    ScheduleComponent,
    TagmodalComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    SecurityModalComponent,
    PrivilegeModalComponent,
    ReportsNavbarComponent,
    JoinsHelpOptionComponent,
    ReportsComponent,
    QueryBuilderComponent,
    InfoModalComponent,
    CreateReportComponent,
    ReportTablesComponent,
    ReportConditionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgPipesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule,
    Ng2SmartTableModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedComponentsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [UserService, SecurityModalService, PrivilegeModalService, QueryBuilderService],
  bootstrap: [AppComponent],
  entryComponents: []
})

export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
