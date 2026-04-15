import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { DINGTALK_APP_CREDENTIAL_NAME } from "../lib/dingtalk"
import { t } from "../lib/i18n"

export const dingtalkAppCredential = {
  name: DINGTALK_APP_CREDENTIAL_NAME,
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  description: t("CREDENTIAL_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "corp_id",
      type: "string",
      required: true,
      display_name: t("CREDENTIAL_CORP_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CREDENTIAL_CORP_ID_HINT"),
        placeholder: t("CREDENTIAL_CORP_ID_PLACEHOLDER"),
        width: "full",
      },
    },
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: t("CREDENTIAL_CLIENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CREDENTIAL_CLIENT_ID_HINT"),
        placeholder: t("CREDENTIAL_CLIENT_ID_PLACEHOLDER"),
        width: "full",
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: t("CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("CREDENTIAL_CLIENT_SECRET_HINT"),
        placeholder: t("CREDENTIAL_CLIENT_SECRET_PLACEHOLDER"),
        width: "full",
      },
    },
    {
      name: "user_union_id",
      type: "string",
      required: false,
      display_name: t("CREDENTIAL_USER_UNION_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CREDENTIAL_USER_UNION_ID_HINT"),
        placeholder: t("CREDENTIAL_USER_UNION_ID_PLACEHOLDER"),
        width: "full",
      },
    },
    {
      name: "agent_id",
      type: "string",
      required: true,
      display_name: t("CREDENTIAL_AGENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CREDENTIAL_AGENT_ID_HINT"),
        placeholder: t("CREDENTIAL_AGENT_ID_PLACEHOLDER"),
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition
