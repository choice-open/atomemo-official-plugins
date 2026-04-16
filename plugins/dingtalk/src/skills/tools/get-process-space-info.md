# dingtalk / get-process-space-info

Get DingDrive space information used for workflow attachments.

## Input Parameters

| Field           | Type            | Required | Default | Description                                               |
| --------------- | --------------- | -------- | ------- | --------------------------------------------------------- |
| `credential_id` | `credential_id` | yes      | —       | Links to credential `dingtalk-app`.                       |
| `user_id`       | `string`        | no       | —       | DingTalk user ID. Defaults to credential `user_union_id`. |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "user_id": "user123"
}
```

## Credential

- Credential name: `dingtalk-app`
- Requires `agent_id` to be set on the credential.

## Success Output

```json
{
  "result": {
    "spaceId": 3996960664
  },
  "success": true
}
```

