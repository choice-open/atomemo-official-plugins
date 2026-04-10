/**
 * 飞书「将用户或机器人拉入群聊」POST /open-apis/im/v1/chats/:chat_id/members
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/group/chat-member/create
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./im-shared.zod"

/** 查询参数 */
export const imAddChatMembersQuerySchema = z
  .object({
    member_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

/** 请求体 */
export const imAddChatMembersBodySchema = z
  .object({
    id_list: z.array(z.string()),
  })
  .strict()

export type ImAddChatMembersQuery = z.infer<typeof imAddChatMembersQuerySchema>
export type ImAddChatMembersBody = z.infer<typeof imAddChatMembersBodySchema>

export function parseImAddChatMembersQuery(
  raw: Record<string, unknown>,
): ImAddChatMembersQuery {
  return imAddChatMembersQuerySchema.parse(raw)
}

export function parseImAddChatMembersBody(
  raw: Record<string, unknown>,
): ImAddChatMembersBody {
  return imAddChatMembersBodySchema.parse(raw)
}
