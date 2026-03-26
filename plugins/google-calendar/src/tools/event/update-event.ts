import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParam,
  eventIdParam,
  updateEventParams,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import {
  dateOnlySchema,
  optionalIanaTimezoneSchema,
  rfc3339Schema,
} from "../../lib/validators"

export const updateEventTool: ToolDefinition = {
  name: "update-event",
  display_name: t("UPDATE_EVENT_DISPLAY_NAME"),
  description: t("UPDATE_EVENT_DESCRIPTION"),
  icon: "✏️",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    eventIdParam,
    ...updateEventParams,
  ],
  async invoke({ args }) {
    const calendar = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const {
      calendar_id,
      event_id,
      summary,
      description,
      location,
      is_all_day_event,
      start_datetime,
      end_datetime,
      start_date,
      end_date,
      timezone,
      send_updates,
      visibility,
      transparency,
      status,
      color_id,
      recurrence,
      attendees,
      use_advanced_options,
      guests_can_invite_others,
      guests_can_modify,
      guests_can_see_other_guests,
      max_attendees,
    } = args.parameters

    const tz = optionalIanaTimezoneSchema.parse(timezone) ?? "UTC"

    const body: Record<string, unknown> = {}
    if (summary !== undefined) body.summary = summary
    if (description !== undefined) body.description = description
    if (location !== undefined) body.location = location

    if (is_all_day_event && start_date && end_date) {
      const sd = dateOnlySchema.parse(start_date)
      const ed = dateOnlySchema.parse(end_date)
      if (new Date(sd) >= new Date(ed)) {
        throw new Error("end_date must be after start_date")
      }
      body.start = { date: sd, timeZone: null, dateTime: null }
      body.end = { date: ed, timeZone: null, dateTime: null }
    } else if (start_datetime && end_datetime) {
      const sdt = rfc3339Schema.parse(start_datetime)
      const edt = rfc3339Schema.parse(end_datetime)
      if (new Date(sdt) >= new Date(edt)) {
        throw new Error("end_datetime must be after start_datetime")
      }
      body.start = { dateTime: sdt, timeZone: tz, date: null }
      body.end = { dateTime: edt, timeZone: tz, date: null }
    }
    if (visibility !== undefined) body.visibility = visibility
    if (transparency !== undefined) body.transparency = transparency
    if (status !== undefined) body.status = status
    if (color_id !== undefined) body.colorId = color_id
    if (recurrence) {
      const rules = (recurrence as string)
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean)
      body.recurrence = rules
    }
    if (attendees) {
      const emails = (attendees as string)
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
      body.attendees = emails.map((email) => ({ email }))
    }

    if (use_advanced_options) {
      body.guestsCanInviteOthers = guests_can_invite_others as boolean
      body.guestsCanModify = guests_can_modify as boolean
      body.guestsCanSeeOtherGuests = guests_can_see_other_guests as boolean
    }

    const maxAttendees =
      use_advanced_options &&
      typeof max_attendees === "number" &&
      max_attendees >= 1
        ? max_attendees
        : undefined

    const res = await calendar.events.patch({
      calendarId: calendar_id as string,
      eventId: event_id as string,
      sendUpdates: (send_updates as string) || undefined,
      maxAttendees,
      requestBody: body,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
