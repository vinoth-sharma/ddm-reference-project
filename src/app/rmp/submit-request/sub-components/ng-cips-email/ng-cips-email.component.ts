import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit, Output, EventEmitter, Input, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { DjangoService } from "../../../django.service";
import { SubmitRequestService } from '../../submit-request.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

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

  @ViewChild('mailInput') mailInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public djangoService: DjangoService,
    private renderer: Renderer2,
    public ngToaster: NgToasterComponent,
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

    // Add our chip
    if ((value || '').trim()) {
      let l_value = getMailIds(value.trim())
      if (l_value) {
        this.selectedChips.push(value.trim());
        this.selectedChips = [...new Set([...this.selectedChips, value.trim()])]
        this.emailSelectionEmitter.emit(this.selectedChips)
      }
      else
        this.ngToaster.error("Enter the valid email id")
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

  public onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    let mailIds = getMailIds(pastedText);
    if (mailIds) {
      this.selectedChips = [...new Set([...this.selectedChips, ...mailIds])];
      this.emailSelectionEmitter.emit(this.selectedChips);
      event.preventDefault();
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedChips.push(event.option.viewValue);
    this.mailInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
    this.emailSelectionEmitter.emit(this.selectedChips);
  }

}

//validate email
function getMailIds(text) {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}