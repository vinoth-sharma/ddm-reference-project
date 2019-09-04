import { Component, OnInit, Input } from '@angular/core';

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

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (typeof this.values != "undefined") {
      this.dataType = this.values['data_type'];
      this.count = this.values['data']['count'];
      this.items = this.values['data']['list'];
      this.columnName = Object.keys(this.items[0]);
    }
  }
}