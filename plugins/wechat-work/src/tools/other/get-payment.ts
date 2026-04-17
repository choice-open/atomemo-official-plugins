import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getPaymentSkill from "./get-payment-skill.md" with { type: "text" }

type PaymentInfo = {
  payment_id: string
  school_id: string
  title: string
  amount: number
  description?: string
  creator_userid: string
  create_time: number
  status: number
  pay_info?: Array<{
    userid: string
    name: string
    pay_time?: number
  }>
  total_count?: number
  pay_count?: number
  no_pay_count?: number
}

type GetPaymentResponse = {
  errcode?: number
  errmsg?: string
  payment_info?: PaymentInfo
}

export const getPaymentTool: ToolDefinition = {
  name: "wechat-work-get-payment",
  display_name: {
    en_US: "Get payment details",
    zh_Hans: "获取收款详情",
  },
  description: {
    en_US: "Get the details of a class payment collection.",
    zh_Hans: "获取班级收款详情。",
  },
  skill: getPaymentSkill,
  icon: "💳",
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
      name: "payment_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Payment ID",
        zh_Hans: "收款ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The payment collection ID",
          zh_Hans: "收款ID",
        },
        support_expression: true,
        width: "full",
      },
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
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      payment_id?: string
      school_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const paymentId = params.payment_id?.trim()
    const schoolId = params.school_id?.trim()

    if (!paymentId || !schoolId) {
      throw new Error("payment_id and school_id are required.")
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

    const extraParams: Record<string, string> = {
      payment_id: paymentId,
      school_id: schoolId,
    }

    const data = await wechatWorkGetJson<GetPaymentResponse>(
      "/school/payment/get",
      token,
      extraParams,
    )
    return data.payment_info ?? null
  },
}