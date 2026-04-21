// API docs: https://developers.hubspot.com/docs/api/crm/associations
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
} from "../../_shared/utils"

export const findAssociationsTool = {
  name: "hubspot-find-associations",
  display_name: t("FIND_ASSOCIATIONS_DISPLAY_NAME"),
  description: t("FIND_ASSOCIATIONS_DESCRIPTION"),
  icon: "🔗",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "from_object_type",
      type: "string",
      required: true,
      display_name: t("PARAM_FROM_OBJECT_TYPE_LABEL"),
      ai: { llm_description: t("PARAM_FROM_OBJECT_TYPE_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_FROM_OBJECT_TYPE_HINT"),
        support_expression: true,
      },
    },
    {
      name: "to_object_type",
      type: "string",
      required: true,
      display_name: t("PARAM_TO_OBJECT_TYPE_LABEL"),
      ai: { llm_description: t("PARAM_TO_OBJECT_TYPE_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_TO_OBJECT_TYPE_HINT"),
        support_expression: true,
      },
    },
    {
      name: "from_ids",
      type: "string",
      required: true,
      display_name: t("PARAM_FROM_IDS_LABEL"),
      ai: { llm_description: t("PARAM_FROM_IDS_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_FROM_IDS_HINT"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const fromType = getString(args.parameters, "from_object_type")
    const toType = getString(args.parameters, "to_object_type")
    if (!fromType || !toType)
      throw new Error("from_object_type and to_object_type are required")

    const fromIdsRaw = getString(args.parameters, "from_ids")
    if (!fromIdsRaw) throw new Error("from_ids is required")
    const fromIds = fromIdsRaw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
    if (!fromIds.length) throw new Error("At least one from_id is required")

    try {
      const result = await client.crm.associations.v4.batchApi.getPage(
        fromType,
        toType,
        { inputs: fromIds.map((id) => ({ id })) },
      )
      return {
        success: true,
        associations: result.results,
      } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
