import {
  Directive,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[scrollToBottom]',
})
export class ScrollToBottomDirective  {

  constructor(private el: ElementRef) {
  }

  public scrollDown(): void {
    this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
  }

}
