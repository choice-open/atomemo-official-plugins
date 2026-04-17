import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getCustomerServiceQrcodeSkill from "./get-customer-service-qrcode-skill.md" with { type: "text" }

type GetCustomerServiceQrcodeResponse = {
  errcode?: number
  errmsg?: string
  qrcode?: string
  url?: string
}

export const getCustomerServiceQrcodeTool: ToolDefinition = {
  name: "wechat-work-get-customer-service-qrcode",
  display_name: {
    en_US: "Get customer service qrcode",
    zh_Hans: "获取获客助手链接",
  },
  description: {
    en_US: "Get the customer service qrcode or link for acquisition.",
    zh_Hans: "获取获客助手的二维码或链接。",
  },
  skill: getCustomerServiceQrcodeSkill,
  icon: "📱",
  parameters: [
    {
      name: "wechat_work_credential",
      type: "credential_id",
      required: true,
      credential_name: "wechat-work",
      display_name: {
        en_US: "WeChat Work credential",
        zh_Hans: "企业微信凭证",
      },
      ui: { component: "credential-select" },
    },
    {
      name: "type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Type",
        zh_Hans: "类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Type of acquisition",
          zh_Hans: "获客类型",
        },
        options: [
          { label: "QR Code (1)", value: "1" },
          { label: "Link (2)", value: "2" },
        ],
      },
    },
    {
      name: "scene",
      type: "string",
      required: false,
      display_name: {
        en_US: "Scene",
        zh_Hans: "场景",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Contact scene",
          zh_Hans: "联系场景",
        },
        options: [
          { label: "Single customer (1)", value: "1" },
          { label: "Group chat (2)", value: "2" },
        ],
      },
    },
    {
      name: "way_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Contact way ID",
        zh_Hans: "联系我方式ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Contact way ID for the qrcode",
          zh_Hans: "联系我方式ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      type?: string
      scene?: string
      way_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const type = params.type?.trim()
    if (!type) {
      throw new Error("type is required.")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error(
        "Wechat work credential is missing or has no access_token.",
      )
    }

    const body: Record<string, unknown> = {
      type: parseInt(type, 10),
    }

    const scene = params.scene?.trim()
    if (scene) body.scene = parseInt(scene, 10)

    const wayId = params.way_id?.trim()
    if (wayId) body.way_id = wayId

    const data = await wechatWorkPostJson<GetCustomerServiceQrcodeResponse>(
      "/externalcontact/intelligence/get_qrcode",
      token,
      body,
    )
    return {
      qrcode: data.qrcode ?? "",
      url: data.url ?? "",
    }
  },
}