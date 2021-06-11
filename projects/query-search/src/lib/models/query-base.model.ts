import {v4 as uuidv4} from 'uuid';

export class QueryBase {
  id: string;
  depth: number;

  constructor() {
    this.id = uuidv4();
  }
}
