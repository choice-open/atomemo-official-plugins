/**
 * 飞书「获取群信息」GET /open-apis/im/v1/chats/:chat_id
 * @see https://open.feishu.cn/document/server-docs/group/chat/get-2
 */
import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./im-shared.zod"

/** 文档：查询参数（均为可选） */
export const imGetChatQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

/** GET 无请求体，仅允许空对象 */
export const imGetChatBodySchema = emptyBodyStrictSchema

export type ImGetChatQuery = z.infer<typeof imGetChatQuerySchema>

export function parseImGetChatQuery(
  raw: Record<string, unknown>,
): ImGetChatQuery {
  return imGetChatQuerySchema.parse(raw)
}

export function parseImGetChatBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return imGetChatBodySchema.parse(raw) as Record<string, never>
}
