import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getTransferResultSkill from "./get-transfer-result-skill.md" with { type: "text" }

type GetTransferResultResponse = {
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

export const getTransferResultTool: ToolDefinition = {
  name: "wechat-work-get-transfer-result",
  display_name: {
    en_US: "Get transfer result (on-job)",
    zh_Hans: "查询在职转移结果",
  },
  description: {
    en_US: "Get the result of on-job customer transfer.",
    zh_Hans: "查询在职转移客户的结果。",
  },
  skill: getTransferResultSkill,
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
      name: "cursor",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cursor",
        zh_Hans: "分页游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Cursor for pagination",
          zh_Hans: "分页游标",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "string",
      required: false,
      display_name: {
        en_US: "Limit",
        zh_Hans: "限制数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Limit for results (default 100)",
          zh_Hans: "每页数量，默认100",
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
      cursor?: string
      limit?: string
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

    const extraParams: Record<string, string> = {
      handover_userid: handoverUserid,
      takeover_userid: takeoverUserid,
    }

    const cursor = params.cursor?.trim()
    if (cursor) extraParams.cursor = cursor

    const limit = params.limit?.trim()
    if (limit) extraParams.limit = limit

    const data = await wechatWorkGetJson<GetTransferResultResponse>(
      "/externalcontact/transfer_result",
      token,
      extraParams,
    )
    return {
      next_cursor: data.next_cursor ?? "",
      transferred: data.transferred ?? [],
      not_transferred: data.not_transferred ?? [],
    }
  },
}