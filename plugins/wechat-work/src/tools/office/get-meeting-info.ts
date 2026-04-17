import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import getMeetingInfoSkill from "./get-meeting-info-skill.md" with { type: "text" }

const getMeetingInfoBodySchema = z
  .object({
    meetingid: z.string().optional().describe("会议ID"),
    meeting_code: z.string().optional().describe("入会码"),
    sub_meetingid: z.string().optional().describe("周期性会议子会议ID"),
  })
  .refine((v) => v.meetingid || v.meeting_code, {
    message: "meetingid 和 meeting_code 必须填一个",
  })

type GetMeetingInfoResponse = {
  errcode?: number
  errmsg?: string
  [key: string]: unknown
}

export const getMeetingInfoTool: ToolDefinition = {
  name: "wechat-work-get-meeting-info",
  display_name: {
    en_US: "Get meeting details",
    zh_Hans: "获取会议详情",
  },
  description: {
    en_US:
      "Get details of a specified meeting via POST /meeting/get_info.",
    zh_Hans: "获取企业微信指定会议的详情内容。",
  },
  skill: getMeetingInfoSkill,
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
      name: "body",
      type: "string",
      required: true,
      display_name: {
        en_US: "Request body (JSON)",
        zh_Hans: "请求包体 (JSON)",
      },
      ui: {
        component: "code-editor",
        hint: {
          en_US: `JSON object. Fields:
• meetingid (optional, string): meeting ID. Either meetingid or meeting_code is required
• meeting_code (optional, string): meeting code. Either meetingid or meeting_code is required
• sub_meetingid (optional, string): sub-meeting ID for recurring meetings`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• meetingid（选填，string）：会议ID。meetingid 和 meeting_code 必须填一个
• meeting_code（选填，string）：入会码。meetingid 和 meeting_code 必须填一个
• sub_meetingid（选填，string）：周期性会议子会议ID`,
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      body?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }

    const bodyStr =
      typeof params.body === "string" ? params.body.trim() : ""
    if (!bodyStr) {
      throw new Error("请求包体 (body) 不能为空。")
    }

    let rawBody: unknown
    try {
      rawBody = JSON.parse(bodyStr)
    } catch {
      throw new Error("请求包体不是合法的 JSON 格式。")
    }

    const parsed = getMeetingInfoBodySchema.safeParse(rawBody)
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")
      throw new Error(`请求包体校验失败: ${issues}`)
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const body = parsed.data as Record<string, unknown>

    const data = await wechatWorkPostJson<GetMeetingInfoResponse>(
      "/meeting/get_info",
      token,
      body,
    )

    return JSON.parse(JSON.stringify(data))
  },
}
