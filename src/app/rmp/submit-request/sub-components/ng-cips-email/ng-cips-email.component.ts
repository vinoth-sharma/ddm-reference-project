import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith, debounceTime, distinctUntilChanged, mergeMap} from 'rxjs/operators';
import { DjangoService } from "../../../django.service";
import { SubmitRequestService } from '../../submit-request.service';

@Component({
  selector: 'app-ng-cips-email',
  templateUrl: './ng-cips-email.component.html',
  styleUrls: ['./ng-cips-email.component.css']
})
export class NgCipsEmailComponent implements OnInit {

  @Input() selectedemails = [];
  @Output() emailSelectionEmitter = new EventEmitter()

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
  constructor(public djangoService: DjangoService,
    public subReqService : SubmitRequestService){
    this.filteredChips = this.chipCtrl.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap((ele:any)=>{
          return this.djangoService.getDistributionList(ele)
        }))
        // map((fruit: string | null) => fruit ? this._filter(fruit) : this.allChips.slice()));
  }

  ngOnInit(){
    this.subReqService.emitReqOnBehalfEmail.subscribe((email:string)=>{
      this.selectedChips.push(email)
    })
  }

  ngOnChanges(){
  console.log(this.selectedemails);
    // this.selectedChips.push(...this.selectedemails)
  }
  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedChips.push(value.trim());
      this.emailSelectionEmitter.emit(this.selectedChips)
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
    this.emailSelectionEmitter.emit(this.selectedChips)
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedChips.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
    this.emailSelectionEmitter.emit(this.selectedChips)
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allChips.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  // }
}