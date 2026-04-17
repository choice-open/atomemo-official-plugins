import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import batchGetExternalContactsSkill from "./batch-get-external-contacts-skill.md" with {
  type: "text",
}

const batchGetBodySchema = z.object({
  userid_list: z
    .array(z.string())
    .min(1)
    .max(100)
    .describe("企业成员的userid列表，字符串类型，最多支持100个"),
  cursor: z
    .string()
    .optional()
    .describe("用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("返回的最大记录数，整型，最大值100，默认值50，超过最大值时取最大值"),
})

type BatchGetExternalContactResponse = {
  errcode?: number
  errmsg?: string
  external_contact_list?: Array<{
    external_contact: {
      external_userid: string
      name: string
      position?: string
      avatar?: string
      corp_name?: string
      corp_full_name?: string
      type: number
      gender: number
      unionid?: string
    }
    follow_info: {
      userid: string
      remark?: string
      description?: string
      createtime: number
      tag_id?: string[]
      remark_corp_name?: string
      remark_mobiles?: string[]
      oper_userid?: string
      add_way?: number
      state?: string
    }
  }>
  next_cursor?: string
  fail_info?: {
    unlicensed_userid_list?: string[]
  }
}

export const batchGetExternalContactsTool: ToolDefinition = {
  name: "wechat-work-batch-get-external-contacts",
  display_name: {
    en_US: "Batch get external contacts",
    zh_Hans: "批量获取客户详情",
  },
  description: {
    en_US: "Batch get detailed information of external contacts for specified members.",
    zh_Hans: "企业/第三方可通过此接口获取指定成员添加的客户信息列表。",
  },
  skill: batchGetExternalContactsSkill,
  icon: "👥",
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
• userid_list (required, string[]): enterprise member userid list, max 100
• cursor (optional, string): pagination cursor from previous response
• limit (optional, int): max records to return, max 100, default 50`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• userid_list（必填，string[]）：企业成员的userid列表，字符串类型，最多支持100个
• cursor（选填，string）：用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填
• limit（选填，int）：返回的最大记录数，整型，最大值100，默认值50，超过最大值时取最大值`,
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

    const parsed = batchGetBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<BatchGetExternalContactResponse>(
      "/externalcontact/batch/get_by_user",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      external_contact_list: data.external_contact_list ?? [],
      next_cursor: data.next_cursor ?? "",
      fail_info: data.fail_info ?? null,
    }
  },
}
