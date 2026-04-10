/**
 * 飞书「获取任务详情」GET /open-apis/task/v2/tasks/:task_guid
 * @see https://open.feishu.cn/document/task-v2/task/get
 */
import { z } from "zod"
import { emptyBodyStrictSchema } from "../contact/contact-shared.zod"

/** 文档：查询参数（均为可选） */
export const taskGetQuerySchema = z
  .object({
    user_id_type: z.enum(["open_id", "union_id", "user_id"]).optional(),
  })
  .strict()

/** GET 无请求体，仅允许空对象 */
export const taskGetBodySchema = emptyBodyStrictSchema

export type TaskGetQuery = z.infer<typeof taskGetQuerySchema>

export function parseTaskGetQuery(raw: Record<string, unknown>): TaskGetQuery {
  return taskGetQuerySchema.parse(raw)
}

export function parseTaskGetBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return taskGetBodySchema.parse(raw) as Record<string, never>
}
