# Update Vacation Tool Documentation

## Tool

- **Name**: `gmail-update-vacation`
- **Purpose**: Updates vacation responder (auto-reply) settings for the mailbox.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `gmail_credential` | `credential_id` | `true` | credential-select | OAuth credential bound to `gmail-oauth`. | |
| `user_id` | `string` | `false` | `input` | Gmail user id; defaults to `me`. | `"me"` |
| `enable_auto_reply` | `boolean` | `true` | `switch` | Turn auto-reply on or off. | `true` |
| `response_subject` | `string` | `false` | `input` | Optional subject line for the auto-reply. | `"Out of office"` |
| `response_body` | `string` | `false` | `textarea` | Plain-text body sent as `responseBodyPlainText`. | `"I am away until Monday."` |
| `restrict_to_contacts` | `boolean` | `false` | `switch` | Only reply to people in Contacts. | `false` |
| `restrict_to_domain` | `boolean` | `false` | `switch` | Only reply to same-domain senders. | `false` |

## Tool Input Example

```json
{
  "parameters": {
    "gmail_credential": "<credential_id>",
    "user_id": "me",
    "enable_auto_reply": true,
    "response_subject": "Away",
    "response_body": "Thanks for your email. I will reply when I return.",
    "restrict_to_contacts": false,
    "restrict_to_domain": false
  }
}
```

## Tool Output Example

```json
{
  "vacation": {
    "enableAutoReply": true,
    "responseSubject": "Away",
    "responseBodyPlainText": "Thanks for your email. I will reply when I return."
  }
}
```
