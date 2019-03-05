import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ViewComponent implements OnInit {

  join = {
    table1: {
      'name': 'Table 1',
      'selected columns': ['col 1', 'col 11', 'col 12'],
      'columns': ['col 1', 'col 11', 'col 12', 'col 13']
    },
    table2: {
      'name': 'Table 2',
      'selected columns': ['col 21', 'col 1'],
      'columns': ['col 1', 'col 21', 'col 22', 'col 23']
    },
    type: 'left'
  }

  constructor() { }

  ngOnInit() { }

}
