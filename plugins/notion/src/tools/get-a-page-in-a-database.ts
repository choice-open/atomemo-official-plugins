import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { GetPageParameters } from "@notionhq/client"
import { t } from "../i18n/i18n-node"
import {
  formatNotionError,
  getNotionClient,
  getSimplifyOutputFlag,
  invokeErrResult,
  okResult,
  transformNotionOutput,
} from "./_shared/notion-helpers"
import { notionCredentialParameter } from "./_shared-parameters/credential"
import type { ExcludedNames } from "./_shared-parameters/excluded-names"
import { pageIdProperty } from "./_shared-parameters/page-id"
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output"

type ParametersNames =
  | Exclude<keyof GetPageParameters, ExcludedNames>
  | "api_key"
  | "simplify_output"

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  pageIdProperty,
  {
    name: "filter_properties",
    type: "array",
    required: false,
    items: {
      type: "string",
      name: "property_id_or_name",
      ui: { component: "input", support_expression: true },
    },
    default: [],
    display_name: t("GET_PAGE_FILTER_PROPERTIES_DISPLAY_NAME"),
    ai: {
      llm_description: t("GET_PAGE_FILTER_PROPERTIES_LLM_DESCRIPTION"),
    },
    ui: {
      component: "tag-input",
      support_expression: true,
    },
  },
  simplifyOutputProperty,
]

export const getAPageInADatabaseTool: ToolDefinition = {
  name: "notion-get-page",
  display_name: t("GET_PAGE_TOOL_DISPLAY_NAME"),
  description: t("GET_PAGE_TOOL_DESCRIPTION"),
  icon: "🎛️",
  parameters,
  invoke: async ({ args }) => {
    const client = getNotionClient(args)
    if (!client) {
      return invokeErrResult("Missing Notion API key")
    }

    const rawParameters = args.parameters as Record<string, unknown>
    const pageId =
      typeof rawParameters.page_id === "string" ? rawParameters.page_id : ""

    if (pageId === "") {
      return invokeErrResult("page_id is required")
    }
    console.log("pageId", pageId, typeof pageId)

    try {
      const simplifyOutput = getSimplifyOutputFlag(rawParameters)
      const data = await client.pages.retrieve({
        filter_properties:
          Array.isArray(rawParameters.filter_properties) &&
          rawParameters.filter_properties.length > 0
            ? rawParameters.filter_properties.filter(
                (item): item is string => typeof item === "string",
              )
            : undefined,
        page_id: pageId,
      } satisfies GetPageParameters)
      return okResult(transformNotionOutput(data, simplifyOutput))
    } catch (error) {
      return invokeErrResult(formatNotionError(error))
    }
  },
}
