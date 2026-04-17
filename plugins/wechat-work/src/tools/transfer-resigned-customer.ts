import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import transferResignedCustomerSkill from "./transfer-resigned-customer-skill.md" with { type: "text" }

type TransferResignedCustomerResponse = {
  errcode?: number
  errmsg?: string
  result?: Array<{
    external_userid: string
    errcode: number
    errmsg: string
  }>
  not_found_external_userid?: string[]
}

export const transferResignedCustomerTool: ToolDefinition = {
  name: "wechat-work-transfer-resigned-customer",
  display_name: {
    en_US: "Transfer resigned customer (off-job)",
    zh_Hans: "分配离职成员的客户",
  },
  description: {
    en_US: "Transfer customers from a resigned member to another member.",
    zh_Hans: "将离职成员的客户分配给其他成员。",
  },
  skill: transferResignedCustomerSkill,
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
        en_US: "Resigned member userid",
        zh_Hans: "离职成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Userid of the resigned member",
          zh_Hans: "离职成员的 userid",
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
      name: "transfer_strategy",
      type: "string",
      required: false,
      display_name: {
        en_US: "Transfer strategy",
        zh_Hans: "分配方式",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Transfer strategy for the customer",
          zh_Hans: "客户分配策略",
        },
        options: [
          { label: "Force transfer", value: "force" },
          { label: "Default (notify customer)", value: "default" },
          { label: "Not force (customer confirmation)", value: "not_force" },
        ],
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
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      handover_userid?: string
      takeover_userid?: string
      transfer_strategy?: string
      external_userid?: string
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

    const transferStrategy = params.transfer_strategy?.trim()
    if (transferStrategy) {
      body.transfer_strategy = transferStrategy
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

    const data = await wechatWorkPostJson<TransferResignedCustomerResponse>(
      "/externalcontact/resign/transfer_customer",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      result: data.result ?? [],
      not_found_external_userid: data.not_found_external_userid ?? [],
    }
  },
}