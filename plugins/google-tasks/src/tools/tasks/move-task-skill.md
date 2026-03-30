# Move Task Tool Documentation

## Tool

- **Name**: `move-task`
- **Purpose**: Moves a task to a new position or another task list.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Source task list ID. | `"MDQ2..."` |
| `task_id` | `string` | `true` | `input` | Task ID to move. | `"task_id_xxx"` |
| `parent` | `string` | `false` | `input` | New parent task ID. | `"parent_task_id"` |
| `previous` | `string` | `false` | `input` | Previous sibling task ID in target position. | `"previous_task_id"` |
| `destination_tasklist` | `string` | `false` | `input` | Destination task list ID. | `"dest_list_id"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "MDQ2...",
    "task_id": "task_id_xxx",
    "destination_tasklist": "dest_list_id"
  }
}
```

## Tool Output Example

```json
{
  "id": "task_id_xxx",
  "selfLink": "https://www.googleapis.com/tasks/v1/lists/..."
}
```
