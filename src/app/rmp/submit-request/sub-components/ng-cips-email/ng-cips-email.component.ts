import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
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

  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public chipCtrl = new FormControl();
  public filteredChips: Observable<any>;
  public selectedChips: string[] = [];
  public allChips: string[] = [];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public djangoService: DjangoService,
    public subReqService: SubmitRequestService) {
    this.filteredChips = this.chipCtrl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      mergeMap((ele: any) => {
        return this.djangoService.getDistributionList(ele)
      }))
  }

  ngOnInit() {
    this.subReqService.emitReqOnBehalfEmail.subscribe((email: string) => {
      this.selectedChips.push(email);
      this.emailSelectionEmitter.emit(this.selectedChips)
    })
  }

  ngOnChanges() {
    if (this.selectedemails.length) {
      this.selectedChips = this.selectedemails;
    }
  }

  public add(event: MatChipInputEvent): void {
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

  public remove(chip: string): void {
    const index = this.selectedChips.indexOf(chip);

    if (index >= 0) {
      this.selectedChips.splice(index, 1);
    }
    this.emailSelectionEmitter.emit(this.selectedChips)
  }


  public selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedChips.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
    this.emailSelectionEmitter.emit(this.selectedChips)
  }

}