export interface QueryField {
  name: string;
  type: 'boolean' | 'date' | 'number' | 'string' | 'array';
  values?: any[];
  format?: string;
  label?: string;
}
