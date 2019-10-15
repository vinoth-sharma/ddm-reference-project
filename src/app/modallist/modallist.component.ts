import { Component, OnInit, Input, Inject  } from '@angular/core';
import { MatDialog } from '@angular/material';
// import { ShowLovComponent } from './show-lov/show-lov.component';
import { ListOfValuesService } from './list-of-values.service';
import { ShowLovComponent } from './show-lov/show-lov.component';

@Component({
  selector: 'app-modallist',
  templateUrl: './modallist.component.html',
  styleUrls: ['./modallist.component.css']
})

export class ModallistComponent implements OnInit {
  public items = [];
  public columnName;
  public data;
  public count;
  dataType:string = '';
  @Input() values: any[];
  @Input() Loading: boolean;
  load: boolean = false;
  @Input() tableSelectedId: number;
  createdLov = [];

  constructor(private dialog: MatDialog,
    private listOfValuesService : ListOfValuesService) {}

  ngOnInit() {
  }
  
  openLovDialog() {
    const dialogRef = this.dialog.open(ShowLovComponent, {
      width: '800px',
      height: 'auto',
      maxHeight: '450px',
      // data: this.createdLov
      data: {'values': this.items, 'tableSelectedId': this.tableSelectedId, 'columnName': this.columnName, 'count': this.count}
    })
}

public getLovList() {
  this.load = true;
  let options = {};
  options["tableId"] = this.tableSelectedId;
  options['columnName'] = this.columnName;
  this.listOfValuesService.getLov(options).subscribe(res => {
    this.createdLov = res['data'];     
    console.log(this.createdLov,"createdLov");         
    this.load = false;
  })
}

  ngOnChanges() {
    if(this.tableSelectedId && this.columnName) {
      this.getLovList();
    }   
    if (typeof this.values != "undefined") {
      this.dataType = this.values['data_type'];
      this.count = this.values['data']['count'];
      this.items = this.values['data']['list'];
        this.columnName = Object.keys(this.items[0])[0];
    }
  }   
}