import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuTaskAddMembersTool } from "./task-add-members"
import { feishuTaskAddRemindersTool } from "./task-add-reminders"
import { feishuTaskAddTasklistTool } from "./task-add-tasklist"
import { feishuTaskCreateTool } from "./task-create"
import { feishuTaskDeleteTool } from "./task-delete"
import { feishuTaskGetTool } from "./task-get"
import { feishuTaskListTool } from "./task-list"
import { feishuTaskListTasklistsTool } from "./task-list-tasklists"
import { feishuTaskPatchTool } from "./task-patch"
import { feishuTaskRemoveMembersTool } from "./task-remove-members"
import { feishuTaskRemoveRemindersTool } from "./task-remove-reminders"
import { feishuTaskRemoveTasklistTool } from "./task-remove-tasklist"
import { feishuTasklistAddMembersTool } from "./tasklist-add-members"
import { feishuTasklistCreateTool } from "./tasklist-create"
import { feishuTasklistDeleteTool } from "./tasklist-delete"
import { feishuTasklistGetTool } from "./tasklist-get"
import { feishuTasklistListTool } from "./tasklist-list"
import { feishuTasklistListTasksTool } from "./tasklist-list-tasks"
import { feishuTasklistPatchTool } from "./tasklist-patch"
import { feishuTasklistRemoveMembersTool } from "./tasklist-remove-members"

export * from "./task-add-members"
export * from "./task-add-reminders"
export * from "./task-add-tasklist"
export * from "./task-create"
export * from "./task-delete"
export * from "./task-get"
export * from "./task-list"
export * from "./task-list-tasklists"
export * from "./task-patch"
export * from "./task-remove-members"
export * from "./task-remove-reminders"
export * from "./task-remove-tasklist"
export * from "./tasklist-add-members"
export * from "./tasklist-create"
export * from "./tasklist-delete"
export * from "./tasklist-get"
export * from "./tasklist-list"
export * from "./tasklist-list-tasks"
export * from "./tasklist-patch"
export * from "./tasklist-remove-members"

export const taskTools: ToolDefinition[] = [
  feishuTaskCreateTool,
  feishuTaskPatchTool,
  feishuTaskGetTool,
  feishuTaskDeleteTool,
  feishuTaskAddMembersTool,
  feishuTaskRemoveMembersTool,
  feishuTaskListTool,
  feishuTaskListTasklistsTool,
  feishuTaskAddTasklistTool,
  feishuTaskRemoveTasklistTool,
  feishuTaskAddRemindersTool,
  feishuTaskRemoveRemindersTool,
  feishuTasklistCreateTool,
  feishuTasklistGetTool,
  feishuTasklistPatchTool,
  feishuTasklistDeleteTool,
  feishuTasklistAddMembersTool,
  feishuTasklistRemoveMembersTool,
  feishuTasklistListTasksTool,
  feishuTasklistListTool,
]
