import { Injectable, SimpleChanges } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MultiDateService {
  public sendingDates: string[];
  public dateMode:boolean = false;
  // console.log("dateMode value in MultiDateService");
  constructor() {
   }
   ngOnChanges(changes:SimpleChanges){
    console.log("dateMode value",this.dateMode)
   }
}
