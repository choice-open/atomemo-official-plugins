import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getApprovalTemplateSkill from "./get-approval-template-skill.md" with { type: "text" }

type ApprovalTemplateResponse = {
  errcode?: number
  errmsg?: string
  template?: {
    template_id?: string
    title?: string
    icon?: string
    creator?: string
    create_time?: number
    updater?: string
    update_time?: number
    deploy_status?: number
    tags?: string[]
    controls?: Array<{
      id?: string
      title?: string
      type?: string
      require?: number
      value?: string
    }>
  }
}

export const getApprovalTemplateTool: ToolDefinition = {
  name: "wechat-work-get-approval-template",
  display_name: {
    en_US: "Get approval template",
    zh_Hans: "获取审批模板",
  },
  description: {
    en_US: "Get approval template details by template ID.",
    zh_Hans: "根据模板ID获取审批模板详情。",
  },
  skill: getApprovalTemplateSkill,
  icon: "📄",
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
      name: "template_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Template ID",
        zh_Hans: "模板 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Approval template ID",
          zh_Hans: "审批模板 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      template_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const template_id = params.template_id?.trim()
    if (!template_id) {
      throw new Error("Template ID is required.")
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

    const data = await wechatWorkGetJson<ApprovalTemplateResponse>(
      "/oa/get_template",
      token,
      { template_id },
    )

    return data
  },
}