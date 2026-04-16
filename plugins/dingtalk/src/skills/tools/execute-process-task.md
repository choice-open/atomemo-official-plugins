# dingtalk / execute-process-task

Approve or reject a single workflow task.

## Input Parameters

| Field                 | Type            | Required | Default | Description                                           |
| --------------------- | --------------- | -------- | ------- | ----------------------------------------------------- |
| `credential_id`       | `credential_id` | yes      | —       | Links to credential `dingtalk-app`.                   |
| `process_instance_id` | `string`        | yes      | —       | Process instance that owns the task.                  |
| `task_id`             | `integer`       | yes      | —       | Task node ID to execute.                              |
| `actioner_user_id`    | `string`        | no       | —       | Actor userId. Defaults to credential `user_union_id`. |
| `result`              | `string`        | yes      | —       | `agree` or `refuse`.                                  |
| `remark`              | `string`        | no       | —       | Optional remark for the action.                       |
| `file`                | `file_ref`      | no       | —       | Optional image attachment. Must be an image.          |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "process_instance_id": "instance123",
  "task_id": 1,
  "actioner_user_id": "user123",
  "result": "agree",
  "remark": "Looks good"
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
  "result": true,
  "success": true
}
```

