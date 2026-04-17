import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getKfServiceStateSkill from "./get-kf-service-state-skill.md" with { type: "text" }

type GetKfServiceStateResponse = {
  errcode?: number
  errmsg?: string
  service_state?: number
  servicer_userid?: string
  open_kfid?: string
}

export const getKfServiceStateTool: ToolDefinition = {
  name: "wechat-work-get-kf-service-state",
  display_name: {
    en_US: "Get customer service conversation state",
    zh_Hans: "获取客服会话状态",
  },
  description: {
    en_US: "Get the current customer service conversation state.",
    zh_Hans: "获取当前微信客服会话状态。",
  },
  skill: getKfServiceStateSkill,
  icon: "🔍",
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
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      open_kfid?: string
      external_userid?: string
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
    }

    const data = await wechatWorkPostJson<GetKfServiceStateResponse>(
      "/kf/service_state/get",
      token,
      body,
    )
    return {
      service_state: data.service_state,
      servicer_userid: data.servicer_userid ?? "",
      open_kfid: data.open_kfid ?? "",
    }
  },
}