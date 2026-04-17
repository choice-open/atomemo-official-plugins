import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listSchoolsSkill from "./list-schools-skill.md" with { type: "text" }

type SchoolInfo = {
  school_name: string
  school_id: number
  principal_userid: string
  jointype: number
  create_time: number
  visible_upgrade_switches: number[]
}

type ListSchoolsResponse = {
  errcode?: number
  errmsg?: string
  school_list?: SchoolInfo[]
}

export const listSchoolsTool: ToolDefinition = {
  name: "wechat-work-list-schools",
  display_name: {
    en_US: "List schools",
    zh_Hans: "获取学校列表",
  },
  description: {
    en_US: "Fetch the list of schools in WeChat Work education module.",
    zh_Hans: "获取企业微信家校应用中的学校列表。",
  },
  skill: listSchoolsSkill,
  icon: "🏫",
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
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
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

    const data = await wechatWorkGetJson<ListSchoolsResponse>(
      "/school/list",
      token,
    )
    return { school_list: data.school_list ?? [] }
  },
}
