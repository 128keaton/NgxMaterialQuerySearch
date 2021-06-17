import {QueryField} from "./query-field.model";

export interface ValueNotification {
  partialValue: string;
  field: QueryField;
}
