import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from "@angular/common";
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { NgPipesModule } from 'angular-pipes';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { setAppInjector } from '../app-injector';
import { AppRoutingModule } from './app-routing.module';
// RMP
import { ShareReportService } from './share-reports/share-report.service';
import { AuthSsoService } from './auth-sso.service';
import { AuthInterceptor } from './auth-interceptor.service';
import { CustomModalsModule } from './rmp/custom-modals/custom-modals.module';
import { InputValidatorDirective } from "./custom-directives/input-validator.directive";
import { CustomPipeModules } from "./custom-directives/custom.pipes.module";
import { QuillModule } from "ngx-quill";
import { SchedulerPrivilegesComponent } from './privilege-modal/scheduler-privileges/scheduler-privileges.component';
import { CommonModuleDdmRmp } from "./custom-directives/common.module";

export function authoSsoServiceFactory(authSsoService: AuthSsoService): Function {
  return () => authSsoService.authLoad();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InputValidatorDirective,
    SchedulerPrivilegesComponent,
  ],
  imports: [
    BrowserModule,
    QuillModule,
    NgPipesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CustomModalsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule,
    AppRoutingModule,
    CustomPipeModules.forRoot(),
    CommonModuleDdmRmp.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: authoSsoServiceFactory,
      deps: [AuthSsoService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthSsoService
  ],
  bootstrap: [AppComponent],
  entryComponents: [SchedulerPrivilegesComponent
  ],
  exports: []
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
