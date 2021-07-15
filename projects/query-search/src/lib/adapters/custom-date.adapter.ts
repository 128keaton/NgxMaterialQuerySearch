import {Injectable} from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';
import {DateTime} from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class CustomDateAdapter extends NativeDateAdapter {

  private customDateFormat: string;

  setFormat(format: string) {
    this.customDateFormat = format;
  }

  format(date: Date, displayFormat: any): string {
    if (this.customDateFormat) {
      return DateTime.fromJSDate(date).toFormat(this.customDateFormat);
    }

    return super.format(date, displayFormat);
  }
}
