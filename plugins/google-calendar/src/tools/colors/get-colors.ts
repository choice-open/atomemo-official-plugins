import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const getColorsTool: ToolDefinition = {
  name: "get-colors",
  display_name: t("COLORS_GET_DISPLAY_NAME"),
  description: t("COLORS_GET_DESCRIPTION"),
  icon: "🎨",
  parameters: [calendarCredentialParam],
  async invoke({ args }) {
    const client = requireCalendarClient(args.credentials, args.parameters.credential_id)

    const res = await client.colors.get()

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
