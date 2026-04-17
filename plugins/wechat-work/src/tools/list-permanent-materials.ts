import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import listPermanentMaterialsSkill from "./list-permanent-materials-skill.md" with { type: "text" }

type MaterialItem = {
  media_id: string
  name: string
  update_time: number
  tags: string[]
  url?: string
}

type ListPermanentMaterialsResponse = {
  errcode?: number
  errmsg?: string
  total_count: number
  item: MaterialItem[]
}

export const listPermanentMaterialsTool: ToolDefinition = {
  name: "wechat-work-list-permanent-materials",
  display_name: {
    en_US: "List permanent materials",
    zh_Hans: "获取素材列表",
  },
  description: {
    en_US: "List permanent materials from WeChat Work.",
    zh_Hans: "获取企业微信中的永久素材列表。",
  },
  skill: listPermanentMaterialsSkill,
  icon: "📋",
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
      name: "type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Material type",
        zh_Hans: "素材类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Material type: image, video, voice, file",
          zh_Hans: "素材类型：图片、视频、语音、文件",
        },
        options: [
          { label: { en_US: "Image", zh_Hans: "图片" }, value: "image" },
          { label: { en_US: "Video", zh_Hans: "视频" }, value: "video" },
          { label: { en_US: "Voice", zh_Hans: "语音" }, value: "voice" },
          { label: { en_US: "File", zh_Hans: "文件" }, value: "file" },
        ],
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "offset",
      type: "number",
      required: false,
      display_name: {
        en_US: "Offset",
        zh_Hans: "偏移量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Starting position (default: 0)",
          zh_Hans: "从全部素材的起始位置开始（默认: 0）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "count",
      type: "number",
      required: false,
      display_name: {
        en_US: "Count",
        zh_Hans: "数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of items to return (default: 20, max: 20)",
          zh_Hans: "返回素材数量（默认: 20，最大: 20）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      type?: string
      offset?: number
      count?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const type = params.type?.trim()
    if (!type) {
      throw new Error("type is required.")
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

    const offset = typeof params.offset === "number" ? params.offset : 0
    const count = typeof params.count === "number" ? Math.min(params.count, 20) : 20

    const data = await wechatWorkPostJson<ListPermanentMaterialsResponse>(
      "/material/batchget_material",
      token,
      {
        type,
        offset,
        count,
      },
    )

    return {
      total_count: data.total_count,
      items: data.item ?? [],
    }
  },
}
