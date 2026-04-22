// API docs: https://developers.hubspot.com/docs/api-reference/legacy/crm/using-object-apis
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { createPropertyMappingMethod } from "../../_shared/methods"
import {
  credentialParams,
  genericObjectPropertiesOptionalParam,
  idPropertyParam,
  objectIdParam,
  objectTypeParam,
  upsertParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getBoolean,
  getHubSpotClient,
  getString,
  handleHubSpotError,
  resolveResourceMapper,
  toJsonValue,
} from "../../_shared/utils"

export const updateCrmObjectTool = {
  name: "hubspot-update-crm-object",
  display_name: t("UPDATE_CRM_OBJECT_DISPLAY_NAME"),
  description: t("UPDATE_CRM_OBJECT_DESCRIPTION"),
  icon: "🔷",
  skill: "",
  parameters: [
    ...credentialParams,
    objectTypeParam,
    objectIdParam,
    genericObjectPropertiesOptionalParam,
    upsertParam,
    idPropertyParam,
  ],
  resource_mapping: createPropertyMappingMethod(""),

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const objectType = getString(args.parameters, "object_type")
    if (!objectType) throw new Error("object_type is required")
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}
    const useUpsert = getBoolean(args.parameters, "upsert") ?? false

    try {
      if (useUpsert) {
        const idProperty = getString(args.parameters, "id_property")
        const objectId = getString(args.parameters, "object_id")
        if (!idProperty || !objectId) {
          throw new Error(
            "Both object_id (as lookup value) and id_property are required for upsert mode",
          )
        }
        const response = await client.crm.objects.batchApi.upsert(objectType, {
          inputs: [{ idProperty, id: objectId, properties }],
        })
        return toJsonValue({
          success: true,
          object: response.results[0],
          upserted: true,
        })
      }

      const objectId = getString(args.parameters, "object_id")
      if (!objectId) throw new Error("object_id is required")
      const result = await client.crm.objects.basicApi.update(
        objectType,
        objectId,
        { properties },
      )
      return toJsonValue({ success: true, object: result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
