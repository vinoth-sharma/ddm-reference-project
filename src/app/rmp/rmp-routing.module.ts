import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RmpLandingPageComponent } from './rmp-landing-page/rmp-landing-page.component';
import { MainMenuLandingPageComponent } from './Main/main-menu-landing-page/main-menu-landing-page.component';
import { DdmIntroComponent } from './Main/ddm-intro/ddm-intro.component';
import { UserProfileComponent } from './Main/user-profile/user-profile.component';
import { DdmTeamComponent } from './Main/ddm-team/ddm-team.component';
import { ReferenceDocComponent } from './Main/reference-doc/reference-doc.component';
import { MainMenuComponent } from './Main/main-menu/main-menu.component';
import { DdmAdminComponent } from './Main/ddm-admin/ddm-admin.component';
import { BrandFormsComponent } from './Main/brand-forms/brand-forms.component';
import { RequestStatusComponent } from './request-status/request-status.component';
import { ReportsComponent } from './reports/reports.component';
import { MetricsComponent } from './metrics/metrics.component';
import { DisclaimerWrapperComponent } from './submit-request/disclaimer-wrapper/disclaimer-wrapper.component';
import { SubmitRequestWrapperComponent } from './submit-request/submit-request-wrapper/submit-request-wrapper.component';

export const RMP_Routes = [
  {
    path: '', component: RmpLandingPageComponent, children: [
      {
        path: 'main', component: MainMenuComponent,
        children: [
          { path: 'home', component: MainMenuLandingPageComponent },
          { path: 'ddm', component: DdmIntroComponent },
          { path: 'user-profile', component: UserProfileComponent },
          { path: 'ddm-team', component: DdmTeamComponent },
          { path: 'reference-documents', component: ReferenceDocComponent },
          { path: 'ddm-admin', component: DdmAdminComponent },
          { path: 'ddm-brand-forms', component: BrandFormsComponent },
          { path: '', redirectTo: '/user/main/home' }
        ]
      },
      { path: 'disclaimer', component: DisclaimerWrapperComponent },
      { path: 'submit-request', component: SubmitRequestWrapperComponent },
      { path: 'request-status', component: RequestStatusComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'metrics', component: MetricsComponent },
      { path: '', redirectTo: 'main', pathMatch: 'full' }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(RMP_Routes)],
  exports: [RouterModule]
})
export class RMPRoutingModule { }
