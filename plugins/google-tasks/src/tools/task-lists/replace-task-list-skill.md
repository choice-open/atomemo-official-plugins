# Replace Task List Tool Documentation

## Tool

- **Name**: `replace-task-list`
- **Purpose**: Fully replaces an existing task list definition.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Target task list ID. | `"task_list_id_xxx"` |
| `title` | `string` | `true` | `input` | New task list title. | `"Personal Tasks"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "task_list_id_xxx",
    "title": "Personal Tasks"
  }
}
```

## Tool Output Example

```json
{
  "id": "task_list_id_xxx",
  "title": "Personal Tasks"
}
```
