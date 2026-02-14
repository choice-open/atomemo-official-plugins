import type {
  Property,
  PropertyObject,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { CreatePageParameters } from "@notionhq/client"
import { t } from "../i18n/i18n-node"
import {
  formatNotionError,
  getNotionClient,
  invokeErrResult,
  mapBlocks,
  mapIcon,
  mapPageProperties,
  okResult,
} from "./_shared/notion-helpers"
import { blocksProperty } from "./_shared-parameters/blocks"
import { notionCredentialParameter } from "./_shared-parameters/credential"
import { iconProperty } from "./_shared-parameters/icon"
import { pagePropertiesProperty } from "./_shared-parameters/page-properties/page-properties"
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output"

type ParametersNames =
  | Extract<
      keyof CreatePageParameters,
      "parent" | "children" | "icon" | "properties"
    >
  | "api_key"
  | "simplify_output"

const parentProperty: PropertyObject<"parent"> = {
  name: "parent",
  type: "object",
  properties: [
    {
      name: "type",
      type: "string",
      required: false,
      constant: "page_id",
      ui: {
        component: "input",
        display_none: true,
      },
    },
    {
      name: "page_id",
      type: "string",
      required: true,
      ui: { component: "input", support_expression: true },
      display_name: t("CREATE_PAGE_PARENT_PAGE_ID_DISPLAY_NAME"),
      ai: {
        llm_description: t("CREATE_PAGE_PARENT_PAGE_ID_LLM_DESCRIPTION"),
      },
    },
  ],
}

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  parentProperty,
  pagePropertiesProperty,
  blocksProperty,
  iconProperty,
  simplifyOutputProperty,
]

export const createAPageTool: ToolDefinition = {
  name: "notion-create-page",
  display_name: t("CREATE_PAGE_TOOL_DISPLAY_NAME"),
  description: t("CREATE_PAGE_TOOL_DESCRIPTION"),
  icon: "🎛️",
  parameters,
  invoke: async ({ args }) => {
    const client = getNotionClient(args)
    if (!client) {
      return invokeErrResult("Missing Notion API key")
    }

    const rawParameters = args.parameters as Record<string, unknown>
    const parent = rawParameters.parent as Record<string, unknown> | undefined
    const pageId = typeof parent?.page_id === "string" ? parent.page_id : ""

    if (pageId === "") {
      return invokeErrResult("parent.page_id is required")
    }

    try {
      const data = await client.pages.create({
        children: mapBlocks(rawParameters.children),
        icon: mapIcon(rawParameters.icon),
        parent: { page_id: pageId },
        properties: mapPageProperties(rawParameters.properties),
      } satisfies CreatePageParameters)
      return okResult(data)
    } catch (error) {
      return invokeErrResult(formatNotionError(error))
    }
  },
}
