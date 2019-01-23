import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector } from "@angular/core";
import { NgPipesModule } from "angular-pipes";
import { AppComponent } from "./app.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { SemanticLayerMainComponent } from "./semantic-layer-main/semantic-layer-main.component";
import { SemanticHomeComponent } from "./semantic-home/semantic-home.component";
import { SemanticSLComponent } from "./semantic-sl/semantic-sl.component";
import { SemanticRMPComponent } from "./semantic-rmp/semantic-rmp.component";
import { SemanticDQMComponent } from "./semantic-dqm/semantic-dqm.component";
import { RouterModule } from "@angular/router";
import { SemanticExistingComponent } from "./semantic-existing/semantic-existing.component";
import { SemanticNewComponent } from "./semantic-new/semantic-new.component";
import { DdmLandingPageComponent } from "./ddm-landing-page/ddm-landing-page.component";
import { SearchbarComponent } from "./searchbar/searchbar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RmpLandingPageComponent } from "./rmp-landing-page/rmp-landing-page.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { SortTableComponent } from "./sort-table/sort-table.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule, MatSortModule } from "@angular/material";
import { UserService } from "./user.service";
import { ShareReportComponent } from "./share-report/share-report.component";
import { SemanticReportsComponent } from "./semantic-reports/semantic-reports.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { TagmodalComponent } from "./tagmodal/tagmodal.component";
import { QueryTableComponent } from "./query-table/query-table.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpModule } from "@angular/http";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./auth.guard";
import { ToastrModule } from "ngx-toastr";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { DdmPipePipe } from "./ddm-pipe.pipe";
import { SharedComponentsModule } from "./shared-components/shared-components.module";
import { SecurityModalComponent } from './security-modal/security-modal.component';
import { PrivilegeModalComponent } from './privilege-modal/privilege-modal.component';
import { PrivilegeModalService } from "./privilege-modal/privilege-modal.service";
import { SecurityModalService } from "./security-modal/security-modal.service";
import { NgxSpinnerModule } from 'ngx-spinner';
import { setAppInjector } from '../app-injector';
import { ReportsNavbarComponent } from './reports-navbar/reports-navbar.component';
import { JoinsHelpOptionComponent } from './joins-help-option/joins-help-option.component';
import { ReportsComponent } from './reports/reports.component';
import { QueryBuilderComponent } from "./query-builder/query-builder.component";
import { QueryBuilderService } from "./query-builder/query-builder.service";


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
    DdmLandingPageComponent,
    SearchbarComponent,
    RmpLandingPageComponent,
    SortTableComponent,
    ShareReportComponent,
    ScheduleComponent,
    TagmodalComponent,
    QueryTableComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    DdmPipePipe,
    SecurityModalComponent,
    PrivilegeModalComponent,
    ReportsNavbarComponent,
    JoinsHelpOptionComponent,
    ReportsComponent,
    QueryBuilderComponent
  ],
  imports: [
    BrowserModule,
    NgPipesModule,
    RouterModule,
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
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot([
      {
        path: "module",
        component: DdmLandingPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "user",
        component: RmpLandingPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "login",
        component: LoginComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "",
        component: LoginComponent
      },
      {
        path: "roles",
        component: SortTableComponent
      },
      {
        path: "semantic",
        component: SemanticLayerMainComponent,
        canActivate: [AuthGuard],
        data: [{ semantic: "sele" }, { semantic_id: "" }],
        children: [
          { path: "", redirectTo: "sem-home", pathMatch: 'full' },
          { path: "sem-home", component: SemanticHomeComponent },
          { path: "sem-reports", component: ReportsComponent,
          children: [ 
            { path: "", redirectTo: "home", pathMatch: 'full' },
            { path: "home", component: SemanticReportsComponent },
            { path: "create-report", component: JoinsHelpOptionComponent } 
          ] },
          { path: "sem-sl", component: SemanticSLComponent,  
            children: [ 
              { path: "", redirectTo: "sem-existing", pathMatch: 'full' },
              { path: "sem-existing", component: SemanticExistingComponent },
              { path: "sem-new", component: SemanticNewComponent } 
            ]
          },
          { path: "sem-rmp", component: SemanticRMPComponent },
          { path: "sem-dqm", component: SemanticDQMComponent },
          { path: "query-table", component: QueryTableComponent },
          { path: "query-builder", component: QueryBuilderComponent}
        ]
      },
      { path: "**", redirectTo: "" }
    ])
  ],
  providers: [UserService,SecurityModalService,PrivilegeModalService,QueryBuilderService],
  bootstrap: [AppComponent],
  entryComponents: []
})

// export let InjectorInstance:Injector;

export class AppModule { 
  //  let InjectorInstance:Injector;

  constructor(injector: Injector){
   setAppInjector(injector);
  }
}
