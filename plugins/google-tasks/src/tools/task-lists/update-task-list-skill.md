# Update Task List Tool Documentation

## Tool

- **Name**: `update-task-list`
- **Purpose**: Partially updates an existing task list.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Target task list ID. | `"task_list_id_xxx"` |
| `title` | `string` | `true` | `input` | New task list title. | `"Work Tasks (Updated)"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "task_list_id_xxx",
    "title": "Work Tasks (Updated)"
  }
}
```

## Tool Output Example

```json
{
  "id": "task_list_id_xxx",
  "title": "Work Tasks (Updated)"
}
```
