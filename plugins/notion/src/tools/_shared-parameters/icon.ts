import type { PropertyString } from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";

export const iconProperty: PropertyString<"icon"> = {
  name: "icon",
  type: "string",
  required: false,
  display_name: t("ICON_DISPLAY_NAME"),
  ui: {
    component: "emoji-picker",
    support_expression: true,
  },
  ai: {
    llm_description: t("ICON_LLM_DESCRIPTION"),
  },
};
