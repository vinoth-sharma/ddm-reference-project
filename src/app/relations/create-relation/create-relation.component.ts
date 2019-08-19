import { Component, OnInit, Inject } from '@angular/core';
import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { NewRelationModalService } from '../../new-relation-modal/new-relation-modal.service';
import Utils from '../../../utils';
import { Router } from '@angular/router';
import { ShowRelationsComponent } from '../show-relations/show-relations.component';

@Component({
  selector: 'app-create-relation',
  templateUrl: './create-relation.component.html',
  styleUrls: ['./create-relation.component.css']
})
export class CreateRelationComponent implements OnInit {

  tables:any[] = [];
  joins:any[] = [];
  keys:any[] = [];
  LeftColumns:any[] = [];
  rightColumns:any[] = [];
  values:any[] = [];
  joinKey:string = '';
  leftTable:any[] = [];
  rightTable:any[] = [];
  diffDataType:boolean = false;
  type:string = '';

  constructor(
    private router:Router,
    private relationService:NewRelationModalService,
    private dialogRef: MatDialogRef<CreateRelationComponent>,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables = Array.isArray(tables) ? tables : [];
      this.resetState();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resetState() {
    this.joins = ['Left Outer','Right Outer','Full Outer','Inner','Cross'];
    this.keys = [{'primaryKey': '','value':'','foriegnKey':''}];
    this.values = ['=','!='];
    this.type = this.data['type'];
  }

  setSelectedTable(data:any, type:string) {
    if(type === 'left') {
      this.LeftColumns = data['column_properties'];
      // this.leftTableId = data['sl_tables_id'];
    } else {
      this.rightColumns = data['column_properties'];
      // this.rightTableId = data['sl_tables_id'];
    }
  }

  setSelectedColumn(data:any, type:string, columnIndex) {
    console.log(data, columnIndex);
    let rightIndex = this.rightTable['column_properties'].filter(item => item['column'].toLowerCase() === data.foriegnKey.toLowerCase());
    let leftIndex = this.leftTable['column_properties'].filter(item => item['column'].toLowerCase() === data.primaryKey.toLowerCase());
    console.log(rightIndex,leftIndex,'indces');
    if(rightIndex[0].data_type === leftIndex[0].data_type) {
      console.log('same data type');
      this.diffDataType = false;
    } else {
      console.log('please select same data type');
      this.diffDataType = true;
    }

  }


  public getSemanticId() {
    let semanticId;
   this.router.config.forEach(element => {
     if (element.path == "semantic") {
       semanticId =  element.data["semantic_id"];
      }
    });

    return semanticId;
  }
  

  getData(type) {
    return this.keys.map(data => {
      return data[type];
    });
  }

  onCreate() {
    // Utils.showSpinner();
    let option = {};
    let joinType = this.joinKey;
    let leftTableId = this.leftTable['sl_tables_id'];
    let rightTableId = this.rightTable['sl_tables_id'];
    option['sl_id'] = this.getSemanticId();
    option['relationships_list'] = {
          'join_type': joinType,
          'left_table_id': leftTableId,
          'right_table_id': rightTableId,
          'primary_key': this.getData('primaryKey'),
          'foreign_key': this.getData('foriegnKey'),
          'operator': this.getData('value')
        }
    console.log(option,'option');

  //   this.relationService.createRelations(option).subscribe(res => {
  //     Utils.hideSpinner();
  //     console.log('creaed');
  //   },
  //   err => {
  //     Utils.hideSpinner();
  //     console.log('FAILED');
  //   }
  // )
  }

  addRow() {
    this.keys.push({'primaryKey': '','value':'','foriegnKey':''});
  }

  deleteRow(i) {
    this.keys.splice(i,1);
  }

  checkDataType() {
    // this.
  }

  checkOneRelation() {
    return this.keys.length === 1;
  }

  checkValidate() {
    let result = this.keys.map(data => {

    });
  }

  showRelationships() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ShowRelationsComponent, {
      width: '800px',
      height: '250px',
      data: {'semanticId':this.getSemanticId()}
    })

    dialogRef.afterClosed().subscribe(result => {
     console.log(result, 'after close');
    })
  }
}
