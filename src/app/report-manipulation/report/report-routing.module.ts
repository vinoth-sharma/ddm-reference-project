import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ReportContainerComponent } from './report-view/report-container/report-container.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'insert/:reportId', component: ReportContainerComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
