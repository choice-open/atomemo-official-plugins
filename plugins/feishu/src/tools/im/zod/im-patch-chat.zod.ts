/**
 * 飞书「更新群信息」PUT /open-apis/im/v1/chats/:chat_id
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/group/chat/update
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./im-shared.zod"

const i18nNameSchema = z
  .object({
    zh_cn: z.string().optional(),
    ja_jp: z.string().optional(),
    en_us: z.string().optional(),
  })
  .strict()

/** 查询参数 */
export const imPatchChatQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

/** 请求体 */
export const imPatchChatBodySchema = z
  .object({
    avatar: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    i18n_names: i18nNameSchema.optional(),
    owner_id: z.string().optional(),
    add_member_permission: z
      .enum(["all_members", "only_owner", "moderator_list", "no_one"])
      .optional(),
    share_card_permission: z
      .enum(["allowed", "only_owner", "no_one"])
      .optional(),
    at_all_permission: z
      .enum(["all_members", "only_owner", "moderator_list", "no_one"])
      .optional(),
    edit_permission: z.enum(["all_members", "only_owner"]).optional(),
    membership_approval: z
      .enum(["no_approval_required", "approval_required"])
      .optional(),
    moderation_permission: z
      .enum(["all_members", "only_owner", "moderator_list"])
      .optional(),
    hide_member_count_setting: z.enum(["all_members", "only_owner"]).optional(),
  })
  .strict()

export type ImPatchChatQuery = z.infer<typeof imPatchChatQuerySchema>
export type ImPatchChatBody = z.infer<typeof imPatchChatBodySchema>

export function parseImPatchChatQuery(
  raw: Record<string, unknown>,
): ImPatchChatQuery {
  return imPatchChatQuerySchema.parse(raw)
}

export function parseImPatchChatBody(
  raw: Record<string, unknown>,
): ImPatchChatBody {
  return imPatchChatBodySchema.parse(raw)
}
