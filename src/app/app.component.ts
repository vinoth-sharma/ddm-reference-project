import { Component,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DDM';

associates;
firstName;
userData;
lastName;
roleId;
roleName;

constructor(){
  
  this.associates = [{
    role:'Admin',
    firstname: 'Jacquelin',
    lastname:'Beiter'
  },
  {role:'Non-Admin',firstname: 'Aubrey',lastname:'Dubberke'},
  {role:'Report Viewer',firstname: 'Charlie',lastname:'Chevoor'}
];
}
recieveUserdetails($event){
  this.roleId = $event
  console.log(this.roleId)
  }

}
