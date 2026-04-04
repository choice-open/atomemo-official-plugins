import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import createCalendarEventSkill from "./create-calendar-event-skill.md" with {
  type: "text",
}

const GRAPH_ME_EVENTS = "https://graph.microsoft.com/v1.0/me/events"

function parseAttendeeEmails(raw: unknown): string[] {
  if (raw == null) return []
  const s = String(raw).trim()
  if (!s) return []
  return s
    .split(/[\s,;]+/u)
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
}

function isTeamsOnlineMeeting(raw: unknown): boolean {
  if (raw === true) return true
  if (typeof raw === "string") {
    const s = raw.trim().toLowerCase()
    return s === "true" || s === "1" || s === "yes"
  }
  return false
}

function resolveCredential(args: {
  parameters: Record<string, unknown>
  credentials?: Record<string, { access_token?: string } | undefined>
}) {
  const selectedCredentialId = String(args.parameters.credential_id ?? "")
  const credentialFromSelectedId =
    args.credentials?.[selectedCredentialId as keyof typeof args.credentials]
  const credentialFromParameterName = args.credentials?.credential_id
  return credentialFromSelectedId ?? credentialFromParameterName
}

export const createCalendarEventTool: ToolDefinition = {
  name: "create-calendar-event",
  display_name: t("M365_CREATE_EVENT_TOOL_DISPLAY_NAME"),
  description: t("M365_CREATE_EVENT_TOOL_DESCRIPTION"),
  skill: createCalendarEventSkill,
  icon: "📅",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "microsoft-365-oauth2",
      display_name: t("M365_CREATE_EVENT_CREDENTIAL_DISPLAY_NAME"),
      ui: {
        component: "credential-select",
        hint: t("M365_CREATE_EVENT_CREDENTIAL_HINT"),
        width: "full",
      },
    },
    {
      name: "subject",
      type: "string",
      required: true,
      display_name: t("M365_CREATE_EVENT_SUBJECT_DISPLAY_NAME"),
      ui: {
        component: "input",
        width: "full",
        placeholder: t("M365_CREATE_EVENT_SUBJECT_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "start_datetime",
      type: "string",
      required: true,
      display_name: t("M365_CREATE_EVENT_START_DISPLAY_NAME"),
      ui: {
        component: "input",
        width: "full",
        hint: t("M365_CREATE_EVENT_START_HINT"),
        placeholder: t("M365_CREATE_EVENT_START_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "end_datetime",
      type: "string",
      required: true,
      display_name: t("M365_CREATE_EVENT_END_DISPLAY_NAME"),
      ui: {
        component: "input",
        width: "full",
        hint: t("M365_CREATE_EVENT_END_HINT"),
        placeholder: t("M365_CREATE_EVENT_END_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "time_zone",
      type: "string",
      required: false,
      display_name: t("M365_CREATE_EVENT_TIME_ZONE_DISPLAY_NAME"),
      ui: {
        component: "input",
        width: "full",
        hint: t("M365_CREATE_EVENT_TIME_ZONE_HINT"),
        placeholder: t("M365_CREATE_EVENT_TIME_ZONE_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "location",
      type: "string",
      required: false,
      display_name: t("M365_CREATE_EVENT_LOCATION_DISPLAY_NAME"),
      ui: {
        component: "input",
        width: "full",
        hint: t("M365_CREATE_EVENT_LOCATION_HINT"),
        placeholder: t("M365_CREATE_EVENT_LOCATION_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "teams_online_meeting",
      type: "boolean",
      required: false,
      default: false,
      display_name: t("M365_CREATE_EVENT_TEAMS_MEETING_DISPLAY_NAME"),
      ui: {
        component: "switch",
        hint: t("M365_CREATE_EVENT_TEAMS_MEETING_HINT"),
        width: "full",
      },
    },
    {
      name: "attendees",
      type: "string",
      required: false,
      display_name: t("M365_CREATE_EVENT_ATTENDEES_DISPLAY_NAME"),
      display: {
        show: { teams_online_meeting: { $eq: true } },
      },
      ui: {
        component: "textarea",
        width: "full",
        hint: t("M365_CREATE_EVENT_ATTENDEES_HINT"),
        placeholder: t("M365_CREATE_EVENT_ATTENDEES_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "body",
      type: "string",
      required: false,
      display_name: t("M365_CREATE_EVENT_BODY_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        width: "full",
        hint: t("M365_CREATE_EVENT_BODY_HINT"),
        placeholder: t("M365_CREATE_EVENT_BODY_PLACEHOLDER"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const credential = resolveCredential(args)
    const token = credential?.access_token
    if (!token) {
      throw new Error(
        "Microsoft 365 credential is missing or has no access_token.",
      )
    }

    const subject = String(args.parameters.subject ?? "").trim()
    if (!subject) {
      throw new Error("subject is required.")
    }

    const startDatetime = String(args.parameters.start_datetime ?? "").trim()
    const endDatetime = String(args.parameters.end_datetime ?? "").trim()
    if (!startDatetime || !endDatetime) {
      throw new Error("start_datetime and end_datetime are required.")
    }

    const timeZone = String(args.parameters.time_zone ?? "").trim() || "UTC"
    const bodyText = String(args.parameters.body ?? "").trim()
    const locationName = String(args.parameters.location ?? "").trim()

    const payload: Record<string, unknown> = {
      subject,
      start: {
        dateTime: startDatetime,
        timeZone,
      },
      end: {
        dateTime: endDatetime,
        timeZone,
      },
    }

    if (bodyText) {
      payload.body = {
        contentType: "text",
        content: bodyText,
      }
    }

    if (locationName) {
      payload.location = { displayName: locationName }
    }

    if (isTeamsOnlineMeeting(args.parameters.teams_online_meeting)) {
      payload.isOnlineMeeting = true
      payload.onlineMeetingProvider = "teamsForBusiness"
    }

    const attendeeEmails = parseAttendeeEmails(args.parameters.attendees)
    if (attendeeEmails.length > 0) {
      payload.attendees = attendeeEmails.map((address) => ({
        emailAddress: { address },
        type: "required",
      }))
    }

    const response = await fetch(GRAPH_ME_EVENTS, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = (await response.json()) as Record<string, unknown>

    if (!response.ok) {
      const err = data.error
      const msg =
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
          ? (err as { message: string }).message
          : typeof data.error_description === "string"
            ? data.error_description
            : JSON.stringify(data)
      throw new Error(
        `Microsoft Graph create event failed (${response.status}): ${msg}`,
      )
    }

    return JSON.parse(
      JSON.stringify({
        id: data.id ?? null,
        subject: data.subject ?? null,
        webLink: data.webLink ?? null,
        start: data.start ?? null,
        end: data.end ?? null,
        onlineMeetingUrl: data.onlineMeetingUrl ?? null,
        onlineMeeting: data.onlineMeeting ?? null,
      }),
    )
  },
}
