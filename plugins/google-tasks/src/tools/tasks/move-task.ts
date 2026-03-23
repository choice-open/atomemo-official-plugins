import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { createTasksClient, getAccessToken, toJSON } from "../../utils/api"

export const moveTaskTool: ToolDefinition = {
  name: "move-task",
  display_name: t("MOVE_TASK_DISPLAY_NAME"),
  description: t("MOVE_TASK_DESCRIPTION"),
  icon: "↕️",
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
      name: "parent",
      type: "string",
      required: false,
      display_name: t("PARENT_TASK_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("PARENT_TASK_ID_HINT"),
        placeholder: t("PARENT_TASK_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "previous",
      type: "string",
      required: false,
      display_name: t("PREVIOUS_TASK_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("PREVIOUS_TASK_ID_HINT"),
        placeholder: t("PREVIOUS_TASK_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "destination_tasklist",
      type: "string",
      required: false,
      display_name: t("DESTINATION_TASK_LIST_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("DESTINATION_TASK_LIST_ID_HINT"),
        placeholder: t("DESTINATION_TASK_LIST_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = createTasksClient(getAccessToken(args))
    const p = args.parameters
    const res = await client.tasks.move({
      tasklist: p.task_list_id,
      task: p.task_id,
      parent: p.parent || undefined,
      previous: p.previous || undefined,
      destinationTasklist: p.destination_tasklist || undefined,
    })
    return toJSON(res.data)
  },
}
