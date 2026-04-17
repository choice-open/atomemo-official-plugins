import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createPaymentSkill from "./create-payment-skill.md" with { type: "text" }

type CreatePaymentResponse = {
  errcode?: number
  errmsg?: string
  payment_id?: string
}

export const createPaymentTool: ToolDefinition = {
  name: "wechat-work-create-payment",
  display_name: {
    en_US: "Create class payment",
    zh_Hans: "创建班级收款",
  },
  description: {
    en_US: "Create a class payment collection.",
    zh_Hans: "创建班级收款。",
  },
  skill: createPaymentSkill,
  icon: "💰",
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
      name: "school_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "School ID",
        zh_Hans: "学校ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "School ID from education management console",
          zh_Hans: "家校管理后台的学校ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "title",
      type: "string",
      required: true,
      display_name: {
        en_US: "Title",
        zh_Hans: "收款标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Payment collection title",
          zh_Hans: "收款标题",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "amount",
      type: "number",
      required: true,
      display_name: {
        en_US: "Amount (in cents)",
        zh_Hans: "金额（分）",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "Payment amount in cents",
          zh_Hans: "收款金额，单位：分",
        },
      },
    },
    {
      name: "description",
      type: "string",
      required: false,
      display_name: {
        en_US: "Description",
        zh_Hans: "描述",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Payment description",
          zh_Hans: "收款描述",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      school_id?: string
      title?: string
      amount?: number
      description?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const schoolId = params.school_id?.trim()
    const title = params.title?.trim()
    const amount = params.amount

    if (!schoolId || !title || !amount) {
      throw new Error("school_id, title, and amount are required.")
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
      school_id: schoolId,
      title,
      amount,
    }

    const description = params.description?.trim()
    if (description) body.description = description

    const data = await wechatWorkPostJson<CreatePaymentResponse>(
      "/school/payment/create",
      token,
      body,
    )

    const result: { errcode?: number; errmsg?: string; payment_id?: string } = {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
    if (data.payment_id) result.payment_id = data.payment_id

    return result
  },
}