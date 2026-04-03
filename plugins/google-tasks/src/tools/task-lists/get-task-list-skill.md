# Get Task List Tool Documentation

## Tool

- **Name**: `get-task-list`
- **Purpose**: Gets a single task list by ID.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Task list ID to retrieve. | `"task_list_id_xxx"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "task_list_id_xxx"
  }
}
```

## Tool Output Example

```json
{
  "id": "task_list_id_xxx",
  "title": "Work Tasks"
}
```
