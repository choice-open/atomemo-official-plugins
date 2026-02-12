import type {
  PropertyBoolean,
  PropertyObject,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";

const sortParameter: PropertyObject<"sort"> = {
  name: "sort",
  type: "object",
  required: false,
  display_name: t("SORT_DISPLAY_NAME"),
  ai: {
    llm_description: t("SORT_LLM_DESCRIPTION"),
  },
  properties: [
    {
      name: "timestamp",
      type: "string",
      enum: ["last_edited_time"],
      default: "last_edited_time",
      ui: {
        component: "select",
        clearable: true,
        indentation: 4,
        support_expression: true,
      },
    },
    {
      name: "direction",
      type: "string",
      display_name: t("SORT_DIRECTION_DISPLAY_NAME"),
      enum: ["ascending", "descending"],
      default: "descending",
      ui: {
        component: "select",
        clearable: true,
        indentation: 4,
        options: [
          {
            label: t("SORT_DIRECTION_OPTION_ASCENDING"),
            value: "ascending",
          },
          {
            label: t("SORT_DIRECTION_OPTION_DESCENDING"),
            value: "descending",
          },
        ],
        support_expression: true,
      },
    },
  ],
  display: {
    hide: {
      enable_sort: false,
    },
  },
};

const enableSortParameter: PropertyBoolean<"enable_sort"> = {
  name: "enable_sort",
  type: "boolean",
  required: false,
  default: false,
  display_name: t("SORT_ENABLE_DISPLAY_NAME"),
  ui: {
    component: "switch",
    hint: t("SORT_ENABLE_HINT"),
    support_expression: false,
  },
  ai: {
    llm_description: t("SORT_ENABLE_LLM_DESCRIPTION"),
  },
};

export const sortRelatedParameters: [
  PropertyBoolean<"enable_sort">,
  PropertyObject<"sort">,
] = [enableSortParameter, sortParameter];
