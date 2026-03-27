import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { createTasksClient, getAccessToken, toJSON } from "../../utils/api"
import listTaskListsSkill from "./list-task-lists-skill.md" with {
  type: "text",
}

export const listTaskListsTool: ToolDefinition = {
  name: "list-task-lists",
  display_name: t("LIST_TASK_LISTS_DISPLAY_NAME"),
  description: t("LIST_TASK_LISTS_DESCRIPTION"),
  skill: listTaskListsSkill,
  icon: "📋",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      display_name: t("CREDENTIAL_ID_DISPLAY_NAME"),
      credential_name: "google-tasks-oauth2",
    },
    {
      name: "max_results",
      type: "number",
      required: false,
      display_name: t("MAX_RESULTS_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("MAX_RESULTS_HINT"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "page_token",
      type: "string",
      required: false,
      display_name: t("PAGE_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("PAGE_TOKEN_HINT"),
        placeholder: t("PAGE_TOKEN_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
    },
  ],
  async invoke({ args }) {
    const client = createTasksClient(getAccessToken(args))
    const res = await client.tasklists.list({
      maxResults: args.parameters.max_results || undefined,
      pageToken: args.parameters.page_token || undefined,
    })
    return toJSON(res.data)
  },
}
