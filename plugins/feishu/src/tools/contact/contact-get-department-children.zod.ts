/**
 * 飞书「获取子部门列表」GET /open-apis/contact/v3/departments/:department_id/children
 */
import { z } from "zod"
import {
  emptyBodyStrictSchema,
  feishuDepartmentIdTypeSchema,
  feishuUserIdTypeSchema,
} from "./contact-shared.zod"

export const contactGetDepartmentChildrenQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
    fetch_child: z.boolean().optional(),
  })
  .strict()

export const contactGetDepartmentChildrenBodySchema = emptyBodyStrictSchema

export type ContactGetDepartmentChildrenQuery = z.infer<
  typeof contactGetDepartmentChildrenQuerySchema
>

export function parseContactGetDepartmentChildrenQuery(
  raw: Record<string, unknown>,
): ContactGetDepartmentChildrenQuery {
  return contactGetDepartmentChildrenQuerySchema.parse(raw)
}

export function parseContactGetDepartmentChildrenBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return contactGetDepartmentChildrenBodySchema.parse(raw) as Record<string, never>
}
