# dingtalk / add-process-comment

Add a comment to a workflow process instance.

## Input Parameters

| Field                 | Type            | Required | Default | Description                                               |
| --------------------- | --------------- | -------- | ------- | --------------------------------------------------------- |
| `credential_id`       | `credential_id` | yes      | —       | Links to credential `dingtalk-app`.                       |
| `process_instance_id` | `string`        | yes      | —       | Workflow process instance ID to comment on.               |
| `text`                | `string`        | no       | —       | Comment text body.                                        |
| `comment_user_id`     | `string`        | no       | —       | Commenter userId. Defaults to credential `user_union_id`. |
| `file`                | `file_ref`      | no       | —       | Optional image file to attach. Must be an image.          |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "process_instance_id": "instance123",
  "text": "Approved, please proceed.",
  "comment_user_id": "user123"
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

