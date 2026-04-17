import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import handleReportSkill from "./handle-report-skill.md" with {
  type: "text",
}

type HandleReportResponse = {
  errcode?: number
  errmsg?: string
}

type HandleReportRequest = {
  order_id: string
  action_type: number
  assign_userid?: string
  process_desc?: string
  image_urls?: string[]
}

export const handleReportTool: ToolDefinition = {
  name: "wechat-work-handle-report",
  display_name: {
    en_US: "Handle report",
    zh_Hans: "处理上报",
  },
  description: {
    en_US: "Handle (accept, assign, reject, or complete) a report in WeChat Work.",
    zh_Hans: "在企业微信中处理（受理、分配、拒绝、办结）上报。",
  },
  skill: handleReportSkill,
  icon: "✅",
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
      name: "order_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Order ID",
        zh_Hans: "工单ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The order ID to handle",
          zh_Hans: "要处理的工单ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "action_type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Action type",
        zh_Hans: "处理动作",
      },
      ui: {
        component: "select",
        options: [
          { label: { en_US: "Accept (2)", zh_Hans: "受理 (2)" }, value: "2" },
          { label: { en_US: "Assign (3)", zh_Hans: "分配 (3)" }, value: "3" },
          { label: { en_US: "Transfer (4)", zh_Hans: "转交 (4)" }, value: "4" },
          { label: { en_US: "Complete (5)", zh_Hans: "办结 (5)" }, value: "5" },
          { label: { en_US: "Reject (6)", zh_Hans: "拒绝 (6)" }, value: "6" },
          { label: { en_US: "Processing (7)", zh_Hans: "办理中 (7)" }, value: "7" },
        ],
        hint: {
          en_US: "Action type: 2-Accept, 3-Assign, 4-Transfer, 5-Complete, 6-Reject, 7-Processing",
          zh_Hans: "处理动作：2-受理，3-分配，4-转交，5-办结，6-拒绝，7-办理中",
        },
        width: "full",
      },
    },
    {
      name: "assign_userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "Assign userid",
        zh_Hans: "分配userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "User ID to assign (required for action type 3 or 4)",
          zh_Hans: "分配给的用户ID（动作类型为3或4时必填）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "process_desc",
      type: "string",
      required: false,
      display_name: {
        en_US: "Process description",
        zh_Hans: "处理描述",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Description of the handling process",
          zh_Hans: "处理过程描述",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "image_urls",
      type: "string",
      required: false,
      display_name: {
        en_US: "Process image URLs",
        zh_Hans: "处理图片URL列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated process image URLs",
          zh_Hans: "处理过程图片URL列表，逗号分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      order_id?: string
      action_type?: string
      assign_userid?: string
      process_desc?: string
      image_urls?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const orderId = typeof params.order_id === "string" ? params.order_id.trim() : ""
    if (!orderId) {
      throw new Error("Order ID is required.")
    }
    const actionType = params.action_type?.trim()
    if (!actionType || !["2", "3", "4", "5", "6", "7"].includes(actionType)) {
      throw new Error("Valid action type is required (2-Accept, 3-Assign, 4-Transfer, 5-Complete, 6-Reject, 7-Processing).")
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

    const body: HandleReportRequest = {
      order_id: orderId,
      action_type: parseInt(actionType, 10),
    }
    const assignUserid = params.assign_userid?.trim()
    if (assignUserid) {
      body.assign_userid = assignUserid
    }
    const processDesc = params.process_desc?.trim()
    if (processDesc) {
      body.process_desc = processDesc
    }
    const imageUrls = params.image_urls?.trim()
    if (imageUrls) {
      body.image_urls = imageUrls.split(",").map((s) => s.trim()).filter(Boolean)
    }

    await wechatWorkPostJson<HandleReportResponse>(
      "/report/resident/deal",
      token,
      body,
    )
    return { success: true }
  },
}
