# Create Calendar Tool Documentation

## Tool

- **Name**: `create-calendar`
- **Purpose**: Create a new calendar.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `summary` | `string` | `true` | `input` | Calendar title. | `"Project Alpha"` |
| `description` | `string` | `false` | `input` | Calendar description. | `"Shared team calendar"` |
| `location` | `string` | `false` | `input` | Geographic location. | `"Shanghai"` |
| `timeZone` | `string` | `false` | `input` | Default IANA timezone. | `"Asia/Shanghai"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "summary": "Project Alpha",
    "timeZone": "Asia/Shanghai"
  }
}
```

## Tool Output Example

```json
{
  "id": "abc123@group.calendar.google.com",
  "summary": "Project Alpha",
  "timeZone": "Asia/Shanghai"
}
```
