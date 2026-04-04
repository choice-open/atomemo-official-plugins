import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Microsoft 365",
  PLUGIN_DESCRIPTION: "Connect to Microsoft Graph API",
  M365_CREDENTIAL_DISPLAY_NAME: "Microsoft 365 OAuth2",
  M365_CREDENTIAL_DESCRIPTION:
    "OAuth2 credential for accessing Microsoft Graph APIs.",
  M365_CLIENT_ID_DISPLAY_NAME: "Client ID",
  M365_CLIENT_ID_PLACEHOLDER:
    "Enter your Microsoft Entra application client ID",
  M365_CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  M365_CLIENT_SECRET_PLACEHOLDER:
    "Enter your Microsoft Entra application client secret",
  M365_TENANT_DISPLAY_NAME: "Tenant",
  M365_TENANT_HINT:
    "Choose common, organizations, consumers, or custom tenant.",
  M365_CUSTOM_TENANT_ID_DISPLAY_NAME: "Custom Tenant ID",
  M365_CUSTOM_TENANT_ID_PLACEHOLDER:
    "Enter your custom tenant ID (GUID or domain)",
  M365_CREATE_EVENT_TOOL_DISPLAY_NAME: "Create calendar event",
  M365_CREATE_EVENT_TOOL_DESCRIPTION:
    "Creates an event on your default Microsoft 365 calendar. Optionally add a Microsoft Teams link and invite attendees.",
  M365_CREATE_EVENT_CREDENTIAL_DISPLAY_NAME: "Credential",
  M365_CREATE_EVENT_CREDENTIAL_HINT:
    "Select a Microsoft 365 OAuth2 credential with a valid access token.",
  M365_CREATE_EVENT_SUBJECT_DISPLAY_NAME: "Subject",
  M365_CREATE_EVENT_SUBJECT_PLACEHOLDER: "Event title",
  M365_CREATE_EVENT_START_DISPLAY_NAME: "Start",
  M365_CREATE_EVENT_START_HINT:
    "Local start time for the chosen time zone (e.g. 2025-04-02T10:00:00).",
  M365_CREATE_EVENT_START_PLACEHOLDER: "2025-04-02T10:00:00",
  M365_CREATE_EVENT_END_DISPLAY_NAME: "End",
  M365_CREATE_EVENT_END_HINT: "Local end time for the chosen time zone.",
  M365_CREATE_EVENT_END_PLACEHOLDER: "2025-04-02T11:00:00",
  M365_CREATE_EVENT_TIME_ZONE_DISPLAY_NAME: "Time zone",
  M365_CREATE_EVENT_TIME_ZONE_HINT:
    "IANA (e.g. Europe/Berlin) or Windows name; empty means UTC.",
  M365_CREATE_EVENT_TIME_ZONE_PLACEHOLDER: "UTC",
  M365_CREATE_EVENT_BODY_DISPLAY_NAME: "Body",
  M365_CREATE_EVENT_BODY_HINT: "Optional plain-text description.",
  M365_CREATE_EVENT_BODY_PLACEHOLDER: "Notes…",
  M365_CREATE_EVENT_LOCATION_DISPLAY_NAME: "Location",
  M365_CREATE_EVENT_LOCATION_HINT:
    "Optional physical or online location label.",
  M365_CREATE_EVENT_LOCATION_PLACEHOLDER: "Room / address",
  M365_CREATE_EVENT_TEAMS_MEETING_DISPLAY_NAME: "Teams online meeting",
  M365_CREATE_EVENT_TEAMS_MEETING_HINT:
    "When enabled, creates a Microsoft Teams join link (teamsForBusiness) on the event.",
  M365_CREATE_EVENT_ATTENDEES_DISPLAY_NAME: "Attendees",
  M365_CREATE_EVENT_ATTENDEES_HINT:
    "Optional invitees: comma, semicolon, or whitespace-separated email addresses.",
  M365_CREATE_EVENT_ATTENDEES_PLACEHOLDER: "ada@contoso.com, bob@contoso.com",
} satisfies BaseTranslation

export default en_US
