import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { createTasksClient, getAccessToken } from "../../utils/api"

export const clearCompletedTasksTool: ToolDefinition = {
  name: "clear-completed-tasks",
  display_name: t("CLEAR_COMPLETED_DISPLAY_NAME"),
  description: t("CLEAR_COMPLETED_DESCRIPTION"),
  icon: "🧹",
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
      const res = await client.tasks.clear({ tasklist: taskListId })
      if (res.status === 204) {
        return { success: true, clearedTaskList: taskListId }
      }
      throw new Error(`Unexpected response status: ${res.status} ${res.statusText}`)
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || err?.message || "Unknown error"
      throw new Error(`Failed to clear completed tasks from list "${taskListId}": ${message}`)
    }
  },
}
