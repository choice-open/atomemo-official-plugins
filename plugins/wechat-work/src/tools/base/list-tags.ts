import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
import listTagsSkill from "./list-tags-skill.md" with { type: "text" }

type ListTagsResponse = {
  errcode?: number
  errmsg?: string
  taglist?: Array<{
    tagid: number
    tagname: string
  }>
}

export const listTagsTool: ToolDefinition = {
  name: "wechat-work-list-tags",
  display_name: {
    en_US: "List tags",
    zh_Hans: "获取标签列表",
  },
  description: {
    en_US: "Fetch the tag list from WeChat Work.",
    zh_Hans: "获取企业微信中的标签列表。",
  },
  skill: listTagsSkill,
  icon: "🏷️",
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
      throw new Error("请选择企业微信凭证。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const data = await wechatWorkGetJson<ListTagsResponse>("/tag/list", token)
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      taglist: data.taglist ?? [],
    }
  },
}
