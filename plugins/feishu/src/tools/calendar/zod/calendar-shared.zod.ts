/**
 * 飞书 Calendar API 共用的 Zod 片段（与飞书 calendar v4 文档字段一致）。
 */
import { z } from "zod"

export const feishuUserIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])

export const calendarPermissionsSchema = z.enum([
  "private",
  "show_only_free_busy",
  "public",
])

export const calendarVisibilitySchema = z.enum(["default", "public", "private"])

export const attendeeAbilitySchema = z.enum([
  "can_see_others",
  "can_invite",
  "canModify",
])

export const freeBusyStatusSchema = z.enum(["busy", "free", "tentative"])

export const vcTypeSchema = z.enum(["none", "feishu", "third_party"])

export const eventTimestampSchema = z
  .object({
    date: z.string().optional(),
    timestamp: z.string().optional(),
    timezone: z.string().optional(),
  })
  .strict()

export const calendarEventAttendeeSchema = z
  .object({
    type: z.enum(["user", "chat", "resource", "third_party"]).optional(),
    is_optional: z.boolean().optional(),
    user_id: z.string().optional(),
    chat_id: z.string().optional(),
    room_id: z.string().optional(),
    third_party_email: z.string().optional(),
    operate_id: z.string().optional(),
  })
  .strict()

export const emptyBodyStrictSchema = z.object({}).strict()
