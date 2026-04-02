# Delete Calendar Tool Documentation

## Tool

- **Name**: `delete-calendar`
- **Purpose**: Delete a calendar (cannot delete `primary`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar ID to delete (not `primary`). | `"abc@group.calendar.google.com"` |

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
