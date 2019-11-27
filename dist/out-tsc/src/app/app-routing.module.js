import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SemanticLayerMainComponent } from "./semantic-layer-main/semantic-layer-main.component";
import { SemanticSLComponent } from "./semantic-sl/semantic-sl.component";
import { SemanticRMPComponent } from "./semantic-rmp/semantic-rmp.component";
import { SemanticExistingComponent } from "./semantic-existing/semantic-existing.component";
import { SemanticNewComponent } from "./semantic-new/semantic-new.component";
import { DdmLandingPageComponent } from "./ddm-landing-page/ddm-landing-page.component";
// import { RmpLandingPageComponent } from "./rmp-landing-page/rmp-landing-page.component";
import { LogEntryComponent } from "./log-entry/log-entry.component";
import { SortTableComponent } from "./sort-table/sort-table.component";
import { SemanticReportsComponent } from "./semantic-reports/semantic-reports.component";
import { ReportsComponent } from './reports/reports.component';
import { QueryBuilderComponent } from "./query-builder/query-builder.component";
import { CreateReportLayoutComponent } from './create-report/create-report-layout/create-report-layout.component';
import { ScheduledReportsComponent } from './scheduled-reports/scheduled-reports.component';
import { AuthGuard } from "./auth.guard";
import { CalculatedColumnComponent } from './calculated-column/calculated-column.component';
var routes = [
    {
        path: "module",
        component: DdmLandingPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "user",
        loadChildren: './rmp/rmp.module#RMPModule',
        canActivate: [AuthGuard]
    },
    {
        path: "",
        loadChildren: './rmp/rmp.module#RMPModule',
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
            {
                path: "sem-reports", component: ReportsComponent,
                children: [
                    { path: "", redirectTo: "home", pathMatch: 'full' },
                    { path: "home", component: SemanticReportsComponent },
                    { path: "create-report/:id", component: CreateReportLayoutComponent },
                    { path: "create-report", component: CreateReportLayoutComponent },
                    { path: "view", loadChildren: "src/app/report-manipulation/report/report.module#ReportModule" },
                    { path: "scheduled-reports", component: ScheduledReportsComponent },
                ]
            },
            {
                path: "sem-sl", component: SemanticSLComponent,
                children: [
                    { path: "", redirectTo: "sem-existing", pathMatch: 'full' },
                    { path: "sem-existing", component: SemanticExistingComponent },
                    { path: "sem-new", component: SemanticNewComponent },
                    { path: "query-builder", component: QueryBuilderComponent },
                    { path: "calculated-column", component: CalculatedColumnComponent, data: { allowMultiColumn: '' } }
                ]
            },
            { path: "sem-rmp", component: SemanticRMPComponent },
            { path: "dqm", component: SemanticReportsComponent },
        ]
    },
    {
        path: "**",
        redirectTo: ""
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes, { useHash: true })],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map