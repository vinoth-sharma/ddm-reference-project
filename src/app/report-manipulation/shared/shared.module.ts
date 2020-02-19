import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   MatButtonModule,
//   MatTabsModule,
//   MatIconModule,
//   MatDialogModule,
//   MatOptionModule,
//   MatFormFieldModule,
//   MatSelectModule,
//   MatSnackBarModule,
//   MatSidenavModule,
//   MatAutocompleteModule,
//   MatTableModule,
//   MatSortModule,
//   MatPaginatorModule,
//   MatCheckboxModule
// } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';

@NgModule({
  declarations: [],
  imports: [
    // CommonModule,
    FormsModule,
    DragDropModule,
    SharedComponentsModule,
    FlexLayoutModule,
    // MatButtonModule,
    // MatTabsModule,
    // MatIconModule,
    // MatDialogModule,
    // MatOptionModule,
    // MatFormFieldModule,
    // MatSelectModule,
    // MatSnackBarModule,
    // MatSidenavModule,
    // MatAutocompleteModule,
    // MatTableModule,
    // MatSortModule,
    // MatPaginatorModule,
    // MatCheckboxModule,
  ],
  exports: [
    FlexLayoutModule,
    FormsModule,
    SharedComponentsModule,
    DragDropModule,
    // MatButtonModule,
    // MatTabsModule,
    // MatIconModule,
    // MatDialogModule,
    // MatOptionModule,
    // MatFormFieldModule,
    // MatSelectModule,
    // MatSnackBarModule,
    // MatSidenavModule,
    // MatAutocompleteModule,
    // MatTableModule,
    // MatSortModule,
    // MatPaginatorModule,
    // MatCheckboxModule,
  ]
})

export class SharedModule { }
