# Get Vacation Tool Documentation

## Tool

- **Name**: `gmail-get-vacation`
- **Purpose**: Reads the user's vacation responder (out-of-office) settings.

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
  "vacation": {
    "enableAutoReply": false,
    "responseSubject": "",
    "responseBodyPlainText": ""
  }
}
```
