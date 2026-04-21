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
} from "../../_shared/utils"

export const addContactToListTool = {
  name: "hubspot-add-contact-to-list",
  display_name: t("ADD_CONTACT_TO_LIST_DISPLAY_NAME"),
  description: t("ADD_CONTACT_TO_LIST_DESCRIPTION"),
  icon: "📋",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "list_id",
      type: "string",
      required: true,
      display_name: t("PARAM_LIST_ID_LABEL"),
      ai: { llm_description: t("PARAM_LIST_ID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_LIST_ID_HINT"),
        support_expression: true,
      },
    },
    {
      name: "contact_ids",
      type: "string",
      required: true,
      display_name: t("PARAM_CONTACT_IDS_LABEL"),
      ai: { llm_description: t("PARAM_CONTACT_IDS_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_CONTACT_IDS_HINT"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const listId = getString(args.parameters, "list_id")
    if (!listId) throw new Error("list_id is required")
    const contactIdsRaw = getString(args.parameters, "contact_ids")
    if (!contactIdsRaw) throw new Error("contact_ids is required")
    const contactIds = contactIdsRaw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
    if (!contactIds.length)
      throw new Error("At least one contact_id is required")

    try {
      const result = await client.crm.lists.membershipsApi.add(
        listId,
        contactIds,
      )
      return { success: true, result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
