import {InjectionToken} from "@angular/core";

export interface QuerySearchConfig {
  loggingCallback: () => void;
  debug: boolean;
  encode: boolean;
}

export const QUERY_SEARCH_CONFIG = new InjectionToken<QuerySearchConfig>('Query Search Configuration', {
  providedIn: 'any',
  factory: () => {
    return {
      loggingCallback: () => {
      },
      debug: false,
      encode: false
    }
  }
});
