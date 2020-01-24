import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-joins-help-option',
  templateUrl: './joins-help-option.component.html',
  styleUrls: ['./joins-help-option.component.css']
})

export class JoinsHelpOptionComponent implements OnInit {

  @Input() createRelate: boolean;
  @Input() selectTables: boolean;
  @Output() resetJoinSelectTable = new EventEmitter<any>();
  @Output() resetCreateRelate = new EventEmitter<any>();


  constructor() { }

  ngOnInit() { }

  resetJoin() {
    if(this.createRelate)  this.resetCreateRelate.emit(false);
    if(this.selectTables) this.resetJoinSelectTable.emit(false);
  }

}
