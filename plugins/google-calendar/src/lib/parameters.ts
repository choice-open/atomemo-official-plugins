import type { Property } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const calendarCredentialParam = {
  name: "credential_id",
  type: "credential_id" as const,
  required: true,
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  credential_name: "google-calendar-oauth2",
  ui: { component: "credential-select" as const },
} satisfies Property<"credential_id">

export const calendarIdParam: Property<"calendar_id"> = {
  name: "calendar_id",
  type: "string" as const,
  required: true,
  display_name: t("CALENDAR_ID_DISPLAY_NAME"),
  default: "primary",
  ui: {
    component: "input" as const,
    hint: t("CALENDAR_ID_HINT"),
    placeholder: t("CALENDAR_ID_PLACEHOLDER"),
    support_expression: true,
    width: "full",
  },
}