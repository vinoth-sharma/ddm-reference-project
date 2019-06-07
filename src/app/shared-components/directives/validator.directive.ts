import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appValidator]'
})
export class ValidatorDirective {

  // splCharRegex = /[~`!#$%\^&*+=\-\[\]\/';,/{}|\\":<>\?@]/;
  splCharRegex = new RegExp(/^[~`)(@!#$%\^&*+=\-\[\]\/';,/{}|\\":<>\?]/);

  constructor(private el: ElementRef) { }

  @HostListener('input') onInput(){
      this.validate();
  }

  private validate(){
    if (this.splCharRegex.test(this.el.nativeElement.value)) {
      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z0-9]/g, '').replace(/\s/g,'');
    }
  }
}