import type { Property } from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";

const pageSizeParameter: Property<"page_size"> = {
  name: "page_size",
  type: "integer",
  minimum: 1,
  maximum: 100,
  default: 100,
  display_name: t("PAGE_SIZE_DISPLAY_NAME"),
  ai: {
    llm_description: t("PAGE_SIZE_LLM_DESCRIPTION"),
  },
  ui: {
    component: "number-input",
    step: 1,
    support_expression: true,
  },
  display: {
    hide: {
      return_all: true,
    },
  },
};

const returnAllParameter: Property<"return_all"> = {
  name: "return_all",
  type: "boolean",
  required: false,
  default: false,
  display_name: t("RETURN_ALL_DISPLAY_NAME"),
  ui: {
    component: "switch",
    hint: t("RETURN_ALL_HINT"),
    support_expression: true,
  },
  ai: {
    llm_description: t("RETURN_ALL_LLM_DESCRIPTION"),
  },
};

export const pageSizeRelatedParameters = [
  returnAllParameter,
  pageSizeParameter,
];
