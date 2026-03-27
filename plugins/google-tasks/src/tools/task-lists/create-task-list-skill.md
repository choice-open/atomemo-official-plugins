# Create Task List Tool Documentation

## Tool

- **Name**: `create-task-list`
- **Purpose**: Creates a new Google Tasks list.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `title` | `string` | `true` | `input` | Task list title. | `"Work Tasks"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "title": "Work Tasks"
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
