import type { PropertyString } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

export const crawlIdParameter: PropertyString<"id"> = {
  type: "string",
  name: "id",
  required: true,
  display_name: t("LABEL_ID"),
  ui: {
    component: "input",
    hint: t("HINT_CRAWL_ID"),
    support_expression: true,
  },
}
