// API docs: https://developers.hubspot.com/docs/api/crm/lists
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { credentialParams } from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
  toJsonValue,
} from "../../_shared/utils"

export const createListTool = {
  name: "hubspot-create-list",
  display_name: t("CREATE_LIST_DISPLAY_NAME"),
  description: t("CREATE_LIST_DESCRIPTION"),
  icon: "📋",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "list_name",
      type: "string",
      required: true,
      display_name: t("PARAM_LIST_NAME_LABEL"),
      ai: { llm_description: t("PARAM_LIST_NAME_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_LIST_NAME_HINT"),
        support_expression: true,
      },
    },
    {
      name: "object_type_id",
      type: "string",
      required: true,
      default: "0-1",
      display_name: t("PARAM_LIST_OBJECT_TYPE_ID_LABEL"),
      ai: { llm_description: t("PARAM_LIST_OBJECT_TYPE_ID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_LIST_OBJECT_TYPE_ID_HINT"),
        support_expression: true,
      },
    },
    {
      name: "processing_type",
      type: "string",
      required: true,
      display_name: t("PARAM_LIST_PROCESSING_TYPE_LABEL"),
      ai: { llm_description: t("PARAM_LIST_PROCESSING_TYPE_HINT") },
      ui: {
        component: "select",
        options: [
          { label: t("LIST_PROCESSING_TYPE_MANUAL"), value: "MANUAL" },
          { label: t("LIST_PROCESSING_TYPE_SNAPSHOT"), value: "SNAPSHOT" },
        ],
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const name = getString(args.parameters, "list_name")
    if (!name) throw new Error("list_name is required")
    const objectTypeId = getString(args.parameters, "object_type_id") ?? "0-1"
    const processingType = getString(args.parameters, "processing_type")
    if (!processingType) throw new Error("processing_type is required")

    try {
      const result = await client.crm.lists.listsApi.create({
        name,
        objectTypeId,
        processingType,
        filterBranch: undefined as any,
      })
      return toJsonValue({ success: true, list: result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
