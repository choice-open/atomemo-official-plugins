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
  | "enable_filter"
  | "simplify_output"

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  {
    // Constant filter to only return pages
    name: "filter",
    type: "object",
    required: false,
    ai: {
      llm_description: t("SEARCH_PAGES_FILTER_LLM_DESCRIPTION"),
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
        constant: "page",
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
    display_name: t("SEARCH_PAGES_QUERY_DISPLAY_NAME"),
    ai: {
      llm_description: t("SEARCH_PAGES_QUERY_LLM_DESCRIPTION"),
    },
    ui: {
      component: "input",
      placeholder: {
        en_US: "e.g. Meeting notes",
      },
      support_expression: true,
    },
  },
  ...pageSizeRelatedParameters,
  {
    name: "enable_filter",
    type: "boolean",
    default: false,
    ui: { component: "switch", support_expression: true },
    display_name: t("SEARCH_PAGES_ENABLE_FILTER_DISPLAY_NAME"),
  },
  ...sortRelatedParameters,
  simplifyOutputProperty,
]

export const searchPagesTool: ToolDefinition = {
  name: "notion-search-pages",
  display_name: t("SEARCH_PAGES_TOOL_DISPLAY_NAME"),
  description: t("SEARCH_PAGES_TOOL_DESCRIPTION"),
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
    const filter: SearchParameters["filter"] =
      rawParameters.enable_filter === true
        ? { property: "object", value: "page" as const }
        : undefined
    const sort =
      rawParameters.enable_sort === true
        ? mapSearchSort(rawParameters.sort)
        : undefined
    const query =
      typeof rawParameters.query === "string" &&
      rawParameters.query.trim() !== ""
        ? rawParameters.query
        : undefined

    try {
      const simplifyOutput = getSimplifyOutputFlag(rawParameters)
      const data = await queryWithPagination(returnAll, (startCursor) =>
        client.search({
          filter,
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
