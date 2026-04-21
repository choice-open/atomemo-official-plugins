// API docs: https://developers.hubspot.com/docs/api/crm/objects
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
  handleHubSpotError,
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

    const returnProps = getString(args.parameters, "return_properties")
    const properties = returnProps
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const returnAssoc = getString(args.parameters, "return_associations")
    const associations = returnAssoc
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      const result = await client.crm.objects.basicApi.getById(
        objectType,
        objectId,
        properties,
        undefined,
        associations,
      )
      return { success: true, object: result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
