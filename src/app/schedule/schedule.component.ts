import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  public isCollapsed = true;
  public isSharedHidden : boolean;
  public isFtpHidden : boolean;
  public isEmailHidden : boolean;
  public deliveryMethod: any;

  constructor() { }


  ngOnInit() {
    this.isEmailHidden = true;
    this.isSharedHidden = true;
    this.isFtpHidden = true;
  }

  public changeDeliveryMethod(deliveryMethod : string){
    this.isEmailHidden = true;
    this.isSharedHidden = true;
    this.isFtpHidden = true;
    if(deliveryMethod == "email"){
      this.isEmailHidden = false;
    }
    else if(deliveryMethod == "shared"){
      this.isSharedHidden = false;
    }
    else{
      this.isFtpHidden = false;
    }
  }

}