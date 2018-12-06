import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineEditComponent } from './inline-edit/inline-edit.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
     InlineEditComponent,
     ConfirmModalComponent
  ],
  exports:[
    InlineEditComponent,
    ConfirmModalComponent
  ]
})
export class SharedComponentsModule { }
