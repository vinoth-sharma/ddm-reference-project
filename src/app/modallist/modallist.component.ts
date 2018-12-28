import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modallist',
  templateUrl: './modallist.component.html',
  styleUrls: ['./modallist.component.css']
})

export class ModallistComponent implements OnInit {
  public items;
  @Input() values:any[];
  @Input() isLoading: boolean;

  constructor() { 
    console.log(this.values,'values');
    
  }
 

  ngOnInit() {
   
   }

   ngOnChanges() {
 
    this.items =this.values['data']; 
    
  }

}