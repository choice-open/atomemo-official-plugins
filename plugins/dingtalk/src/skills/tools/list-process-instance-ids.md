# dingtalk / list-process-instance-ids

List workflow process instance IDs by process code and filters.

## Input Parameters

| Field           | Type                | Required | Default | Description                                                                     |
| --------------- | ------------------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `credential_id` | `credential_id`     | yes      | —       | Links to credential `dingtalk-app`.                                             |
| `process_code`  | `string`            | yes      | —       | Workflow process code.                                                          |
| `start_time`    | `string` / `number` | yes      | —       | Start time filter (Unix ms or absolute date).                                   |
| `end_time`      | `string` / `number` | no       | —       | End time filter (same format as start_time).                                    |
| `user_ids`      | `array` of `string` | no       | —       | Optional starter user IDs filter.                                               |
| `statuses`      | `array` of `string` | no       | —       | Optional status filters: RUNNING, TERMINATED, COMPLETED, COMPLETED_WITH_BLANKS. |
| `max_results`   | `integer`           | no       | `20`    | Page size (1–100).                                                              |
| `next_token`    | `integer`           | no       | `0`     | Pagination token.                                                               |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "process_code": "PROC-123",
  "start_time": "2026-04-01",
  "end_time": "2026-04-15",
  "statuses": ["COMPLETED"],
  "max_results": 20,
  "next_token": 0
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
  "result": {
    "list": ["instance1", "instance2"],
    "nextToken": "20"
  },
  "success": true
}
```

