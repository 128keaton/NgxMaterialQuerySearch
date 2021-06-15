export function isEven(n: number): boolean {
  return n % 2 == 0;
}

export function getEnumKeyByEnumValue(myEnum: any, enumValue: string) {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : null;
}

export function transformValue(value: any, type: string) {
  switch (type) {
    case 'boolean':
      return (`${value}` === 'true')
    case 'number':
      return Number(value)
    case 'date':
      try {
        return new Date(value).toISOString();
      } catch (e) {
        return undefined;
      }
    default:
      return `${value}`;
  }
}

export function isDefined(value: any): boolean {
  return value !== undefined;
}
