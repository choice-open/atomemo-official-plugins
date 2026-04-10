/**
 * 飞书「获取单个用户信息」GET /open-apis/contact/v3/users/:user_id
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/get
 */
import { z } from "zod"
import {
  emptyBodyStrictSchema,
  feishuDepartmentIdTypeSchema,
  feishuUserIdTypeSchema,
} from "./contact-shared.zod"

/** 文档：查询参数（均为可选） */
export const contactGetUserQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
  })
  .strict()

/** GET 无请求体，仅允许空对象 */
export const contactGetUserBodySchema = emptyBodyStrictSchema

export type ContactGetUserQuery = z.infer<typeof contactGetUserQuerySchema>

export function parseContactGetUserQuery(
  raw: Record<string, unknown>,
): ContactGetUserQuery {
  return contactGetUserQuerySchema.parse(raw)
}

export function parseContactGetUserBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return contactGetUserBodySchema.parse(raw) as Record<string, never>
}
