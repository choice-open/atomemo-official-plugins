// API docs: https://developers.hubspot.com/docs/api/crm/line-items
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

export const createLineItemTool = {
  name: "hubspot-create-line-item",
  display_name: t("CREATE_LINE_ITEM_DISPLAY_NAME"),
  description: t("CREATE_LINE_ITEM_DESCRIPTION"),
  icon: "📦",
  skill: "",
  parameters: [...credentialParams, propertiesParam],
  resource_mapping: createPropertyMappingMethod("line_items"),

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}
    try {
      const result = await client.crm.lineItems.basicApi.create({
        properties,
        associations: [],
      })
      return { success: true, object: result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
