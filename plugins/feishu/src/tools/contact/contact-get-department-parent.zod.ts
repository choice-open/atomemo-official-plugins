/**
 * 飞书「获取父部门信息」GET /open-apis/contact/v3/departments/:department_id/parent
 */
import { z } from "zod"
import {
  emptyBodyStrictSchema,
  feishuDepartmentIdTypeSchema,
  feishuUserIdTypeSchema,
} from "./contact-shared.zod"

export const contactGetDepartmentParentQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
  })
  .strict()

export const contactGetDepartmentParentBodySchema = emptyBodyStrictSchema

export type ContactGetDepartmentParentQuery = z.infer<
  typeof contactGetDepartmentParentQuerySchema
>

export function parseContactGetDepartmentParentQuery(
  raw: Record<string, unknown>,
): ContactGetDepartmentParentQuery {
  return contactGetDepartmentParentQuerySchema.parse(raw)
}

export function parseContactGetDepartmentParentBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return contactGetDepartmentParentBodySchema.parse(raw) as Record<string, never>
}
