// API docs: https://developers.hubspot.com/docs/api-reference/legacy/crm/using-object-apis
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  associationsParam,
  credentialParams,
  objectIdParam,
  objectTypeParam,
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

export const getCrmObjectTool = {
  name: "hubspot-get-crm-object",
  display_name: t("GET_CRM_OBJECT_DISPLAY_NAME"),
  description: t("GET_CRM_OBJECT_DESCRIPTION"),
  icon: "🔷",
  skill: "",
  parameters: [
    ...credentialParams,
    objectTypeParam,
    objectIdParam,
    returnPropertiesParam,
    associationsParam,
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const objectType = getString(args.parameters, "object_type")
    if (!objectType) throw new Error("object_type is required")
    const objectId = getString(args.parameters, "object_id")
    if (!objectId) throw new Error("object_id is required")

    const properties = getStringArray(args.parameters, "return_properties")
    const associations = getStringArray(args.parameters, "return_associations")

    try {
      const result = await client.crm.objects.basicApi.getById(
        objectType,
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
