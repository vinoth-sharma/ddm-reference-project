import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-cont',
  templateUrl: './table-cont.component.html',
  styleUrls: ['./table-cont.component.scss']
})
export class TableContComponent implements OnInit {
  @Input() tableData: any[];
  @Input() columns: string[];
  @Input() tableRowIdentifier: string | number;
  @Output() clicked = new EventEmitter();

  column:string = '';
  orderType:string = '';
  currentColumn:string = '';
  searchItem:string = '';
  cachedTables = [];
  searchData = [];

  constructor() { }

  ngOnInit() {
    this.column = this.columns[0];
    this.searchData.length = this.columns.length;
    this.cachedTables = this.tableData.slice();
  }

  handleClick(tableRowIdentifier) {
    this.clicked.emit(tableRowIdentifier);
  }

   /**
   * sort
   */
  public sort(col) {
    this.column = col.replace(/\s/g, "_");
    if(this.currentColumn === col){
      this.orderType = !this.orderType?'desc':'';
    }else{
      this.orderType = '';
    }
    this.currentColumn = col;
  }

  public search(col){
    this.tableData = this.cachedTables;
    let value = this.searchItem;
    this.tableData = this.tableData.filter(element =>{
        return  (element[col] + '').toLowerCase().includes((value + '').toLowerCase()) 
    })
  }

  public isSearchable(i){
    if(this.searchData[i]){
      if(this.searchData[i]['isSearchable']){
        this.searchData[i]['isSearchable'] = false;
      }else{
        this.searchData.forEach((element,key) => {
          element['isSearchable'] = key === i?true:false;
        });
        this.searchItem = '';
      }
      this.tableData = this.cachedTables;
    }else{
      this.searchData.forEach((element,key) => {
        element['isSearchable'] = false;
      });
      this.searchData.splice(i,0,{'isSearchable': true});
      this.searchItem = '';
      this.tableData = this.cachedTables;
    }
  }

}
