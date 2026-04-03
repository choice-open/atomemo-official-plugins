# Insert Calendar List Tool Documentation

## Tool

- **Name**: `insert-calendar-list`
- **Purpose**: Add an existing calendar to the user’s calendar list.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar ID to subscribe to (not `primary` as placeholder). | `"shared@group.calendar.google.com"` |
| `selected` | `boolean` | `false` | `switch` | Show in UI. | `true` |
| `colorId` | `string` | `false` | `select` | Calendar list color `1`–`24`. | `"9"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "shared@group.calendar.google.com",
    "selected": true,
    "colorId": "5"
  }
}
```

## Tool Output Example

```json
{
  "id": "shared@group.calendar.google.com",
  "summary": "Shared",
  "selected": true,
  "colorId": "5"
}
```
