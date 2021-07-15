import {ProvidedValue} from '../models';

export const valueContains = (value: any, searchValue: string) => {
  if (value.hasOwnProperty('displayValue')) {
    if (value.hasOwnProperty('description') && value.description) {
      return value.value.toLowerCase().includes(searchValue) ||
        value.displayValue.toLowerCase().includes(searchValue) ||
        value.description.toLowerCase().includes(searchValue);
    }

    return value.value.toLowerCase().includes(searchValue) ||
      value.displayValue.toLowerCase().includes(searchValue);
  }

  return `${value}`.toLowerCase().includes(searchValue);
};

export const handleRawValues = (rawValues: any[], searchValue: string | null) => {
  const values = Object.assign([], rawValues);
  const lowerValue = (searchValue || '').trim().toLowerCase();

  if (lowerValue.length > 0) {
    return values.map(value => valueContains(value, lowerValue));
  }

  return values;
};

export const handleReturnValues = (values: any[], maxResults: number | undefined) => {
  const returnedValues: any[] = [];

  values.forEach((value, index) => {
    if (index + 1 < (maxResults || 50)) {
      returnedValues.push(value);
    }
  });

  return [...new Set(returnedValues)];
};

export const handleValueSelected = (value: any, selectedValues: any[]) => {
  if (value.hasOwnProperty('displayValue') && value.hasOwnProperty('value')) {
    return selectedValues.includes(value.value);
  }

  return selectedValues.includes(value);
};

/**
 * Toggle selection of values
 *
 * @param value
 * @param values
 * @param operator
 * @param multiSelect
 */
export const toggleValueSelection = (value: any | ProvidedValue,
                                     values: any[] | ProvidedValue[],
                                     operator: any,
                                     multiSelect: boolean = true): any[] | ProvidedValue[] => {
  const doubleValueOperators = [
    'BETWEEN'
  ];

  const multiValueOperators = [
    'IN',
    'NOT_IN'
  ];

  const onlyDoTwo = doubleValueOperators.includes(operator) && multiSelect;
  const allowMultiple = multiValueOperators.includes(operator) && multiSelect;

  // Check if the value is a ProvidedValue
  if (value.hasOwnProperty('displayValue') && value.hasOwnProperty('value')) {
    // Check if we're not allowed to have more than one value
    if (!allowMultiple) {
      // Check if we're not allowed to have more than two, and check if we already have a value in the array
      if (onlyDoTwo && values.length === 2) {
        // Check if the value is already in the array, and if so, remove it. Otherwise, remove the oldest value and append our value
        return (values.includes(value.value) ? values.filter(v => v !== value.value) : [...values.slice(1), value.value]);
      } else if (!onlyDoTwo) {
        // Check if the value is already in the array, and if so, remove it. Otherwise, return an array with a single value
        return (values.includes(value.value) ? values.filter(v => v !== value.value) : [value.value]);
      }
    }

    // Check if the value is already in the array, and if so, remove it. Otherwise, return an array with our appended value
    return (values.includes(value.value) ? values.filter(v => v !== value.value) : [...values, value.value]);
  }

  if (!allowMultiple) {
    if (onlyDoTwo && values.length === 2) {
      return (values.includes(value) ? values.filter(v => v !== value) : [...values.slice(1), value]);
    } else if (!onlyDoTwo) {
      return (values.includes(value) ? values.filter(v => v !== value) : [value]);
    }
  }
  return (values.includes(value) ? values.filter(v => v !== value) : [...values, value]);
};
