// API docs: https://developers.hubspot.com/docs/api/crm/line-items
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
  toJsonValue,
} from "../../_shared/utils"

export const updateLineItemTool = {
  name: "hubspot-update-line-item",
  display_name: t("UPDATE_LINE_ITEM_DISPLAY_NAME"),
  description: t("UPDATE_LINE_ITEM_DESCRIPTION"),
  icon: "📦",
  skill: "",
  parameters: [...credentialParams, objectIdParam, propertiesOptionalParam],
  resource_mapping: createPropertyMappingMethod("line_items"),

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const objectId = getString(args.parameters, "object_id")
    if (!objectId) throw new Error("object_id is required")
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}

    try {
      const result = await client.crm.lineItems.basicApi.update(objectId, {
        properties,
      })
      return toJsonValue({ success: true, object: result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
