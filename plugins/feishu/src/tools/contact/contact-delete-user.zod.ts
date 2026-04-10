/**
 * 飞书「删除用户」DELETE /open-apis/contact/v3/users/{user_id}
 * 查询参数、请求体字段与官方文档 / SDK 一致。
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/delete
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./contact-shared.zod"

export const contactDeleteUserQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

const emailAcceptorSchema = z
  .object({
    processing_type: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
    acceptor_user_id: z.string().optional(),
  })
  .strict()

/** 文档：请求体字段均为可选 */
export const contactDeleteUserBodySchema = z
  .object({
    department_chat_acceptor_user_id: z.string().optional(),
    external_chat_acceptor_user_id: z.string().optional(),
    docs_acceptor_user_id: z.string().optional(),
    calendar_acceptor_user_id: z.string().optional(),
    application_acceptor_user_id: z.string().optional(),
    minutes_acceptor_user_id: z.string().optional(),
    survey_acceptor_user_id: z.string().optional(),
    email_acceptor: emailAcceptorSchema.optional(),
    anycross_acceptor_user_id: z.string().optional(),
  })
  .strict()

export type ContactDeleteUserQuery = z.infer<
  typeof contactDeleteUserQuerySchema
>
export type ContactDeleteUserBody = z.infer<typeof contactDeleteUserBodySchema>

export function parseContactDeleteUserQuery(
  raw: Record<string, unknown>,
): ContactDeleteUserQuery {
  return contactDeleteUserQuerySchema.parse(raw)
}

export function parseContactDeleteUserBody(
  raw: Record<string, unknown>,
): ContactDeleteUserBody {
  return contactDeleteUserBodySchema.parse(raw)
}
