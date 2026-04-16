# dingtalk / batch-send-robot-message

Send one-to-one robot messages to multiple DingTalk users in batch.

## Input Parameters

| Field           | Type                | Required | Default | Description                         |
| --------------- | ------------------- | -------- | ------- | ----------------------------------- |
| `credential_id` | `credential_id`     | yes      | —       | Links to credential `dingtalk-app`. |
| `robot_code`    | `string`            | yes      | —       | DingTalk robot code.                |
| `user_ids`      | `array` of `string` | yes      | —       | Target user IDs. Min 1, max 20.     |
| `message`       | `object`            | yes      | —       | Structured robot message payload.   |

### Message Object
The `message` object must include a `type` and the fields required for that type:

- `type`: `"text"` | `"link"` | `"markdown"` | `"actionCard"` | `"feedCard"`
- **text**: requires `content`
- **link**: requires `title`, `text`, `message_url`; optional `pic_url`
- **markdown**: requires `title`, `text`
- **actionCard**: requires `title`, `text`, `action_card_variant`
  - `single`: requires `single_title`, `single_url`
  - `vertical_buttons`: requires `buttons` (2–5 items)
  - `horizontal_buttons`: requires `buttons` (exactly 2 items)
- **feedCard**: requires `links` (at least 1 item with `title`, `message_url`, `pic_url`)

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "robot_code": "robot123",
  "user_ids": ["user1", "user2"],
  "message": {
    "type": "text",
    "content": "Hello from Atomemo!"
  }
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
  "processQueryKey": "abc123",
  "invalidStaffIdList": [],
  "flowControlledStaffIdList": []
}
```

