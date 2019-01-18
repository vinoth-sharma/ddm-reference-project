import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-joins-help-option',
  template: `<div id="joins-help-option-wrapper">
              <img class="mx-auto d-block img-fluid" src="../../assets/joins-img1.png" alt="Joins help option">
            </div>`,
  styles: [`#joins-help-option-wrapper {
                    margin-top: 5em;
          }`]
})

export class JoinsHelpOptionComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
