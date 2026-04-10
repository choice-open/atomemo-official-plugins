/**
 * 飞书「发送消息」POST /open-apis/im/v1/messages
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/im-v1/message/create
 */
import { z } from "zod"
import { feishuReceiveIdTypeSchema, feishuMsgTypeSchema } from "./im-shared.zod"

/** 查询参数 */
export const imSendMessageQuerySchema = z
  .object({
    receive_id_type: feishuReceiveIdTypeSchema,
  })
  .strict()

/** 请求体 */
export const imSendMessageBodySchema = z
  .object({
    receive_id: z.string(),
    msg_type: feishuMsgTypeSchema,
    content: z.string(),
    uuid: z.string().optional(),
  })
  .strict()

export type ImSendMessageQuery = z.infer<typeof imSendMessageQuerySchema>
export type ImSendMessageBody = z.infer<typeof imSendMessageBodySchema>

export function parseImSendMessageQuery(
  raw: Record<string, unknown>,
): ImSendMessageQuery {
  return imSendMessageQuerySchema.parse(raw)
}

export function parseImSendMessageBody(
  raw: Record<string, unknown>,
): ImSendMessageBody {
  return imSendMessageBodySchema.parse(raw)
}
