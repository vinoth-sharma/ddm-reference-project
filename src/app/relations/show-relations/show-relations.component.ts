import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NewRelationModalService } from '../../new-relation-modal/new-relation-modal.service';
import Utils from '../../../utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show-relations',
  templateUrl: './show-relations.component.html',
  styleUrls: ['./show-relations.component.css']
})
export class ShowRelationsComponent implements OnInit {

  relationships:any[] = [];
  isLoading:boolean = true;

  constructor(
    private dialogRef: MatDialogRef<ShowRelationsComponent>,
    private relationService:NewRelationModalService,
    private dialog: MatDialog,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
   this.getRelations();
  }

  getRelations() {
     this.isLoading = true;
     Utils.closeModals();
     this.relationService.getRelations( this.data.semanticId).subscribe(res => {
       this.isLoading = false;
       this.relationships = res['data'];
     }, err => {
       this.isLoading = false;
     })
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  deleteRelation(rId) {
    this.relationService.deleteRelations(rId).subscribe(res => {
      this.toasterService.success(res['message']);
      this.getRelations();
    }, err => {
      this.toasterService.error(err);
    })
  }

  editRelation(relation) {
    this.dialogRef.close({'relation':relation,'type':'edit'});
  }

}
