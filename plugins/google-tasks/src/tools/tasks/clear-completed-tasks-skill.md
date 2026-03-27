# Clear Completed Tasks Tool Documentation

## Tool

- **Name**: `clear-completed-tasks`
- **Purpose**: Clears all completed tasks in a specified task list.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Task list ID. | `"MDQ2..."` |

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
  "clearedTaskList": "MDQ2..."
}
```
