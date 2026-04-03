# Update Calendar List Tool Documentation

## Tool

- **Name**: `update-calendar-list`
- **Purpose**: Update user-specific calendar list properties (not `primary`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Secondary calendar ID (not `primary`). | `"abc@group.calendar.google.com"` |
| `summaryOverride` | `string` | `false` | `input` | Custom title shown in list. | `"Work"` |
| `colorId` | `string` | `false` | `select` | Color `1`–`24` (see Get Colors). | `"3"` |
| `selected` | `boolean` | `false` | `switch` | Whether calendar is selected in UI. | `true` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "abc@group.calendar.google.com",
    "summaryOverride": "Design reviews",
    "selected": true
  }
}
```

## Tool Output Example

```json
{
  "id": "abc@group.calendar.google.com",
  "summaryOverride": "Design reviews",
  "selected": true
}
```
