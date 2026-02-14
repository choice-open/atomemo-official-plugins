import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { UpdatePageParameters } from "@notionhq/client"
import { t } from "../i18n/i18n-node"
import {
  formatNotionError,
  getNotionClient,
  getSimplifyOutputFlag,
  invokeErrResult,
  mapIcon,
  mapPageProperties,
  okResult,
  transformNotionOutput,
} from "./_shared/notion-helpers"
import { notionCredentialParameter } from "./_shared-parameters/credential"
import { iconProperty } from "./_shared-parameters/icon"
import { pageIdProperty } from "./_shared-parameters/page-id"
import { pagePropertiesProperty } from "./_shared-parameters/page-properties/page-properties"
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output"

type ParametersNames =
  | Extract<
      keyof UpdatePageParameters,
      "page_id" | "properties" | "archived" | "icon"
    >
  | "api_key"
  | "simplify_output"

export const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  pageIdProperty,
  pagePropertiesProperty,
  iconProperty,
  simplifyOutputProperty,
]

export const updateAPageInADatabaseTool: ToolDefinition = {
  name: "notion-update-page-in-database",
  display_name: t("UPDATE_PAGE_TOOL_DISPLAY_NAME"),
  description: t("UPDATE_PAGE_TOOL_DESCRIPTION"),
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

    try {
      const simplifyOutput = getSimplifyOutputFlag(rawParameters)
      const data = await client.pages.update({
        archived:
          typeof rawParameters.archived === "boolean"
            ? rawParameters.archived
            : undefined,
        icon: mapIcon(rawParameters.icon),
        page_id: pageId,
        properties: mapPageProperties(rawParameters.properties),
      } satisfies UpdatePageParameters)
      return okResult(transformNotionOutput(data, simplifyOutput))
    } catch (error) {
      return invokeErrResult(formatNotionError(error))
    }
  },
}
