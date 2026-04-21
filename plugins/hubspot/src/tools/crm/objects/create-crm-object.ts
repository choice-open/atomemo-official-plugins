// API docs: https://developers.hubspot.com/docs/api-reference/legacy/crm/using-object-apis
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { createPropertyMappingMethod } from "../../_shared/methods"
import {
  credentialParams,
  objectTypeParam,
  propertiesParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
  resolveResourceMapper,
} from "../../_shared/utils"

export const createCrmObjectTool = {
  name: "hubspot-create-crm-object",
  display_name: t("CREATE_CRM_OBJECT_DISPLAY_NAME"),
  description: t("CREATE_CRM_OBJECT_DESCRIPTION"),
  icon: "🔷",
  skill: "",
  parameters: [...credentialParams, objectTypeParam, propertiesParam],
  resource_mapping: createPropertyMappingMethod(""),

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const objectType = getString(args.parameters, "object_type")
    if (!objectType) throw new Error("object_type is required")
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}
    try {
      const result = await client.crm.objects.basicApi.create(objectType, {
        properties,
        associations: [],
      })
      return { success: true, object: result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
