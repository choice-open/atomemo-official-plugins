/**
 * 飞书「获取单个部门信息」GET /open-apis/contact/v3/departments/:department_id
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/department/get
 */
import { z } from "zod"
import {
  feishuUserIdTypeSchema,
  feishuDepartmentIdTypeSchema,
  emptyBodyStrictSchema,
} from "./contact-shared.zod"

/** 文档：查询参数（均为可选） */
export const contactGetDepartmentQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
  })
  .strict()

/** GET 无请求体，仅允许空对象 */
export const contactGetDepartmentBodySchema = emptyBodyStrictSchema

export type ContactGetDepartmentQuery = z.infer<
  typeof contactGetDepartmentQuerySchema
>

export function parseContactGetDepartmentQuery(
  raw: Record<string, unknown>,
): ContactGetDepartmentQuery {
  return contactGetDepartmentQuerySchema.parse(raw)
}

export function parseContactGetDepartmentBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return contactGetDepartmentBodySchema.parse(raw) as Record<string, never>
}
