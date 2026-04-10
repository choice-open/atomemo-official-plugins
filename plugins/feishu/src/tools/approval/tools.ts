import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuApprovalBatchGetInstanceIdsTool } from "./approval-batch-get-instance-ids"
import { feishuApprovalCreateInstanceTool } from "./approval-create-instance"
import { feishuApprovalGetInstanceTool } from "./approval-get-instance"
import { feishuApprovalListDefinitionsTool } from "./approval-list-definitions"
import { feishuApprovalQueryInstancesTool } from "./approval-query-instances"
import { feishuApprovalTaskAddSignerTool } from "./approval-task-add-signer"
import { feishuApprovalTaskApproveTool } from "./approval-task-approve"
import { feishuApprovalTaskRejectTool } from "./approval-task-reject"
import { feishuApprovalTaskTransferTool } from "./approval-task-transfer"

export * from "./approval-batch-get-instance-ids"
export * from "./approval-create-instance"
export * from "./approval-get-instance"
export * from "./approval-list-definitions"
export * from "./approval-query-instances"
export * from "./approval-task-add-signer"
export * from "./approval-task-approve"
export * from "./approval-task-reject"
export * from "./approval-task-transfer"

export const approvalTools: ToolDefinition[] = [
  feishuApprovalCreateInstanceTool,
  feishuApprovalGetInstanceTool,
  feishuApprovalQueryInstancesTool,
  feishuApprovalBatchGetInstanceIdsTool,
  feishuApprovalTaskApproveTool,
  feishuApprovalTaskRejectTool,
  feishuApprovalTaskTransferTool,
  feishuApprovalTaskAddSignerTool,
  feishuApprovalListDefinitionsTool,
]
