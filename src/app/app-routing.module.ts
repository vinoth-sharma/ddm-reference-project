import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SemanticLayerMainComponent } from "./semantic-layer-main/semantic-layer-main.component";
import { SemanticHomeComponent } from "./semantic-home/semantic-home.component";
import { SemanticSLComponent } from "./semantic-sl/semantic-sl.component";
import { SemanticRMPComponent } from "./semantic-rmp/semantic-rmp.component";
import { SemanticExistingComponent } from "./semantic-existing/semantic-existing.component";
import { SemanticNewComponent } from "./semantic-new/semantic-new.component";
import { DdmLandingPageComponent } from "./ddm-landing-page/ddm-landing-page.component"
// import { RmpLandingPageComponent } from "./rmp-landing-page/rmp-landing-page.component";
import { LogEntryComponent } from "./log-entry/log-entry.component"; 
import { SortTableComponent } from "./sort-table/sort-table.component";
import { SemanticReportsComponent } from "./semantic-reports/semantic-reports.component";
import { LoginComponent } from "./login/login.component";
import { ReportsComponent } from './reports/reports.component';
import { QueryBuilderComponent } from "./query-builder/query-builder.component";
import { CreateReportLayoutComponent } from './create-report/create-report-layout/create-report-layout.component';
import { RMPModule } from "./rmp/rmp.module";
import { RmpLandingPageComponent } from './rmp/rmp-landing-page/rmp-landing-page.component';
import { ScheduledReportsComponent } from './scheduled-reports/scheduled-reports.component'
// import { SelectTablesComponent } from './create-report/select-tables/select-tables.component';
// import { AddConditionsComponent } from './create-report/add-conditions/add-conditions.component';
// import { ViewComponent } from './create-report/view/view.component';
// import { ApplyAggregationsComponent } from './create-report/apply-aggregations/apply-aggregations.component';
import { AuthGuard } from "./auth.guard";
// import { CreateCalculatedColumnComponent } from './create-report/create-calculated-column/create-calculated-column.component';
import { RMP_Routes } from "./rmp/rmp-routing.module"

const routes: Routes = [{
  path: "module",
  component: DdmLandingPageComponent,
  canActivate: [AuthGuard]
},
// {
//   path: "user",
//   component: RmpLandingPageComponent,
//   canActivate: [AuthGuard]
// },
// {
//   path: "user",
//   loadChildren : "../app/rmp/rmp.module#RMPModule",
//   canActivate: [AuthGuard]
// },
{
  path: "user",
  loadChildren: './rmp/rmp.module#RMPModule',
  canActivate: [AuthGuard]
},
// {
//   path: "login",
//   component: LoginComponent,
//   canActivate: [AuthGuard]
// },
{
  path: "",
  // component: LoginComponent
  component : RmpLandingPageComponent,
  children : RMP_Routes
  // canActivate: [AuthGuard]
},
{
  path: "roles",
  component: SortTableComponent,
  canActivate: [AuthGuard]
},
{
  path: "logs",
  component: LogEntryComponent,
  canActivate: [AuthGuard]
},
{
  path: "semantic",
  component: SemanticLayerMainComponent,
  canActivate: [AuthGuard],
  data: [{ semantic: "sele" }, { semantic_id: "" }],
  children: [
    { path: "", redirectTo: "sem-sl", pathMatch: 'full' },
    { path: "sem-home", component: SemanticHomeComponent },
    {
      path: "sem-reports", component: ReportsComponent,
      children: [
        { path: "", redirectTo: "home", pathMatch: 'full' },
        { path: "home", component: SemanticReportsComponent },
        { path: "create-report/:id", component: CreateReportLayoutComponent},
        { path: "create-report", component: CreateReportLayoutComponent },
        { path: "view", loadChildren: './report-manipulation/report/report.module#ReportModule' },
        { path: "scheduled-reports", component: ScheduledReportsComponent },
      ]
    },
    {
      path: "sem-sl", component: SemanticSLComponent,
      children: [
        { path: "", redirectTo: "sem-existing", pathMatch: 'full' },
        { path: "sem-existing", component: SemanticExistingComponent },
        { path: "sem-new", component: SemanticNewComponent }
      ]
    },
    { path: "sem-rmp", component: SemanticRMPComponent },
    { path: "dqm", component: SemanticReportsComponent },
    // { path: "scheduled-reports", component: ScheduledReportsComponent },
    { path: "query-builder", component: QueryBuilderComponent }
  ]
},
{ path: "**", redirectTo: "" }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule { }