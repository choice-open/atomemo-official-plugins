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
