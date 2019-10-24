import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[inputNameValidator]'
})
export class InputValidatorDirective {

  @HostListener('keypress', ['$event']) onkeypress(event: KeyboardEvent){
    // Check for small alphabets and undedrscore
    if(event.keyCode>96 || event.keyCode === 95){
      if(event.keyCode<123) {
        return true
      }
    }

    // Checck for Capital alphabets
    if(event.keyCode>64){
      if(event.keyCode<91) {
        return true
      }
    }

    // Check for numbers
    if(event.keyCode>47){
      if(event.keyCode<58) {
        return true
      }
    }
    return false
  }

}
