import type { PropertyString } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

export const batchIdParameter: PropertyString<"batchId"> = {
  name: "batchId",
  type: "string",
  display_name: t("LABEL_BATCH_ID"),
  required: true,
  ui: {
    component: "input",
    hint: t("HINT_BATCH_ID"),
    support_expression: true,
  },
}
