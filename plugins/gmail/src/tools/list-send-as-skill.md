# List Send-As Tool Documentation

## Tool

- **Name**: `gmail-list-send-as`
- **Purpose**: Lists "Send mail as" aliases and their settings for the account.

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
  "sendAs": [
    {
      "sendAsEmail": "user@example.com",
      "displayName": "User",
      "isPrimary": true
    }
  ]
}
```
