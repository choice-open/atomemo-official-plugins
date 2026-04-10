import { z } from "zod"
import {
  emptyBodyStrictSchema,
  feishuUserIdTypeSchema,
} from "./approval-shared.zod"

const objectBodySchema = z.record(z.string(), z.unknown())

export const approvalCommonQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const approvalTaskApproveQuerySchema = approvalCommonQuerySchema
export const approvalTaskApproveBodySchema = z
  .object({
    task_id: z.string(),
    comment: z.string().optional(),
  })
  .strict()

export const approvalTaskTransferQuerySchema = approvalCommonQuerySchema
export const approvalTaskTransferBodySchema = z
  .object({
    task_id: z.string(),
    assignee_id: z.string(),
  })
  .strict()

export const approvalTaskRejectQuerySchema = approvalCommonQuerySchema
export const approvalTaskRejectBodySchema = z
  .object({
    task_id: z.string(),
    reason: z.string().optional(),
  })
  .strict()

export const approvalTaskAddSignerQuerySchema = approvalCommonQuerySchema
export const approvalTaskAddSignerBodySchema = z
  .object({
    task_id: z.string(),
    approver_id: z.string(),
    sign_type: z.enum(["before", "after"]).optional(),
    approval_method: z.enum(["or", "and"]).optional(),
  })
  .strict()

export const approvalQueryInstancesQuerySchema = approvalCommonQuerySchema
export const approvalQueryInstancesBodySchema = objectBodySchema

export const approvalCreateInstanceQuerySchema = approvalCommonQuerySchema
export const approvalCreateInstanceBodySchema = objectBodySchema

export const approvalEmptyBodySchema = emptyBodyStrictSchema

export function parseApprovalTaskApproveQuery(raw: Record<string, unknown>) {
  return approvalTaskApproveQuerySchema.parse(raw)
}
export function parseApprovalTaskApproveBody(raw: Record<string, unknown>) {
  return approvalTaskApproveBodySchema.parse(raw)
}
export function parseApprovalTaskTransferQuery(raw: Record<string, unknown>) {
  return approvalTaskTransferQuerySchema.parse(raw)
}
export function parseApprovalTaskTransferBody(raw: Record<string, unknown>) {
  return approvalTaskTransferBodySchema.parse(raw)
}
export function parseApprovalTaskRejectQuery(raw: Record<string, unknown>) {
  return approvalTaskRejectQuerySchema.parse(raw)
}
export function parseApprovalTaskRejectBody(raw: Record<string, unknown>) {
  return approvalTaskRejectBodySchema.parse(raw)
}
export function parseApprovalTaskAddSignerQuery(raw: Record<string, unknown>) {
  return approvalTaskAddSignerQuerySchema.parse(raw)
}
export function parseApprovalTaskAddSignerBody(raw: Record<string, unknown>) {
  return approvalTaskAddSignerBodySchema.parse(raw)
}
export function parseApprovalQueryInstancesQuery(raw: Record<string, unknown>) {
  return approvalQueryInstancesQuerySchema.parse(raw)
}
export function parseApprovalQueryInstancesBody(raw: Record<string, unknown>) {
  return approvalQueryInstancesBodySchema.parse(raw)
}
export function parseApprovalCreateInstanceQuery(raw: Record<string, unknown>) {
  return approvalCreateInstanceQuerySchema.parse(raw)
}
export function parseApprovalCreateInstanceBody(raw: Record<string, unknown>) {
  return approvalCreateInstanceBodySchema.parse(raw)
}
