import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.css']
})
export class EditDescriptionComponent implements OnInit {
  
  @Input() slDescription : any;
  @Output() sendDescription = new EventEmitter();
  
  constructor() { }

  
  ngOnInit() {}


  public check(){
    let newDescription = this.slDescription;
    this.sendDescription.emit(newDescription);

  }

}
