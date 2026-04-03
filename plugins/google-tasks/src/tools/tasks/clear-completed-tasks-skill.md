# Clear Completed Tasks Tool Documentation

## Tool

- **Name**: `clear-completed-tasks`
- **Purpose**: Calls Google Tasks **`tasks.clear`** for a task list.

## Google Tasks API behavior (important)

Official reference: [tasks.clear](https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/clear)

- **`tasks.clear` does not delete task records.** It clears completed tasks from the list by marking affected tasks as **`hidden: true`** (the `hidden` field on the [Task resource](https://developers.google.com/workspace/tasks/reference/rest/v1/tasks) is **read-only**).
- Google states: affected tasks **are no longer returned by default** when listing tasks.
- **`tasks.list`** has query parameter **`showHidden`**. When **`showHidden=true`**, hidden (cleared) completed tasks **can still appear** in API results—so a workflow that lists with “show hidden” on may look like “clear did nothing.”
- **`showCompleted`** controls whether completed tasks are included; combine with **`showHidden`** when debugging or auditing cleared items.
- To **permanently remove** a single task from Google’s store, use **`tasks.delete`** (this plugin’s **`delete-task`** tool), not `tasks.clear`.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Task list ID (same list you pass to `list-tasks`). | `"MDQ2..."` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "MDQ2..."
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "clearedTaskList": "MDQ2...",
  "googleTasksApiNote": "Per Google Tasks API: tasks.clear marks completed tasks as hidden..."
}
```

The plugin returns **HTTP 204** success from `tasks.clear` as `success: true`, plus `googleTasksApiNote` summarizing the API semantics above.
