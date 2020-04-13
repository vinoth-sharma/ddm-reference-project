import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from "@angular/common";
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { NgPipesModule } from 'angular-pipes';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppComponent } from "./app.component";
import { SortTableComponent } from "./sort-table/sort-table.component";
import { LoginComponent } from "./login/login.component";
import { SecurityModalComponent } from './security-modal/security-modal.component';
import { PrivilegeModalComponent } from './privilege-modal/privilege-modal.component';
import { PrivilegeModalService } from './privilege-modal/privilege-modal.service';
import { SecurityModalService } from './security-modal/security-modal.service';
import { setAppInjector } from '../app-injector';
import { AppRoutingModule } from './app-routing.module';
import { LogEntryComponent } from './log-entry/log-entry.component';
// RMP
import { ShareReportService } from './share-reports/share-report.service';
import { AuthSsoService } from './auth-sso.service';
import { AuthInterceptor } from './auth-interceptor.service';
// import { CreateCalculatedColumnComponent } from './create-report/create-calculated-column/create-calculated-column.component';
import { CustomModalsModule } from './rmp/custom-modals/custom-modals.module';
import { InputValidatorDirective } from "./custom-directives/input-validator.directive";
import { CustomPipeModules } from "./custom-directives/custom.pipes.module";
import { QuillModule } from "ngx-quill";
import { SchedulerPrivilegesComponent } from './privilege-modal/scheduler-privileges/scheduler-privileges.component';
// import { MaterialModule } from "./material.module";
import { CommonModuleDdmRmp } from "./custom-directives/common.module";

export function authoSsoServiceFactory(authSsoService: AuthSsoService): Function {
  return () => authSsoService.authLoad();
}

@NgModule({
  declarations: [
    AppComponent,
    SortTableComponent,
    LoginComponent,
    SecurityModalComponent,
    PrivilegeModalComponent,
    // MultiDatesPickerComponent,
    LogEntryComponent,
    InputValidatorDirective,
    // spaceFormaterString
    SchedulerPrivilegesComponent,
  ],
  imports: [
    BrowserModule,
    QuillModule,
    // CommonModule,
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
    NgxSpinnerModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule,
    // NgbModule.forRoot(),
    CustomPipeModules.forRoot(),
    CommonModuleDdmRmp.forRoot()
    // MaterialModule.forRoot()
    // RMP
    // FooterComponent,
    // HeaderComponent,
    // RMPModule,
    // RMPRoutingModule
  ],
  providers: [
    SecurityModalService,
    PrivilegeModalService,
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
  exports:[]
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
