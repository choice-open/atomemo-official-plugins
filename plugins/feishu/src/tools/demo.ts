import type {
  PropertyCredentialId,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

const credentialParameter: PropertyCredentialId<"credentialId"> = {
  name: "credentialId",
  type: "credential_id",
  credential_name: "feishu-app-credential",
  display_name: {
    en_US: "Credential",
    zh_Hans: "凭证",
  },
  required: true,
  ui: {
    component: "credential-select",
  },
}

export const demoTool = {
  name: "send_feishu_webhook_message",
  skill: "send.feishu.webhook.message",
  display_name: t("DEMO_TOOL_DISPLAY_NAME"),
  description: t("DEMO_TOOL_DESCRIPTION"),
  icon: "📨",
  parameters: [
    credentialParameter,
    {
      name: "webhook_url",
      type: "string",
      required: true,
      display_name: t("LOCATION_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("LOCATION_HINT"),
        placeholder: t("LOCATION_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "text",
      type: "string",
      required: true,
      display_name: {
        en_US: "Message Text",
        zh_Hans: "消息内容",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Text content to send to the Feishu group bot",
          zh_Hans: "发送到飞书群机器人的文本内容",
        },
        placeholder: {
          en_US: "Hello from Atomemo",
          zh_Hans: "来自 Atomemo 的问候",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const parameters =
      args.parameters &&
      typeof args.parameters === "object" &&
      !Array.isArray(args.parameters)
        ? (args.parameters as Record<string, unknown>)
        : {}
    const credentials =
      args.credentials &&
      typeof args.credentials === "object" &&
      !Array.isArray(args.credentials)
        ? (args.credentials as Record<string, unknown>)
        : {}

    const credentialId = String(parameters.credentialId ?? "").trim()
    const webhookUrl = String(parameters.webhook_url ?? "").trim()
    const text = String(parameters.text ?? "").trim()

    if (!credentialId) {
      throw new Error("Missing credentialId")
    }
    if (!webhookUrl) {
      throw new Error("Parameter `webhook_url` is required.")
    }
    if (!text) {
      throw new Error("Parameter `text` is required.")
    }

    const credentialValue = credentials[credentialId]
    const credential =
      credentialValue &&
      typeof credentialValue === "object" &&
      !Array.isArray(credentialValue)
        ? (credentialValue as Record<string, unknown>)
        : {}
    const appId = String(credential.app_id ?? "").trim()
    const appSecret = String(credential.app_secret ?? "").trim()

    if (!appId || !appSecret) {
      throw new Error(
        "Selected credential is invalid: missing app_id or app_secret",
      )
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        msg_type: "text",
        content: {
          text,
        },
      }),
    })

    const bodyText = await response.text()
    let payload: unknown = bodyText
    try {
      payload = bodyText ? JSON.parse(bodyText) : null
    } catch {
      payload = bodyText
    }

    if (!response.ok) {
      throw new Error(
        `Feishu webhook request failed with HTTP ${response.status}: ${bodyText}`,
      )
    }

    return {
      message: "Feishu webhook message sent successfully",
      webhook_url: webhookUrl,
      request_payload: {
        msg_type: "text",
        content: { text },
      },
      response_raw: JSON.stringify(payload),
    }
  },
} satisfies ToolDefinition
