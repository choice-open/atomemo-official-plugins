import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuImBatchMessagesTool } from "./im-batch-messages"
import { feishuImDownloadFileTool } from "./im-download-file"
import { feishuImDownloadImageTool } from "./im-download-image"
import { feishuImSendMessageTool } from "./im-send-message"
import { feishuImUploadFileTool } from "./im-upload-file"
import { feishuImUploadImageTool } from "./im-upload-image"

export * from "./im-batch-messages"
export * from "./im-download-file"
export * from "./im-download-image"
export * from "./im-send-message"
export * from "./im-upload-file"
export * from "./im-upload-image"

export const imTools: ToolDefinition[] = [
  feishuImSendMessageTool,
  feishuImBatchMessagesTool,
  feishuImUploadImageTool,
  feishuImDownloadImageTool,
  feishuImUploadFileTool,
  feishuImDownloadFileTool,
]
