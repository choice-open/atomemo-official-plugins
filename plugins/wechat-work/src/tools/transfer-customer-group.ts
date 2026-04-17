import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import transferCustomerGroupSkill from "./transfer-customer-group-skill.md" with { type: "text" }

type TransferCustomerGroupResponse = {
  errcode?: number
  errmsg?: string
}

export const transferCustomerGroupTool: ToolDefinition = {
  name: "wechat-work-transfer-customer-group",
  display_name: {
    en_US: "Transfer customer group",
    zh_Hans: "分配在职成员的客户群",
  },
  description: {
    en_US: "Transfer a customer group from one member to another.",
    zh_Hans: "将客户群从原跟进人转移给新跟进人。",
  },
  skill: transferCustomerGroupSkill,
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
      name: "chat_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Chat ID",
        zh_Hans: "客户群 chat_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Customer group chat_id",
          zh_Hans: "客户群的 chat_id",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "new_owner",
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
      name: "transfer_ownership",
      type: "string",
      required: false,
      display_name: {
        en_US: "Transfer ownership",
        zh_Hans: "是否转移群主",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Whether to transfer group ownership to new owner",
          zh_Hans: "是否将群主转移给新跟进人",
        },
        options: [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      chat_id?: string
      new_owner?: string
      transfer_ownership?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const chatId = params.chat_id?.trim()
    if (!chatId) {
      throw new Error("chat_id is required.")
    }

    const newOwner = params.new_owner?.trim()
    if (!newOwner) {
      throw new Error("new_owner is required.")
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
      chat_id: chatId,
      new_owner: newOwner,
    }

    const transferOwnership = params.transfer_ownership?.trim()
    if (transferOwnership === "true") {
      body.transfer_ownership = true
    }

    const data = await wechatWorkPostJson<TransferCustomerGroupResponse>(
      "/externalcontact/grouptransfer/transfer_customer",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}