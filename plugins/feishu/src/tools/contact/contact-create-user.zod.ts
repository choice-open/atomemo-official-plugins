/**
 * 飞书「创建用户」POST /open-apis/contact/v3/users
 * 查询参数、请求体字段与官方文档一致，使用 .strict() 拒绝未在文档中出现的键。
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/create
 */
import { z } from "zod"

/** 查询参数 user_id_type */
const userIdType = z.enum(["open_id", "union_id", "user_id"])

/** 查询参数 department_id_type */
const departmentIdType = z.enum(["department_id", "open_department_id"])

/** 文档：查询参数（均为可选） */
export const contactCreateUserQuerySchema = z
  .object({
    user_id_type: userIdType.optional(),
    department_id_type: departmentIdType.optional(),
    client_token: z.string().optional(),
  })
  .strict()

const customAttrGenericUserSchema = z
  .object({
    id: z.string(),
    type: z.number().int(),
  })
  .strict()

/** 文档：user_custom_attr_value */
const userCustomAttrValueSchema = z
  .object({
    text: z.string().optional(),
    url: z.string().optional(),
    pc_url: z.string().optional(),
    option_id: z.string().optional(),
    option_value: z.string().optional(),
    name: z.string().optional(),
    picture_url: z.string().optional(),
    generic_user: customAttrGenericUserSchema.optional(),
  })
  .strict()

/** 文档：user_custom_attr */
const userCustomAttrSchema = z
  .object({
    type: z
      .enum(["TEXT", "HREF", "ENUMERATION", "PICTURE_ENUM", "GENERIC_USER"])
      .optional(),
    id: z.string().optional(),
    value: userCustomAttrValueSchema.optional(),
  })
  .strict()

/** 文档：user_order */
const userOrderSchema = z
  .object({
    department_id: z.string().optional(),
    user_order: z.number().int().optional(),
    department_order: z.number().int().optional(),
    is_primary_dept: z.boolean().optional(),
  })
  .strict()

/** 文档：请求体 */
export const contactCreateUserBodySchema = z
  .object({
    user_id: z.string().max(64).optional(),
    name: z.string().min(1).max(255),
    en_name: z.string().max(255).optional(),
    nickname: z.string().max(255).optional(),
    email: z.string().optional(),
    mobile: z.string(),
    mobile_visible: z.boolean().optional(),
    gender: z
      .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
      .optional(),
    avatar_key: z.string().optional(),
    department_ids: z.array(z.string()).min(1),
    leader_user_id: z.string().optional(),
    city: z.string().max(100).optional(),
    country: z.string().optional(),
    work_station: z.string().max(255).optional(),
    join_time: z.number().int().optional(),
    employee_no: z.string().max(255).optional(),
    employee_type: z.number().int(),
    orders: z.array(userOrderSchema).optional(),
    custom_attrs: z.array(userCustomAttrSchema).optional(),
    enterprise_email: z.string().optional(),
    job_title: z.string().max(255).optional(),
    geo: z.string().optional(),
    job_level_id: z.string().optional(),
    job_family_id: z.string().optional(),
    subscription_ids: z.array(z.string()).optional(),
    dotted_line_leader_user_ids: z.array(z.string()).optional(),
  })
  .strict()

export type ContactCreateUserQuery = z.infer<
  typeof contactCreateUserQuerySchema
>
export type ContactCreateUserBody = z.infer<typeof contactCreateUserBodySchema>

export function parseContactCreateUserQuery(
  raw: Record<string, unknown>,
): ContactCreateUserQuery {
  return contactCreateUserQuerySchema.parse(raw)
}

export function parseContactCreateUserBody(
  raw: Record<string, unknown>,
): ContactCreateUserBody {
  return contactCreateUserBodySchema.parse(raw)
}
