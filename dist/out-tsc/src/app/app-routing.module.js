// import { NgModule } from '@angular/core';
// import { Route, RouterModule } from '@angular/router';
// import { HttpModule } from '@angular/http';
// //import { LandingPageComponent } from './landing-page/landing-page.component';
// import { SemanticLayerMainComponent } from './semantic-layer-main/semantic-layer-main.component';
// import { SemanticHomeComponent } from './semantic-home/semantic-home.component';
// import { SemanticReportsComponent } from './semantic-reports/semantic-reports.component';
// import { SemanticSLComponent } from './semantic-sl/semantic-sl.component';
// import { SemanticRMPComponent } from './semantic-rmp/semantic-rmp.component';
// import { SemanticDQMComponent } from './semantic-dqm/semantic-dqm.component';
// import { SemanticNewComponent } from './semantic-new/semantic-new.component';
// import { SemanticExistingComponent } from './semantic-existing/semantic-existing.component';
// import { DdmLandingPageComponent } from './ddm-landing-page/ddm-landing-page.component';
// import { RmpLandingPageComponent } from './rmp-landing-page/rmp-landing-page.component';
// import { SortTableComponent } from './sort-table/sort-table.component';
// import { QueryTableComponent } from './query-table/query-table.component';
// import { LoginComponent } from './login/login.component';
// const routes: Route[] = [
//   {path:'',component:LoginComponent},
//   {path:'user',component:DdmLandingPageComponent},
//   {path:'rmp',component:RmpLandingPageComponent},
//   {path:'semantic',component:SemanticLayerMainComponent,
//     children:[
//       {path:'sem-home',component:SemanticHomeComponent},
//       {path:'sem-reports',component:SemanticReportsComponent},
//       {path:'sem-sl',component:SemanticSLComponent,
//         children: [
//           {path:'sem-existing',component:SemanticExistingComponent},
//           {path:'sem-new',component:SemanticNewComponent},
//           {path:'', redirectTo:'sem-existing',pathMatch:'full'}
//         ]},
//       {path:'sem-rmp',component:SemanticRMPComponent},
//       {path:'sem-dqm',component:SemanticDQMComponent},
//       {path:'query-table', component: QueryTableComponent},
//   ]}, 
//   {path:'roles',component: SortTableComponent}
// ] 
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
//# sourceMappingURL=app-routing.module.js.map