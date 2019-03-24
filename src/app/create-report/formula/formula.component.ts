import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";

import { SharedDataService } from "../shared-data.service";

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit {

  public displayString : string;
  @Input() aggregationsFormula : string;
  @Output() onView = new EventEmitter();

  public formula: string;

  constructor(private router: Router, private sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.sharedDataService.currentFormula.subscribe(formula =>
      this.formula = formula
    )
  }

  public goToView() {
    this.onView.emit();
    this.router.navigate(['semantic/sem-reports/create-report/view']);
  }

  /**
   * saveReport
   */
  public saveReport(data: any) {

  }

}
