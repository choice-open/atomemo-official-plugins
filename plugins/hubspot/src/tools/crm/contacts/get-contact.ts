// API docs: https://developers.hubspot.com/docs/api/crm/contacts
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  associationsParam,
  credentialParams,
  objectIdParam,
  returnPropertiesParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  getStringArray,
  handleHubSpotError,
  toJsonValue,
} from "../../_shared/utils"

export const getContactTool = {
  name: "hubspot-get-contact",
  display_name: t("GET_CONTACT_DISPLAY_NAME"),
  description: t("GET_CONTACT_DESCRIPTION"),
  icon: "👤",
  skill: "",
  parameters: [
    ...credentialParams,
    objectIdParam,
    returnPropertiesParam,
    associationsParam,
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const objectId = getString(args.parameters, "object_id")
    if (!objectId) throw new Error("object_id is required")

    const properties = getStringArray(args.parameters, "return_properties")
    const associations = getStringArray(args.parameters, "return_associations")

    try {
      const result = await client.crm.contacts.basicApi.getById(
        objectId,
        properties,
        undefined,
        associations,
      )
      return toJsonValue({ success: true, object: result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
