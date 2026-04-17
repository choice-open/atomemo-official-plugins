import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import submitApprovalSkill from "./submit-approval-skill.md" with { type: "text" }

type SubmitApprovalResponse = {
  errcode?: number
  errmsg?: string
  apply_id?: string
}

export const submitApprovalTool: ToolDefinition = {
  name: "wechat-work-submit-approval",
  display_name: {
    en_US: "Submit approval",
    zh_Hans: "提交审批",
  },
  description: {
    en_US: "Submit an approval application.",
    zh_Hans: "提交审批申请。",
  },
  skill: submitApprovalSkill,
  icon: "📝",
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
      name: "creator_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Creator userid",
        zh_Hans: "申请人 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The applicant's userid",
          zh_Hans: "申请人的 userid",
        },
        support_expression: true,
        width: "full",
      },
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
    {
      name: "use_template_approver",
      type: "string",
      required: false,
      display_name: {
        en_US: "Use template approver",
        zh_Hans: "使用模板审批人",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Use template's default approver",
          zh_Hans: "使用模板默认审批人",
        },
        options: [
          { label: { en_US: "Yes", zh_Hans: "是" }, value: "1" },
          { label: { en_US: "No", zh_Hans: "否" }, value: "0" },
        ],
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "apply_data",
      type: "string",
      required: true,
      display_name: {
        en_US: "Apply data",
        zh_Hans: "申请数据",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON object of apply data",
          zh_Hans: "申请数据的 JSON 对象",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "approver",
      type: "string",
      required: false,
      display_name: {
        en_US: "Approvers",
        zh_Hans: "审批人",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of approvers",
          zh_Hans: "审批人 JSON 数组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "notifyer",
      type: "string",
      required: false,
      display_name: {
        en_US: "CC users",
        zh_Hans: "抄送人",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of user IDs to CC",
          zh_Hans: "抄送人 userid JSON 数组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "notify_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "CC timing",
        zh_Hans: "抄送方式",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "When to send CC notification",
          zh_Hans: "何时发送抄送通知",
        },
        options: [
          { label: { en_US: "On submit (1)", zh_Hans: "提单时抄送 (1)" }, value: "1" },
          { label: { en_US: "After approve (2)", zh_Hans: "单据通过后抄送 (2)" }, value: "2" },
          { label: { en_US: "Both (3)", zh_Hans: "提单和通过后抄送 (3)" }, value: "3" },
        ],
      },
    },
    {
      name: "summary_list",
      type: "string",
      required: false,
      display_name: {
        en_US: "Summary list",
        zh_Hans: "审批摘要",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of summary info",
          zh_Hans: "审批摘要 JSON 数组",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      creator_userid?: string
      template_id?: string
      use_template_approver?: string
      apply_data?: string
      approver?: string
      notifyer?: string
      notify_type?: string
      summary_list?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const creator_userid = params.creator_userid?.trim()
    const template_id = params.template_id?.trim()
    const apply_data_str = params.apply_data?.trim()

    if (!creator_userid || !template_id || !apply_data_str) {
      throw new Error("Creator userid, template ID and apply data are required.")
    }

    let apply_data: unknown
    try {
      apply_data = JSON.parse(apply_data_str)
    } catch {
      throw new Error("Apply data must be a valid JSON object.")
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
      creator_userid,
      template_id,
      apply_data,
    }

    const use_template_approver = params.use_template_approver?.trim()
    if (use_template_approver) {
      body.use_template_approver = parseInt(use_template_approver, 10)
    }

    const approverStr = params.approver?.trim()
    if (approverStr) {
      try {
        body.approver = JSON.parse(approverStr)
      } catch {
        throw new Error("Approver must be a valid JSON array.")
      }
    }

    const notifyerStr = params.notifyer?.trim()
    if (notifyerStr) {
      try {
        body.notifyer = JSON.parse(notifyerStr)
      } catch {
        throw new Error("Notifyer must be a valid JSON array.")
      }
    }

    const notify_type = params.notify_type?.trim()
    if (notify_type) {
      body.notify_type = parseInt(notify_type, 10)
    }

    const summary_list_str = params.summary_list?.trim()
    if (summary_list_str) {
      try {
        body.summary_list = JSON.parse(summary_list_str)
      } catch {
        throw new Error("Summary list must be a valid JSON array.")
      }
    }

    const data = await wechatWorkPostJson<SubmitApprovalResponse>(
      "/oa/apply_event",
      token,
      body,
    )

    const result: { errcode?: number; errmsg?: string; sp_no?: string } = {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
    if (data.apply_id) result.sp_no = data.apply_id

    return result
  },
}