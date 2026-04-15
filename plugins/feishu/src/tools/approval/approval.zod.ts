import { z } from "zod"

const userIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])

const approvalTaskActionQuerySchema = z
  .object({
    user_id_type: userIdTypeSchema.optional(),
  })
  .strict()

const emptyQuerySchema = z.object({}).strict()
const approvalInstanceQuerySchema = z
  .object({
    user_id_type: userIdTypeSchema.optional(),
    locale: z.string().optional(),
  })
  .strict()
const approvalListInstancesQuerySchema = z
  .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
  .default({})

export function parseApprovalCreateInstanceQuery(raw: Record<string, unknown>) {
  return emptyQuerySchema.parse(raw)
}

export function parseApprovalGetInstanceQuery(raw: Record<string, unknown>) {
  return approvalInstanceQuerySchema.parse(raw)
}

export function parseApprovalListInstancesQuery(raw: Record<string, unknown>) {
  return approvalListInstancesQuerySchema.parse(raw)
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
