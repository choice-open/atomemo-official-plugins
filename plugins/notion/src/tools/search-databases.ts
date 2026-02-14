import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { SearchParameters } from "@notionhq/client"
import { t } from "../i18n/i18n-node"
import {
  formatNotionError,
  getNotionClient,
  getSimplifyOutputFlag,
  invokeErrResult,
  mapSearchSort,
  okResult,
  queryWithPagination,
  transformNotionOutput,
} from "./_shared/notion-helpers"
import { notionCredentialParameter } from "./_shared-parameters/credential"
import type { ExcludedNames } from "./_shared-parameters/excluded-names"
import { pageSizeRelatedParameters } from "./_shared-parameters/page-size-related"
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output"
import { sortRelatedParameters } from "./_shared-parameters/sort"

type ParametersNames =
  | Exclude<keyof SearchParameters, ExcludedNames>
  | "api_key"
  | "return_all"
  | "enable_sort"
  | "simplify_output"

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
]

export const searchDatabasesTool: ToolDefinition = {
  name: "notion-search-databases",
  display_name: t("SEARCH_DATABASES_TOOL_DISPLAY_NAME"),
  description: t("SEARCH_DATABASES_TOOL_DESCRIPTION"),
  icon: "🎛️",
  parameters,
  invoke: async ({ args }) => {
    const client = getNotionClient(args)
    if (!client) {
      return invokeErrResult("Missing Notion API key")
    }

    const rawParameters = args.parameters as Record<string, unknown>
    const returnAll = rawParameters.return_all === true
    const pageSize =
      typeof rawParameters.page_size === "number"
        ? rawParameters.page_size
        : 100
    const query =
      typeof rawParameters.query === "string" &&
      rawParameters.query.trim() !== ""
        ? rawParameters.query
        : undefined
    const sort =
      rawParameters.enable_sort === true
        ? mapSearchSort(rawParameters.sort)
        : undefined

    try {
      const simplifyOutput = getSimplifyOutputFlag(rawParameters)
      const data = await queryWithPagination(returnAll, (startCursor) =>
        client.search({
          filter: {
            property: "object",
            value: "data_source",
          },
          page_size: pageSize,
          query,
          sort,
          start_cursor: startCursor,
        } satisfies SearchParameters),
      )
      return okResult(transformNotionOutput(data, simplifyOutput))
    } catch (error) {
      return invokeErrResult(formatNotionError(error))
    }
  },
}
