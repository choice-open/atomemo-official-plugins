import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createLiveSkill from "./create-live-skill.md" with { type: "text" }

type CreateLiveResponse = {
  errcode?: number
  errmsg?: string
  live_id?: string
}

export const createLiveTool: ToolDefinition = {
  name: "wechat-work-create-live",
  display_name: {
    en_US: "Create live",
    zh_Hans: "创建直播",
  },
  description: {
    en_US: "Create a live broadcast.",
    zh_Hans: "创建直播。",
  },
  skill: createLiveSkill,
  icon: "📹",
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
      name: "title",
      type: "string",
      required: true,
      display_name: {
        en_US: "Title",
        zh_Hans: "标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Live broadcast title",
          zh_Hans: "直播标题",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "start_time",
      type: "number",
      required: true,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间（Unix时间戳）",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Start Unix timestamp",
          zh_Hans: "开始 Unix 时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "number",
      required: true,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间（Unix时间戳）",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "End Unix timestamp",
          zh_Hans: "结束 Unix 时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "anchor_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Anchor userid",
        zh_Hans: "主播 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The host's userid",
          zh_Hans: "主播的 userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "description",
      type: "string",
      required: false,
      display_name: {
        en_US: "Description",
        zh_Hans: "描述",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Live broadcast description",
          zh_Hans: "直播描述",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "theme",
      type: "string",
      required: false,
      display_name: {
        en_US: "Live topic/theme",
        zh_Hans: "直播主题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Live broadcast topic",
          zh_Hans: "直播主题",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      title?: string
      start_time?: number
      end_time?: number
      anchor_userid?: string
      description?: string
      theme?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const title = params.title?.trim()
    const start_time = params.start_time
    const end_time = params.end_time
    const anchor_userid = params.anchor_userid?.trim()

    if (!title || !start_time || !end_time || !anchor_userid) {
      throw new Error("Title, start time, end time and anchor userid are required.")
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
      title,
      start_time,
      end_time,
      anchor_userid,
    }

    const description = params.description?.trim()
    if (description) body.description = description

    const theme = params.theme?.trim()
    if (theme) body.theme = theme

    const data = await wechatWorkPostJson<CreateLiveResponse>(
      "/live/create",
      token,
      body,
    )

    const result: { errcode?: number; errmsg?: string; live_id?: string } = {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
    if (data.live_id) result.live_id = data.live_id

    return result
  },
}