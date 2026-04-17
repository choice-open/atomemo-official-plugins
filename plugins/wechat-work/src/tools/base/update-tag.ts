import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import updateTagSkill from "./update-tag-skill.md" with { type: "text" }

const updateTagBodySchema = z.object({
  tagid: z.number().int().describe("标签ID"),
  tagname: z
    .string()
    .describe(
      "标签名称，长度限制为32个字（汉字或英文字母），标签不可与其他标签重名。",
    ),
})

type UpdateTagResponse = {
  errcode?: number
  errmsg?: string
}

export const updateTagTool: ToolDefinition = {
  name: "wechat-work-update-tag",
  display_name: {
    en_US: "Update tag name",
    zh_Hans: "更新标签名字",
  },
  description: {
    en_US: "Update an existing tag name in WeChat Work.",
    zh_Hans: "更新企业微信中已有标签的名字。",
  },
  skill: updateTagSkill,
  icon: "✏️",
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
      name: "tagid",
      type: "integer",
      required: true,
      display_name: {
        en_US: "Tag ID",
        zh_Hans: "标签ID",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The tag ID to update.",
          zh_Hans: "标签ID。",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "tagname",
      type: "string",
      required: true,
      display_name: {
        en_US: "Tag name",
        zh_Hans: "标签名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US:
            "New tag name, max 32 characters. Must not duplicate other tags.",
          zh_Hans:
            "标签名称，长度限制为32个字（汉字或英文字母），标签不可与其他标签重名。",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      tagid?: number
      tagname?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }

    const rawBody: Record<string, unknown> = {}
    if (params.tagid != null) rawBody.tagid = params.tagid
    if (params.tagname != null) rawBody.tagname = params.tagname

    const parsed = updateTagBodySchema.safeParse(rawBody)
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")
      throw new Error(`参数校验失败: ${issues}`)
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const data = await wechatWorkPostJson<UpdateTagResponse>(
      "/tag/update",
      token,
      parsed.data as Record<string, unknown>,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
