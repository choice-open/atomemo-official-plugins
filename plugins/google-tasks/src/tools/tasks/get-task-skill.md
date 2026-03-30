# Get Task Tool Documentation

## Tool

- **Name**: `get-task`
- **Purpose**: Gets a single task by task list ID and task ID.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Task list ID. | `"MDQ2..."` |
| `task_id` | `string` | `true` | `input` | Task ID to retrieve. | `"task_id_xxx"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "MDQ2...",
    "task_id": "task_id_xxx"
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
