import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import updateDepartmentSkill from "./update-department-skill.md" with {
  type: "text",
}

const updateDepartmentBodySchema = z.object({
  id: z.number().int().describe("部门id"),
  name: z
    .string()
    .min(1)
    .max(64)
    .optional()
    .describe(
      "部门名称。长度限制为1~64个UTF-8字符，字符不能包括\\:*?\"<>｜",
    ),
  name_en: z
    .string()
    .min(1)
    .max(64)
    .optional()
    .describe(
      "英文名称，需要在管理后台开启多语言支持才能生效。长度限制为1~64个字符，字符不能包括\\:*?\"<>｜",
    ),
  parentid: z.number().int().optional().describe("父部门id"),
  order: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe("在父部门中的次序值。order值大的排序靠前。有效的值范围是[0, 2^32)"),
})

type UpdateDepartmentResponse = {
  errcode?: number
  errmsg?: string
}

export const updateDepartmentTool: ToolDefinition = {
  name: "wechat-work-update-department",
  display_name: {
    en_US: "Update department",
    zh_Hans: "更新部门",
  },
  description: {
    en_US: "Update an existing department in WeChat Work organization.",
    zh_Hans: "更新企业微信中已有部门的信息。",
  },
  skill: updateDepartmentSkill,
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
          en_US: `JSON object for updating a department. Fields:
• id (required, int): Department ID
• name (optional, string): Department name, 1-64 UTF-8 characters. Cannot contain \\:*?"<>｜
• name_en (optional, string): English name, 1-64 characters. Requires multi-language support enabled
• parentid (optional, int): Parent department ID
• order (optional, int): Sort order within parent. Larger value = higher priority. Range: [0, 2^32)`,
          zh_Hans: `请求包体 JSON 对象，字段说明（非必须字段未指定则不更新）：
• id（必填，int）：部门id
• name（选填，string）：部门名称。长度限制为1~64个UTF-8字符，字符不能包括\\:*?"<>｜
• name_en（选填，string）：英文名称，需要在管理后台开启多语言支持才能生效。长度限制为1~64个字符
• parentid（选填，int）：父部门id
• order（选填，int）：在父部门中的次序值。order值大的排序靠前。有效的值范围是[0, 2^32)`,
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

    const parsed = updateDepartmentBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<UpdateDepartmentResponse>(
      "/department/update",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
