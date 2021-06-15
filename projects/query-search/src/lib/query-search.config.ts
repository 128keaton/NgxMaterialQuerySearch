import {MatFormFieldAppearance} from "@angular/material/form-field/form-field";
import {QueryRuleGroup} from "./models";

export interface QuerySearchConfig {
  loggingCallback: () => void;
  debug: boolean;
  generateButtonText?: string;
  appearance?: MatFormFieldAppearance;
  transform?: (rules: QueryRuleGroup[]) => any;
}
