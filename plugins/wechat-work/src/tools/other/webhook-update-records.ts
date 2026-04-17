import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"

type WebhookUpdateRecordsResponse = {
  errcode?: number
  errmsg?: string
  updated?: number
}

export const webhookUpdateRecordsTool: ToolDefinition = {
  name: "wechat-work-webhook-update-records",
  display_name: {
    en_US: "Webhook update smartsheet records",
    zh_Hans: "Webhook 更新记录",
  },
  description: {
    en_US: "Update records in a smartsheet via webhook from external systems.",
    zh_Hans: "通过 Webhook 从外部系统更新智能表格记录。",
  },
  icon: "🔄",
  parameters: [
    {
      name: "key",
      type: "string",
      required: true,
      display_name: {
        en_US: "Webhook key",
        zh_Hans: "Webhook key",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The webhook key for the smartsheet",
          zh_Hans: "智能表格的 Webhook key",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "data",
      type: "string",
      required: true,
      display_name: {
        en_US: "Data (JSON)",
        zh_Hans: "数据 (JSON)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON data to update existing records",
          zh_Hans: "要更新现有记录的 JSON 数据",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      key?: string
      data?: string
    }
    const key = params.key?.trim()
    if (!key) {
      throw new Error("Webhook key is required.")
    }
    const dataStr = params.data?.trim()
    if (!dataStr) {
      throw new Error("Data is required.")
    }

    let data: JsonValue
    try {
      data = JSON.parse(dataStr)
    } catch {
      throw new Error("Data must be a valid JSON string.")
    }

    const QYAPI_BASE = "https://qyapi.weixin.qq.com/cgi-bin"
    const url = new URL(`${QYAPI_BASE}/wedoc/smartsheet/webhook?key=${key}&action=update`)
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    })
    const result = (await res.json()) as WebhookUpdateRecordsResponse
    if (result.errcode !== 0 && result.errcode !== undefined) {
      throw new Error(result.errmsg ?? `Webhook error (errcode=${result.errcode})`)
    }
    return {
      updated: result.updated ?? 0,
      errcode: result.errcode ?? 0,
      errmsg: result.errmsg ?? "ok",
    }
  },
}
