import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { createPropertyMappingMethod } from "../../_shared/methods"
import {
  credentialParams,
  objectIdParam,
  propertiesOptionalParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
  resolveResourceMapper,
} from "../../_shared/utils"

export const updateTicketTool = {
  name: "hubspot-update-ticket",
  display_name: t("UPDATE_TICKET_DISPLAY_NAME"),
  description: t("UPDATE_TICKET_DESCRIPTION"),
  icon: "🎫",
  skill: "",
  parameters: [...credentialParams, objectIdParam, propertiesOptionalParam],
  resource_mapping: createPropertyMappingMethod("tickets"),
  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const objectId = getString(args.parameters, "object_id")
    if (!objectId) throw new Error("object_id is required")
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}
    try {
      const result = await client.crm.tickets.basicApi.update(objectId, {
        properties,
      })
      return { success: true, object: result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
