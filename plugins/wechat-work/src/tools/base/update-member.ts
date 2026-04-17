import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import updateMemberSkill from "./update-member-skill.md" with { type: "text" }

const extAttrItemSchema = z.object({
  type: z.number().int().describe("属性类型: 0-文本 1-网页 2-小程序"),
  name: z.string().describe("属性名称"),
  text: z
    .object({ value: z.string() })
    .optional()
    .describe("文本属性内容"),
  web: z
    .object({ url: z.string(), title: z.string() })
    .optional()
    .describe("网页属性内容"),
  miniprogram: z
    .object({
      appid: z.string(),
      pagepath: z.string(),
      title: z.string(),
    })
    .optional()
    .describe("小程序属性内容"),
})

const updateMemberBodySchema = z.object({
  userid: z
    .string()
    .min(1)
    .max(64)
    .describe(
      "成员UserID。对应管理端的账号，企业内必须唯一。不区分大小写，长度为1~64个字节",
    ),
  name: z
    .string()
    .min(1)
    .max(64)
    .optional()
    .describe("成员名称。长度为1~64个utf8字符"),
  alias: z
    .string()
    .min(1)
    .max(64)
    .optional()
    .describe("别名。长度为1-64个utf8字符"),
  mobile: z
    .string()
    .optional()
    .describe("手机号码。企业内必须唯一"),
  department: z
    .array(z.number().int())
    .max(100)
    .optional()
    .describe("成员所属部门id列表，不超过100个"),
  order: z
    .array(z.number().int())
    .optional()
    .describe(
      "部门内的排序值，默认为0。当有传入department时有效。数量必须和department一致，数值越大排序越前面。有效的值范围是[0, 2^32)",
    ),
  position: z
    .string()
    .max(128)
    .optional()
    .describe("职务信息。长度为0~128个utf8字符"),
  gender: z
    .string()
    .optional()
    .describe("性别。1表示男性，2表示女性"),
  email: z
    .string()
    .optional()
    .describe("邮箱。长度6~64个字节，且为有效的email格式。企业内必须唯一"),
  biz_mail: z
    .string()
    .optional()
    .describe("企业邮箱。长度6~63个字节，且为有效的企业邮箱格式。企业内必须唯一"),
  biz_mail_alias: z
    .object({
      item: z.array(z.string()),
    })
    .optional()
    .describe("企业邮箱别名。最多可设置5个别名。更新时为覆盖式更新"),
  telephone: z
    .string()
    .max(32)
    .optional()
    .describe("座机。由1-32位的纯数字、\"-\"、\"+\"或\",\"组成"),
  is_leader_in_dept: z
    .array(z.number().int())
    .optional()
    .describe(
      "部门负责人字段，个数必须和department一致，表示在所在的部门内是否为负责人。0-否，1-是",
    ),
  direct_leader: z
    .array(z.string())
    .max(1)
    .optional()
    .describe("直属上级，可以设置企业范围内成员为直属上级，最多设置1个"),
  avatar_mediaid: z
    .string()
    .optional()
    .describe("成员头像的mediaid，通过素材管理接口上传图片获得的mediaid"),
  enable: z
    .number()
    .int()
    .optional()
    .describe("启用/禁用成员。1表示启用成员，0表示禁用成员"),
  extattr: z
    .object({ attrs: z.array(extAttrItemSchema) })
    .optional()
    .describe("扩展属性"),
  external_profile: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("成员对外属性"),
  external_position: z
    .string()
    .optional()
    .describe("对外职务，如果设置了该值，则以此作为对外展示的职务。不超过12个汉字"),
  address: z
    .string()
    .max(128)
    .optional()
    .describe("地址。长度最大128个字符"),
  main_department: z
    .number()
    .int()
    .optional()
    .describe("主部门"),
  new_userid: z
    .string()
    .optional()
    .describe("新的UserID，仅当userid由系统自动生成时允许修改一次"),
})

type UpdateUserResponse = {
  errcode?: number
  errmsg?: string
}

export const updateMemberTool: ToolDefinition = {
  name: "wechat-work-update-member",
  display_name: {
    en_US: "Update member",
    zh_Hans: "更新成员",
  },
  description: {
    en_US: "Update an existing member in WeChat Work organization.",
    zh_Hans: "更新企业微信中已有成员的信息。",
  },
  skill: updateMemberSkill,
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
          en_US: `JSON object for updating a member. Fields:
• userid (required, string): User ID, 1-64 bytes
• name (optional, string): Member name, 1-64 UTF-8 characters
• alias (optional, string): Alias, 1-64 UTF-8 characters
• mobile (optional, string): Mobile number, unique
• department (optional, int[]): Department ID list, max 100
• order (optional, int[]): Sort order, must match department count
• position (optional, string): Job title, 0-128 characters
• gender (optional, string): "1"=male, "2"=female
• email (optional, string): Email, 6-64 bytes, unique
• biz_mail (optional, string): Business email, 6-63 bytes
• biz_mail_alias (optional, obj): { item: string[] }, max 5 aliases
• telephone (optional, string): Landline, 1-32 characters
• is_leader_in_dept (optional, int[]): Leader flags, must match department count
• direct_leader (optional, string[]): Direct leader UserID, max 1
• avatar_mediaid (optional, string): Avatar media ID
• enable (optional, int): 1=enable, 0=disable
• extattr (optional, obj): Extended attributes
• external_profile (optional, obj): External profile
• external_position (optional, string): External-facing job title
• address (optional, string): Address, max 128 characters
• main_department (optional, int): Main department ID
• new_userid (optional, string): New UserID (only if auto-generated, one-time change)`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• userid（必填，string）：成员UserID。企业内必须唯一。不区分大小写，长度为1~64个字节
• name（选填，string）：成员名称。长度为1~64个utf8字符
• alias（选填，string）：别名。长度为1-64个utf8字符
• mobile（选填，string）：手机号码。企业内必须唯一
• department（选填，int[]）：成员所属部门id列表，不超过100个
• order（选填，int[]）：部门内的排序值，默认为0。数量必须和department一致，数值越大排序越前面
• position（选填，string）：职务信息。长度为0~128个utf8字符
• gender（选填，string）：性别。1表示男性，2表示女性
• email（选填，string）：邮箱。长度6~64个字节。企业内必须唯一
• biz_mail（选填，string）：企业邮箱。长度6~63个字节
• biz_mail_alias（选填，obj）：企业邮箱别名 { item: string[] }，最多5个别名，覆盖式更新
• telephone（选填，string）：座机。由1-32位的纯数字、"-"、"+"或","组成
• is_leader_in_dept（选填，int[]）：部门负责人字段，个数必须和department一致。0-否，1-是
• direct_leader（选填，string[]）：直属上级UserID，最多设置1个
• avatar_mediaid（选填，string）：成员头像的mediaid
• enable（选填，int）：启用/禁用成员。1表示启用，0表示禁用
• extattr（选填，obj）：扩展属性
• external_profile（选填，obj）：成员对外属性
• external_position（选填，string）：对外职务。不超过12个汉字
• address（选填，string）：地址。长度最大128个字符
• main_department（选填，int）：主部门
• new_userid（选填，string）：新的UserID，仅当userid由系统自动生成时允许修改一次`,
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

    const parsed = updateMemberBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<UpdateUserResponse>(
      "/user/update",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
