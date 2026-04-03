import { z } from "zod/v4-mini"

function nullishSchema<T extends z.ZodMiniType>(schema: T) {
  return z.optional(z.nullable(schema))
}

export function parseWithSchema<T extends z.ZodMiniType>(
  schema: T,
  value: unknown,
  message: string,
): z.infer<T> {
  const result = schema.safeParse(value)
  if (!result.success) {
    throw new Error(message)
  }
  return result.data
}

export const promptParametersSchema = z.object({
  prompt: nullishSchema(z.string()),
})

export const credentialIdParametersSchema = z.object({
  credentialId: nullishSchema(z.string()),
})

export const credentialSchema = z.object({
  api_key: z.string(),
  base_url: nullishSchema(z.string()),
})

export const generateConfigParametersSchema = z.object({
  model: nullishSchema(z.string()),
  aspect_ratio: nullishSchema(z.string()),
  resolution: nullishSchema(z.string()),
  thinking_level: nullishSchema(z.string()),
  include_thoughts: nullishSchema(z.boolean()),
  enable_search_grounding: nullishSchema(z.boolean()),
  upload_to_storage: nullishSchema(z.boolean()),
})

export const credentialsSchema = z.record(
  z.string(),
  credentialSchema,
)

export const downloadedFileSchema = z.object({
  content: nullishSchema(z.string()),
})
