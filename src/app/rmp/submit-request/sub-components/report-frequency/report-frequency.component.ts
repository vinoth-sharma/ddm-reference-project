import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from "@angular/material/chips";

export interface Dl {
  mail: string;
}
@Component({
  selector: 'app-report-frequency',
  templateUrl: './report-frequency.component.html',
  styleUrls: ['./report-frequency.component.css']
})
export class ReportFrequencyComponent implements OnInit {

 
  constructor() { }
  recReport: string[] = ['Yes', 'No'];
  dayFreq = new FormControl();
  dayFreqs: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  biMonFreq = new FormControl();
  biMonFreqs: string[] = ['Day after Sales Reporting month end close', '15th of the month', 'Day after calendar month end', 'Other'];

  quarFreq = new FormControl();
  quarFreqs: string[] = ['Day after Sales Reporting month end close','Day after calendar month end'];

  dealAllocFreq = new FormControl();
  dealAllocFreqs: string[] = ['Mid-Month Variance', 'Month End Variance', 'Specific Consensus Period', 'Other'];

  onDemFreq = new FormControl();
  onDemFreqs: string[] = ['On Demand', 'On Demand Configurable'];

  ngOnInit(): void {
    
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  dls: Dl[] = [
    {mail: 'upendra.br@gm.com'},
    {mail: 'hilary.varghese@gm.com'},
    {mail: 'aneesha.biju@gm.com'},
    {mail: 'deepak.urs@gm.com'},
    {mail: 'vinoth.vvs@gm.com'},
    {mail: 'baby.kumar@gm.com'},
    {mail: 'madan.s@gm.com'},
    {mail: 'mridula.bhutda@gm.com'},
    {mail: 'vijaya.dodla@gm.com'},
    {mail: 'chitneni.sairam@gm.com'},
  ];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our dl
    if ((value || '').trim()) {
      this.dls.push({mail: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(dl: Dl): void {
    const index = this.dls.indexOf(dl);

    if (index >= 0) {
      this.dls.splice(index, 1);
    }
  }

}
