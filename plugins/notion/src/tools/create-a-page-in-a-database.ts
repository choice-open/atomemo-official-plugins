import type {
  Property,
  PropertyObject,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { CreatePageParameters } from "@notionhq/client"
import { t } from "../i18n/i18n-node"
import {
  getNotionClient,
  getSimplifyOutputFlag,
  handleNotionError,
  mapBlocks,
  mapIcon,
  mapPageProperties,
  transformNotionOutput,
} from "./_shared/notion-helpers"
import { blocksProperty } from "./_shared-parameters/blocks"
import { notionCredentialParameter } from "./_shared-parameters/credential"
import { iconProperty } from "./_shared-parameters/icon"
import { pagePropertiesProperty } from "./_shared-parameters/page-properties/page-properties"
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output"

const parentProperty: PropertyObject<"parent"> = {
  name: "parent",
  type: "object",
  properties: [
    {
      name: "type",
      type: "string",
      required: false,
      constant: "data_source_id",
      ui: {
        component: "input",
        display_none: true,
      },
    },
    {
      name: "data_source_id",
      type: "string",
      required: true,
      display_name: t("CREATE_PAGE_IN_DATABASE_PARENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        support_expression: true,
        hint: t("CREATE_PAGE_IN_DATABASE_PARENT_ID_HINT"),
      },
      ai: {
        llm_description: t("CREATE_PAGE_IN_DATABASE_PARENT_ID_LLM_DESCRIPTION"),
      },
    },
  ],
}

type ParametersNames =
  | Extract<
      keyof CreatePageParameters,
      "parent" | "children" | "icon" | "properties"
    >
  | "api_key"
  | "simplify_output"

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  parentProperty,
  pagePropertiesProperty,
  blocksProperty,
  iconProperty,
  simplifyOutputProperty,
]

export const createAPageInADatabaseTool: ToolDefinition = {
  name: "notion-create-page-in-database",
  display_name: t("CREATE_PAGE_IN_DATABASE_TOOL_DISPLAY_NAME"),
  description: t("CREATE_PAGE_IN_DATABASE_TOOL_DESCRIPTION"),
  icon: "🎛️",
  parameters,
  invoke: async ({ args }) => {
    const client = getNotionClient(args)
    if (!client) {
      throw new Error("Missing Notion API key")
    }

    const rawParameters = args.parameters as Record<string, unknown>
    const parent = rawParameters.parent as Record<string, unknown> | undefined
    const dataSourceId =
      typeof parent?.data_source_id === "string" ? parent.data_source_id : ""

    if (dataSourceId === "") {
      throw new Error("parent.data_source_id is required")
    }

    const simplifyOutput = getSimplifyOutputFlag(rawParameters)
    try {
      const data = await client.pages.create({
        children: mapBlocks(rawParameters.children),
        icon: mapIcon(rawParameters.icon),
        parent: { data_source_id: dataSourceId },
        properties: mapPageProperties(rawParameters.properties),
      } satisfies CreatePageParameters)
      return transformNotionOutput(data, simplifyOutput)
    } catch (error) {
      return handleNotionError(error)
    }
  },
}
