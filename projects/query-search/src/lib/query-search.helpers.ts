import {ConditionOperator} from "./enums";

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
    console.log('split', `${value}`.split(','));
    return `${value}`.split(',').map(v => {
      if (v !== null) {
        console.log(`${v}`.trim() === 'true');
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
