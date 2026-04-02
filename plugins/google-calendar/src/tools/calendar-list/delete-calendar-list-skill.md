# Delete Calendar List Tool Documentation

## Tool

- **Name**: `delete-calendar-list`
- **Purpose**: Remove a calendar from the user’s calendar list (does not delete the calendar resource).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar to remove from list (not `primary`). | `"abc@group.calendar.google.com"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "abc@group.calendar.google.com"
  }
}
```

## Tool Output Example

```json
{}
```
