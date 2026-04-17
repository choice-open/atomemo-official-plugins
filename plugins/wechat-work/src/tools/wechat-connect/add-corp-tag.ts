import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import addCorpTagSkill from "./add-corp-tag-skill.md" with { type: "text" }

const addCorpTagBodySchema = z.object({
  group_id: z.string().optional().describe("标签组id"),
  group_name: z.string().max(30).optional().describe("标签组名称，最长为30个字符"),
  order: z.number().int().min(0).optional().describe("标签组次序值。order值大的排序靠前。有效的值范围是[0, 2^32)"),
  tag: z
    .array(
      z.object({
        name: z.string().max(30).describe("添加的标签名称，最长为30个字符"),
        order: z.number().int().min(0).optional().describe("标签次序值。order值大的排序靠前。有效的值范围是[0, 2^32)"),
      }),
    )
    .min(1)
    .describe("标签列表"),
  agentid: z.number().int().optional().describe("授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数"),
})

type AddCorpTagResponse = {
  errcode?: number
  errmsg?: string
  tag_group?: {
    group_id: string
    group_name: string
    create_time: number
    order: number
    tag: Array<{ id: string; name: string; create_time: number; order: number }>
  }
}

export const addCorpTagTool: ToolDefinition = {
  name: "wechat-work-add-corp-tag",
  display_name: {
    en_US: "Add enterprise customer tag",
    zh_Hans: "添加企业客户标签",
  },
  description: {
    en_US: "Add new tag groups and tags to the enterprise customer tag library.",
    zh_Hans: "企业可通过此接口向客户标签库中添加新的标签组和标签，每个企业最多可配置10000个企业标签。",
  },
  skill: addCorpTagSkill,
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
• group_id (optional, string): existing tag group ID. If provided, group_name and group order are ignored
• group_name (optional, string): new tag group name, max 30 chars. Required if group_id not provided
• order (optional, uint32): tag group order, higher values sort first
• tag (required, obj[]): [{ name: string (max 30), order?: uint32 }]
• agentid (optional, int): only for legacy third-party multi-app suites`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• group_id（选填，string）：标签组id。若指定了group_id，则group_name和标签组的order参数会被忽略
• group_name（选填，string）：标签组名称，最长为30个字符。如不指定group_id则需要填写此字段
• order（选填，uint32）：标签组次序值。order值大的排序靠前。有效的值范围是[0, 2^32)
• tag（必填，obj[]）：标签列表 [{ name: string（最长30字符）, order?: uint32 }]
• agentid（选填，int）：授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数`,
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

    const parsed = addCorpTagBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<AddCorpTagResponse>(
      "/externalcontact/add_corp_tag",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      tag_group: data.tag_group ?? null,
    }
  },
}
