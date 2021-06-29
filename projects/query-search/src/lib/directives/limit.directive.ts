import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: 'input[limit]'
})
export class LimitDirective {

  @HostListener('keypress', ['$event']) onKeyPressHandler(event: KeyboardEvent) {
    const inputElement = this.elementRef.nativeElement;

    if (!!this.limit && inputElement.value.toString().length >= this.limit) {
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

  private _limit: number | undefined;

  constructor(private elementRef: ElementRef) {
  }

}
