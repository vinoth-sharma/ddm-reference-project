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
  @Input() values: any[];
  @Input() Loading: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (typeof this.values != "undefined") {
      this.count = this.values['data']['count'];
      console.log("count", this.count );
      this.items = this.values['data']['list'];
      console.log("length of items", this.items.length );
      this.columnName = Object.keys(this.items[0]);
    }
  }
}