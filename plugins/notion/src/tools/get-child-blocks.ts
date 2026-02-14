import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { ListBlockChildrenParameters } from "@notionhq/client"
import { t } from "../i18n/i18n-node"
import {
  formatNotionError,
  getNotionClient,
  invokeErrResult,
  okResult,
  queryWithPagination,
} from "./_shared/notion-helpers"
import { notionCredentialParameter } from "./_shared-parameters/credential"
import type { ExcludedNames } from "./_shared-parameters/excluded-names"
import { pageSizeRelatedParameters } from "./_shared-parameters/page-size-related"
import { simplifyOutputProperty } from "./_shared-parameters/simplify-output"

type ParametersNames =
  | Exclude<keyof ListBlockChildrenParameters, ExcludedNames>
  | "api_key"
  | "return_all"
  | "simplify_output"

// TBD: fetchNestedBlocks

const parameters: Array<Property<ParametersNames>> = [
  notionCredentialParameter,
  {
    name: "block_id",
    type: "string",
    required: true,
    display_name: t("GET_CHILD_BLOCKS_BLOCK_ID_DISPLAY_NAME"),
    ai: {
      llm_description: t("GET_CHILD_BLOCKS_BLOCK_ID_LLM_DESCRIPTION"),
    },
    ui: {
      component: "input",
      placeholder: {
        en_US: "e.g. 1b2c3d4e5f6g7h8i9j0k",
      },
      support_expression: true,
    },
  },
  ...pageSizeRelatedParameters,
  simplifyOutputProperty,
]

export const getChildBlocksTool: ToolDefinition = {
  name: "notion-get-child-blocks",
  display_name: t("GET_CHILD_BLOCKS_TOOL_DISPLAY_NAME"),
  description: t("GET_CHILD_BLOCKS_TOOL_DESCRIPTION"),
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

    const returnAll = rawParameters.return_all === true
    const pageSize =
      typeof rawParameters.page_size === "number"
        ? rawParameters.page_size
        : 100

    try {
      const data = await queryWithPagination(returnAll, (startCursor) =>
        client.blocks.children.list({
          block_id: blockId,
          page_size: pageSize,
          start_cursor: startCursor,
        } satisfies ListBlockChildrenParameters),
      )
      return okResult(data)
    } catch (error) {
      return invokeErrResult(formatNotionError(error))
    }
  },
}
