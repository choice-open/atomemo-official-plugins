/**
 * 飞书「搜索用户」GET /open-apis/search/v1/user
 * @see https://open.feishu.cn/document/server-docs/contact-v3/user/search-users
 */
import { z } from "zod"

export const contactSearchUsersQuerySchema = z
  .object({
    query: z.string().min(1),
    page_size: z.number().int().min(1).max(200).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const contactSearchUsersBodySchema = z.object({}).strict()

export type ContactSearchUsersQuery = z.infer<typeof contactSearchUsersQuerySchema>

export function parseContactSearchUsersQuery(
  raw: Record<string, unknown>,
): ContactSearchUsersQuery {
  return contactSearchUsersQuerySchema.parse(raw)
}

export function parseContactSearchUsersBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return contactSearchUsersBodySchema.parse(raw) as Record<string, never>
}
