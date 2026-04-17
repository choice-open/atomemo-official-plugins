import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import transferKfServiceStateSkill from "./transfer-kf-service-state-skill.md" with { type: "text" }

type TransferKfServiceStateResponse = {
  errcode?: number
  errmsg?: string
  msg_code?: string
}

export const transferKfServiceStateTool: ToolDefinition = {
  name: "wechat-work-transfer-kf-service-state",
  display_name: {
    en_US: "Transfer or finish KF conversation",
    zh_Hans: "转接或结束客服会话",
  },
  description: {
    en_US: "Transfer or finish a customer service conversation.",
    zh_Hans: "转接或结束微信客服会话。",
  },
  skill: transferKfServiceStateSkill,
  icon: "🔄",
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
      name: "open_kfid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Customer service account ID",
        zh_Hans: "客服账号ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Customer service account ID (open_kfid)",
          zh_Hans: "客服账号ID (open_kfid)",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "external_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Customer user ID",
        zh_Hans: "客户 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "External user ID of the customer",
          zh_Hans: "客户的外部用户userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "service_state",
      type: "string",
      required: true,
      display_name: {
        en_US: "Target service state",
        zh_Hans: "目标会话状态",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Target service state to change to",
          zh_Hans: "变更的目标会话状态",
        },
        options: [
          { label: "Untreated (0)", value: "0" },
          { label: "AI Serving (1)", value: "1" },
          { label: "In Queue (2)", value: "2" },
          { label: "Human Serving (3)", value: "3" },
          { label: "Finished (4)", value: "4" },
        ],
      },
    },
    {
      name: "servicer_userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "Servicer user ID",
        zh_Hans: "接待人员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Servicer user ID (required when state=3)",
          zh_Hans: "接待人员userid（state=3时必填）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      open_kfid?: string
      external_userid?: string
      service_state?: string
      servicer_userid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const openKfid = params.open_kfid?.trim()
    if (!openKfid) {
      throw new Error("open_kfid is required.")
    }

    const externalUserid = params.external_userid?.trim()
    if (!externalUserid) {
      throw new Error("external_userid is required.")
    }

    const serviceState = params.service_state?.trim()
    if (!serviceState) {
      throw new Error("service_state is required.")
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
      open_kfid: openKfid,
      external_userid: externalUserid,
      service_state: parseInt(serviceState, 10),
    }

    const servicerUserid = params.servicer_userid?.trim()
    if (servicerUserid) {
      body.servicer_userid = servicerUserid
    }

    if (parseInt(serviceState, 10) === 3 && !servicerUserid) {
      throw new Error("servicer_userid is required when service_state is 3.")
    }

    const data = await wechatWorkPostJson<TransferKfServiceStateResponse>(
      "/kf/service_state/trans",
      token,
      body,
    )
    return { success: true, msg_code: data.msg_code }
  },
}