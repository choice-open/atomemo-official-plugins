import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import addKfServingSkill from "./add-kf-serving-skill.md" with { type: "text" }

const addKfServingBodySchema = z
  .object({
    open_kfid: z.string().describe("客服账号ID"),
    userid_list: z
      .array(z.string())
      .max(100)
      .optional()
      .describe("接待人员userid列表。第三方应用填密文userid，即open_userid。可填充个数：0~100，超过100个需分批调用"),
    department_id_list: z
      .array(z.number())
      .max(20)
      .optional()
      .describe("接待人员部门id列表。可填充个数：0~20"),
  })
  .refine(
    (v) =>
      (v.userid_list?.length ?? 0) + (v.department_id_list?.length ?? 0) > 0,
    { message: "userid_list 和 department_id_list 至少传一个" },
  )

type AddKfServingResponse = {
  errcode?: number
  errmsg?: string
  result_list?: Array<{
    userid?: string
    department_id?: number
    errcode: number
    errmsg: string
  }>
}

export const addKfServingTool: ToolDefinition = {
  name: "wechat-work-add-kf-serving",
  display_name: {
    en_US: "Add customer service representative",
    zh_Hans: "添加接待人员",
  },
  description: {
    en_US:
      "Add service representatives to a customer service account. Max 2000 users and 20 departments per account.",
    zh_Hans:
      "添加指定客服账号的接待人员，每个客服账号目前最多可添加2000个接待人员，20个部门。",
  },
  skill: addKfServingSkill,
  icon: "👤",
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
• open_kfid (required, string): Customer service account ID
• userid_list (optional, string[]): Service representative userid list, max 100 per call
• department_id_list (optional, int[]): Department ID list, max 20
Note: at least one of userid_list or department_id_list is required`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• open_kfid（必填，string）：客服账号ID
• userid_list（选填，string[]）：接待人员userid列表。第三方应用填密文userid，即open_userid。可填充个数：0~100，超过100个需分批调用
• department_id_list（选填，int[]）：接待人员部门id列表。可填充个数：0~20
注意：userid_list 和 department_id_list 至少需要填其中一个`,
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

    const parsed = addKfServingBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<AddKfServingResponse>(
      "/kf/servicer/add",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      result_list: data.result_list ?? [],
    }
  },
}
