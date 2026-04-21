// API docs: https://developers.hubspot.com/docs/api/crm/products
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

export const createProductTool = {
  name: "hubspot-create-product",
  display_name: t("CREATE_PRODUCT_DISPLAY_NAME"),
  description: t("CREATE_PRODUCT_DESCRIPTION"),
  icon: "📦",
  skill: "",
  parameters: [...credentialParams, propertiesParam],
  resource_mapping: createPropertyMappingMethod("products"),

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}
    try {
      const result = await client.crm.products.basicApi.create({
        properties,
        associations: [],
      })
      return { success: true, object: result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
