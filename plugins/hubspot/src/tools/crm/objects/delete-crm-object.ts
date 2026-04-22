// API docs: https://developers.hubspot.com/docs/api-reference/legacy/crm/using-object-apis
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  credentialParams,
  objectIdParam,
  objectTypeParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
  toJsonValue,
} from "../../_shared/utils"

export const deleteCrmObjectTool = {
  name: "hubspot-delete-crm-object",
  display_name: t("DELETE_CRM_OBJECT_DISPLAY_NAME"),
  description: t("DELETE_CRM_OBJECT_DESCRIPTION"),
  icon: "🔷",
  skill: "",
  parameters: [...credentialParams, objectTypeParam, objectIdParam],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const objectType = getString(args.parameters, "object_type")
    if (!objectType) throw new Error("object_type is required")
    const objectId = getString(args.parameters, "object_id")
    if (!objectId) throw new Error("object_id is required")
    try {
      await client.crm.objects.basicApi.archive(objectType, objectId)
      return toJsonValue({
        success: true,
        deleted: true,
        id: objectId,
      })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
