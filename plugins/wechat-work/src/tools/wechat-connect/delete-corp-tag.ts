import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import deleteCorpTagSkill from "./delete-corp-tag-skill.md" with { type: "text" }

const deleteCorpTagBodySchema = z
  .object({
    tag_id: z.array(z.string()).optional().describe("标签的id列表"),
    group_id: z.array(z.string()).optional().describe("标签组的id列表"),
    agentid: z.number().int().optional().describe("授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数"),
  })
  .refine(
    (v) => (v.tag_id?.length ?? 0) + (v.group_id?.length ?? 0) > 0,
    { message: "tag_id和group_id不可同时为空" },
  )

type DeleteCorpTagResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteCorpTagTool: ToolDefinition = {
  name: "wechat-work-delete-corp-tag",
  display_name: {
    en_US: "Delete enterprise customer tag",
    zh_Hans: "删除企业客户标签",
  },
  description: {
    en_US: "Delete customer tags or tag groups from the enterprise tag library.",
    zh_Hans: "企业可通过此接口删除客户标签库中的标签，或删除整个标签组。",
  },
  skill: deleteCorpTagSkill,
  icon: "🗑️",
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
• tag_id (optional, string[]): tag ID list to delete
• group_id (optional, string[]): tag group ID list to delete
• agentid (optional, int): only for legacy third-party multi-app suites
Note: tag_id and group_id cannot both be empty`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• tag_id（选填，string[]）：标签的id列表
• group_id（选填，string[]）：标签组的id列表
• agentid（选填，int）：授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数
注意：tag_id和group_id不可同时为空。如果一个标签组下所有的标签均被删除，则标签组会被自动删除`,
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

    const parsed = deleteCorpTagBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<DeleteCorpTagResponse>(
      "/externalcontact/del_corp_tag",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
