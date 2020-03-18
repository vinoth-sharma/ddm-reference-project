import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MultipleDatesSelectionService {

  public datesChosen : any = [];
  constructor() { }
}
