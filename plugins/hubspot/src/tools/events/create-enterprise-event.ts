// API docs: https://developers.hubspot.com/docs/api-reference/legacy/events/send-event-data/guide
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { credentialParams } from "../_shared/parameters"
import type { ToolArgs } from "../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
  resolveStringMap,
  toJsonValue,
} from "../_shared/utils"

export const createEnterpriseEventTool = {
  name: "hubspot-create-enterprise-event",
  display_name: t("CREATE_ENTERPRISE_EVENT_DISPLAY_NAME"),
  description: t("CREATE_ENTERPRISE_EVENT_DESCRIPTION"),
  icon: "📊",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "event_name",
      type: "string",
      required: true,
      display_name: t("PARAM_EVENT_NAME_LABEL"),
      ai: { llm_description: t("PARAM_EVENT_NAME_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_EVENT_NAME_HINT"),
        placeholder: t("PARAM_EVENT_NAME_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "email",
      type: "string",
      required: false,
      display_name: t("PARAM_EVENT_EMAIL_LABEL"),
      ai: { llm_description: t("PARAM_EVENT_EMAIL_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_EVENT_EMAIL_HINT"),
        support_expression: true,
      },
    },
    {
      name: "properties",
      type: "array",
      required: false,
      display_name: t("PARAM_EVENT_PROPERTIES_LABEL"),
      ai: { llm_description: t("PARAM_EVENT_PROPERTIES_HINT") },
      ui: { component: "key-value-editor", hint: t("PARAM_EVENT_PROPERTIES_HINT") },
      items: {
        type: "object",
        name: "property",
        properties: [
          {
            name: "key",
            type: "string",
            required: true,
            display_name: t("PARAM_EVENT_PROPERTY_NAME_LABEL"),
          },
          {
            name: "value",
            type: "string",
            required: true,
            display_name: t("PARAM_EVENT_PROPERTY_VALUE_LABEL"),
            ui: { component: "textarea", support_expression: true },
          },
        ],
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const eventName = getString(args.parameters, "event_name")
    if (!eventName) throw new Error("event_name is required")

    const body: Record<string, unknown> = { eventName }
    const email = getString(args.parameters, "email")
    if (email) body.email = email
    const properties = resolveStringMap(args.parameters.properties)
    if (properties) body.properties = properties

    try {
      const response = await client.apiRequest({
        method: "POST",
        path: "/events/v3/send",
        body,
      })
      const result = await response.json()
      return toJsonValue({ success: true, result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
