# Delete Task Tool Documentation

## Tool

- **Name**: `delete-task`
- **Purpose**: Deletes a task from a task list.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Task list ID. | `"MDQ2..."` |
| `task_id` | `string` | `true` | `input` | Task ID to delete. | `"task_id_xxx"` |

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
  "success": true,
  "deletedTask": "task_id_xxx",
  "fromTaskList": "MDQ2..."
}
```
