import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import demoSkill from "./demo-skill.md" with { type: "text" }

export const demoTool = {
  name: "demo-tool",
  display_name: t("DEMO_TOOL_DISPLAY_NAME"),
  description: t("DEMO_TOOL_DESCRIPTION"),
  skill: demoSkill,
  icon: "🧰",
  parameters: [
    {
      name: "location",
      type: "string",
      required: true,
      display_name: t("LOCATION_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("LOCATION_HINT"),
        placeholder: t("LOCATION_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "microsoft-365-oauth2",
      display_name: t("DEMO_CREDENTIAL_DISPLAY_NAME"),
      ui: {
        component: "credential-select",
        hint: t("DEMO_CREDENTIAL_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const selectedCredentialId = String(args.parameters.credential_id ?? "")
    const credentialFromSelectedId =
      args.credentials?.[selectedCredentialId as keyof typeof args.credentials]
    const credentialFromParameterName = args.credentials?.credential_id
    const credential = credentialFromSelectedId ?? credentialFromParameterName

    return {
      message: `Testing the plugin with location: ${args.parameters.location}`,
      selected_credential_id: selectedCredentialId,
      has_access_token: Boolean(credential?.access_token),
    }
  },
} satisfies ToolDefinition
