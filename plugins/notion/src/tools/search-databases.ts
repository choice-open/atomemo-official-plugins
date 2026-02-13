import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import type { SearchParameters } from "@notionhq/client";
import { t } from "../i18n/i18n-node";
import { notionCredentialParameter } from "./_shared-parameters/credential";
import type { ExcludedNames } from "./_shared-parameters/excluded-names";
import { pageSizeRelatedParameters } from "./_shared-parameters/page-size-related";
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output";
import { sortRelatedParameters } from "./_shared-parameters/sort";

type ParametersNames =
  | Exclude<keyof SearchParameters, ExcludedNames>
  | "api_key"
  | "return_all"
  | "enable_sort"
  | "simplify_output";

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  {
    // Constant filter to only return databases (data sources)
    name: "filter",
    type: "object",
    required: false,
    ai: {
      llm_description: t("SEARCH_DATABASES_FILTER_LLM_DESCRIPTION"),
    },
    properties: [
      {
        name: "property",
        type: "string",
        constant: "object",
        ui: {
          component: "input",
          display_none: true,
          support_expression: true,
        },
      },
      {
        name: "value",
        type: "string",
        constant: "data_source",
        ui: {
          component: "input",
          display_none: true,
          support_expression: true,
        },
      },
    ],
  },
  {
    name: "query",
    type: "string",
    required: false,
    display_name: t("SEARCH_DATABASES_QUERY_DISPLAY_NAME"),
    ai: {
      llm_description: t("SEARCH_DATABASES_QUERY_LLM_DESCRIPTION"),
    },
    ui: {
      component: "input",
      placeholder: {
        en_US: "e.g. Tasks",
      },
      support_expression: true,
    },
  },
  ...pageSizeRelatedParameters,
  ...sortRelatedParameters,
  simplifyOutputProperty,
];

export const searchDatabasesTool: ToolDefinition = {
  name: "notion-search-databases",
  display_name: t("SEARCH_DATABASES_TOOL_DISPLAY_NAME"),
  description: t("SEARCH_DATABASES_TOOL_DESCRIPTION"),
  icon: "🎛️",
  parameters,
  invoke: async () => ({
    error: "Not implemented",
  }),
};
