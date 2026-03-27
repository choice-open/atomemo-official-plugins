import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { createTasksClient, getAccessToken } from "../../utils/api"
import deleteTaskListSkill from "./delete-task-list-skill.md" with { type: "text" }

export const deleteTaskListTool: ToolDefinition = {
  name: "delete-task-list",
  display_name: t("DELETE_TASK_LIST_DISPLAY_NAME"),
  description: t("DELETE_TASK_LIST_DESCRIPTION"),
  skill: deleteTaskListSkill,
  icon: "🗑️",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      display_name: t("CREDENTIAL_ID_DISPLAY_NAME"),
      credential_name: "google-tasks-oauth2",
    },
    {
      name: "task_list_id",
      type: "string",
      required: true,
      display_name: t("TASK_LIST_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("TASK_LIST_ID_HINT"),
        placeholder: t("TASK_LIST_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = createTasksClient(getAccessToken(args))
    const taskListId = args.parameters.task_list_id
    try {
      const res = await client.tasklists.delete({ tasklist: taskListId })
      if (res.status === 204) {
        return { success: true, deletedTaskList: taskListId }
      }
      throw new Error(`Unexpected response status: ${res.status} ${res.statusText}`)
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || err?.message || "Unknown error"
      throw new Error(`Failed to delete task list "${taskListId}": ${message}`)
    }
  },
}
