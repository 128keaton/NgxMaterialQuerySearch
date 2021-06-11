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
      return new Date(value).toISOString();
    default:
      return `${value}`;
  }
}
