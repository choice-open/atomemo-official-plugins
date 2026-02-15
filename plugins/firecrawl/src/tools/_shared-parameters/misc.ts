import type { PropertyString } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

// Custom Body
export const customBodyParameter: PropertyString<"customBody"> = {
  name: "customBody",
  type: "string",
  display_name: t("PARAM_REQUEST_BODY_LABEL"),
  ui: {
    component: "code-editor",
    language: "json",
    line_numbers: false,
    support_expression: true,
  },
  default: "{}",
}
