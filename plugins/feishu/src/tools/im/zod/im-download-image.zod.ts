/**
 * 飞书「下载图片」GET /open-apis/im/v1/images/:image_key
 */
import { emptyBodyStrictSchema } from "./im-shared.zod"

export const imDownloadImageQuerySchema = emptyBodyStrictSchema
export const imDownloadImageBodySchema = emptyBodyStrictSchema

export function parseImDownloadImageQuery(
  raw: Record<string, unknown>,
): Record<string, never> {
  return imDownloadImageQuerySchema.parse(raw) as Record<string, never>
}

export function parseImDownloadImageBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return imDownloadImageBodySchema.parse(raw) as Record<string, never>
}
