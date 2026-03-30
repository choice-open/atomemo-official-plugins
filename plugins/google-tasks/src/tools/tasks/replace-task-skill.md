# Replace Task Tool Documentation

## Tool

- **Name**: `replace-task`
- **Purpose**: Replaces an existing task with a full new representation.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Task list ID containing the task. | `"MDQ2..."` |
| `task_id` | `string` | `true` | `input` | Target task ID. | `"task_id_xxx"` |
| `title` | `string` | `true` | `input` | Task title. | `"Weekly review"` |
| `notes` | `string` | `false` | `textarea` | Task notes. | `"Check all projects"` |
| `status` | `string` | `false` | `select` | Task status: `needsAction` or `completed`. | `"needsAction"` |
| `due` | `string` | `false` | `input` | Due date in RFC 3339 format. | `"2026-04-01T08:00:00Z"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "MDQ2...",
    "task_id": "task_id_xxx",
    "title": "Weekly review",
    "status": "needsAction"
  }
}
```

## Tool Output Example

```json
{
  "id": "task_id_xxx",
  "title": "Weekly review",
  "status": "needsAction"
}
```
