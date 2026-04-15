import { z } from "zod"

const receiveIdTypeSchema = z.enum([
  "open_id",
  "union_id",
  "user_id",
  "email",
  "chat_id",
])

const emptyQuerySchema = z.object({}).strict()

export function parseImSendMessageQuery(raw: Record<string, unknown>) {
  return z
    .object({
      receive_id_type: receiveIdTypeSchema,
    })
    .strict()
    .parse(raw)
}

export function parseImEmptyQuery(raw: Record<string, unknown>) {
  return emptyQuerySchema.parse(raw)
}
