/**
 * 通讯录 API 共用的 Zod 片段（与飞书 contact v3 文档字段一致）。
 */
import { z } from "zod"

export const feishuUserIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])

export const feishuDepartmentIdTypeSchema = z.enum([
  "department_id",
  "open_department_id",
])

/** GET/POST 常见分页查询 */
export const feishuPageQuerySchema = z
  .object({
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const contactUserOrderSchema = z
  .object({
    department_id: z.string().optional(),
    user_order: z.number().int().optional(),
    department_order: z.number().int().optional(),
    is_primary_dept: z.boolean().optional(),
  })
  .strict()

const customAttrGenericUserSchema = z
  .object({
    id: z.string(),
    type: z.number().int(),
  })
  .strict()

export const contactUserCustomAttrValueSchema = z
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

export const contactUserCustomAttrSchema = z
  .object({
    type: z
      .enum(["TEXT", "HREF", "ENUMERATION", "PICTURE_ENUM", "GENERIC_USER"])
      .optional(),
    id: z.string().optional(),
    value: contactUserCustomAttrValueSchema.optional(),
  })
  .strict()

/** GET 且无请求体 */
export const emptyBodyStrictSchema = z.object({}).strict()
