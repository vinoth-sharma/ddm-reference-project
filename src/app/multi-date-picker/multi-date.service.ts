import { Injectable, SimpleChanges } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MultiDateService {
  public sendingDates: string[];
  public dateMode:boolean = false;
  constructor() {
   }
   ngOnChanges(changes:SimpleChanges){
   }
}