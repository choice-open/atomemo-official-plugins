import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./im-shared.zod"

const batchMsgContentSchema = z
  .object({
    text: z.string().optional(),
    image: z.string().optional(),
    post: z.record(z.string(), z.unknown()).optional(),
    share_chat: z.string().optional(),
  })
  .strict()

export const imBatchMessageBodySchema = z
  .object({
    open_ids: z.array(z.string()).optional(),
    user_ids: z.array(z.string()).optional(),
    union_ids: z.array(z.string()).optional(),
    department_ids: z.array(z.string()).optional(),
    msg_type: z.enum(["text", "image", "post", "share_chat", "interactive"]),
    content: batchMsgContentSchema.optional(),
    card: z.record(z.string(), z.unknown()).optional(),
  })
  .strict()

const objectBodySchema = z.record(z.string(), z.unknown())

export const imActionQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .passthrough()

export const imActionBodySchema = z.union([
  imBatchMessageBodySchema,
  objectBodySchema,
])
export const imEmptyBodySchema = emptyBodyStrictSchema

export function parseImActionQuery(raw: Record<string, unknown>) {
  return imActionQuerySchema.parse(raw)
}

export function parseImActionBody(raw: Record<string, unknown>) {
  return imActionBodySchema.parse(raw)
}

export function parseImEmptyBody(raw: Record<string, unknown>) {
  return imEmptyBodySchema.parse(raw) as Record<string, never>
}
