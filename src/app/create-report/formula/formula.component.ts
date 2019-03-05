import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit {

  @Output() onView = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() { }

  view() {
    this.onView.emit();
    this.router.navigate(['semantic/sem-reports/create-report/view']);
  }

  /**
   * saveReport
   */
  public saveReport(data: any) { }
}
