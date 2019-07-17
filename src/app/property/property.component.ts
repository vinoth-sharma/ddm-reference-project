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
  public data_type: string;
  @Input() selectedCustomId: number;
  @Input() views = [];
  @Input() type: string;
  @Input() selectedColumn: string;
  columnDetails = [];
  public datatype: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log(this.selectedCustomId, "id");
    if (this.type == 'view') {
      this.getDatatype(this.selectedColumn);
    } else {
      if (typeof this.properties != "undefined")
        this.items = this.properties['data'];
    }
  }

  getDatatype(col) {
    let views = this.views;
    // console.log("view", views);
    let columnDetails = views.find(x => x.custom_table_id == this.selectedCustomId).column_properties;
    // console.log(columnDetails, "columnDetails");
    let datatype = columnDetails.find(x => x.column.trim().toLowerCase() == col.trim().toLowerCase()).data_type;
    // console.log(datatype, "datatype");
    this.datatype = datatype;
  }
}

