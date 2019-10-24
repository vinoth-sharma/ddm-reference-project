import { Component, OnInit, Input, Inject, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListOfValuesService } from './list-of-values.service';
import { LovContainerComponent } from './lov-container/lov-container.component';

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
  dataType: string = '';
  @Input() values: any[];
  @Input() Loading: boolean;
  load: boolean = false;
  @Input() tableSelectedId: number;
  createdLov = [];

  constructor(private dialog: MatDialog,
    private listOfValuesService: ListOfValuesService) { }

  ngOnInit() {
  }

  openLovDialog() {
    const dialogRef = this.dialog.open(LovContainerComponent, {
      width: '800px',
      height: 'auto',
      maxHeight: '450px',
      data: { values: this.items, tableSelectedId: this.tableSelectedId, columnName: this.columnName, count: this.count }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result, 'result');
      }
    })
  }

  public getLovList() {
    this.load = true;
    let options = {};
    options["tableId"] = this.tableSelectedId;
    options['columnName'] = this.columnName;
    this.listOfValuesService.getLov(options).subscribe(res => {
      this.createdLov = res['data'];
      this.load = false;
    })
  }

  ngOnChanges(changes: SimpleChanges) {

    if (typeof this.values != "undefined") {
      this.dataType = this.values['data_type'];
      this.count = this.values['data']['count'];
      this.items = this.values['data']['list'];
      this.columnName = Object.keys(this.items[0])[0];
    }

    if (this.tableSelectedId && this.columnName) {
      this.getLovList();
    }

  }
}