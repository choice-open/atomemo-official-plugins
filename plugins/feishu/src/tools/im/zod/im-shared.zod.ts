/**
 * 飞书 IM API 共用的 Zod 片段（与飞书 im v1 文档字段一致）。
 */
import { z } from "zod"

export const feishuUserIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])

export const feishuReceiveIdTypeSchema = z.enum([
  "open_id",
  "union_id",
  "user_id",
  "email",
  "chat_id",
])

export const feishuMsgTypeSchema = z.enum([
  "text",
  "post",
  "image",
  "file",
  "audio",
  "media",
  "sticker",
  "interactive",
  "share_chat",
  "share_user",
  "system",
])

export const imTextContentSchema = z
  .object({
    text: z.string(),
  })
  .strict()

export const imImageContentSchema = z
  .object({
    image_key: z.string(),
  })
  .strict()

export const imFileContentSchema = z
  .object({
    file_key: z.string(),
  })
  .strict()

export const imAudioContentSchema = z
  .object({
    file_key: z.string(),
    duration: z.number().int().optional(),
  })
  .strict()

export const imMediaContentSchema = z
  .object({
    file_key: z.string(),
  })
  .strict()

export const imStickerContentSchema = z
  .object({
    file_key: z.string(),
  })
  .strict()

export const imShareChatContentSchema = z
  .object({
    chat_id: z.string(),
  })
  .strict()

export const imShareUserContentSchema = z
  .object({
    user_id: z.string(),
  })
  .strict()

export const emptyBodyStrictSchema = z.object({}).strict()
