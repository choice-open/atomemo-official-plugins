import { z } from "zod"
import {
  feishuDepartmentIdTypeSchema,
  feishuUserIdTypeSchema,
  emptyBodyStrictSchema,
} from "./contact-shared.zod"

const objectBodySchema = z.record(z.string(), z.unknown())

export const contactActionQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .passthrough()

export const contactActionBodySchema = objectBodySchema
export const contactEmptyBodySchema = emptyBodyStrictSchema

export function parseContactActionQuery(raw: Record<string, unknown>) {
  return contactActionQuerySchema.parse(raw)
}

export function parseContactActionBody(raw: Record<string, unknown>) {
  return contactActionBodySchema.parse(raw)
}

export function parseContactEmptyBody(raw: Record<string, unknown>) {
  return contactEmptyBodySchema.parse(raw) as Record<string, never>
}
