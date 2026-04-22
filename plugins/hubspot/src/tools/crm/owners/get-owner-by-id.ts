// API docs: https://developers.hubspot.com/docs/api/crm/owners
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { hubspotLocatorListMethods } from "../../_shared/methods"
import {
  credentialParams,
  ownerIdParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getResourceLocatorValue,
  handleHubSpotError,
  toJsonValue,
} from "../../_shared/utils"

export const getOwnerByIdTool = {
  name: "hubspot-get-owner-by-id",
  display_name: t("GET_OWNER_BY_ID_DISPLAY_NAME"),
  description: t("GET_OWNER_BY_ID_DESCRIPTION"),
  icon: "👑",
  skill: "",
  parameters: [...credentialParams, ownerIdParam],
  locator_list: hubspotLocatorListMethods,

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const ownerId = getResourceLocatorValue(args.parameters, "owner_id")
    if (!ownerId) throw new Error("owner_id is required")
    try {
      const owner = await client.crm.owners.ownersApi.getById(Number(ownerId))
      return toJsonValue({ success: true, owner })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
