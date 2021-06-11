import {QueryBase} from "./query-base.model";

export class QueryItem extends QueryBase {
  fieldName: string;
  condition: string;
  value: any;
}
