# dingtalk / get-app-access-token

Fetch the current DingTalk app access token using the selected credential.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | yes | — | Links to credential `dingtalk-app`. |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app"
}
```

## Credential

- Credential name: `dingtalk-app`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `corp_id` | `string` | yes | Organization ID where the DingTalk app is installed. |
| `client_id` | `string` | yes | DingTalk app Client ID. |
| `client_secret` | `encrypted_string` | yes | DingTalk app Client Secret. |
| `user_union_id` | `string` | no | Default operator unionId for workflow-related operations. |
| `agent_id` | `string` | yes | AgentId of the internal DingTalk app. |

## Success Output

```json
{
  "corpId": "dingxxxxxxxxxxxx",
  "clientId": "dingoaxxxxxxxxxxxx",
  "accessToken": "abc123def456"
}
```

