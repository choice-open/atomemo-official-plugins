import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { createTasksClient, getAccessToken, toJSON } from "../../utils/api"
import updateTaskListSkill from "./update-task-list-skill.md" with { type: "text" }

export const updateTaskListTool: ToolDefinition = {
  name: "update-task-list",
  display_name: t("UPDATE_TASK_LIST_DISPLAY_NAME"),
  description: t("UPDATE_TASK_LIST_DESCRIPTION"),
  skill: updateTaskListSkill,
  icon: "✏️",
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
    {
      name: "title",
      type: "string",
      required: true,
      display_name: t("TITLE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("TITLE_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = createTasksClient(getAccessToken(args))
    const res = await client.tasklists.patch({
      tasklist: args.parameters.task_list_id,
      requestBody: { title: args.parameters.title },
    })
    return toJSON(res.data)
  },
}
