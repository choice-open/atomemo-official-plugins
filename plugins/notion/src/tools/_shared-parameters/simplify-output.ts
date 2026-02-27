import type { PropertyBoolean } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

/**
 * deal with simplify_output parameter in invoke/execute blocks,
 * notion api itself does not have this parameter
 */
const simplifyOutputProperty: PropertyBoolean<"simplify_output"> = {
  name: "simplify_output",
  type: "boolean",
  required: false,
  display_name: t("SIMPLIFY_OUTPUT_DISPLAY_NAME"),
  default: true,
  ui: {
    component: "switch",
    hint: t("SIMPLIFY_OUTPUT_HINT"),
    support_expression: true,
  },
  ai: {
    llm_description: t("SIMPLIFY_OUTPUT_LLM_DESCRIPTION"),
  },
}

export { simplifyOutputProperty }
