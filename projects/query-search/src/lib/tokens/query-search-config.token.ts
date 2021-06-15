import {InjectionToken} from "@angular/core";
import {QuerySearchConfig} from "../query-search.config";

export const QUERY_SEARCH_CONFIG = new InjectionToken<QuerySearchConfig>('__QUERY_SEARCH_CONFIG__');

export const querySearchDefaultConfig: QuerySearchConfig = {
  loggingCallback: () => {
  },
  debug: false,
  generateButtonText: 'Generate',
  appearance: 'outline',
  transform: rules => {
    return rules
  }
};
