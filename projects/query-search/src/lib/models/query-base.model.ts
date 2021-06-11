import {v4 as uuidv4} from 'uuid';

export class QueryBase {
  id: string;

  constructor() {
    this.id = uuidv4();
  }
}
