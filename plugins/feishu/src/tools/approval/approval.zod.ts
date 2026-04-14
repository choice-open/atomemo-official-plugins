import { z } from "zod"

const userIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])

const approvalTaskActionQuerySchema = z
  .object({
    user_id_type: userIdTypeSchema.optional(),
  })
  .strict()

const emptyQuerySchema = z.object({}).strict()

export function parseApprovalCreateInstanceQuery(raw: Record<string, unknown>) {
  return emptyQuerySchema.parse(raw)
}

export function parseApprovalApproveTaskQuery(raw: Record<string, unknown>) {
  return approvalTaskActionQuerySchema.parse(raw)
}

export function parseApprovalRejectTaskQuery(raw: Record<string, unknown>) {
  return approvalTaskActionQuerySchema.parse(raw)
}

export function parseApprovalTransferTaskQuery(raw: Record<string, unknown>) {
  return approvalTaskActionQuerySchema.parse(raw)
}

export function parseApprovalSpecifiedRollbackQuery(
  raw: Record<string, unknown>,
) {
  return approvalTaskActionQuerySchema.parse(raw)
}
