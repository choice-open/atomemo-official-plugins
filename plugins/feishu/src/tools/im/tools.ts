import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuImAddChatMembersTool } from "./im-add-chat-members"
import { feishuImBatchMessagesTool } from "./im-batch-messages"
import { feishuImCreateChatTool } from "./im-create-chat"
import { feishuImDeleteChatTool } from "./im-delete-chat"
import { feishuImDownloadFileTool } from "./im-download-file"
import { feishuImDownloadImageTool } from "./im-download-image"
import { feishuImGetChatTool } from "./im-get-chat"
import { feishuImListChatsTool } from "./im-list-chats"
import { feishuImPatchChatTool } from "./im-patch-chat"
import { feishuImRemoveChatMemberTool } from "./im-remove-chat-member"
import { feishuImSendMessageTool } from "./im-send-message"
import { feishuImUploadFileTool } from "./im-upload-file"
import { feishuImUploadImageTool } from "./im-upload-image"

export * from "./im-add-chat-members"
export * from "./im-batch-messages"
export * from "./im-create-chat"
export * from "./im-delete-chat"
export * from "./im-download-file"
export * from "./im-download-image"
export * from "./im-get-chat"
export * from "./im-list-chats"
export * from "./im-patch-chat"
export * from "./im-remove-chat-member"
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
  feishuImCreateChatTool,
  feishuImDeleteChatTool,
  feishuImListChatsTool,
  feishuImGetChatTool,
  feishuImPatchChatTool,
  feishuImAddChatMembersTool,
  feishuImRemoveChatMemberTool,
]
