import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dependents-modal',
  templateUrl: './dependents-modal.component.html',
  styleUrls: ['./dependents-modal.component.css']
})
export class DependentsModalComponent implements OnInit {

  @Input() reports: any;

  constructor() { }

  ngOnInit() { }

  public cancel() {
    this.reports = [];
  }

}