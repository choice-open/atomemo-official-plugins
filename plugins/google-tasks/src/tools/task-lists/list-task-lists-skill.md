# List Task Lists Tool Documentation

## Tool

- **Name**: `list-task-lists`
- **Purpose**: Lists available Google task lists.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-selector` | Credential ID for `google-tasks-oauth2`. | `"cred_xxx"` |
| `max_results` | `number` | `false` | `number-input` | Max number of task lists to return. | `20` |
| `page_token` | `string` | `false` | `input` | Pagination token from previous response. | `"next_page_token"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "max_results": 20
  }
}
```

## Tool Output Example

```json
{
  "kind": "tasks#taskLists",
  "items": [
    {
      "id": "task_list_id_xxx",
      "title": "Work Tasks"
    }
  ],
  "nextPageToken": "next_page_token"
}
```
