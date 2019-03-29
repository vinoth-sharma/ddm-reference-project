import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material'

import { SemanticLayerMainComponent } from "./semantic-layer-main/semantic-layer-main.component";
import { SemanticHomeComponent } from "./semantic-home/semantic-home.component";
import { SemanticSLComponent } from "./semantic-sl/semantic-sl.component";
import { SemanticRMPComponent } from "./semantic-rmp/semantic-rmp.component";
import { SemanticDQMComponent } from "./semantic-dqm/semantic-dqm.component";
import { SemanticExistingComponent } from "./semantic-existing/semantic-existing.component";
import { SemanticNewComponent } from "./semantic-new/semantic-new.component";
import { DdmLandingPageComponent } from "./ddm-landing-page/ddm-landing-page.component"
import { RmpLandingPageComponent } from "./rmp-landing-page/rmp-landing-page.component";
import { SortTableComponent } from "./sort-table/sort-table.component";
import { SemanticReportsComponent } from "./semantic-reports/semantic-reports.component";
import { LoginComponent } from "./login/login.component";
import { ReportsComponent } from './reports/reports.component';
import { QueryBuilderComponent } from "./query-builder/query-builder.component";
// import { JoinsHelpOptionComponent } from './joins-help-option/joins-help-option.component';
import { CreateReportLayoutComponent } from './create-report/create-report-layout/create-report-layout.component';
import { SelectTablesComponent } from './create-report/select-tables/select-tables.component';
import { AddConditionsComponent } from './create-report/add-conditions/add-conditions.component';
import { ViewComponent } from './create-report/view/view.component';
import { ApplyAggregationsComponent } from './create-report/apply-aggregations/apply-aggregations.component';
import { AuthGuard } from "./auth.guard";
import { CalculatedColumnReportComponent } from './create-report/calculated-column-report/calculated-column-report.component';
import { PreviewComponent } from './create-report/preview/preview.component';
import { CreateCalculatedColumnComponent } from './create-report/create-calculated-column/create-calculated-column.component';

const routes: Routes = [{
  path: "module",
  component: DdmLandingPageComponent,
  // component: CreateCalculatedColumnComponent,
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
  // component: CreateCalculatedColumnComponent,
  canActivate: [AuthGuard]
},
{
  path: "",
  component: LoginComponent
  // component: CreateCalculatedColumnComponent
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
    
    {
      path: "sem-reports", component: ReportsComponent,
      children: [
        { path: "", redirectTo: "home", pathMatch: 'full' },       
        { path: "home", component: SemanticReportsComponent },
        { path: "create-report", component: CreateReportLayoutComponent,
        // { path: "create-report", component: CreateCalculatedColumnComponent,
          children: [
            { path: "", redirectTo: "select-tables", pathMatch: 'full' },
            { path: "select-tables", component: SelectTablesComponent },
            { path: "add-conditions", component: AddConditionsComponent },
            { path: "view", component: ViewComponent },
            { path: "preview", component: PreviewComponent },
            { path: "calculated-column", component: CreateCalculatedColumnComponent},
            { path: "apply-aggregations", component: ApplyAggregationsComponent}
          ]
        }
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
    { path: "sem-dqm", component: SemanticDQMComponent },
    { path: "query-builder", component: QueryBuilderComponent }
  ]
},
{ path: "**", redirectTo: "" }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }