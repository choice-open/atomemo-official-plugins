/**
 * 飞书「获取用户或机器人所在的群列表」GET /open-apis/im/v1/chats
 * @see https://open.feishu.cn/document/server-docs/group/chat/list
 */
import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./im-shared.zod"

export const imListChatsQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    sort_type: z.enum(["ByCreateTimeAsc", "ByActiveTimeDesc"]).optional(),
    page_token: z.string().optional(),
    page_size: z.number().int().min(1).max(100).default(20).optional(),
  })
  .strict()

export const imListChatsBodySchema = emptyBodyStrictSchema

export type ImListChatsQuery = z.infer<typeof imListChatsQuerySchema>

export function parseImListChatsQuery(
  raw: Record<string, unknown>,
): ImListChatsQuery {
  return imListChatsQuerySchema.parse(raw)
}

export function parseImListChatsBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return imListChatsBodySchema.parse(raw) as Record<string, never>
}
