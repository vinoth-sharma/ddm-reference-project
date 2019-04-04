import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {TextFieldModule} from '@angular/cdk/text-field'

// import {MatTableModule,MatGridListModule,MatIconModule} from '@angular/material';
import { CreateReportLayoutComponent } from './create-report-layout/create-report-layout.component';
import { FormulaComponent } from './formula/formula.component';
import { SelectTablesComponent } from './select-tables/select-tables.component';
import { AddConditionsComponent } from './add-conditions/add-conditions.component';
import { GenerateReportModalComponent } from './generate-report-modal/generate-report-modal.component';
// import { CalculatedColumnReportComponent } from './calculated-column-report/calculated-column-report.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';
import { PreviewComponent } from './preview/preview.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateCalculatedColumnComponent } from './create-calculated-column/create-calculated-column.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
// import { MatFormFieldModule, MatAutocomplete, MatCheckbox, MatCheckboxModule } from '@angular/material';

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

// import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ValidatorDirective } from '../shared-components/directives/validator.directive';
// import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';

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
    NgxPaginationModule,
    SharedComponentsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [
    CreateReportLayoutComponent,
    FormulaComponent,
    SelectTablesComponent,
    AddConditionsComponent,
    GenerateReportModalComponent,
    // CalculatedColumnReportComponent,
    AddConditionsComponent,
    ApplyAggregationsComponent,
    PreviewComponent,
    CreateCalculatedColumnComponent
  ]
})

export class CreateReportModule { }