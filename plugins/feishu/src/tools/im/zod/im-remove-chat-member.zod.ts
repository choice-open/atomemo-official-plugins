/**
 * 飞书「移除群成员」DELETE /open-apis/im/v1/chats/:chat_id/members
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/group/chat-member/delete
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./im-shared.zod"

/** 查询参数 */
export const imRemoveChatMemberQuerySchema = z
  .object({
    member_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

/** 请求体 */
export const imRemoveChatMemberBodySchema = z
  .object({
    id_list: z.array(z.string()),
  })
  .strict()

export type ImRemoveChatMemberQuery = z.infer<
  typeof imRemoveChatMemberQuerySchema
>
export type ImRemoveChatMemberBody = z.infer<
  typeof imRemoveChatMemberBodySchema
>

export function parseImRemoveChatMemberQuery(
  raw: Record<string, unknown>,
): ImRemoveChatMemberQuery {
  return imRemoveChatMemberQuerySchema.parse(raw)
}

export function parseImRemoveChatMemberBody(
  raw: Record<string, unknown>,
): ImRemoveChatMemberBody {
  return imRemoveChatMemberBodySchema.parse(raw)
}
