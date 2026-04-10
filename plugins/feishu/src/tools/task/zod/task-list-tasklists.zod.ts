/**
 * 飞书「获取清单列表」GET /open-apis/task/v2/tasklists
 * @see https://open.feishu.cn/document/task-v2/tasklist/list
 */
import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./task-shared.zod"

export const taskListTasklistsQuerySchema = z
  .object({
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const taskListTasklistsBodySchema = emptyBodyStrictSchema

export type TaskListTasklistsQuery = z.infer<typeof taskListTasklistsQuerySchema>

export function parseTaskListTasklistsQuery(
  raw: Record<string, unknown>,
): TaskListTasklistsQuery {
  return taskListTasklistsQuerySchema.parse(raw)
}

export function parseTaskListTasklistsBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return taskListTasklistsBodySchema.parse(raw) as Record<string, never>
}
