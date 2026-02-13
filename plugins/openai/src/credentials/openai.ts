import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const openaiCredential = {
  name: "openai-api-key",
  display_name: t("OPENAI_API_KEY_DISPLAY_NAME"),
  description: t("OPENAI_API_KEY_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "encrypted_string",
      required: true,
      display_name: t("OPENAI_API_KEY_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        hint: t("OPENAI_API_KEY_HINT"),
        placeholder: t("OPENAI_API_KEY_PLACEHOLDER"),
        width: "full",
      },
    },
    {
      name: "organization_id",
      type: "string",
      required: false,
      display_name: t("OPENAI_ORGANIZATION_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("OPENAI_ORGANIZATION_ID_HINT"),
        placeholder: t("OPENAI_ORGANIZATION_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "project_id",
      type: "string",
      required: false,
      display_name: t("OPENAI_PROJECT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("OPENAI_PROJECT_ID_HINT"),
        placeholder: t("OPENAI_PROJECT_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async authenticate({ args: { credential } }) {
    const headers = new Headers()
    headers.set("Authorization", `Bearer ${credential.api_key}`)

    if (typeof credential.organization_id === "string" && credential.organization_id !== "") {
      headers.set("OpenAI-Organization", credential.organization_id)
    }

    if (typeof credential.project_id === "string" && credential.project_id !== "") {
      headers.set("OpenAI-Project", credential.project_id)
    }

    const apiKey = credential.api_key ?? ""
    if(apiKey === "") {
      throw new Error("credential api_key is empty, please check your credential")
    }

    return {
      adapter: "openai",
      endpoint: "https://api.openai.com/v1/chat/completions",
      headers: Object.fromEntries(headers.entries()),
      api_key: apiKey,
    }
  },
} satisfies CredentialDefinition
