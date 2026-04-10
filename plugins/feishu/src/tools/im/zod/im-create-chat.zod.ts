/**
 * 飞书「创建群聊」POST /open-apis/im/v1/chats
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/group/chat/create
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
export const imCreateChatQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    set_bot_manager: z.string().optional(),
    uuid: z.string().optional(),
  })
  .strict()

const restrictedModeSettingSchema = z
  .object({
    status: z.boolean().optional(),
    screenshot_has_permission_setting: z
      .enum(["all_members", "not_anyone"])
      .optional(),
    download_has_permission_setting: z
      .enum(["all_members", "not_anyone"])
      .optional(),
    message_has_permission_setting: z
      .enum(["all_members", "not_anyone"])
      .optional(),
  })
  .strict()

/** 请求体 */
export const imCreateChatBodySchema = z
  .object({
    avatar: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    i18n_names: i18nNameSchema.optional(),
    owner_id: z.string().optional(),
    user_id_list: z.array(z.string()).optional(),
    bot_id_list: z.array(z.string()).optional(),
    group_message_type: z.enum(["chat", "thread"]).optional(),
    chat_mode: z.enum(["group", "topic", "p2p"]).optional(),
    chat_type: z.enum(["private", "public"]).optional(),
    chat_tag: z.string().optional(),
    external: z.boolean().optional(),
    join_message_visibility: z
      .enum(["only_owner", "all_members", "not_anyone"])
      .optional(),
    leave_message_visibility: z
      .enum(["only_owner", "all_members", "not_anyone"])
      .optional(),
    membership_approval: z
      .enum(["no_approval_required", "approval_required"])
      .optional(),
    restricted_mode_setting: restrictedModeSettingSchema.optional(),
    urgent_setting: z.enum(["only_owner", "all_members"]).optional(),
    video_conference_setting: z.enum(["only_owner", "all_members"]).optional(),
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
    moderation_permission: z
      .enum(["all_members", "only_owner", "moderator_list"])
      .optional(),
    hide_member_count_setting: z.enum(["all_members", "only_owner"]).optional(),
  })
  .strict()

export type ImCreateChatQuery = z.infer<typeof imCreateChatQuerySchema>
export type ImCreateChatBody = z.infer<typeof imCreateChatBodySchema>

export function parseImCreateChatQuery(
  raw: Record<string, unknown>,
): ImCreateChatQuery {
  return imCreateChatQuerySchema.parse(raw)
}

export function parseImCreateChatBody(
  raw: Record<string, unknown>,
): ImCreateChatBody {
  return imCreateChatBodySchema.parse(raw)
}
