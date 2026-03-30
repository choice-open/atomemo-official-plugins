import type { BaseTranslation } from "../i18n-types"

const en_US = {
  // Plugin
  PLUGIN_DISPLAY_NAME: "Google Tasks",
  PLUGIN_DESCRIPTION:
    "Manage Google Tasks - create, read, update, and delete tasks and task lists",

  // Credential
  CREDENTIAL_DISPLAY_NAME: "Google Tasks OAuth2",
  CREDENTIAL_DESCRIPTION: "OAuth2 credential for accessing Google Tasks API",
  CLIENT_ID_DISPLAY_NAME: "Client ID",
  CLIENT_ID_PLACEHOLDER: "Enter your Google OAuth2 Client ID",
  CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  CLIENT_SECRET_PLACEHOLDER: "Enter your Google OAuth2 Client Secret",

  // Common parameters
  CREDENTIAL_ID_DISPLAY_NAME: "Credential",
  TASK_LIST_ID_DISPLAY_NAME: "Task List ID",
  TASK_LIST_ID_HINT:
    "The ID of the task list. Use 'List Task Lists' to find available IDs.",
  TASK_LIST_ID_PLACEHOLDER: "e.g. MTUzNTQ0...",
  TASK_ID_DISPLAY_NAME: "Task ID",
  TASK_ID_HINT: "The ID of the task. Use 'List Tasks' to find available IDs.",
  TASK_ID_PLACEHOLDER: "e.g. dGFza19pZA...",
  TITLE_DISPLAY_NAME: "Title",
  TITLE_PLACEHOLDER: "Enter title (max 1024 characters)",
  NOTES_DISPLAY_NAME: "Notes",
  NOTES_PLACEHOLDER:
    "Enter notes (optional, max 8192 chars). Docs-assigned tasks cannot have notes.",
  STATUS_DISPLAY_NAME: "Status",
  DUE_DATE_DISPLAY_NAME: "Due Date",
  DUE_DATE_HINT:
    "RFC 3339 format (e.g. 2025-12-31T00:00:00Z). Only date portion is used; time is discarded.",
  DUE_DATE_PLACEHOLDER: "2025-12-31T00:00:00Z",
  MAX_RESULTS_DISPLAY_NAME: "Max Results",
  MAX_RESULTS_HINT: "Maximum 100 results per page (default: 20)",
  PAGE_TOKEN_DISPLAY_NAME: "Page Token",
  PAGE_TOKEN_HINT: "Token for fetching the next page of results",
  PAGE_TOKEN_PLACEHOLDER: "Enter page token",
  SHOW_COMPLETED_DISPLAY_NAME: "Show Completed",
  SHOW_COMPLETED_HINT:
    "Include completed tasks. Requires showHidden to also be true to show tasks completed in first-party clients (web UI, mobile apps).",
  SHOW_DELETED_DISPLAY_NAME: "Show Deleted",
  SHOW_DELETED_HINT: "Whether to include deleted tasks",
  SHOW_HIDDEN_DISPLAY_NAME: "Show Hidden",
  SHOW_HIDDEN_HINT:
    "Include hidden tasks (tasks marked completed when the list was last cleared)",
  PARENT_TASK_ID_DISPLAY_NAME: "Parent Task ID",
  PARENT_TASK_ID_HINT:
    "ID of parent task. Cannot be an assigned or repeating task. Omit to create at top level.",
  PARENT_TASK_ID_PLACEHOLDER: "Enter parent task ID (optional)",
  PREVIOUS_TASK_ID_DISPLAY_NAME: "Previous Task ID",
  PREVIOUS_TASK_ID_HINT:
    "ID of previous sibling task. Omit to move to first position among siblings.",
  PREVIOUS_TASK_ID_PLACEHOLDER: "Enter previous task ID (optional)",
  DESTINATION_TASK_LIST_ID_DISPLAY_NAME: "Destination Task List ID",
  DESTINATION_TASK_LIST_ID_HINT:
    "ID of destination task list. Omit to move within current list. Repeating tasks cannot be moved between lists.",
  DESTINATION_TASK_LIST_ID_PLACEHOLDER:
    "Enter destination task list ID (optional)",
  DUE_MIN_DISPLAY_NAME: "Due Date Min",
  DUE_MIN_HINT:
    "Filter: lower bound for due date (RFC 3339, e.g. 2025-01-01T00:00:00Z)",
  DUE_MAX_DISPLAY_NAME: "Due Date Max",
  DUE_MAX_HINT:
    "Filter: upper bound for due date (RFC 3339, e.g. 2025-12-31T23:59:59Z)",
  UPDATED_MIN_DISPLAY_NAME: "Updated After",
  UPDATED_MIN_HINT:
    "Filter: lower bound for last modification time (RFC 3339, e.g. 2025-01-01T00:00:00Z)",
  COMPLETED_MIN_DISPLAY_NAME: "Completed Min",
  COMPLETED_MIN_HINT:
    "Filter: lower bound for completion date (RFC 3339, e.g. 2025-01-01T00:00:00Z)",
  COMPLETED_MAX_DISPLAY_NAME: "Completed Max",
  COMPLETED_MAX_HINT:
    "Filter: upper bound for completion date (RFC 3339, e.g. 2025-12-31T23:59:59Z)",
  SHOW_ASSIGNED_DISPLAY_NAME: "Show Assigned",
  SHOW_ASSIGNED_HINT: "Include tasks assigned from Docs or Chat Spaces",

  // TaskList tools
  LIST_TASK_LISTS_DISPLAY_NAME: "List Task Lists",
  LIST_TASK_LISTS_DESCRIPTION:
    "Returns all task lists for the authenticated user",
  CREATE_TASK_LIST_DISPLAY_NAME: "Create Task List",
  CREATE_TASK_LIST_DESCRIPTION: "Creates a new task list",
  GET_TASK_LIST_DISPLAY_NAME: "Get Task List",
  GET_TASK_LIST_DESCRIPTION: "Returns the specified task list",
  REPLACE_TASK_LIST_DISPLAY_NAME: "Replace Task List",
  REPLACE_TASK_LIST_DESCRIPTION:
    "Fully replaces the specified task list using tasklists.update",
  UPDATE_TASK_LIST_DISPLAY_NAME: "Update Task List",
  UPDATE_TASK_LIST_DESCRIPTION: "Updates the title of the specified task list",
  DELETE_TASK_LIST_DISPLAY_NAME: "Delete Task List",
  DELETE_TASK_LIST_DESCRIPTION: "Deletes the specified task list",

  // Task tools
  LIST_TASKS_DISPLAY_NAME: "List Tasks",
  LIST_TASKS_DESCRIPTION: "Returns all tasks in the specified task list",
  GET_TASK_DISPLAY_NAME: "Get Task",
  GET_TASK_DESCRIPTION: "Returns the specified task",
  CREATE_TASK_DISPLAY_NAME: "Create Task",
  CREATE_TASK_DESCRIPTION: "Creates a new task in the specified task list",
  REPLACE_TASK_DISPLAY_NAME: "Replace Task",
  REPLACE_TASK_DESCRIPTION:
    "Fully replaces the specified task using tasks.update",
  UPDATE_TASK_DISPLAY_NAME: "Update Task",
  UPDATE_TASK_DESCRIPTION:
    "Updates the specified task (title, notes, status, due date)",
  DELETE_TASK_DISPLAY_NAME: "Delete Task",
  DELETE_TASK_DESCRIPTION: "Deletes the specified task from the task list",
  MOVE_TASK_DISPLAY_NAME: "Move Task",
  MOVE_TASK_DESCRIPTION: "Moves a task to another position or task list",
  CLEAR_COMPLETED_DISPLAY_NAME: "Clear Completed Tasks",
  CLEAR_COMPLETED_DESCRIPTION:
    "Clears all completed tasks from the specified task list",
} satisfies BaseTranslation

export default en_US
