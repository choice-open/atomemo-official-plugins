import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuTaskAddCommentTool } from "./task-add-comment"
import { feishuTaskAddMembersTool } from "./task-add-members"
import { feishuTaskCompleteTool } from "./task-complete"
import { feishuTaskCreateTool } from "./task-create"
import { feishuTaskCreateSubtaskTool } from "./task-create-subtask"
import { feishuTaskCreateTasklistTool } from "./task-create-tasklist"
import { feishuTaskDeleteTool } from "./task-delete"
import { feishuTaskGetTool } from "./task-get"
import { feishuTaskListTool } from "./task-list"
import { feishuTaskListCommentsTool } from "./task-list-comments"
import { feishuTaskListSubtasksTool } from "./task-list-subtasks"
import { feishuTaskListTasklistsTool } from "./task-list-tasklists"
import { feishuTaskPatchTool } from "./task-patch"
import { feishuTaskRemoveMemberTool } from "./task-remove-member"

export * from "./task-add-comment"
export * from "./task-add-members"
export * from "./task-complete"
export * from "./task-create"
export * from "./task-create-subtask"
export * from "./task-create-tasklist"
export * from "./task-delete"
export * from "./task-get"
export * from "./task-list"
export * from "./task-list-comments"
export * from "./task-list-subtasks"
export * from "./task-list-tasklists"
export * from "./task-patch"
export * from "./task-remove-member"

export const taskTools: ToolDefinition[] = [
  feishuTaskCreateTool,
  feishuTaskGetTool,
  feishuTaskPatchTool,
  feishuTaskDeleteTool,
  feishuTaskCompleteTool,
  feishuTaskListTool,
  feishuTaskAddMembersTool,
  feishuTaskRemoveMemberTool,
  feishuTaskCreateSubtaskTool,
  feishuTaskListSubtasksTool,
  feishuTaskCreateTasklistTool,
  feishuTaskListTasklistsTool,
  feishuTaskListCommentsTool,
  feishuTaskAddCommentTool,
]
