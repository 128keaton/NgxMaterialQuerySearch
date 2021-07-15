import {forwardRef, Input} from '@angular/core';
import {Component} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'group-type-selector',
  templateUrl: './group-type-selector.component.html',
  styleUrls: ['./group-type-selector.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GroupTypeSelectorComponent),
    multi: true
  }]
})
export class GroupTypeSelectorComponent implements ControlValueAccessor {

  @Input()
  groupColor = 'primary';

  @Input()
  set disabled(newValue: any) {
    if (!!newValue) {
      this.disableButtons = `${newValue}` === 'true';
    } else {
      this.disableButtons = false;
    }
  }

  disableButtons = false;

  /**
   * Holds the current value of the slider
   */
  value = 'AND';

  constructor() {}

  /**
   * Invoked when the model has been changed
   */
  onChange: (_: any) => void = (_: any) => {};

  /**
   * Invoked when the model has been touched
   */
  onTouched: () => void = () => {};

  /**
   * Method that is invoked on an update of a model.
   */
  updateChanges() {
    this.onChange(this.value);
  }

  ///////////////
  // OVERRIDES //
  ///////////////

  /**
   * Writes a new item to the element.
   *
   * @param value the value
   */
  writeValue(value: string): void {
    this.value = value;
    this.updateChanges();
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   *
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   *
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setType(type: string) {
    if (type === 'AND') {
      this.writeValue('AND');
    } else {
      this.writeValue('OR');
    }
  }

  getColor(type: string) {
    if (type === this.value) {
      if (this.groupColor === 'primary') {
        return 'accent';
      } else if (this.groupColor === 'accent' || this.groupColor === 'warn') {
        return 'primary';
      }
    }

    return '';
  }
}
