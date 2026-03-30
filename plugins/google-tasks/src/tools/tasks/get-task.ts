import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { createTasksClient, getAccessToken, toJSON } from "../../utils/api"
import getTaskSkill from "./get-task-skill.md" with { type: "text" }

export const getTaskTool: ToolDefinition = {
  name: "get-task",
  display_name: t("GET_TASK_DISPLAY_NAME"),
  description: t("GET_TASK_DESCRIPTION"),
  skill: getTaskSkill,
  icon: "🔍",
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
      name: "task_id",
      type: "string",
      required: true,
      display_name: t("TASK_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("TASK_ID_HINT"),
        placeholder: t("TASK_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = createTasksClient(getAccessToken(args))
    const res = await client.tasks.get({
      tasklist: args.parameters.task_list_id,
      task: args.parameters.task_id,
    })
    return toJSON(res.data)
  },
}
