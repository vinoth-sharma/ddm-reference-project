import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modallist',
  templateUrl: './modallist.component.html',
  styleUrls: ['./modallist.component.css']
})

export class ModallistComponent implements OnInit {
  public items = [];
  public data;
  @Input() values: any[];
  @Input() Loading: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
  if (typeof this.values != "undefined")
  this.items = this.values['data'];
  }

}