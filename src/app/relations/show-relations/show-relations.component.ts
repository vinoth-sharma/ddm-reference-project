import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NewRelationModalService } from '../../new-relation-modal/new-relation-modal.service';
import Utils from '../../../utils';
// import { CreateRelationComponent } from '../create-relation/create-relation.component';

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
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    // Utils.showSpinner();
    this.isLoading = true;
    Utils.closeModals();
    // this.dialog.closeAll();
    this.relationService.getRelations( this.data.semanticId).subscribe(res => {
      // Utils.hideSpinner();
      this.isLoading = false;
      // this.relationships = res['data'];
      this.relationships = [
        { 'left_table': 941,
        'type_of_join': 'left Outer',
        'right_table': 941,
        'relationship_list': [
          {
            'primary_key': 'VIN',
              'operator': '=',
              'foreign_key': 'VIN'
        },
        {
          'primary_key': 'VIN',
            'operator': '=',
            'foreign_key': 'VIN'
      }
        ]
      }
      ]
    },
    err => {
      // Utils.hideSpinner();
      this.isLoading = false;
      console.log('FAILED');
    }
  )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteRelation(rId) {
    this.relationService.deleteRelations(rId).subscribe(res => {
      // this.
    },
    err => {
      // this.
    }
  )
  }

  editRelation(relation) {
    // this.dialog.closeAll();
    // const dialogRef = this.dialog.open(CreateRelationComponent, {
    //   width: '800px',
    //   height: '250px',
    //   data: {}
    // })

    // dialogRef.afterClosed().subscribe(result => {
    //  console.log(result, 'after close');
    // })
  }



}
