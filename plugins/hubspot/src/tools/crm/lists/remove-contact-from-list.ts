// API docs: https://developers.hubspot.com/docs/api/crm/lists
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { hubspotLocatorListMethods } from "../../_shared/methods"
import {
  contactIdsParam,
  credentialParams,
  listIdParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getResourceLocatorValue,
  getStringArray,
  handleHubSpotError,
  toJsonValue,
} from "../../_shared/utils"

export const removeContactFromListTool = {
  name: "hubspot-remove-contact-from-list",
  display_name: t("REMOVE_CONTACT_FROM_LIST_DISPLAY_NAME"),
  description: t("REMOVE_CONTACT_FROM_LIST_DESCRIPTION"),
  icon: "📋",
  skill: "",
  parameters: [...credentialParams, listIdParam, contactIdsParam],
  locator_list: hubspotLocatorListMethods,

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const listId = getResourceLocatorValue(args.parameters, "list_id")
    if (!listId) throw new Error("list_id is required")
    const contactIds = getStringArray(args.parameters, "contact_ids")
    if (!contactIds?.length)
      throw new Error("At least one contact_id is required")

    try {
      const result = await client.crm.lists.membershipsApi.remove(
        listId,
        contactIds,
      )
      return toJsonValue({ success: true, result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
