import {EventEmitter, Inject} from '@angular/core';
import {Injectable} from '@angular/core';
import {CondOperator, RequestQueryBuilder} from "@nestjsx/crud-request";
import {QueryField} from "./models/query-field.model";
import {BehaviorSubject} from "rxjs";
import {QUERY_SEARCH_CONFIG, QuerySearchConfig} from "./query-search.config";

@Injectable({
  providedIn: 'root'
})
export class QuerySearchService {

  queryUpdated = new EventEmitter<any>();
  queryStringUpdated = new EventEmitter<string>();
  operators: string[] = [];
  fields: BehaviorSubject<QueryField[]> = new BehaviorSubject<QueryField[]>([]);

  private _fields: QueryField[];
  private readonly _loggingCallback: (...args: any[]) => void = () => {
  };

  private readonly _debug: boolean = false;
  private readonly _encode: boolean = false;

  constructor(@Inject(QUERY_SEARCH_CONFIG) configuration: QuerySearchConfig) {
    this.operators = Object.keys(CondOperator).filter(k => !k.includes('LOW'));

    if (!!configuration) {
      if (!!configuration.loggingCallback) {
        this._loggingCallback = configuration.loggingCallback;
      }

      if (configuration.hasOwnProperty('debug')) {
        this._debug = configuration.debug;
      }

      if (configuration.hasOwnProperty('encode')) {
        this._encode = configuration.encode;
      }

    }
  }

  addFields(fields: QueryField[]) {
    this._fields = fields || [];
    this.fields.next(this._fields);
  }

  log(...args: any[]) {
    if (!this._debug) {
      return;
    }

    this._loggingCallback(...args);
  }

  emitQuery(queryBuilder: RequestQueryBuilder) {
    const queryObject = queryBuilder.queryObject;
    const queryString = queryBuilder.query(this._encode);

    this.log('Emitting query', queryObject);
    this.queryUpdated.emit(queryObject);

    this.log('Emitting query string', queryString);
    this.queryStringUpdated.emit(queryString);
  }
}
