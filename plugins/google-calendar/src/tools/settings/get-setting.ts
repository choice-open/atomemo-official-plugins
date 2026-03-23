import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const getSettingTool: ToolDefinition = {
  name: "get-setting",
  display_name: t("SETTINGS_GET_DISPLAY_NAME"),
  description: t("SETTINGS_GET_DESCRIPTION"),
  icon: "⚙️",
  parameters: [
    calendarCredentialParam,
    {
      name: "setting_id",
      type: "string",
      required: true,
      display_name: t("SETTING_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("SETTING_ID_HINT"),
        placeholder: t("SETTING_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { setting_id } = args.parameters

    const res = await client.settings.get({
      setting: setting_id as string,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
