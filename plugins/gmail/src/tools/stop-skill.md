# Stop Watch Tool Documentation

## Tool

- **Name**: `gmail-stop`
- **Purpose**: Stops any active Gmail push notification channel for the user (`users.stop`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me"
  }
}
```

## Tool Output Example

```json
{
  "success": true
}
```
