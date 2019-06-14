import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OndemandConfigReportsComponent } from './ondemand-config-reports/ondemand-config-reports.component';
import { OndemandReportsComponent } from './ondemand-reports/ondemand-reports.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OndemandConfigReportsComponent, OndemandReportsComponent],
  exports: [OndemandConfigReportsComponent, OndemandReportsComponent]
})
export class CustomModalsModule { }
