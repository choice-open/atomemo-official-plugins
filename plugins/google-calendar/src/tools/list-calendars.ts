import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createCalendarClient } from "../lib/calendar-client"
import type { GoogleCalendarCredential } from "../lib/calendar-client"
import { t } from "../i18n/i18n-node"

export const listCalendarsTool = {
  name: "list-calendars",
  display_name: t("LIST_CALENDARS_DISPLAY_NAME"),
  description: t("LIST_CALENDARS_DESCRIPTION"),
  icon: "📆",
  parameters: [
    {
      name: "credential",
      type: "credential_id",
      required: true,
      display_name: t("CREDENTIAL_DISPLAY_NAME"),
      credential_name: "google-calendar-oauth2",
    },
  ],
  async invoke({ args }) {
    const cred = args.credentials.credential as GoogleCalendarCredential

    const calendar = createCalendarClient(cred)
    const res = await calendar.calendarList.list()

    const calendars = (res.data.items ?? []).map((c) => ({
      id: c.id,
      summary: c.summary,
      summaryOverride: c.summaryOverride,
      description: c.description,
      primary: c.primary,
      accessRole: c.accessRole,
      backgroundColor: c.backgroundColor,
      foregroundColor: c.foregroundColor,
    }))

    return {
      calendars,
      count: calendars.length,
    }
  },
} satisfies ToolDefinition
