import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gmailOAuthCredential = {
  name: "gmail-oauth",
  display_name: t("GMAIL_CREDENTIAL_DISPLAY_NAME"),
  description: t("GMAIL_CREDENTIAL_DESCRIPTION"),
  icon: "📧",
  parameters: [
    {
      name: "access_token",
      type: "encrypted_string",
      required: true,
      display_name: t("GMAIL_CREDENTIAL_ACCESS_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("GMAIL_CREDENTIAL_ACCESS_TOKEN_HINT"),
        placeholder: t("GMAIL_CREDENTIAL_ACCESS_TOKEN_PLACEHOLDER"),
        width: "full",
      },
    },
    {
      name: "refresh_token",
      type: "encrypted_string",
      required: false,
      display_name: t("GMAIL_CREDENTIAL_REFRESH_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("GMAIL_CREDENTIAL_REFRESH_TOKEN_HINT"),
        width: "full",
      },
    },
    {
      name: "client_id",
      type: "string",
      required: false,
      display_name: t("GMAIL_CREDENTIAL_CLIENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("GMAIL_CREDENTIAL_CLIENT_ID_HINT"),
        width: "full",
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: false,
      display_name: t("GMAIL_CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("GMAIL_CREDENTIAL_CLIENT_SECRET_HINT"),
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition

export type GmailCredential = {
  access_token: string
  refresh_token?: string
  client_id?: string
  client_secret?: string
}
