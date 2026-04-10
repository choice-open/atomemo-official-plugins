import { z } from "zod"
import { emptyBodyStrictSchema, feishuUserIdTypeSchema } from "./task-shared.zod"

const objectBodySchema = z.record(z.string(), z.unknown())

export const taskCommonUserQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const taskAddCommentQuerySchema = taskCommonUserQuerySchema
export const taskAddCommentBodySchema = z
  .object({
    content: z.string().optional(),
    rich_content: z.string().optional(),
    reply_to_comment_id: z.string().optional(),
    resource_type: z.enum(["task"]).optional(),
    resource_id: z.string().optional(),
  })
  .strict()

export const taskAddMembersQuerySchema = taskCommonUserQuerySchema
export const taskAddMembersBodySchema = z
  .object({
    id_list: z.array(z.string()).optional(),
    members: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .strict()

export const taskCompleteQuerySchema = taskCommonUserQuerySchema
export const taskCompleteBodySchema = objectBodySchema

export const taskCreateSubtaskQuerySchema = taskCommonUserQuerySchema
export const taskCreateSubtaskBodySchema = objectBodySchema

export const taskCreateTasklistQuerySchema = taskCommonUserQuerySchema
export const taskCreateTasklistBodySchema = objectBodySchema

export const taskDeleteQuerySchema = taskCommonUserQuerySchema
export const taskDeleteBodySchema = emptyBodyStrictSchema

export const taskPatchQuerySchema = taskCommonUserQuerySchema
export const taskPatchBodySchema = objectBodySchema

export const taskRemoveMemberQuerySchema = taskCommonUserQuerySchema
export const taskRemoveMemberBodySchema = emptyBodyStrictSchema

export function parseTaskAddCommentQuery(raw: Record<string, unknown>) {
  return taskAddCommentQuerySchema.parse(raw)
}
export function parseTaskAddCommentBody(raw: Record<string, unknown>) {
  return taskAddCommentBodySchema.parse(raw)
}
export function parseTaskAddMembersQuery(raw: Record<string, unknown>) {
  return taskAddMembersQuerySchema.parse(raw)
}
export function parseTaskAddMembersBody(raw: Record<string, unknown>) {
  return taskAddMembersBodySchema.parse(raw)
}
export function parseTaskCompleteQuery(raw: Record<string, unknown>) {
  return taskCompleteQuerySchema.parse(raw)
}
export function parseTaskCompleteBody(raw: Record<string, unknown>) {
  return taskCompleteBodySchema.parse(raw)
}
export function parseTaskCreateSubtaskQuery(raw: Record<string, unknown>) {
  return taskCreateSubtaskQuerySchema.parse(raw)
}
export function parseTaskCreateSubtaskBody(raw: Record<string, unknown>) {
  return taskCreateSubtaskBodySchema.parse(raw)
}
export function parseTaskCreateTasklistQuery(raw: Record<string, unknown>) {
  return taskCreateTasklistQuerySchema.parse(raw)
}
export function parseTaskCreateTasklistBody(raw: Record<string, unknown>) {
  return taskCreateTasklistBodySchema.parse(raw)
}
export function parseTaskDeleteQuery(raw: Record<string, unknown>) {
  return taskDeleteQuerySchema.parse(raw)
}
export function parseTaskDeleteBody(raw: Record<string, unknown>) {
  return taskDeleteBodySchema.parse(raw) as Record<string, never>
}
export function parseTaskPatchQuery(raw: Record<string, unknown>) {
  return taskPatchQuerySchema.parse(raw)
}
export function parseTaskPatchBody(raw: Record<string, unknown>) {
  return taskPatchBodySchema.parse(raw)
}
export function parseTaskRemoveMemberQuery(raw: Record<string, unknown>) {
  return taskRemoveMemberQuerySchema.parse(raw)
}
export function parseTaskRemoveMemberBody(raw: Record<string, unknown>) {
  return taskRemoveMemberBodySchema.parse(raw) as Record<string, never>
}
