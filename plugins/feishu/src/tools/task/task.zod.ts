import { z } from "zod"

const userIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])

const commonQuerySchema = z
  .object({
    user_id_type: userIdTypeSchema.optional(),
  })
  .strict()

const emptyQuerySchema = z.object({}).strict()

const listQuerySchema = z
  .object({
    user_id_type: userIdTypeSchema.optional(),
    page_size: z.number().int().positive().optional(),
    page_token: z.string().optional(),
    completed: z.boolean().optional(),
    type: z.string().optional(),
  })
  .strict()

const tasklistListTasksQuerySchema = z
  .object({
    user_id_type: userIdTypeSchema.optional(),
    page_size: z.number().int().positive().optional(),
    page_token: z.string().optional(),
    completed: z.boolean().optional(),
    created_from: z.string().optional(),
    created_to: z.string().optional(),
  })
  .strict()

export function parseTaskCreateQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTaskPatchQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTaskGetQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTaskDeleteQuery(raw: Record<string, unknown>) {
  return emptyQuerySchema.parse(raw)
}
export function parseTaskAddMembersQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTaskRemoveMembersQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTaskListQuery(raw: Record<string, unknown>) {
  return listQuerySchema.parse(raw)
}
export function parseTaskListTasklistsQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTaskAddTasklistQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTaskRemoveTasklistQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTaskAddRemindersQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTaskRemoveRemindersQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}

export function parseTasklistCreateQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTasklistGetQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTasklistPatchQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTasklistDeleteQuery(raw: Record<string, unknown>) {
  return emptyQuerySchema.parse(raw)
}
export function parseTasklistAddMembersQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTasklistRemoveMembersQuery(raw: Record<string, unknown>) {
  return commonQuerySchema.parse(raw)
}
export function parseTasklistListTasksQuery(raw: Record<string, unknown>) {
  return tasklistListTasksQuerySchema.parse(raw)
}
export function parseTasklistListQuery(raw: Record<string, unknown>) {
  return listQuerySchema.parse(raw)
}
