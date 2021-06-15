export function isEven(n: number): boolean {
  return n % 2 == 0;
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
