import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import hubspotPluginStatusSkill from "./hubspot-plugin-status-skill.md" with { type: "text" }

export const hubspotPluginStatusTool = {
  name: "hubspot-plugin-status",
  display_name: t("HUBSPOT_PLUGIN_STATUS_DISPLAY_NAME"),
  description: t("HUBSPOT_PLUGIN_STATUS_DESCRIPTION"),
  skill: hubspotPluginStatusSkill,
  icon: "🧡",
  parameters: [],
  async invoke(): Promise<JsonValue> {
    return {
      status: "scaffold_only",
      plugin: "hubspot",
      credentials_configured: false,
      planned_resources: [
        "contact",
        "company",
        "contactList",
        "deal",
        "engagement",
        "ticket",
      ],
      planned_auth: ["oauth2", "private_app_token"],
      note: "No real HubSpot operations are implemented yet.",
    }
  },
} satisfies ToolDefinition
