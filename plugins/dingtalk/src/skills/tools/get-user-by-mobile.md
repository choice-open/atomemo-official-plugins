# dingtalk / get-user-by-mobile

Look up a DingTalk userId by mobile phone number.

## Input Parameters

| Field           | Type            | Required | Default | Description                               |
| --------------- | --------------- | -------- | ------- | ----------------------------------------- |
| `credential_id` | `credential_id` | yes      | —       | Links to credential `dingtalk-app`.       |
| `mobile`        | `string`        | yes      | —       | Mobile phone number of the DingTalk user. |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "mobile": "13000000000"
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
  "result": {
    "userid": "user123"
  }
}
```

