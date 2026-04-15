import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuApprovalApproveTaskTool } from "./approval-approve-task"
import { feishuApprovalCreateInstanceTool } from "./approval-create-instance"
import { feishuApprovalGetInstanceTool } from "./approval-get-instance"
import { feishuApprovalListInstancesTool } from "./approval-list-instances"
import { feishuApprovalRejectTaskTool } from "./approval-reject-task"
import { feishuApprovalSpecifiedRollbackTool } from "./approval-specified-rollback"
import { feishuApprovalTransferTaskTool } from "./approval-transfer-task"

export * from "./approval-approve-task"
export * from "./approval-create-instance"
export * from "./approval-get-instance"
export * from "./approval-list-instances"
export * from "./approval-reject-task"
export * from "./approval-specified-rollback"
export * from "./approval-transfer-task"

export const approvalTools: ToolDefinition[] = [
  feishuApprovalCreateInstanceTool,
  feishuApprovalGetInstanceTool,
  feishuApprovalListInstancesTool,
  feishuApprovalApproveTaskTool,
  feishuApprovalRejectTaskTool,
  feishuApprovalTransferTaskTool,
  feishuApprovalSpecifiedRollbackTool,
]
