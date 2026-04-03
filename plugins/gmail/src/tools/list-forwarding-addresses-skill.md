# List Forwarding Addresses Tool Documentation

## Tool

- **Name**: `gmail-list-forwarding-addresses`
- **Purpose**: Lists forwarding addresses configured for the user.

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
  "forwardingAddresses": [
    {
      "forwardingEmail": "archive@example.com",
      "verificationStatus": "accepted"
    }
  ]
}
```
