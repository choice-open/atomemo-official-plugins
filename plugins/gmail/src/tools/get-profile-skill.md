# Get Profile Tool Documentation

## Tool

- **Name**: `gmail-get-profile`
- **Purpose**: Returns the authenticated user's Gmail profile (email address, messages total, threads total, history id).

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
  "profile": {
    "emailAddress": "user@example.com",
    "messagesTotal": 1234,
    "threadsTotal": 567,
    "historyId": "12345678"
  }
}
```
