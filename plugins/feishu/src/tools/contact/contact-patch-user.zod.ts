/**
 * 飞书「修改用户部分信息」PATCH /open-apis/contact/v3/users/{user_id}
 * 请求体字段与官方文档 / SDK contact.user.patch 一致，使用 .strict()。
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/patch
 */
import { z } from "zod"
import {
  contactUserOrderSchema,
  feishuDepartmentIdTypeSchema,
  feishuUserIdTypeSchema,
} from "./contact-shared.zod"

/** 文档：查询参数（均为可选） */
export const contactPatchUserQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
  })
  .strict()

const i18nNameSchema = z
  .object({
    zh_cn: z.string().optional(),
    ja_jp: z.string().optional(),
    en_us: z.string().optional(),
  })
  .strict()

const patchDepartmentPathNameSchema = z
  .object({
    name: z.string().optional(),
    i18n_name: i18nNameSchema.optional(),
  })
  .strict()

const patchDepartmentPathInnerSchema = z
  .object({
    department_ids: z.array(z.string()).optional(),
    department_path_name: patchDepartmentPathNameSchema.optional(),
  })
  .strict()

const patchDepartmentPathItemSchema = z
  .object({
    department_id: z.string().optional(),
    department_name: z
      .object({
        name: z.string().optional(),
        i18n_name: i18nNameSchema.optional(),
      })
      .strict()
      .optional(),
    department_path: patchDepartmentPathInnerSchema.optional(),
  })
  .strict()

const patchUserPositionSchema = z
  .object({
    position_code: z.string().optional(),
    position_name: z.string().optional(),
    department_id: z.string().optional(),
    leader_user_id: z.string().optional(),
    leader_position_code: z.string().optional(),
    is_major: z.boolean().optional(),
  })
  .strict()

/** patch 接口 custom_attrs.value 与 create 略有不同（见文档 / SDK） */
const patchCustomAttrValueSchema = z
  .object({
    text: z.string().optional(),
    url: z.string().optional(),
    pc_url: z.string().optional(),
    option_id: z.string().optional(),
    generic_user: z
      .object({
        id: z.string(),
        type: z.number().int(),
      })
      .strict()
      .optional(),
  })
  .strict()

const patchCustomAttrSchema = z
  .object({
    type: z.string().optional(),
    id: z.string().optional(),
    value: patchCustomAttrValueSchema.optional(),
  })
  .strict()

/** 文档：请求体，未传递的字段不更新（全部可选） */
export const contactPatchUserBodySchema = z
  .object({
    name: z.string().optional(),
    en_name: z.string().optional(),
    nickname: z.string().optional(),
    email: z.string().optional(),
    mobile: z.string().optional(),
    mobile_visible: z.boolean().optional(),
    gender: z.number().int().optional(),
    avatar_key: z.string().optional(),
    department_ids: z.array(z.string()).optional(),
    leader_user_id: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    work_station: z.string().optional(),
    join_time: z.number().int().optional(),
    employee_no: z.string().optional(),
    employee_type: z.number().int().optional(),
    positions: z.array(patchUserPositionSchema).optional(),
    orders: z.array(contactUserOrderSchema).optional(),
    custom_attrs: z.array(patchCustomAttrSchema).optional(),
    enterprise_email: z.string().optional(),
    idp_type: z.string().optional(),
    description: z.string().optional(),
    job_title: z.string().optional(),
    is_frozen: z.boolean().optional(),
    geo: z.string().optional(),
    job_level_id: z.string().optional(),
    job_family_id: z.string().optional(),
    subscription_ids: z.array(z.string()).optional(),
    department_path: z.array(patchDepartmentPathItemSchema).optional(),
    dotted_line_leader_user_ids: z.array(z.string()).optional(),
  })
  .strict()

export type ContactPatchUserQuery = z.infer<typeof contactPatchUserQuerySchema>
export type ContactPatchUserBody = z.infer<typeof contactPatchUserBodySchema>

export function parseContactPatchUserQuery(
  raw: Record<string, unknown>,
): ContactPatchUserQuery {
  return contactPatchUserQuerySchema.parse(raw)
}

export function parseContactPatchUserBody(
  raw: Record<string, unknown>,
): ContactPatchUserBody {
  return contactPatchUserBodySchema.parse(raw)
}
