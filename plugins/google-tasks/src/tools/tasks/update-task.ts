import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { createTasksClient, getAccessToken, toJSON } from "../../utils/api"

export const updateTaskTool: ToolDefinition = {
  name: "update-task",
  display_name: t("UPDATE_TASK_DISPLAY_NAME"),
  description: t("UPDATE_TASK_DESCRIPTION"),
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
    {
      name: "title",
      type: "string",
      required: false,
      display_name: t("TITLE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("TITLE_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "notes",
      type: "string",
      required: false,
      display_name: t("NOTES_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        placeholder: t("NOTES_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "status",
      type: "string",
      required: false,
      display_name: t("STATUS_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: [
          { label: { en_US: "Needs Action" }, value: "needsAction" },
          { label: { en_US: "Completed" }, value: "completed" },
        ],
        width: "medium",
      },
    },
    {
      name: "due",
      type: "string",
      required: false,
      display_name: t("DUE_DATE_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("DUE_DATE_HINT"),
        placeholder: t("DUE_DATE_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = createTasksClient(getAccessToken(args))
    const p = args.parameters
    const body: Record<string, string> = {}
    if (p.title) body.title = p.title
    if (p.notes) body.notes = p.notes
    if (p.status) body.status = p.status
    if (p.due) body.due = p.due
    const res = await client.tasks.patch({
      tasklist: p.task_list_id,
      task: p.task_id,
      requestBody: body,
    })
    return toJSON(res.data)
  },
}
