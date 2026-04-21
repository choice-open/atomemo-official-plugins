// API docs: https://developers.hubspot.com/docs/api/crm/engagements
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { createPropertyMappingMethod } from "../../_shared/methods"
import { credentialParams } from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
  resolveResourceMapper,
} from "../../_shared/utils"

const ENGAGEMENT_TYPE_MAP: Record<string, string> = {
  call: "calls",
  email: "emails",
  meeting: "meetings",
  task: "tasks",
  note: "notes",
}

export const createEngagementTool = {
  name: "hubspot-create-engagement",
  display_name: t("CREATE_ENGAGEMENT_DISPLAY_NAME"),
  description: t("CREATE_ENGAGEMENT_DESCRIPTION"),
  icon: "📞",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "engagement_type",
      type: "string",
      required: true,
      display_name: t("PARAM_ENGAGEMENT_TYPE_LABEL"),
      ai: { llm_description: t("PARAM_ENGAGEMENT_TYPE_HINT") },
      ui: {
        component: "select",
        options: [
          { label: t("ENGAGEMENT_TYPE_CALL"), value: "call" },
          { label: t("ENGAGEMENT_TYPE_EMAIL"), value: "email" },
          { label: t("ENGAGEMENT_TYPE_MEETING"), value: "meeting" },
          { label: t("ENGAGEMENT_TYPE_TASK"), value: "task" },
          { label: t("ENGAGEMENT_TYPE_NOTE"), value: "note" },
        ],
      },
    },
    {
      name: "properties",
      type: "resource_mapper",
      required: true,
      display_name: t("PARAM_ENGAGEMENT_PROPERTIES_LABEL"),
      ai: { llm_description: t("PARAM_ENGAGEMENT_PROPERTIES_HINT") },
      mapping_method: "map_object_properties",
    },
  ],
  // Dynamic mapping — resolves the engagement subtype at runtime
  resource_mapping: {
    async map_object_properties({ args }) {
      const engagementType =
        getString(args.parameters, "engagement_type") ?? "calls"
      const objectType = ENGAGEMENT_TYPE_MAP[engagementType] ?? engagementType
      const method = createPropertyMappingMethod(objectType)
      return method.map_object_properties({ args })
    },
  },

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const engagementType = getString(args.parameters, "engagement_type")
    if (!engagementType) throw new Error("engagement_type is required")
    const objectType = ENGAGEMENT_TYPE_MAP[engagementType]
    if (!objectType)
      throw new Error(`Invalid engagement type: ${engagementType}`)
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}
    try {
      const result = await client.crm.objects.basicApi.create(objectType, {
        properties,
        associations: [],
      })
      return {
        success: true,
        engagement: result,
        type: engagementType,
      } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
