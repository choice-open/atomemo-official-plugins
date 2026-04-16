# dingtalk / download-process-attachment

Get download authorization information for a process attachment.

## Input Parameters

| Field                     | Type            | Required | Default | Description                                         |
| ------------------------- | --------------- | -------- | ------- | --------------------------------------------------- |
| `credential_id`           | `credential_id` | yes      | —       | Links to credential `dingtalk-app`.                 |
| `process_instance_id`     | `string`        | yes      | —       | Process instance that owns the attachment.          |
| `file_id`                 | `string`        | yes      | —       | File ID from the workflow form component.           |
| `with_comment_attachment` | `boolean`       | no       | `false` | Whether the file_id refers to a comment attachment. |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "process_instance_id": "instance123",
  "file_id": "file456",
  "with_comment_attachment": false
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
  "success": true,
  "result": {
    "downloadUri": "https://example.com/download/file.pdf",
    "fileId": "26748422566",
    "spaceId": 3996960664
  }
}
```

