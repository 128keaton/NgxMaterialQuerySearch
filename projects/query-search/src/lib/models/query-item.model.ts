import {v4 as uuidv4} from 'uuid';

export class QueryItem {
  fieldName: string;
  condition: string;
  value: any;
  id: string;

  constructor() {
    this.id = uuidv4();
  }
}
