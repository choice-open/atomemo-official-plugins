import type { PropertyArray } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

export const parsersParameter: PropertyArray<"parsers"> = {
  name: "parsers",
  type: "array",
  display_name: t("PARAM_PARSERS_LABEL"),
  items: {
    name: "parser",
    type: "string",
  },
  constant: ["pdf"],
  ui: {
    component: "multi-select",
    options: [
      {
        label: t("OPTION_PARSER_PDF"),
        value: "pdf",
      },
    ],
  },
}
