import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { createTasksClient, getAccessToken, toJSON } from "../../utils/api"
import listTasksSkill from "./list-tasks-skill.md" with { type: "text" }

function coerceBoolean(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === null) return defaultValue
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    const s = value.toLowerCase().trim()
    if (s === "true" || s === "1") return true
    if (s === "false" || s === "0") return false
  }
  return defaultValue
}

export const listTasksTool: ToolDefinition = {
  name: "list-tasks",
  display_name: t("LIST_TASKS_DISPLAY_NAME"),
  description: t("LIST_TASKS_DESCRIPTION"),
  skill: listTasksSkill,
  icon: "📄",
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
    {
      name: "show_completed",
      type: "boolean",
      required: false,
      default: true,
      display_name: t("SHOW_COMPLETED_DISPLAY_NAME"),
      ui: {
        component: "switch",
        hint: t("SHOW_COMPLETED_HINT"),
        width: "medium",
      },
    },
    {
      name: "show_deleted",
      type: "boolean",
      required: false,
      default: false,
      display_name: t("SHOW_DELETED_DISPLAY_NAME"),
      ui: {
        component: "switch",
        hint: t("SHOW_DELETED_HINT"),
        width: "medium",
      },
    },
    {
      name: "show_hidden",
      type: "boolean",
      required: false,
      default: false,
      display_name: t("SHOW_HIDDEN_DISPLAY_NAME"),
      ui: {
        component: "switch",
        hint: t("SHOW_HIDDEN_HINT"),
        width: "medium",
      },
    },
    {
      name: "due_min",
      type: "string",
      required: false,
      display_name: t("DUE_MIN_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("DUE_MIN_HINT"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "due_max",
      type: "string",
      required: false,
      display_name: t("DUE_MAX_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("DUE_MAX_HINT"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "updated_min",
      type: "string",
      required: false,
      display_name: t("UPDATED_MIN_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("UPDATED_MIN_HINT"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "completed_min",
      type: "string",
      required: false,
      display_name: t("COMPLETED_MIN_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("COMPLETED_MIN_HINT"),
        support_expression: true,
        width: "medium",
      },
    },
    {
      name: "completed_max",
      type: "string",
      required: false,
      display_name: t("COMPLETED_MAX_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("COMPLETED_MAX_HINT"),
        support_expression: true,
        width: "medium",
      },
    },
  ],
  async invoke({ args }) {
    const client = createTasksClient(getAccessToken(args))
    const p = args.parameters

    const showCompleted = coerceBoolean(p.show_completed, true)
    const showHiddenExplicit = coerceBoolean(p.show_hidden, false)
    // Google API: showHidden must be true to return tasks completed in web/mobile clients.
    const showHidden = showHiddenExplicit || showCompleted
    const showDeleted = coerceBoolean(p.show_deleted, false)

    const res = await client.tasks.list({
      tasklist: p.task_list_id,
      maxResults: p.max_results || undefined,
      pageToken: p.page_token || undefined,
      showCompleted,
      showDeleted,
      showHidden,
      dueMin: p.due_min?.trim() || undefined,
      dueMax: p.due_max?.trim() || undefined,
      updatedMin: p.updated_min?.trim() || undefined,
      completedMin: p.completed_min?.trim() || undefined,
      completedMax: p.completed_max?.trim() || undefined,
    })
    return toJSON(res.data)
  },
}
