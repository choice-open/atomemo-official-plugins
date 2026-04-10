/**
 * 飞书「列取任务列表」GET /open-apis/task/v2/tasks
 * @see https://open.feishu.cn/document/task-v2/task/list
 */
import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./task-shared.zod"

export const taskListQuerySchema = z
  .object({
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
    completed: z.boolean().optional(),
    type: z.enum(["my_tasks"]).optional(),
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const taskListBodySchema = emptyBodyStrictSchema

export type TaskListQuery = z.infer<typeof taskListQuerySchema>

export function parseTaskListQuery(raw: Record<string, unknown>): TaskListQuery {
  return taskListQuerySchema.parse(raw)
}

export function parseTaskListBody(raw: Record<string, unknown>): Record<string, never> {
  return taskListBodySchema.parse(raw) as Record<string, never>
}
