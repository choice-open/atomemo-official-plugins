import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./im-shared.zod"

const objectBodySchema = z.record(z.string(), z.unknown())

export const imActionQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .passthrough()

export const imActionBodySchema = objectBodySchema
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
