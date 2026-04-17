import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import listEventCategoriesSkill from "./list-event-categories-skill.md" with {
  type: "text",
}

type ListEventCategoriesResponse = {
  errcode?: number
  errmsg?: string
  category_list?: Array<{
    category_id: string
    category_name: string
    level: number
    parent_category_id?: string
  }>
}

export const listEventCategoriesTool: ToolDefinition = {
  name: "wechat-work-list-event-categories",
  display_name: {
    en_US: "List event categories",
    zh_Hans: "获取事件类别列表",
  },
  description: {
    en_US: "Get the list of event categories for patrol or resident reports.",
    zh_Hans: "获取巡查上报或居民上报的事件类别列表。",
  },
  skill: listEventCategoriesSkill,
  icon: "📁",
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

    const data = await wechatWorkPostJson<ListEventCategoriesResponse>(
      "/report/grid/list_cata",
      token,
      {},
    )
    return { category_list: data.category_list ?? [] }
  },
}
