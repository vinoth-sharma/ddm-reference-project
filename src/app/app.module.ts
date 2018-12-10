import { BrowserModule } from '@angular/platform-browser';
import { NgModule , Pipe } from '@angular/core';
//import { AppRoutingModule } from './app-routing.module';
import { NgPipesModule} from 'angular-pipes';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SemanticLayerMainComponent } from './semantic-layer-main/semantic-layer-main.component';
import { SemanticHomeComponent } from './semantic-home/semantic-home.component';
// import { SemanticReportsComponent } from './semantic-reports/semantic-reports.component';
import { SemanticSLComponent } from './semantic-sl/semantic-sl.component';
import { SemanticRMPComponent } from './semantic-rmp/semantic-rmp.component';
import { SemanticDQMComponent } from './semantic-dqm/semantic-dqm.component';
import {RouterModule} from '@angular/router';
import { SemanticExistingComponent } from './semantic-existing/semantic-existing.component';
import { SemanticNewComponent } from './semantic-new/semantic-new.component';
import { DdmLandingPageComponent } from './ddm-landing-page/ddm-landing-page.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RmpLandingPageComponent } from './rmp-landing-page/rmp-landing-page.component';
import {  Ng2SmartTableModule } from 'ng2-smart-table';
import { SortTableComponent } from './sort-table/sort-table.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {  HttpClientModule } from '@angular/common/http';
import {  BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule, MatSortModule } from '@angular/material';
import { UserService } from './user.service';
import { ShareReportComponent } from './share-report/share-report.component';
import { SemanticReportsComponent } from './semantic-reports/semantic-reports.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TagmodalComponent } from './tagmodal/tagmodal.component';
import { QueryTableComponent } from './query-table/query-table.component';
import * as $ from 'jquery';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
//import { NgModule } from '@angular/core';
//import { RouterModule, Routes } from '@angular/router';
//import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { SemdetailsService } from './semdetails.service';
//import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
//import { UserComponent } from './user/user.component';
//import { HeaderComponent } from './header/header.component';
//import { FooterComponent } from './footer/footer.component';
import { AuthGuard } from './auth.guard';
//import { ModulesComponent } from './modules/modules.component';
import { map } from 'rxjs/operators';
import { ToastrModule } from 'ngx-toastr';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DdmPipePipe } from './ddm-pipe.pipe';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { InlineEditComponent } from './shared-components/inline-edit/inline-edit.component';
import { SemanticLayerMainService } from './semantic-layer-main/semantic-layer-main.service';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { SemanticlayerComponent } from './semanticlayer/semanticlayer.component';

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
    DdmPipePipe
  ],
  imports: [    
    BrowserModule,
    NgPipesModule,
//    AppRoutingModule,
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
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot([
      // {
      //   path: 'semanticlayer',
      //   component: SemanticlayerComponent,
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'module',
        component: DdmLandingPageComponent, 
        canActivate: [AuthGuard]
      },
    {
      path: 'user',
      component: RmpLandingPageComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'login',
      component: LoginComponent,
      canActivate: [AuthGuard]
    },
    {
      path: '',
      component: LoginComponent,
    },
    {
      path: 'roles',
      component: SortTableComponent,
    },
    {path:'semantic',
    component:SemanticLayerMainComponent,
    canActivate: [AuthGuard],
    data :[ {semantic : 'sele'},{semantic_id: ''}],
    children:[
      {path:'sem-home',component:SemanticHomeComponent},
      {path:'sem-reports',component:SemanticReportsComponent},
      {path:'sem-sl',component:SemanticSLComponent},
      {path:'sem-existing',component:SemanticExistingComponent},
      {path:'sem-new',component:SemanticNewComponent},
        // children: [
        //   {path:'sem-existing',component:SemanticExistingComponent},
        //   {path:'sem-new',component:SemanticNewComponent},
        //   {path:'', redirectTo:'sem-existing',pathMatch:'full'}
        // ]},
      {path:'sem-rmp',component:SemanticRMPComponent},
      {path:'sem-dqm',component:SemanticDQMComponent},
      {path:'query-table', component: QueryTableComponent},
      
  ]}, 
    { path: '**', redirectTo: '' }
    ])
  ],
  providers: [
    UserService,
    SemanticLayerMainService
  ],
  bootstrap: [AppComponent],
  entryComponents:[]
})
export class AppModule { }

