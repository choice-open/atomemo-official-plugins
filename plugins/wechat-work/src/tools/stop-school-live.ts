import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import stopSchoolLiveSkill from "./stop-school-live-skill.md" with { type: "text" }

type StopSchoolLiveResponse = {
  errcode?: number
  errmsg?: string
}

export const stopSchoolLiveTool: ToolDefinition = {
  name: "wechat-work-stop-school-live",
  display_name: {
    en_US: "Stop school live",
    zh_Hans: "结束直播",
  },
  description: {
    en_US: "Stop an ongoing school live broadcast.",
    zh_Hans: "结束上课直播。",
  },
  skill: stopSchoolLiveSkill,
  icon: "🛑",
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
      name: "school_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "School ID",
        zh_Hans: "学校ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "School ID from education management console",
          zh_Hans: "家校管理后台的学校ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "live_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Live ID",
        zh_Hans: "直播ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The live broadcast ID to stop",
          zh_Hans: "要结束的直播ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      school_id?: string
      live_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const schoolId = params.school_id?.trim()
    const liveId = params.live_id?.trim()

    if (!schoolId || !liveId) {
      throw new Error("school_id and live_id are required.")
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
      school_id: schoolId,
      live_id: liveId,
    }

    const data = await wechatWorkPostJson<StopSchoolLiveResponse>(
      "/school/live/stop",
      token,
      body,
    )

    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}