import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineEditComponent } from './inline-edit/inline-edit.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
     InlineEditComponent
  ],
  exports:[
    InlineEditComponent
  ]
})
export class SharedComponentsModule { }
