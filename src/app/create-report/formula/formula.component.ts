import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit {

  @Output() onView = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  view() {
    this.onView.emit();
  }
}
