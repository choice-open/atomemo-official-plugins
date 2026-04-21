// API docs: https://developers.hubspot.com/docs/api/crm/owners
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

export const getOwnerByIdTool = {
  name: "hubspot-get-owner-by-id",
  display_name: t("GET_OWNER_BY_ID_DISPLAY_NAME"),
  description: t("GET_OWNER_BY_ID_DESCRIPTION"),
  icon: "👑",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "owner_id",
      type: "string",
      required: true,
      display_name: t("PARAM_OWNER_ID_LABEL"),
      ai: { llm_description: t("PARAM_OWNER_ID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_OWNER_ID_HINT"),
        placeholder: t("PARAM_OWNER_ID_PLACEHOLDER"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const ownerId = getString(args.parameters, "owner_id")
    if (!ownerId) throw new Error("owner_id is required")
    try {
      const owner = await client.crm.owners.ownersApi.getById(Number(ownerId))
      return { success: true, owner } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
