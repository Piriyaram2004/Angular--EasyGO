import {
  Directive,
  ElementRef,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class Highlight {

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.background = '#fff3cd';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.background = '';
  }

}