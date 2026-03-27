# Update Task Tool Documentation

## Tool

- **Name**: `update-task`
- **Purpose**: Partially updates fields of an existing task.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Task list ID containing the task. | `"MDQ2..."` |
| `task_id` | `string` | `true` | `input` | Target task ID. | `"task_id_xxx"` |
| `title` | `string` | `false` | `input` | New task title. | `"Buy milk and eggs"` |
| `notes` | `string` | `false` | `textarea` | New task notes. | `"2 liters + 12 eggs"` |
| `status` | `string` | `false` | `select` | Task status: `needsAction` or `completed`. | `"completed"` |
| `due` | `string` | `false` | `input` | Due date in RFC 3339 format. | `"2026-03-31T09:00:00Z"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "MDQ2...",
    "task_id": "task_id_xxx",
    "status": "completed"
  }
}
```

## Tool Output Example

```json
{
  "id": "task_id_xxx",
  "status": "completed"
}
```
