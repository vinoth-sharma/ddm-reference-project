import { Directive, Output, Input, EventEmitter, HostBinding, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[cssBtn]'
})
export class ButtonCssDirective {
    private el: ElementRef;
    @Input() cssBtn: any;
    // @Input() paramFlag;
    @Input() disabled;

    constructor(el: ElementRef) {
        this.el = el
    }

    ngOnChanges() {
        if (!this.disabled) {
            this.el.nativeElement.style.backgroundColor = this.getBackgroundColor()
            this.el.nativeElement.style.color = 'white'
        }
        else {
            this.el.nativeElement.style.backgroundColor = 'rgba(0,0,0,.12)'
            this.el.nativeElement.style.color = 'rgba(0,0,0,.12)'
        }
    }

    getBackgroundColor() {
        let l_bg_color = '';
        if (this.cssBtn === 'cancel')
            l_bg_color = '#d2322d'
        else if (this.cssBtn === 'ok')
            l_bg_color = '#5cb85c'
        else if (this.cssBtn === 'mid')
            l_bg_color = '#0892d0'
        return l_bg_color
    }

}