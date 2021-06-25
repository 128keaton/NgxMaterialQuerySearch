import {ProvidedValue, QueryField} from "../models";

export function isEven(n: number): boolean {
  return n % 2 == 0;
}

export function getEnumKeyByEnumValue(myEnum: any, enumValue: string) {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : null;
}

export function transformValue(value: any, type: string) {
  let returnValue;

  switch (type) {
    case 'boolean':
      returnValue = transformToBoolean(value);
      break;
    case 'number':
      returnValue = transformToNumber(value);
      break;
    case 'date':
      returnValue = transformToDate(value);
      break;
    default:
      if (`${value}`.includes(',')) {
        returnValue = `${value}`.split(',')
      } else {
        returnValue = `${value}`;
      }

      break;
  }

  return returnValue;
}

export function isDefined(value: any): boolean {
  return value !== undefined;
}

export function transformToNumber(value: any) {
  if (`${value}`.includes(',')) {
    return `${value}`.split(',').map(v => {
      if (v !== null) {
        return Number(v.trim())
      }

      return v;
    }).filter(v => v !== undefined);
  } else {
    return Number(value);
  }
}

export function transformToBoolean(value: any) {
  if (`${value}`.includes(',')) {
    return `${value}`.split(',').map(v => {
      if (v !== null) {
        return (`${v}`.trim() === 'true')
      }

      return v;
    }).filter(v => v !== undefined);
  } else {
    return (`${value}` === 'true');
  }
}

export function transformToDate(value: any): string | string[] | undefined {
  if (value instanceof Array) {
    return value.map(v => transformToDate(v)) as string[];
  } else {
    try {
      return new Date(value).toISOString();
    } catch (e) {
      return undefined;
    }
  }
}

/**
 * Toggle selection of values
 * @param value
 * @param values
 * @param operator
 */
export function toggleValueSelection(value: any | ProvidedValue, values: any[] | ProvidedValue[], operator: any): any[] | ProvidedValue[] {
  const doubleValueOperators = [
    'BETWEEN'
  ];

  const multiValueOperators = [
    'IN',
    'NOT_IN'
  ];

  const onlyDoTwo = doubleValueOperators.includes(operator);
  const allowMultiple = multiValueOperators.includes(operator);

  // Check if the value is a ProvidedValue
  if (value.hasOwnProperty('displayValue') && value.hasOwnProperty('value')) {
    // Check if we're not allowed to have more than one value
    if (!allowMultiple) {
      // Check if we're not allowed to have more than two, and check if we already have a value in the array
      if (onlyDoTwo && values.length == 2) {
        // Check if the value is already in the array, and if so, remove it. Otherwise, remove the oldest value and append our value
        return (values.includes(value.value) ? values.filter(v => v !== value.value) : [...values.slice(1), value.value])
      } else if (!onlyDoTwo) {
        // Check if the value is already in the array, and if so, remove it. Otherwise, return an array with a single value
        return (values.includes(value.value) ? values.filter(v => v !== value.value) : [value.value])
      }
    }

    // Check if the value is already in the array, and if so, remove it. Otherwise, return an array with our appended value
    return (values.includes(value.value) ? values.filter(v => v !== value.value) : [...values, value.value])
  }

  if (!allowMultiple) {
    if (onlyDoTwo && values.length == 2) {
      return (values.includes(value) ? values.filter(v => v !== value) : [...values.slice(1), value])
    } else if (!onlyDoTwo) {
      return (values.includes(value) ? values.filter(v => v !== value) : [value])
    }
  }
  return (values.includes(value) ? values.filter(v => v !== value) : [...values, value])
}

export function filterFieldNames(partialValue: string | null, fields: QueryField[]): QueryField[] {
  if (!!partialValue && partialValue.trim().length > 0) {
    const lowerValue = partialValue.toLowerCase();

    return fields.filter(f => {
      if (!!f.label) {
        return f.label.toLowerCase().includes(lowerValue)
      }

      return f.name.toLowerCase().includes(lowerValue)
    })
  }

  return fields;
}

export function getFieldType(field: QueryField): string {
  if (!!field && field.type) {
    return titleCase(field.type);
  }

  return 'String';
}

export function titleCase(phrase: string): string {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
