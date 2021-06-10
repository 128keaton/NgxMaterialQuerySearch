import { Injectable } from '@angular/core';
import {CondOperator, SFieldOperator} from "@nestjsx/crud-request";

@Injectable({
  providedIn: 'root'
})
export class QuerySearchService {

  fieldNames: string[] = [];
  operators: string[] = [];

  /**
   *  $eq?: SFiledValues;
   $ne?: SFiledValues;
   $gt?: SFiledValues;
   $lt?: SFiledValues;
   $gte?: SFiledValues;
   $lte?: SFiledValues;
   $starts?: SFiledValues;
   $ends?: SFiledValues;
   $cont?: SFiledValues;
   $excl?: SFiledValues;
   $in?: SFiledValues;
   $notin?: SFiledValues;
   $between?: SFiledValues;
   $isnull?: SFiledValues;
   $notnull?: SFiledValues;
   $eqL?: SFiledValues;
   $neL?: SFiledValues;
   $startsL?: SFiledValues;
   $endsL?: SFiledValues;
   $contL?: SFiledValues;
   $exclL?: SFiledValues;
   $inL?: SFiledValues;
   $notinL?: SFiledValues;
   $or?: SFieldOperator;
   $and?: never;
   */
  constructor() {
    this.operators = Object.keys(CondOperator);
  }
}
