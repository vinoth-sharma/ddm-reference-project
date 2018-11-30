import { Component, OnInit } from '@angular/core';
import { NewRelationModalService } from './new-relation-modal.service';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-relation-modal',
  templateUrl: './new-relation-modal.component.html',
  styleUrls: ['./new-relation-modal.component.css']
})
export class NewRelationModalComponent implements OnInit {
  public rgtTables;
  public lftTables;
  public isToggledIcon;
  public getTableInfoSubscription;
  public selectedLeftTableID;
  public selectedLeftColumn;
  public selectedRightTableID;
  public selectedRightColumn;
  public selectedJoinType;
  public newRelationUpdateSubscription;
  public originalRgtTables;
  public originalLftTables;
  constructor(private activatedRoute:ActivatedRoute,private toastr: ToastrService,private newRelationModalService:NewRelationModalService) { }

  ngOnInit() {          
  //   this.rgtTables = [{
  //     "mapped_table_name":"abc",
  //     "mapped_column_name":[
  //       "efg",
  //       "hij",
  //       "klm"
  //     ]
  //   },{
  //     "mapped_table_name":"nop",
  //     "mapped_column_name":[
  //       "qrs",
  //       "tuv",
  //       "wxyz"
  //     ]
  //   }
  // ]
  this.getTableInfo();
  
  }

  public getTableInfo(){
    let semantic_id = this.activatedRoute.snapshot.data['semantic_id']; 
    this.getTableInfoSubscription = this.newRelationModalService.getTableInfo(semantic_id).subscribe(res => this.tableInfoCallback(res,null), err => this.tableInfoCallback(null,err));
  }

  public tableInfoCallback(res:any,err:any){
    if(err){
      this.rgtTables = [];
      this.rgtTables = [];
      this.lftTables = [];
      this.originalRgtTables = [];
      this.originalLftTables = [];
    }else if(res && (res.sl_table.length || res.sl_view.length)){
      this.rgtTables = [];
      this.lftTables = [];
      this.originalRgtTables = JSON.parse(JSON.stringify(res.sl_table)); 
      this.originalLftTables = JSON.parse(JSON.stringify(res.sl_table));
    }else{
      this.rgtTables = [];
      this.lftTables = [];
      this.originalRgtTables = [];
      this.originalLftTables = [];
    }
  }

  public isToggled(e,th){
    this.isToggledIcon = !this.isToggledIcon;
  }

  public assignOriginalCopy(side) {
    if(side == 'right')
      //this.rgtTables = JSON.parse(JSON.stringify(this.originalRgtTables));
      this.rgtTables = [];
    else
      //this.lftTables = JSON.parse(JSON.stringify(this.originalLftTables));
      this.lftTables = [];
  };

  public searchTable(key){
    this.rgtTables
    .forEach(item => {
      console.log(key,item);
    });
  }

  private newRelationUpdateCallback(res:any,err:any){
    //console.log(res,err,'in newRElationCallback');
    
    if(err){
  
    }else{
      if(res){
        if(res.status == 'Relation Created'){
        //  $('modal').modal('hide');
        this.toastr.success(res.status); 
        }else {
          this.toastr.error(res.status); 
        }
        
      }
    }
  }

  public saveNewRelation(){
    let options = {};
    options['join_type'] = this.selectedJoinType,
    options['left_table_id'] = this.selectedLeftTableID,
    options['right_table_id'] = this.selectedRightTableID,
    options['primary_key'] = this.selectedLeftColumn,
    options['foreign_key'] = this.selectedRightColumn
    console.log(options,'options');
    this.newRelationUpdateSubscription = this.newRelationModalService.saveTableRelationsInfo(options).subscribe(res => this.newRelationUpdateCallback(res,null), err => this.newRelationUpdateCallback(null,err));
  }



  public selectColumn(i,j,side){
    if(side == 'right'){
      this.selectedRightTableID = this.rgtTables[i].sl_tables_id;
      this.selectedRightColumn = this.rgtTables[i]['mapped_column_name'][j];
    }else{
      this.selectedLeftTableID = this.lftTables[i].sl_tables_id;
      this.selectedLeftColumn = this.lftTables[i]['mapped_column_name'][j];
    }
  }

  public selectedJoin(value){
    this.selectedJoinType = value;
  }

  public filterItem(value,side) {
    let returnedItem = [];
    let tables = [];
    if(side == 'right'){
      if (!value) {
        this.assignOriginalCopy('right'); //when nothing has typed
        return;
      }
      let isFound;
      let tables = [];
      JSON.parse(JSON.stringify(this.originalRgtTables)).forEach(
        function(item){
          if(item.mapped_table_name.toLowerCase().indexOf(value.toLowerCase()) > -1 ){
            tables.push(item);
          }else{
            item.mapped_column_name.forEach(function(d){
              if(d.toLowerCase().indexOf(value.toLowerCase()) > -1)
              if(tables.length == 0)
                tables.push(item);    
              else{
                tables.forEach(element => {
                if(element.sl_tables_id != item.sl_tables_id){
                //  tables.push(item);
                isFound = false;
                }else{
                  isFound = true;
                }
              });
              if(!isFound){
                tables.push(item);
              }
            }
            });
          }
        });
        this.rgtTables = tables;
      
    }else{
      let isFound;
      if (!value) {
        this.assignOriginalCopy('left'); //when nothing has typed
        return;
      }
      let tables = [];
      JSON.parse(JSON.stringify(this.originalLftTables)).forEach(
        function(item){
          if(item.mapped_table_name.toLowerCase().indexOf(value.toLowerCase()) > -1 ){
            tables.push(item);
          }else{
            item.mapped_column_name.forEach(function(d){
              if(d.toLowerCase().indexOf(value.toLowerCase()) > -1)
              if(tables.length == 0)
                tables.push(item);    
              else{
                tables.forEach(element => {
                if(element.sl_tables_id != item.sl_tables_id){
                  //tables.push(item);
                  isFound = false;
                }else{
                  isFound = true;
                }
              });
              if(!isFound){
                tables.push(item);
              }
            }
            });
          }
        });
        this.lftTables = tables;
        
    }
  }

  public isCollapse(event){
   // console.log(event);
    if(event.target.parentNode.classList.contains("collapsed")){
     // console.log('its collapsed');
    }
  }

  public isSave(){
    if(this.selectedJoinType && this.selectedLeftTableID && this.selectedRightTableID && this.selectedLeftColumn && this.selectedRightColumn){
      return false;
    }else{
      return true; 
    }
  }

  ngOnDestroy(){
    this.getTableInfoSubscription.unsubscribe();
    if(this.newRelationUpdateSubscription)
      this.newRelationUpdateSubscription.unsubscribe(); 
  }


}
