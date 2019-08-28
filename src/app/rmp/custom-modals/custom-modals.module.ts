import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OndemandConfigReportsComponent } from './ondemand-config-reports/ondemand-config-reports.component';
import { OndemandReportsComponent } from './ondemand-reports/ondemand-reports.component';
import { FormsModule } from '@angular/forms'
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    OndemandConfigReportsComponent, 
    OndemandReportsComponent
  ],
  exports: [OndemandConfigReportsComponent, OndemandReportsComponent]
})
export class CustomModalsModule { }
