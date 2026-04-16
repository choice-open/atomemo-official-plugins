# dingtalk / send-group-robot-message

Send a robot message to a DingTalk group chat.

## Input Parameters

| Field                  | Type            | Required | Default | Description                                    |
| ---------------------- | --------------- | -------- | ------- | ---------------------------------------------- |
| `credential_id`        | `credential_id` | yes      | —       | Links to credential `dingtalk-app`.            |
| `robot_code`           | `string`        | yes      | —       | DingTalk robot code.                           |
| `open_conversation_id` | `string`        | yes      | —       | Open conversation ID of the target group chat. |
| `message`              | `object`        | yes      | —       | Structured robot message payload.              |

### Message Object
Same schema as `batch-send-robot-message`.

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "robot_code": "robot123",
  "open_conversation_id": "cidxxxxxxxxxx",
  "message": {
    "type": "markdown",
    "title": "Weekly Report",
    "text": "## Summary\\nAll systems operational."
  }
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
  "processQueryKey": "abc123"
}
```

