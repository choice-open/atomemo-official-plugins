# Create Task Tool Documentation

## Tool

- **Name**: `create-task`
- **Purpose**: Creates a new task in a specified Google Tasks list.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Target task list ID. | `"MDQ2..."` |
| `title` | `string` | `true` | `input` | Task title. | `"Buy milk"` |
| `notes` | `string` | `false` | `textarea` | Task notes/description. | `"2 liters"` |
| `due` | `string` | `false` | `input` | Due date in RFC 3339 format. | `"2026-03-31T09:00:00Z"` |
| `status` | `string` | `false` | `select` | Task status: `needsAction` or `completed`. | `"needsAction"` |
| `parent` | `string` | `false` | `input` | Parent task ID for subtasks. | `"parent_task_id"` |
| `previous` | `string` | `false` | `input` | Previous sibling task ID for ordering. | `"previous_task_id"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "MDQ2...",
    "title": "Buy milk",
    "notes": "2 liters",
    "due": "2026-03-31T09:00:00Z",
    "status": "needsAction"
  }
}
```

## Tool Output Example

```json
{
  "id": "task_id_xxx",
  "title": "Buy milk",
  "status": "needsAction"
}
```
