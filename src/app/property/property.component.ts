import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  @Input() properties: any[];
  @Input() loader: boolean;
  public items = [];
  public data;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (typeof this.properties != "undefined")
      this.items = this.properties['data'];
  }
}

