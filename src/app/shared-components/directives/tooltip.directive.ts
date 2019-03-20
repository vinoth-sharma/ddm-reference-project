import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appTooltip]"
})
export class TooltipDirective {
  constructor(private el: ElementRef) {}

  @HostListener("click") onClick() {
    this.showDiv();
  }

  @HostListener("document:click", ["$event.target"])
  private onClickOutside(event) {
    if (this.el.nativeElement.contains(event)) {
      // if (
      //   $(this.el.nativeElement).find(".tooltipDiv")[0].style.display ==
      //   "inline"
      // ) {
      //   this.hideDiv();
      // }
    } else {
      this.hideDiv();
    }
  }

  private showDiv() {
    let pos = $(this.el.nativeElement).position();
    $(this.el.nativeElement)
      .find(".tooltipDiv")
      .css("top", pos.top + 25 + "px")
      .css("left", pos.left + "px")
      .fadeIn();
  }

  private hideDiv() {
    $(this.el.nativeElement)
      .find(".tooltipDiv")
      .fadeOut();
  }
}
