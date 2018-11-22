import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-semantic-sl',
  templateUrl: './semantic-sl.component.html',
  styleUrls: ['./semantic-sl.component.css']
})
export class SemanticSLComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  newSM() {
    document.getElementById('new').style.backgroundColor = "rgb(87, 178, 252)";
    document.getElementById('existing').style.backgroundColor = "rgb(33, 150, 243)";
  }
  existingSM() {
    document.getElementById('existing').style.backgroundColor = "rgb(87, 178, 252)";
    document.getElementById('new').style.backgroundColor = "rgb(33, 150, 243)";

}
}
