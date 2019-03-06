import { Directive, ElementRef, HostListener, SimpleChanges, Input } from '@angular/core';

@Directive({
  selector: '[appValidator]'
})
export class ValidatorDirective {

  @Input() validatorType:string;

  splCharRegex = /[~`!#$%\^&*+=\-\[\]\/';,/{}|\\":<>\?@]/;

  constructor(private el: ElementRef) { }

  @HostListener('input')
  onInput(){
    if(this.validatorType == 'splChar'){
      if(new RegExp(this.splCharRegex).test((this.el.nativeElement.value)))
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z0-9]/g, '').replace(/\s/g,'');
    }
  }

}
