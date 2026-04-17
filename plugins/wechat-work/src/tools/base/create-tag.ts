import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import createTagSkill from "./create-tag-skill.md" with { type: "text" }

const createTagBodySchema = z.object({
  tagname: z
    .string()
    .describe(
      "标签名称，长度限制为32个字以内（汉字或英文字母），标签名不可与其他标签重名。",
    ),
  tagid: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      "标签id，非负整型，指定此参数时新增的标签会生成对应的标签id，不指定时则以目前最大的id自增。",
    ),
})

type CreateTagResponse = {
  errcode?: number
  errmsg?: string
  tagid?: number
}

export const createTagTool: ToolDefinition = {
  name: "wechat-work-create-tag",
  display_name: {
    en_US: "Create tag",
    zh_Hans: "创建标签",
  },
  description: {
    en_US: "Create a new tag in WeChat Work.",
    zh_Hans: "在企业微信中创建新标签。",
  },
  skill: createTagSkill,
  icon: "➕",
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
            "Tag name, max 32 characters (Chinese or English). Must not duplicate other tags.",
          zh_Hans:
            "标签名称，长度限制为32个字以内（汉字或英文字母），标签名不可与其他标签重名。",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "tagid",
      type: "integer",
      required: false,
      display_name: {
        en_US: "Tag ID",
        zh_Hans: "标签ID",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US:
            "Non-negative integer. If specified, creates tag with this ID. Auto-generated if not set.",
          zh_Hans:
            "标签id，非负整型，指定此参数时新增的标签会生成对应的标签id，不指定时则以目前最大的id自增。",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      tagname?: string
      tagid?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }

    const rawBody: Record<string, unknown> = {}
    if (params.tagname != null) rawBody.tagname = params.tagname
    if (params.tagid != null) rawBody.tagid = params.tagid

    const parsed = createTagBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<CreateTagResponse>(
      "/tag/create",
      token,
      parsed.data as Record<string, unknown>,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      tagid: data.tagid ?? 0,
    }
  },
}
