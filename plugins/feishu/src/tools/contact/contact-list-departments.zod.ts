/**
 * 飞书「获取部门列表」GET /open-apis/contact/v3/departments
 */
import { z } from "zod"
import {
  emptyBodyStrictSchema,
  feishuDepartmentIdTypeSchema,
  feishuUserIdTypeSchema,
} from "./contact-shared.zod"

export const contactListDepartmentsQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    parent_department_id: z.string().optional(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
    fetch_child: z.boolean().optional(),
  })
  .strict()

export const contactListDepartmentsBodySchema = emptyBodyStrictSchema

export type ContactListDepartmentsQuery = z.infer<
  typeof contactListDepartmentsQuerySchema
>

export function parseContactListDepartmentsQuery(
  raw: Record<string, unknown>,
): ContactListDepartmentsQuery {
  return contactListDepartmentsQuerySchema.parse(raw)
}

export function parseContactListDepartmentsBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return contactListDepartmentsBodySchema.parse(raw) as Record<string, never>
}
