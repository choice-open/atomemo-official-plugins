import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import transferCustomerSkill from "./transfer-customer-skill.md" with { type: "text" }

type TransferCustomerResponse = {
  errcode?: number
  errmsg?: string
  next_cursor?: string
  transferred?: Array<{
    external_userid: string
    errcode: number
  }>
  not_transferred?: Array<{
    external_userid: string
    errcode: number
  }>
}

export const transferCustomerTool: ToolDefinition = {
  name: "wechat-work-transfer-customer",
  display_name: {
    en_US: "Transfer customer (on-job)",
    zh_Hans: "分配在职成员的客户",
  },
  description: {
    en_US: "Transfer customers from one member to another (on-job transfer).",
    zh_Hans: "将在职成员的客户分配给其他成员。",
  },
  skill: transferCustomerSkill,
  icon: "🔀",
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
      name: "handover_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Original owner userid",
        zh_Hans: "原跟进人 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Userid of the original owner",
          zh_Hans: "原跟进人的 userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "takeover_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "New owner userid",
        zh_Hans: "新跟进人 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Userid of the new owner",
          zh_Hans: "新跟进人的 userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "external_userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "External user IDs (JSON array)",
        zh_Hans: "外部联系人 userid 列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of external userids to transfer (max 100)",
          zh_Hans: "要转移的外部联系人 userid JSON数组，最多100个",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "transfer_success_ratio",
      type: "string",
      required: false,
      display_name: {
        en_US: "Success ratio (%)",
        zh_Hans: "成功比例 (%)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Percentage of customers to transfer (1-100)",
          zh_Hans: "转移比例，范围1-100",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      handover_userid?: string
      takeover_userid?: string
      external_userid?: string
      transfer_success_ratio?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const handoverUserid = params.handover_userid?.trim()
    if (!handoverUserid) {
      throw new Error("handover_userid is required.")
    }

    const takeoverUserid = params.takeover_userid?.trim()
    if (!takeoverUserid) {
      throw new Error("takeover_userid is required.")
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
      handover_userid: handoverUserid,
      takeover_userid: takeoverUserid,
    }

    const externalUseridStr = params.external_userid?.trim()
    if (externalUseridStr) {
      try {
        const externalUserid = JSON.parse(externalUseridStr)
        if (Array.isArray(externalUserid)) {
          body.external_userid = externalUserid
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const transferSuccessRatio = params.transfer_success_ratio?.trim()
    if (transferSuccessRatio) {
      body.transfer_success_ratio = parseInt(transferSuccessRatio, 10)
    }

    const data = await wechatWorkPostJson<TransferCustomerResponse>(
      "/externalcontact/transfer_customer",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      next_cursor: data.next_cursor ?? "",
      transferred: data.transferred ?? [],
      not_transferred: data.not_transferred ?? [],
    }
  },
}