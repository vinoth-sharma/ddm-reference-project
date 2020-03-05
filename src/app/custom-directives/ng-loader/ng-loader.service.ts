import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgLoaderService {

  constructor() { }
  // !!!!  do not delete  list of different spinners uncomment to use them
  // public spinner ="<div class='lds-ripple'><div></div><div></div></div>";
  // public spinner ="<div class='loader'></div>"
  public spinner = "<div class='lds-dual-ring'></div>"

  show(){
    let div = document.createElement('div');
    div.setAttribute('id','ng-loader');
    div.innerHTML = this.spinner;
    if(document.querySelectorAll('#ng-loader').length == 1) return
    document.querySelector('body').appendChild(div)
  }

  hide(){
    document.querySelectorAll('#ng-loader').forEach(element =>{element.remove()})
  }
}
