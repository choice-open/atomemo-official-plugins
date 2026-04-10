/**
 * 飞书「创建任务」POST /open-apis/task/v1/tasks
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/task-v1/task/create
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./task-shared.zod"

const taskDueSchema = z
  .object({
    time: z.string().optional(),
    timezone: z.string().optional(),
    is_all_day: z.boolean().optional(),
  })
  .strict()

const taskOriginHrefSchema = z
  .object({
    url: z.string().optional(),
    title: z.string().optional(),
  })
  .strict()

const taskOriginSchema = z
  .object({
    platform_i18n_name: z.string(),
    href: taskOriginHrefSchema.optional(),
  })
  .strict()

/** 查询参数 */
export const taskCreateQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

/** 请求体 */
export const taskCreateBodySchema = z
  .object({
    tasklist_id: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    rich_summary: z.string().optional(),
    rich_description: z.string().optional(),
    extra: z.string().optional(),
    due: taskDueSchema.optional(),
    origin: taskOriginSchema,
    can_edit: z.boolean().optional(),
    custom: z.string().optional(),
    collaborator_ids: z.array(z.string()).optional(),
    follower_ids: z.array(z.string()).optional(),
    repeat_rule: z.string().optional(),
  })
  .strict()

export type TaskCreateQuery = z.infer<typeof taskCreateQuerySchema>
export type TaskCreateBody = z.infer<typeof taskCreateBodySchema>

export function parseTaskCreateQuery(
  raw: Record<string, unknown>,
): TaskCreateQuery {
  return taskCreateQuerySchema.parse(raw)
}

export function parseTaskCreateBody(
  raw: Record<string, unknown>,
): TaskCreateBody {
  return taskCreateBodySchema.parse(raw)
}
