# Update Calendar Tool Documentation

## Tool

- **Name**: `update-calendar`
- **Purpose**: Update metadata for a secondary calendar (not `primary`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Secondary calendar email-style ID (not `primary`). | `"abc@group.calendar.google.com"` |
| `summary` | `string` | `false` | `input` | New title; omit or empty to skip. | `"Renamed calendar"` |
| `description` | `string` | `false` | `input` | New description. | `"Notes"` |
| `location` | `string` | `false` | `input` | New location. | `"Berlin"` |
| `timeZone` | `string` | `false` | `input` | New IANA timezone. | `"Europe/Berlin"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "abc@group.calendar.google.com",
    "summary": "Team Calendar 2026"
  }
}
```

## Tool Output Example

```json
{
  "id": "abc@group.calendar.google.com",
  "summary": "Team Calendar 2026"
}
```
