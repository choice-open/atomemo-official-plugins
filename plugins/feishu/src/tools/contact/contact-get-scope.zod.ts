/**
 * 飞书「获取通讯录授权范围」GET /open-apis/contact/v3/scopes
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/scope/list
 */
import { z } from "zod"
import { feishuDepartmentIdTypeSchema, feishuUserIdTypeSchema } from "./contact-shared.zod"

export const contactGetScopeQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    page_size: z.number().int().min(1).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const contactGetScopeBodySchema = z.object({}).strict()

export type ContactGetScopeQuery = z.infer<typeof contactGetScopeQuerySchema>

export function parseContactGetScopeQuery(
  raw: Record<string, unknown>,
): ContactGetScopeQuery {
  return contactGetScopeQuerySchema.parse(raw)
}

export function parseContactGetScopeBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return contactGetScopeBodySchema.parse(raw) as Record<string, never>
}
