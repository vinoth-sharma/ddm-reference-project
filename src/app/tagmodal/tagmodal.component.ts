import { Component, OnInit } from '@angular/core';
import {Contact} from '../contact';
import {NgbTypeaheadConfig} from '@ng-bootstrap/ng-bootstrap';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tagmodal',
  templateUrl: './tagmodal.component.html',
  styleUrls: ['./tagmodal.component.css']
})
export class TagmodalComponent {
    contacts: any;
    constructor(){
        this.contacts = [];
        
    }
  
    addContact(name){
        let contact = new Contact(name);
        this.contacts.push(contact.name);
    }
  
    removeContact(contact){
        let index = this.contacts.indexOf(contact);
        this.contacts.splice(index,1);
    }
  
    removeAll(contact){
      this.contacts = [];
  }
  
  
  public model: any;
  formatter = (result: any) => result.toUpperCase();
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.contacts.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

}
