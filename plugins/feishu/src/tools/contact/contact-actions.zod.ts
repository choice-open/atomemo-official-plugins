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

export const contactBatchGetUsersBodySchema = z
  .object({
    user_ids: z.array(z.string()).min(1).max(50),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
  })
  .strict()

export const contactBatchGetDepartmentsBodySchema = z
  .object({
    department_ids: z.array(z.string()).min(1).max(50),
  })
  .strict()

export const contactBatchGetUserIdsBodySchema = z
  .object({
    emails: z.array(z.string()).max(50).optional(),
    mobiles: z.array(z.string()).max(50).optional(),
  })
  .strict()

export const contactFindUsersBodySchema = z
  .object({
    department_ids: z.array(z.string()).optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const contactFindUsersByDepartmentQuerySchema = z
  .object({
    department_id: z.string(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const contactListDepartmentsQuerySchema = z
  .object({
    department_id: z.string().optional(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const contactSearchDepartmentsBodySchema = z
  .object({
    query: z.string().optional(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const contactSearchUsersQuerySchema = z
  .object({
    query: z.string().optional(),
    page_size: z.number().int().min(1).max(50).optional(),
    page_token: z.string().optional(),
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const contactCreateDepartmentBodySchema = z
  .object({
    name: z.string(),
    parent_id: z.string().optional(),
    department_id: z.string().optional(),
    manager_user_id: z.string().optional(),
    leader_user_id: z.string().optional(),
    order: z.number().int().optional(),
    description: z.string().optional(),
    avatar: z
      .object({
        avatar_origin: z.string().optional(),
      })
      .optional(),
    chat_access_permission: z
      .enum(["private", "public", "my_department"])
      .optional(),
    chat_id: z.string().optional(),
    hidden: z.boolean().optional(),
    permutations: z
      .array(
        z.object({
          user_id: z.string(),
          role: z.enum(["manager", "leader", "assistant_manager"]),
        }),
      )
      .optional(),
  })
  .strict()

export const contactPatchDepartmentBodySchema = z
  .object({
    name: z.string().optional(),
    manager_user_id: z.string().optional(),
    leader_user_id: z.string().optional(),
    order: z.number().int().optional(),
    description: z.string().optional(),
    avatar: z
      .object({
        avatar_origin: z.string().optional(),
      })
      .optional(),
    chat_access_permission: z
      .enum(["private", "public", "my_department"])
      .optional(),
    chat_id: z.string().optional(),
    hidden: z.boolean().optional(),
    permutations: z
      .array(
        z.object({
          user_id: z.string(),
          role: z.enum(["manager", "leader", "assistant_manager"]),
        }),
      )
      .optional(),
  })
  .strict()

export const contactPutDepartmentBodySchema = z
  .object({
    name: z.string(),
    parent_id: z.string().optional(),
    manager_user_id: z.string().optional(),
    leader_user_id: z.string().optional(),
    order: z.number().int().optional(),
    description: z.string().optional(),
    avatar: z
      .object({
        avatar_origin: z.string().optional(),
      })
      .optional(),
    chat_access_permission: z
      .enum(["private", "public", "my_department"])
      .optional(),
    chat_id: z.string().optional(),
    hidden: z.boolean().optional(),
    permutations: z
      .array(
        z.object({
          user_id: z.string(),
          role: z.enum(["manager", "leader", "assistant_manager"]),
        }),
      )
      .optional(),
  })
  .strict()

export const contactBatchAddUsersBodySchema = z
  .object({
    users: z.array(
      z.object({
        user_id: z.string().optional(),
        open_id: z.string().optional(),
        union_id: z.string().optional(),
        email: z.string().optional(),
        mobile: z.string().optional(),
      }),
    ),
    department_id: z.string(),
    department_id_type: feishuDepartmentIdTypeSchema.optional(),
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

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

export function parseContactCreateDepartmentBody(raw: Record<string, unknown>) {
  return contactCreateDepartmentBodySchema.parse(raw)
}

export function parseContactPatchDepartmentBody(raw: Record<string, unknown>) {
  return contactPatchDepartmentBodySchema.parse(raw)
}

export function parseContactPutDepartmentBody(raw: Record<string, unknown>) {
  return contactPutDepartmentBodySchema.parse(raw)
}

export function parseContactBatchAddUsersBody(raw: Record<string, unknown>) {
  return contactBatchAddUsersBodySchema.parse(raw)
}

export function parseContactBatchGetUsersBody(raw: Record<string, unknown>) {
  return contactBatchGetUsersBodySchema.parse(raw)
}

export function parseContactBatchGetDepartmentsBody(
  raw: Record<string, unknown>,
) {
  return contactBatchGetDepartmentsBodySchema.parse(raw)
}

export function parseContactBatchGetUserIdsBody(raw: Record<string, unknown>) {
  return contactBatchGetUserIdsBodySchema.parse(raw)
}

export function parseContactFindUsersBody(raw: Record<string, unknown>) {
  return contactFindUsersBodySchema.parse(raw)
}

export function parseContactFindUsersByDepartmentQuery(
  raw: Record<string, unknown>,
) {
  return contactFindUsersByDepartmentQuerySchema.parse(raw)
}

export function parseContactListDepartmentsQuery(raw: Record<string, unknown>) {
  return contactListDepartmentsQuerySchema.parse(raw)
}

export function parseContactSearchDepartmentsBody(
  raw: Record<string, unknown>,
) {
  return contactSearchDepartmentsBodySchema.parse(raw)
}

export function parseContactSearchUsersQuery(raw: Record<string, unknown>) {
  return contactSearchUsersQuerySchema.parse(raw)
}
