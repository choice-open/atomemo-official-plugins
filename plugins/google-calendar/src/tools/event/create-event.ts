import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParam,
  updateEventParams,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import {
  dateOnlySchema,
  optionalIanaTimezoneSchema,
  rfc3339Schema,
} from "../../lib/validators"
import createEventSkill from "./create-event-skill.md" with { type: "text" }

export const createEventTool: ToolDefinition = {
  name: "create-event",
  display_name: t("CREATE_EVENT_DISPLAY_NAME"),
  description: t("CREATE_EVENT_DESCRIPTION"),
  skill: createEventSkill,
  icon: "➕",
  parameters: [calendarCredentialParam, calendarIdParam, ...updateEventParams],
  async invoke({ args }) {
    const calendar = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const params = args.parameters
    const {
      calendar_id,
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
    } = params

    const tz = optionalIanaTimezoneSchema.parse(timezone) ?? "UTC"

    const requestBody: Record<string, unknown> = {
      summary: summary as string,
      description: (description as string) || undefined,
      location: (location as string) || undefined,
    }

    if (is_all_day_event) {
      const sd = dateOnlySchema.parse(start_date)
      const ed = dateOnlySchema.parse(end_date)
      if (new Date(sd) >= new Date(ed)) {
        throw new Error("end_date must be after start_date")
      }
      requestBody.start = { date: sd }
      requestBody.end = { date: ed }
    } else {
      const sdt = rfc3339Schema.parse(start_datetime)
      const edt = rfc3339Schema.parse(end_datetime)
      if (new Date(sdt) >= new Date(edt)) {
        throw new Error("end_datetime must be after start_datetime")
      }
      requestBody.start = { dateTime: sdt, timeZone: tz }
      requestBody.end = { dateTime: edt, timeZone: tz }
    }

    if (visibility && visibility !== "default")
      requestBody.visibility = visibility
    if (transparency && transparency !== "opaque")
      requestBody.transparency = transparency
    if (status && status !== "confirmed") requestBody.status = status
    if (color_id) requestBody.colorId = color_id

    if (recurrence) {
      const rules = (recurrence as string)
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean)
      requestBody.recurrence = rules
    }

    if (attendees) {
      const emails = (attendees as string)
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
      requestBody.attendees = emails.map((email) => ({ email }))
    }

    if (use_advanced_options) {
      requestBody.guestsCanInviteOthers = guests_can_invite_others as boolean
      requestBody.guestsCanModify = guests_can_modify as boolean
      requestBody.guestsCanSeeOtherGuests =
        guests_can_see_other_guests as boolean
    }

    const maxAttendees =
      use_advanced_options &&
      typeof max_attendees === "number" &&
      max_attendees >= 1
        ? max_attendees
        : undefined

    const res = await calendar.events.insert({
      calendarId: calendar_id as string,
      sendUpdates: (send_updates as string) || undefined,
      maxAttendees,
      requestBody,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
