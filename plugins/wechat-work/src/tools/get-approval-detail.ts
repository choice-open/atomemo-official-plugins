import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getApprovalDetailSkill from "./get-approval-detail-skill.md" with { type: "text" }

type ApprovalDetailResponse = {
  errcode?: number
  errmsg?: string
  apply_data?: {
    creator?: string
    create_time?: number
    title?: string
    apply_data?: Record<string, unknown>
    leave_info?: Record<string, unknown>
    expense_info?: Record<string, unknown>
    project_info?: Record<string, unknown>
  }
  approval_data?: {
    sp_status?: number
    sp_name?: string
    Approver?: Array<{
      userid?: string
      time?: number
      nodeid?: number
      status?: number
    }>
    notify?: Array<{
      userid?: number
      time?: number
    }>
  }
}

export const getApprovalDetailTool: ToolDefinition = {
  name: "wechat-work-get-approval-detail",
  display_name: {
    en_US: "Get approval detail",
    zh_Hans: "获取审批详情",
  },
  description: {
    en_US: "Get approval application details by approval ID.",
    zh_Hans: "根据审批ID获取审批申请详情。",
  },
  skill: getApprovalDetailSkill,
  icon: "📋",
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
      name: "approval_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Approval ID",
        zh_Hans: "审批 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Approval application ID",
          zh_Hans: "审批申请 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      approval_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const approval_id = params.approval_id?.trim()
    if (!approval_id) {
      throw new Error("Approval ID is required.")
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

    const data = await wechatWorkGetJson<ApprovalDetailResponse>(
      "/oa/get_approval_detail",
      token,
      { approval_id },
    )

    return data
  },
}