import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { NgPipesModule } from 'angular-pipes';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppComponent } from "./app.component";
import { setAppInjector } from '../app-injector';
import { AppRoutingModule } from './app-routing.module';
// RMP
import { AuthSsoService } from './auth-sso.service';
import { AuthInterceptor } from './auth-interceptor.service';
import { InputValidatorDirective } from "./custom-directives/input-validator.directive";
import { CustomPipeModules } from "./custom-directives/custom.pipes.module";
import { QuillModule } from "ngx-quill";
import { CommonModuleDdmRmp } from "./custom-directives/common.module";

export function authoSsoServiceFactory(authSsoService: AuthSsoService): Function {
  return () => authSsoService.authLoad();
}

@NgModule({
  declarations: [
    AppComponent,
    InputValidatorDirective
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
  entryComponents: [],
  exports: []
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
