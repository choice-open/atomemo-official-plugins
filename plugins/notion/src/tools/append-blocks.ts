import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { AppendBlockChildrenParameters } from "@notionhq/client"
import { t } from "../i18n/i18n-node"
import {
  formatNotionError,
  getNotionClient,
  invokeErrResult,
  mapBlocks,
  okResult,
} from "./_shared/notion-helpers"
import { blocksProperty } from "./_shared-parameters/blocks"
import { notionCredentialParameter } from "./_shared-parameters/credential"
import type { ExcludedNames } from "./_shared-parameters/excluded-names"

type ParametersNames =
  | Exclude<keyof AppendBlockChildrenParameters, ExcludedNames>
  | "api_key"

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  {
    name: "block_id",
    type: "string",
    required: true,
    ui: { component: "input", support_expression: true },
    display_name: t("APPEND_BLOCKS_BLOCK_ID_DISPLAY_NAME"),
    ai: {
      llm_description: t("APPEND_BLOCKS_BLOCK_ID_LLM_DESCRIPTION"),
    },
  },
  blocksProperty,
  {
    name: "after",
    type: "string",
    required: false,
    ui: { component: "input", support_expression: true },
    display_name: t("APPEND_BLOCKS_AFTER_DISPLAY_NAME"),
    ai: {
      llm_description: t("APPEND_BLOCKS_AFTER_LLM_DESCRIPTION"),
    },
  },
]

export const appendBlocksTool: ToolDefinition = {
  name: "notion-append-blocks",
  display_name: t("APPEND_BLOCKS_TOOL_DISPLAY_NAME"),
  description: t("APPEND_BLOCKS_TOOL_DESCRIPTION"),
  icon: "🎛️",
  parameters,
  invoke: async ({ args }) => {
    const client = getNotionClient(args)
    if (!client) {
      return invokeErrResult("Missing Notion API key")
    }

    const rawParameters = args.parameters as Record<string, unknown>
    const blockId =
      typeof rawParameters.block_id === "string" ? rawParameters.block_id : ""
    if (blockId === "") {
      return invokeErrResult("block_id is required")
    }

    const children = mapBlocks(rawParameters.children)
    if (!children || children.length === 0) {
      return invokeErrResult("children is required")
    }

    try {
      const data = await client.blocks.children.append({
        after:
          typeof rawParameters.after === "string" &&
          rawParameters.after.trim() !== ""
            ? rawParameters.after
            : undefined,
        block_id: blockId,
        children,
      } satisfies AppendBlockChildrenParameters)
      return okResult(data)
    } catch (error) {
      return invokeErrResult(formatNotionError(error))
    }
  },
}
