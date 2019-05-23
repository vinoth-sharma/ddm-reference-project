import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appValidator]'
})
export class ValidatorDirective {

  // splCharRegex = /[~`!#$%\^&*+=\-\[\]\/';,/{}|\\":<>\?@]/;
  splCharRegex = /^[a-z0-9](?!.*?[^\na-z0-9]{2}).*?[a-z0-9]$/gmi;

  constructor(private el: ElementRef) { }

  @HostListener('input') onInput(){
      this.validate();
  }

  private validate(){
    if(new RegExp(this.splCharRegex).test(this.el.nativeElement.value))
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z0-9]/g, '').replace(/\s/g,'');
  }
}