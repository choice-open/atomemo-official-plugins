/**
 * 飞书「下载文件」GET /open-apis/im/v1/files/:file_key
 */
import { emptyBodyStrictSchema } from "./im-shared.zod"

export const imDownloadFileQuerySchema = emptyBodyStrictSchema
export const imDownloadFileBodySchema = emptyBodyStrictSchema

export function parseImDownloadFileQuery(
  raw: Record<string, unknown>,
): Record<string, never> {
  return imDownloadFileQuerySchema.parse(raw) as Record<string, never>
}

export function parseImDownloadFileBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return imDownloadFileBodySchema.parse(raw) as Record<string, never>
}
