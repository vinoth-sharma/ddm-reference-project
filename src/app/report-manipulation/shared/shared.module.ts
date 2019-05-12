import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatTabsModule, MatIconModule, MatDialogModule, MatOptionModule,
  MatFormFieldModule, MatSelectModule, MatSnackBarModule, MatSidenavModule, MatAutocompleteModule, 
  MatTableModule, MatSortModule, MatPaginatorModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    FlexLayoutModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatSnackBarModule,
    MatSidenavModule,
    DragDropModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    SharedComponentsModule
  ],
  exports: [
    MatButtonModule,
    FlexLayoutModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatSnackBarModule,
    MatSidenavModule,
    DragDropModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    SharedComponentsModule
  ]
})
export class SharedModule { }
