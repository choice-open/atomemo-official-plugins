/**
 * 飞书「获取部门群」GET /open-apis/contact/v3/departments/:department_id/groups
 */
import { z } from "zod"
import {
  emptyBodyStrictSchema,
  feishuDepartmentIdTypeSchema,
  feishuUserIdTypeSchema,
} from "./contact-shared.zod"

export const contactGetDepartmentGroupsQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const contactGetDepartmentGroupsBodySchema = emptyBodyStrictSchema

export type ContactGetDepartmentGroupsQuery = z.infer<
  typeof contactGetDepartmentGroupsQuerySchema
>

export function parseContactGetDepartmentGroupsQuery(
  raw: Record<string, unknown>,
): ContactGetDepartmentGroupsQuery {
  return contactGetDepartmentGroupsQuerySchema.parse(raw)
}

export function parseContactGetDepartmentGroupsBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return contactGetDepartmentGroupsBodySchema.parse(raw) as Record<string, never>
}
