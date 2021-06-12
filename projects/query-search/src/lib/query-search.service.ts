import {EventEmitter, Inject} from '@angular/core';
import {Injectable} from '@angular/core';
import {CondOperator, RequestQueryBuilder} from "@nestjsx/crud-request";
import {QueryField} from "./models";
import {BehaviorSubject} from "rxjs";
import {QUERY_SEARCH_CONFIG, QuerySearchConfig} from "./query-search.config";
import {QuerySortOperator} from "@nestjsx/crud-request/lib/types/request-query.types";

@Injectable({
  providedIn: 'root'
})
export class QuerySearchService {

  queryUpdated = new EventEmitter<any>();
  queryStringUpdated = new EventEmitter<string>();
  operators: string[] = [];
  fields: BehaviorSubject<QueryField[]> = new BehaviorSubject<QueryField[]>([]);

  private _sortBy: string | null;
  private _sortDirection: QuerySortOperator | null;
  private _pageNumber: number = 0;
  private _pageSize: number = 0;

  private _fields: QueryField[] = [];
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
    this._fields.push(...fields);
    this.fields.next(this._fields);
  }

  log(...args: any[]) {
    if (!this._debug) {
      return;
    }

    this._loggingCallback(...args);
  }

  emitQuery(queryBuilder: RequestQueryBuilder) {
    if (!!this._sortBy) {
      queryBuilder.sortBy({field: this._sortBy, order: (this._sortDirection || 'DESC')})
    }

    if (!!this._pageNumber) {
      queryBuilder.setPage(this._pageNumber)
    }

    if (!!this._pageSize) {
      queryBuilder.setLimit(this._pageSize);
    }

    const queryObject = queryBuilder.queryObject;
    const queryString = queryBuilder.query(this._encode);

    this.log('Emitting query', queryObject);
    this.queryUpdated.emit(queryObject);

    this.log('Emitting query string', queryString);
    this.queryStringUpdated.emit(queryString);
  }

  /**
   * Consume a Class/Model statically which provides fields and their information to the component
   * @param instance - Class
   * @param labels - Labels in a key/value object
   */
  consumeModel<T>(instance: any, labels: {} = {}) {
    const toConsume: T = new instance();

    return this.consumeObject(toConsume, labels);
  }

  /**
   * Consume an object which provides fields and their information to the component
   * @param instance - Class
   * @param labels - Labels in a key/value object
   */
  consumeObject<T>(instance: any, labels: {} = {}) {
    const fields = Object.getOwnPropertyNames(instance).map((propName: string) => {
      let fieldType: any = typeof (instance as any)[propName];
      let label = undefined;

      if (fieldType === 'object') {
        if (Object.prototype.toString.call((instance as any)[propName]) === '[object Date]') {
          fieldType = 'date';
        }
      }


      if (!!labels && labels.hasOwnProperty(propName)) {
        label = (labels as any)[propName] as string;
      }

      return {
        name: propName,
        type: fieldType as 'boolean' | 'date' | 'number' | 'string' | 'array',
        values: [],
        label
      }
    });

    this.addFields(fields);
  }

  set pageNumber(newValue: number) {
    this._pageNumber = newValue;
  }

  set pageSize(newValue: number) {
    this._pageSize = newValue;
  }

  set sortBy(fieldName: string) {
    this._sortBy = fieldName;
  }

  set sortDirection(direction: 'ASC' | 'DESC') {
    this._sortDirection = direction;
  }
}
