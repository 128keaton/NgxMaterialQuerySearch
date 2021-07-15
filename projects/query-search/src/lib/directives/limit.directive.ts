import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: 'input[limit]'
})
export class LimitDirective {

  private _limit: number | undefined;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('keypress', ['$event']) onKeyPressHandler(event: KeyboardEvent) {
    const inputElement = this.elementRef.nativeElement;
    const selection = window.getSelection();

    if (!!this.limit && inputElement.value.toString().length >= this.limit) {
      if (
        !!selection &&
        !!inputElement.parentNode &&
        selection.anchorNode === inputElement.parentNode &&
        selection.toString() === inputElement.value.toString()
      ) {
        return;
      }
      event.preventDefault();
    }
  }

  @Input()
  set limit(newValue: number | undefined) {
    this._limit = newValue;
  }

  get limit() {
    return this._limit;
  }
}
