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
    this.el.nativeElement.style.background = '#aed8dd';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.background = '';
  }

}