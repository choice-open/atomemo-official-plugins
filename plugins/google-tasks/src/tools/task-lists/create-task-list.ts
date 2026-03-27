import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { createTasksClient, getAccessToken, toJSON } from "../../utils/api"
import createTaskListSkill from "./create-task-list-skill.md" with { type: "text" }

export const createTaskListTool: ToolDefinition = {
  name: "create-task-list",
  display_name: t("CREATE_TASK_LIST_DISPLAY_NAME"),
  description: t("CREATE_TASK_LIST_DESCRIPTION"),
  skill: createTaskListSkill,
  icon: "📝",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      display_name: t("CREDENTIAL_ID_DISPLAY_NAME"),
      credential_name: "google-tasks-oauth2",
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
    const res = await client.tasklists.insert({
      requestBody: { title: args.parameters.title },
    })
    return toJSON(res.data)
  },
}
