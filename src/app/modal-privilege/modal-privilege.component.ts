import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-privilege',
  templateUrl: './modal-privilege.component.html',
  styleUrls: ['./modal-privilege.component.css']
})
export class ModalPrivilegeComponent {

  constructor() { }

  customUser(){
    document.getElementById("UserPrev").style.backgroundColor = "black";
    document.getElementById("PrevUser").style.backgroundColor = "darkslategrey";
    
  }
  customPrev(){
    document.getElementById("UserPrev").style.backgroundColor="darkslategrey";
    document.getElementById("PrevUser").style.backgroundColor="black";
    
  }

}
