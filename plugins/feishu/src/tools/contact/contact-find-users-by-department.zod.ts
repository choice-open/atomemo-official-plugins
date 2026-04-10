/**
 * 飞书「获取部门直属用户列表」GET /open-apis/contact/v3/users/find_by_department
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/find_by_department
 */
import { z } from "zod"
import { feishuDepartmentIdTypeSchema, feishuUserIdTypeSchema } from "./contact-shared.zod"

export const contactFindUsersByDepartmentQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    department_id: z.string(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const contactFindUsersByDepartmentBodySchema = z.object({}).strict()

export type ContactFindUsersByDepartmentQuery = z.infer<
  typeof contactFindUsersByDepartmentQuerySchema
>

export function parseContactFindUsersByDepartmentQuery(
  raw: Record<string, unknown>,
): ContactFindUsersByDepartmentQuery {
  return contactFindUsersByDepartmentQuerySchema.parse(raw)
}

export function parseContactFindUsersByDepartmentBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return contactFindUsersByDepartmentBodySchema.parse(raw) as Record<string, never>
}
