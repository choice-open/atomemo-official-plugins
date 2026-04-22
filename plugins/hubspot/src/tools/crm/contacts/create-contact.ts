// API docs: https://developers.hubspot.com/docs/api/crm/contacts
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { createPropertyMappingMethod } from "../../_shared/methods"
import { credentialParams, propertiesParam } from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  handleHubSpotError,
  resolveResourceMapper,
  toJsonValue,
} from "../../_shared/utils"

export const createContactTool = {
  name: "hubspot-create-contact",
  display_name: t("CREATE_CONTACT_DISPLAY_NAME"),
  description: t("CREATE_CONTACT_DESCRIPTION"),
  icon: "👤",
  skill: "",
  parameters: [...credentialParams, propertiesParam],
  resource_mapping: createPropertyMappingMethod("contacts"),

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}
    try {
      const result = await client.crm.contacts.basicApi.create({
        properties,
        associations: [],
      })
      return toJsonValue({ success: true, object: result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
