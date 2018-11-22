import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rmp-landing-page',
  templateUrl: './rmp-landing-page.component.html',
  styleUrls: ['./rmp-landing-page.component.css']
})
export class RmpLandingPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  editing(){
    document.getElementById("edit").setAttribute('contenteditable', "true");
    document.getElementById("saving").style.display = "block";
    }
    
    saving_content(){
    document.getElementById("edit").setAttribute('contenteditable',"false");
    document.getElementById("saving").style.display = "none";
    } 
}
