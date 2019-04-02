import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { CreateReportLayoutComponent } from './create-report-layout/create-report-layout.component';
import { FormulaComponent } from './formula/formula.component';
import { SelectTablesComponent } from './select-tables/select-tables.component';
import { AddConditionsComponent } from './add-conditions/add-conditions.component';
import { GenerateReportModalComponent } from './generate-report-modal/generate-report-modal.component';
// import { ViewComponent } from './view/view.component';
import { CalculatedColumnReportComponent } from './calculated-column-report/calculated-column-report.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
// import { SetJoinComponent } from './set-join/set-join.component';
// import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';
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
  MatCheckboxModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatStepperModule,
  MatGridListModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatRadioModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatTooltipModule,
  MatExpansionModule,
  MatDialogModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatPaginatorModule
} from '@angular/material';

// import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ValidatorDirective } from '../shared-components/directives/validator.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
   
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
    // ViewComponent,
    CalculatedColumnReportComponent,
    AddConditionsComponent,
    // ApplyAggregationsComponent,
    PreviewComponent,
    // SetJoinComponent,    
    CreateCalculatedColumnComponent
  ]
})

export class CreateReportModule { }
