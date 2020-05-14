import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith, debounceTime, distinctUntilChanged, mergeMap} from 'rxjs/operators';
import { DjangoService } from "../../../django.service";

@Component({
  selector: 'app-ng-cips-email',
  templateUrl: './ng-cips-email.component.html',
  styleUrls: ['./ng-cips-email.component.css']
})
export class NgCipsEmailComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chipCtrl = new FormControl();
  filteredChips: Observable<any>;
  selectedChips: string[] = [];
  allChips: string[] = [];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  // this.django.getDistributionList();

  constructor(public djangoService: DjangoService){
    this.filteredChips = this.chipCtrl.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap((ele:any)=>{
          return this.djangoService.getDistributionList(ele)
        }))
        // map((fruit: string | null) => fruit ? this._filter(fruit) : this.allChips.slice()));
  }

  ngOnInit(){
  }
  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedChips.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.chipCtrl.setValue(null);
  }

  remove(chip: string): void {
    const index = this.selectedChips.indexOf(chip);

    if (index >= 0) {
      this.selectedChips.splice(index, 1);
    }
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedChips.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allChips.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  // }
}