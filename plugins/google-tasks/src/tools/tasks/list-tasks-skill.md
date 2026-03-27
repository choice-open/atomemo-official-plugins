# List Tasks Tool Documentation

## Tool

- **Name**: `list-tasks`
- **Purpose**: Lists tasks in a specified task list with optional filters.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `task_list_id` | `string` | `true` | `input` | Task list ID. | `"MDQ2..."` |
| `max_results` | `number` | `false` | `number-input` | Max number of tasks to return. | `20` |
| `page_token` | `string` | `false` | `input` | Pagination token from a previous response. | `"next_page_token"` |
| `show_completed` | `boolean` | `false` | `switch` | Include completed tasks. | `true` |
| `show_deleted` | `boolean` | `false` | `switch` | Include deleted tasks. | `false` |
| `show_hidden` | `boolean` | `false` | `switch` | Include hidden tasks. | `true` |
| `due_min` | `string` | `false` | `input` | Due date lower bound (RFC 3339). | `"2026-03-01T00:00:00Z"` |
| `due_max` | `string` | `false` | `input` | Due date upper bound (RFC 3339). | `"2026-03-31T23:59:59Z"` |
| `updated_min` | `string` | `false` | `input` | Updated time lower bound (RFC 3339). | `"2026-03-20T00:00:00Z"` |
| `completed_min` | `string` | `false` | `input` | Completion time lower bound (RFC 3339). | `"2026-03-01T00:00:00Z"` |
| `completed_max` | `string` | `false` | `input` | Completion time upper bound (RFC 3339). | `"2026-03-31T23:59:59Z"` |
| `show_assigned` | `boolean` | `false` | `switch` | Include assigned tasks. | `true` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "task_list_id": "MDQ2...",
    "max_results": 20,
    "show_completed": true
  }
}
```

## Tool Output Example

```json
{
  "kind": "tasks#tasks",
  "items": [
    {
      "id": "task_id_xxx",
      "title": "Buy milk"
    }
  ],
  "nextPageToken": "next_page_token"
}
```
