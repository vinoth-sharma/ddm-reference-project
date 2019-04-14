import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TextFieldModule } from '@angular/cdk/text-field'

import { CreateReportLayoutComponent } from './create-report-layout/create-report-layout.component';
import { FormulaComponent } from './formula/formula.component';
import { SelectTablesComponent } from './select-tables/select-tables.component';
import { AddConditionsComponent } from './add-conditions/add-conditions.component';
import { GenerateReportModalComponent } from './generate-report-modal/generate-report-modal.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';
import { CreateCalculatedColumnComponent } from './create-calculated-column/create-calculated-column.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import {
  MatFormFieldModule, 
  MatAutocompleteModule, 
  MatCheckbox, 
  MatExpansionModule,
  MatStepperModule,
  MatCheckboxModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule,
  MatSidenavModule,
  MatSortModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatRadioModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatTooltipModule,
  MatDialogModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatPaginatorModule,
  MatTableModule,
  MatGridListModule,
  MatIconModule
} from '@angular/material';
import { ValidatorDirective } from '../shared-components/directives/validator.directive';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatGridListModule,
    MatCheckboxModule,
    RouterModule,
    MatTableModule,   
    BrowserModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatStepperModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatRadioModule,
    MatStepperModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    SharedComponentsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [
    CreateReportLayoutComponent,
    FormulaComponent,
    SelectTablesComponent,
    AddConditionsComponent,
    GenerateReportModalComponent,
    AddConditionsComponent,
    ApplyAggregationsComponent,
    CreateCalculatedColumnComponent
  ]
})

export class CreateReportModule { }