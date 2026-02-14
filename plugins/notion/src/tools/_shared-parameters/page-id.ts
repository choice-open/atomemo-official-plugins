import type { PropertyString } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

export const pageIdProperty: PropertyString<"page_id"> = {
  name: "page_id",
  type: "string",
  required: true,
  display_name: t("PAGE_ID_DISPLAY_NAME"),
  ai: {
    llm_description: t("PAGE_ID_LLM_DESCRIPTION"),
  },
  ui: {
    component: "input",
    placeholder: {
      en_US: "e.g. 59833787-2cf9-4fdf-8782-e53db20768a5",
    },
    support_expression: true,
  },
}
