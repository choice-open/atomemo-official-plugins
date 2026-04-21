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
} from "../../_shared/utils"

export const createTicketTool = {
  name: "hubspot-create-ticket",
  display_name: t("CREATE_TICKET_DISPLAY_NAME"),
  description: t("CREATE_TICKET_DESCRIPTION"),
  icon: "🎫",
  skill: "",
  parameters: [...credentialParams, propertiesParam],
  resource_mapping: createPropertyMappingMethod("tickets"),
  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}
    try {
      const result = await client.crm.tickets.basicApi.create({
        properties,
        associations: [],
      })
      return { success: true, object: result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
