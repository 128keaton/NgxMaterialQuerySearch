import {Pipe, PipeTransform} from '@angular/core';
import {CondOperator} from "@nestjsx/crud-request";

@Pipe({
  name: 'operatorName'
})
export class OperatorPipe implements PipeTransform {

  private readonly operators: string[] = [];

  constructor() {
    this.operators = Object.keys(CondOperator).filter(k => !k.includes('LOW'));
  }

  /**
   * Returns a friendly name for an operator
   * @param value
   * @param signValue
   */
  transform(value: string, signValue: boolean = false): string | null {
    if (this.operators.includes(value)) {
      if (signValue) {
        return OperatorPipe.determineSignValue(value);
      }

      return value.split('_')
        .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(' ')
        .replace('Lower Than', 'Less Than')
        .replace('Null', 'NULL');
    }

    return value;
  }

  private static determineSignValue(value: string): string | null {
    switch (value) {
      case 'EQUALS':
        return '=';
      case 'NOT_EQUALS':
        return '!=';
      case 'GREATER_THAN':
        return '>';
      case 'LOWER_THAN':
        return '<';
      case 'GREATER_THAN_EQUALS':
        return '>=';
      case 'LOWER_THAN_EQUALS':
        return '<=';
      default:
        return null;
    }
  }
}
