import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { QueryDataSourceParameters } from "@notionhq/client"
import { t } from "../i18n/i18n-node"
import {
  formatNotionError,
  getNotionClient,
  getSimplifyOutputFlag,
  invokeErrResult,
  mapQuerySorts,
  okResult,
  parseJsonObject,
  queryWithPagination,
  transformNotionOutput,
} from "./_shared/notion-helpers"
import { notionCredentialParameter } from "./_shared-parameters/credential"
import type { ExcludedNames } from "./_shared-parameters/excluded-names"
import { pageSizeRelatedParameters } from "./_shared-parameters/page-size-related"
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output"

type ParametersNames =
  | Exclude<
      keyof QueryDataSourceParameters,
      ExcludedNames | "archived" | "in_trash" | "result_type"
    >
  | "api_key"
  | "return_all"
  | "simplify_output"

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  {
    name: "data_source_id",
    type: "string",
    required: true,
    display_name: t("QUERY_DATABASE_DATA_SOURCE_ID_DISPLAY_NAME"),
    ui: {
      component: "input",
      placeholder: {
        en_US: "e.g. 4c0f2e87-1234-4f7c-9c17-1f5acafe0001",
      },
      support_expression: true,
    },
    ai: {
      llm_description: t("QUERY_DATABASE_DATA_SOURCE_ID_LLM_DESCRIPTION"),
    },
  },
  {
    name: "filter_properties",
    type: "array",
    default: [],
    required: false,
    items: {
      type: "string",
      name: "property_id_or_name",
      ui: { component: "input", support_expression: true },
    },
    display_name: t("QUERY_DATABASE_FILTER_PROPERTIES_DISPLAY_NAME"),
    ai: {
      llm_description: t("QUERY_DATABASE_FILTER_PROPERTIES_LLM_DESCRIPTION"),
    },
    ui: {
      component: "tag-input",
      support_expression: true,
    },
  },
  ...pageSizeRelatedParameters,
  {
    name: "sorts",
    type: "array",
    required: false,
    display_name: t("QUERY_DATABASE_SORTS_DISPLAY_NAME"),
    ai: {
      llm_description: t("QUERY_DATABASE_SORTS_LLM_DESCRIPTION"),
    },
    ui: {
      component: "array-section",
    },
    items: {
      type: "object",
      name: "sort",
      display_name: t("QUERY_DATABASE_SORT_RULE_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
      },
      properties: [
        {
          name: "property",
          type: "string",
          required: true,
          display_name: t("QUERY_DATABASE_SORT_RULE_PROPERTY_DISPLAY_NAME"),
          ai: {
            llm_description: t(
              "QUERY_DATABASE_SORT_RULE_PROPERTY_LLM_DESCRIPTION",
            ),
          },
          ui: {
            component: "input",
            support_expression: true,
          },
        },
        {
          name: "timestamp",
          type: "string",
          required: false,
          default: "last_edited_time",
          enum: ["created_time", "last_edited_time"],
          display_name: t("QUERY_DATABASE_SORT_RULE_TIMESTAMP_DISPLAY_NAME"),
          ai: {
            llm_description: t(
              "QUERY_DATABASE_SORT_RULE_TIMESTAMP_LLM_DESCRIPTION",
            ),
          },
          ui: {
            component: "select",
            support_expression: true,
          },
        },
        {
          name: "direction",
          type: "string",
          required: true,
          enum: ["ascending", "descending"],
          default: "descending",
          display_name: t("QUERY_DATABASE_SORT_RULE_DIRECTION_DISPLAY_NAME"),
          ai: {
            llm_description: t(
              "QUERY_DATABASE_SORT_RULE_DIRECTION_LLM_DESCRIPTION",
            ),
          },
          ui: {
            component: "radio-group",
            support_expression: true,
          },
        },
      ],
    },
  },
  {
    name: "filter",
    type: "string",
    required: false,
    display_name: t("QUERY_DATABASE_FILTER_DISPLAY_NAME"),
    ai: {
      llm_description: t("QUERY_DATABASE_FILTER_LLM_DESCRIPTION"),
    },
    ui: {
      component: "code-editor",
      language: "json",
      min_height: 120,
      support_expression: true,
    },
    default: "{}",
  },
  simplifyOutputProperty,
]

export const getManyPagesInADatabaseTool: ToolDefinition = {
  name: "notion-query-data-source",
  display_name: t("QUERY_DATABASE_TOOL_DISPLAY_NAME"),
  description: t("QUERY_DATABASE_TOOL_DESCRIPTION"),
  icon: "🎛️",
  parameters,
  invoke: async ({ args }) => {
    const client = getNotionClient(args)
    if (!client) {
      return invokeErrResult("Missing Notion API key")
    }

    const rawParameters = args.parameters as Record<string, unknown>
    const dataSourceId =
      typeof rawParameters.data_source_id === "string"
        ? rawParameters.data_source_id
        : ""
    if (dataSourceId === "") {
      return invokeErrResult("data_source_id is required")
    }

    const parsedFilter = parseJsonObject(rawParameters.filter)
    if ("error" in parsedFilter) {
      return invokeErrResult(parsedFilter.error ?? "Invalid filter JSON")
    }

    const returnAll = rawParameters.return_all === true
    const pageSize =
      typeof rawParameters.page_size === "number"
        ? rawParameters.page_size
        : 100

    try {
      const simplifyOutput = getSimplifyOutputFlag(rawParameters)
      const data = await queryWithPagination(returnAll, (startCursor) => {
        const filter = parsedFilter.value
        const sorts = mapQuerySorts(rawParameters.sorts)

        const filter_properties =
          Array.isArray(rawParameters.filter_properties) &&
          rawParameters.filter_properties.length > 0
            ? rawParameters.filter_properties.filter(
                (item): item is string => typeof item === "string",
              )
            : undefined
        const params = {
          data_source_id: dataSourceId,
          page_size: pageSize,
          start_cursor: startCursor,
          filter,
          filter_properties,
          sorts,
        }

        if (filter && Object.keys(filter).length === 0) {
          delete params.filter
        }

        return client.dataSources.query(params)
      })
      return okResult(transformNotionOutput(data, simplifyOutput))
    } catch (error) {
      return invokeErrResult(formatNotionError(error))
    }
  },
}
